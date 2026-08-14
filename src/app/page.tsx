import Carousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";

const SLIDES = [
  { label: "Mercalin — Dashboard", note: "Se instala en tu PC. Funciona sin internet." },
  { label: "Mercalin — Caja", note: "Vendé rápido, con o sin conexión." },
  { label: "Mercalin — Consejo del día", note: "Analiza tus ventas y te avisa antes." },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pt-8">
        <Carousel slides={SLIDES} />
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <p className="tag-numbered text-xs text-brand">Productos</p>
        <div className="mt-6 space-y-4">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
