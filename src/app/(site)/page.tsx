import Hero from "@/components/home/Hero";
import ProductCard from "@/components/ProductCard";
import { listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await listProducts();

  // La grilla se adapta a cuántos productos hay: con uno solo, tres columnas
  // dejan la fila vacía a la derecha y la página se ve rota.
  const n = products.length;
  // Con un solo producto no hay nada que elegir: el titulo cambia solo.
  const titulo = n === 1 ? "Empezá AHORA" : "Elegí tu sistema";
  const grilla =
    n >= 3 ? "max-w-5xl sm:grid-cols-2 lg:grid-cols-3"
    : n === 2 ? "max-w-3xl sm:grid-cols-2"
    : "max-w-[320px] grid-cols-1";

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-5xl px-6 pt-32 pb-16 sm:pt-44 sm:pb-24">
        <div className="text-center">
          <h2 className="font-condensed text-[38px] font-extrabold leading-[1.05] tracking-tight sm:text-[48px]">
            {titulo}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-foreground/55 sm:text-[19px]">
            Un solo pago, sin cuotas mensuales. Soporte 24/7 y actualizaciones incluidas. Probalo 7 días gratis, sin tarjeta.
          </p>
        </div>

        <div className={`mx-auto mt-9 grid gap-6 ${grilla}`}>
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
