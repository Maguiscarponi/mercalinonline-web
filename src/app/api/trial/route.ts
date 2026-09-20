import { NextRequest, NextResponse } from "next/server";
import { getProduct, listProducts } from "@/lib/products";
import { generateLicenseKey, isLicensingConfigured } from "@/lib/license";
import { createActivation, findActiveTrialActivation } from "@/lib/activations";
import { sendMail, licenseEmailHtml, ADMIN_NOTIFY_EMAIL } from "@/lib/mail";
import { clip, recordEvent } from "@/lib/events";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const businessName = typeof body?.businessName === "string" ? body.businessName.trim() : "";
  const visitorId = clip(body?.visitorId, 64);
  const source = clip(body?.source, 100);
  const campaign = clip(body?.campaign, 100);
  const productSlug = typeof body?.productSlug === "string" ? body.productSlug : (await listProducts())[0]?.slug;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Mail inválido." }, { status: 400 });
  }

  const product = productSlug ? await getProduct(productSlug) : undefined;
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
  }

  if (!isLicensingConfigured()) {
    return NextResponse.json(
      { error: "El sistema de licencias todavía no está configurado (falta LICENSE_SECRET)." },
      { status: 503 }
    );
  }

  // Si ya tiene una prueba de este producto sin vencer, se le reenvía esa
  // misma licencia en vez de generar una nueva: sin esto, cualquiera podía
  // pedir "otros 7 días" las veces que quisiera con el mismo mail.
  const existing = await findActiveTrialActivation(email, product.slug);
  if (existing) {
    await sendMail({
      to: email,
      subject: `Tu prueba gratis de ${product.name}`,
      html: licenseEmailHtml({
        productName: product.name,
        kind: "trial",
        licenseKey: existing.licenseKey,
        downloadUrl: product.downloadUrl,
        expiresAt: existing.expiresAt ? new Date(existing.expiresAt) : null,
      }),
    });
    await recordEvent({ name: "trial_resent", email, visitorId, source, campaign, props: { product: product.slug } });
    return NextResponse.json({ ok: true });
  }

  const license = generateLicenseKey(email, "trial");

  const { sent } = await sendMail({
    to: email,
    subject: `Tu prueba gratis de ${product.name}`,
    html: licenseEmailHtml({
      productName: product.name,
      kind: "trial",
      licenseKey: license.key,
      downloadUrl: product.downloadUrl,
      expiresAt: license.expiresAt,
    }),
  });

  await createActivation({
    email,
    businessName: businessName || null,
    productSlug: product.slug,
    kind: "trial",
    licenseKey: license.key,
    expiresAt: license.expiresAt,
    emailSent: sent,
    visitorId,
    source,
    campaign,
  });
  await recordEvent({ name: "trial_started", email, visitorId, source, campaign, props: { product: product.slug } });

  await sendMail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `Nueva prueba gratis: ${email}`,
    html: `<p>${email} (${businessName || "sin nombre de negocio"}) pidió probar ${product.name}.</p>`,
  });

  return NextResponse.json({ ok: true });
}
