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
    <section className="mx-auto max-w-md px-6 py-16 sm:py-20">
      <p className="tag-numbered text-xs text-brand">Comprar</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{product.name}</h1>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          ${product.priceArs.toLocaleString("es-AR")}
        </span>
        <span className="tag-numbered text-xs text-foreground/40">ARS · pago único</span>
      </p>
      <p className="mt-3 text-[15px] text-foreground/60">
        Pagás con Mercado Pago y te llega el código de activación por mail.
      </p>
      <div className="mt-8">
        <CompraForm product={product} />
      </div>
      <p className="mt-6 text-center text-[13px] text-foreground/40">
        <Link href={`/productos/${product.slug}`} className="hover:text-foreground">
          ← Volver al detalle del producto
        </Link>
      </p>
    </section>
  );
}
