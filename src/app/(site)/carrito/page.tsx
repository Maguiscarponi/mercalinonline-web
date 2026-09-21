import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CompraForm from "@/components/CompraForm";
import { listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Comprar — Mercalin",
  description: "Comprá tu licencia de Mercalin.",
};

export default async function Comprar({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: slug } = await searchParams;
  const products = await listProducts();
  const product = (slug ? products.find((p) => p.slug === slug) : undefined) ?? products[0];

  if (!product) notFound();

  return (
    <section className="mx-auto max-w-lg px-5 py-14 sm:px-6 sm:py-20">
      <p className="rt-label">Comprar</p>
      <h1 className="mt-3 text-[clamp(34px,5.4vw,48px)] leading-[1.05] text-ink">{product.name}</h1>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="font-slab text-[34px] leading-none text-ink">${product.priceArs.toLocaleString("es-AR")}</span>
        <span className="tag-numbered text-xs uppercase text-ink-soft">ARS · pago único</span>
      </p>
      <p className="mt-4 text-[18px] leading-relaxed text-ink-soft">
        Pagás con Mercado Pago y te llega el código de activación por mail.
      </p>
      <div className="mt-9 pr-2.5">
        <CompraForm product={product} />
      </div>
      <p className="tag-numbered mt-8 text-[12.5px] uppercase text-ink-soft">
        <Link href={`/productos/${product.slug}`} className="hover:text-brand">
          ← Volver al detalle del producto
        </Link>
      </p>
    </section>
  );
}
