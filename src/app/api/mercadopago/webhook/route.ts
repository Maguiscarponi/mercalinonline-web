import { NextRequest, NextResponse } from "next/server";
import { getPayment, isWebhookConfigured, verifyWebhookSignature } from "@/lib/mercadopago";
import { getProduct } from "@/lib/products";
import { generateLicenseKey, isLicensingConfigured } from "@/lib/license";
import { createActivation, listActivations, setActivationEmailSent } from "@/lib/activations";
import { sendMail, licenseEmailHtml, ADMIN_NOTIFY_EMAIL } from "@/lib/mail";
import { recordEvent } from "@/lib/events";
import { escapeHtml } from "@/lib/validate";

// Mercado Pago llama a esta URL cuando un pago cambia de estado. Ver
// notification_url en src/lib/mercadopago.ts. Reintenta si no respondemos
// 200, así que este handler tiene que ser idempotente (no duplicar la
// activación si ya la procesamos).
export async function POST(req: NextRequest) {
  const dataId = req.nextUrl.searchParams.get("data.id") ?? req.nextUrl.searchParams.get("id");
  const type = req.nextUrl.searchParams.get("type");

  if (!dataId || type !== "payment") {
    return NextResponse.json({ ok: true }); // notificación que no nos interesa
  }

  if (isWebhookConfigured()) {
    try {
      verifyWebhookSignature({
        xSignature: req.headers.get("x-signature"),
        xRequestId: req.headers.get("x-request-id"),
        dataId,
      });
    } catch (err) {
      console.error("[mp:webhook] Firma inválida:", err);
      return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
    }
  } else {
    console.warn("[mp:webhook] MP_WEBHOOK_SECRET no configurado — aceptando sin verificar firma (solo dev).");
  }

  const alreadyProcessed = (await listActivations()).some((a) => a.mpPaymentId === dataId);
  if (alreadyProcessed) {
    return NextResponse.json({ ok: true });
  }

  const payment = await getPayment(dataId);
  const [productSlug, email, visitorId, source] = (payment.external_reference ?? "").split("|");

  if (payment.status !== "approved") {
    if (payment.status === "rejected" || payment.status === "cancelled") {
      await recordEvent({
        name: "payment_failed",
        email: email || null,
        visitorId: visitorId || null,
        source: source || null,
        props: { status: payment.status, detail: payment.status_detail ?? "", payment: dataId },
      });
    }
    return NextResponse.json({ ok: true });
  }

  const product = productSlug ? await getProduct(productSlug) : undefined;
  if (!product || !email) {
    console.error("[mp:webhook] external_reference inesperado:", payment.external_reference);
    return NextResponse.json({ ok: true });
  }

  if (!isLicensingConfigured()) {
    console.error("[mp:webhook] Pago aprobado pero falta LICENSE_SECRET — no se pudo generar la clave.");
    return NextResponse.json({ ok: true });
  }

  const license = generateLicenseKey(email, "full");

  // Se inserta ANTES de mandar el mail, y con mp_payment_id ahora UNIQUE en
  // la base (supabase/schema.sql): si Mercado Pago manda dos notificaciones
  // casi juntas para el mismo pago, la segunda pierde la carrera acá y no
  // llega a mandar un mail duplicado ni a contar la venta dos veces.
  let activation;
  try {
    activation = await createActivation({
      email,
      productSlug: product.slug,
      kind: "full",
      licenseKey: license.key,
      expiresAt: null,
      mpPaymentId: dataId,
      amountArs: payment.transaction_amount ?? product.priceArs,
      emailSent: false,
      visitorId: visitorId || null,
      source: source || null,
    });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "23505") {
      // Unique violation en mp_payment_id: otra notificación de este mismo
      // pago ya lo procesó justo antes. Nada más que hacer.
      return NextResponse.json({ ok: true });
    }
    throw err;
  }

  await recordEvent({
    name: "payment_approved",
    email,
    visitorId: visitorId || null,
    source: source || null,
    props: { product: product.slug, amount: payment.transaction_amount ?? product.priceArs, payment: dataId },
  });

  const { sent } = await sendMail({
    to: email,
    subject: `Tu compra de ${product.name}`,
    html: licenseEmailHtml({
      productName: product.name,
      kind: "full",
      licenseKey: license.key,
      downloadUrl: product.downloadUrl,
      expiresAt: null,
    }),
  });
  if (sent) await setActivationEmailSent(activation.id, true);

  await sendMail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `Nueva venta: ${email}`,
    html: `<p>${escapeHtml(email)} compró ${escapeHtml(product.name)} por $${payment.transaction_amount ?? product.priceArs}.</p>`,
  });

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
