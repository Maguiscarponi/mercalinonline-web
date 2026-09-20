import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { createCheckoutPreference, isPaymentsConfigured } from "@/lib/mercadopago";
import { clip, recordEvent } from "@/lib/events";

export async function POST(req: NextRequest) {
  if (!isPaymentsConfigured()) {
    return NextResponse.json(
      { error: "Los pagos con Mercado Pago todavía no están configurados." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const productSlug = typeof body?.productSlug === "string" ? body.productSlug : "";
  const visitorId = clip(body?.visitorId, 64);
  const source = clip(body?.source, 100);
  const campaign = clip(body?.campaign, 100);

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Mail inválido." }, { status: 400 });
  }

  const product = await getProduct(productSlug);
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  try {
    const initPoint = await createCheckoutPreference({
      productSlug: product.slug,
      productName: product.name,
      priceArs: product.priceArs,
      email,
      siteUrl,
      visitorId,
      source,
    });
    await recordEvent({
      name: "checkout_started",
      email,
      visitorId,
      source,
      campaign,
      props: { product: product.slug, amount: product.priceArs },
    });
    return NextResponse.json({ url: initPoint });
  } catch (err) {
    console.error("[checkout] Error creando preferencia de Mercado Pago:", err);
    return NextResponse.json({ error: "No se pudo iniciar el pago. Probá de nuevo en un rato." }, { status: 502 });
  }
}
