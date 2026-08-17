import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Productos — Mercalin",
  description: "Sistemas de gestión Mercalin.",
};

export default async function Productos() {
  const products = await listProducts();
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <p className="tag-numbered text-xs text-brand">Productos</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Sistemas de gestión Mercalin.
      </h1>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
