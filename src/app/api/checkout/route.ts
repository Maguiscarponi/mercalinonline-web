import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { createCheckoutPreference, isPaymentsConfigured } from "@/lib/mercadopago";
import { clip, recordEvent } from "@/lib/events";
import { isHoneypotFilled, isValidEmail } from "@/lib/validate";
import { tooManyRequests } from "@/lib/rate-limit";
import { planCuotas, pesos } from "@/lib/cuotas";

export async function POST(req: NextRequest) {
  if (!isPaymentsConfigured()) {
    return NextResponse.json(
      { error: "Los pagos con Mercado Pago todavía no están configurados." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  if (isHoneypotFilled(body)) {
    return NextResponse.json({ error: "No se pudo iniciar el pago." }, { status: 400 });
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const productSlug = typeof body?.productSlug === "string" ? body.productSlug : "";
  const visitorId = clip(body?.visitorId, 64);
  const source = clip(body?.source, 100);
  const campaign = clip(body?.campaign, 100);

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Mail inválido." }, { status: 400 });
  }

  // Cada intento crea una preferencia en Mercado Pago: se limita para que
  // nadie pueda llenarla de intentos falsos.
  if (await tooManyRequests("checkout", req.headers, 20, 3600)) {
    return NextResponse.json(
      { error: "Hiciste muchos intentos seguidos. Probá de nuevo en un rato." },
      { status: 429 }
    );
  }

  const product = await getProduct(productSlug);
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
  }

  // El monto se decide acá, con lo que hay cargado en el producto: del
  // navegador solo llega qué forma de pago eligió.
  const planDelProducto = planCuotas(product);
  const enCuotas = body?.plan === "cuotas";
  if (enCuotas && !planDelProducto) {
    return NextResponse.json({ error: "Esa forma de pago no está disponible." }, { status: 400 });
  }
  const plan = enCuotas ? planDelProducto : null;
  const amount = plan ? plan.total : product.priceArs;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  try {
    const initPoint = await createCheckoutPreference({
      productSlug: product.slug,
      productName: plan ? `${product.name} (${plan.cuotas} cuotas de ${pesos(plan.montoCuota)})` : product.name,
      priceArs: amount,
      // Si el producto ofrece cuotas fijas, el pago de contado va sin cuotas
      // (ver mercadopago.ts). Si no las ofrece, queda como siempre.
      maxInstallments: plan ? plan.cuotas : planDelProducto ? 1 : 0,
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
      props: { product: product.slug, amount, plan: plan ? "cuotas" : "contado" },
    });
    return NextResponse.json({ url: initPoint });
  } catch (err) {
    console.error("[checkout] Error creando preferencia de Mercado Pago:", err);
    return NextResponse.json({ error: "No se pudo iniciar el pago. Probá de nuevo en un rato." }, { status: 502 });
  }
}
