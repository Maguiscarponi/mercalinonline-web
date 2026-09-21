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
    <section className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
      <p className="rt-label">Productos</p>
      <h1 className="mt-3 text-[clamp(36px,6vw,64px)] leading-[1.05] text-ink">Sistemas de gestión Mercalin.</h1>
      <div className="mt-10 grid grid-cols-1 gap-8 pr-2 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
