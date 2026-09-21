import type { Metadata } from "next";
import TrialForm from "@/components/TrialForm";
import { listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Probar 7 días gratis — Mercalin",
  description: "Pedí tu prueba gratis de 7 días de Mercalin.",
};

export default async function PruebaGratis({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const products = await listProducts();

  return (
    <section className="mx-auto max-w-lg px-5 py-14 sm:px-6 sm:py-20">
      <p className="rt-label">Prueba gratis</p>
      <h1 className="mt-3 text-[clamp(38px,6vw,54px)] leading-[1.05] text-ink">7 días, sin costo.</h1>
      <p className="mt-4 text-[18px] leading-relaxed text-ink-soft">
        Te mandamos el instalador y una clave que funciona por 7 días. Sin tarjeta, sin crear cuenta.
      </p>
      <div className="mt-9 pr-2.5">
        <TrialForm products={products} defaultSlug={product} />
      </div>
    </section>
  );
}
