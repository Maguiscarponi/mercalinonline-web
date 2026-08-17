import { NextRequest, NextResponse } from "next/server";
import { getPayment, isWebhookConfigured, verifyWebhookSignature } from "@/lib/mercadopago";
import { getProduct } from "@/lib/products";
import { generateLicenseKey, isLicensingConfigured } from "@/lib/license";
import { createActivation, listActivations } from "@/lib/activations";
import { sendMail, licenseEmailHtml, ADMIN_NOTIFY_EMAIL } from "@/lib/mail";

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
  if (payment.status !== "approved") {
    return NextResponse.json({ ok: true });
  }

  const [productSlug, email] = (payment.external_reference ?? "").split("|");
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

  await createActivation({
    email,
    productSlug: product.slug,
    kind: "full",
    licenseKey: license.key,
    expiresAt: null,
    mpPaymentId: dataId,
    amountArs: payment.transaction_amount ?? product.priceArs,
    emailSent: sent,
  });

  await sendMail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `Nueva venta: ${email}`,
    html: `<p>${email} compró ${product.name} por $${payment.transaction_amount ?? product.priceArs}.</p>`,
  });

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
