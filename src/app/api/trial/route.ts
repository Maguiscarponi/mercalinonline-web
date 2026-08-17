import { NextRequest, NextResponse } from "next/server";
import { getProduct, listProducts } from "@/lib/products";
import { generateLicenseKey, isLicensingConfigured } from "@/lib/license";
import { createActivation } from "@/lib/activations";
import { sendMail, licenseEmailHtml, ADMIN_NOTIFY_EMAIL } from "@/lib/mail";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const businessName = typeof body?.businessName === "string" ? body.businessName.trim() : "";
  const productSlug = typeof body?.productSlug === "string" ? body.productSlug : listProducts()[0]?.slug;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Mail inválido." }, { status: 400 });
  }

  const product = productSlug ? getProduct(productSlug) : undefined;
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
  }

  if (!isLicensingConfigured()) {
    return NextResponse.json(
      { error: "El sistema de licencias todavía no está configurado (falta LICENSE_SECRET)." },
      { status: 503 }
    );
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

  createActivation({
    email,
    businessName: businessName || null,
    productSlug: product.slug,
    kind: "trial",
    licenseKey: license.key,
    expiresAt: license.expiresAt,
    emailSent: sent,
  });

  await sendMail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `Nueva prueba gratis: ${email}`,
    html: `<p>${email} (${businessName || "sin nombre de negocio"}) pidió probar ${product.name}.</p>`,
  });

  return NextResponse.json({ ok: true });
}
