import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/lib/db";
import { clip, recordEvent } from "@/lib/events";

// Resend avisa acá qué pasó con cada mail: entregado, rebotado, marcado como
// spam, abierto, con clic. Todo queda en la tabla de eventos, así aparece en
// el recorrido de cada cliente y en el Resumen del admin.
//
// Se configura una sola vez en Resend → Webhooks, apuntando a
// https://mercalinonline.com/api/resend/webhook, y la clave de firma que da
// Resend se carga como RESEND_WEBHOOK_SECRET. Sin esa clave el endpoint no
// acepta nada (cualquiera podría mandar avisos falsos).

const NOMBRES: Record<string, string> = {
  "email.delivered": "email_delivered",
  "email.bounced": "email_bounced",
  "email.complained": "email_complained",
  "email.opened": "email_opened",
  "email.clicked": "email_clicked",
  "email.failed": "email_failed",
  "email.delivery_delayed": "email_delayed",
};

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[resend:webhook] Falta RESEND_WEBHOOK_SECRET — se rechaza el aviso.");
    return NextResponse.json({ error: "No configurado." }, { status: 503 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Faltan encabezados." }, { status: 400 });
  }

  const payload = await req.text();
  let event;
  try {
    // verify() no llama a la red: solo comprueba la firma y la fecha.
    event = new Resend(process.env.RESEND_API_KEY || "sin-clave").webhooks.verify({
      payload,
      headers: { id: svixId, timestamp: svixTimestamp, signature: svixSignature },
      webhookSecret: secret,
    });
  } catch (err) {
    console.error("[resend:webhook] Firma inválida:", err);
    return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
  }

  const name = NOMBRES[event.type];
  if (!name) return NextResponse.json({ ok: true }); // no nos interesa

  // Todos los eventos de NOMBRES son de mails y comparten estos campos.
  const data = event.data as unknown as {
    to: string[];
    email_id: string;
    subject: string;
    tags?: Record<string, string>;
    bounce?: { type: string; subType: string; message: string };
    click?: { link: string };
  };
  const type = data.tags?.type ?? null;
  // Los avisos que te mandamos a vos (nueva prueba, nueva venta) no se registran.
  if (type === "admin_notify") return NextResponse.json({ ok: true });

  // Resend reintenta si no le respondemos rápido: el mismo aviso no se duplica.
  const sql = getDb();
  const [dup] = (await sql`SELECT 1 AS x FROM events WHERE props->>'svix_id' = ${svixId} LIMIT 1`) as unknown as {
    x: number;
  }[];
  if (dup) return NextResponse.json({ ok: true });

  const props: Record<string, unknown> = {
    svix_id: svixId,
    email_id: data.email_id,
    type,
    subject: clip(data.subject, 120),
  };
  if (data.bounce) {
    props.bounce = clip(`${data.bounce.type}/${data.bounce.subType}: ${data.bounce.message}`, 200);
  }
  if (data.click) props.link = clip(data.click.link, 200);

  await recordEvent({ name, email: data.to[0], props });
  return NextResponse.json({ ok: true });
}
