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
    <section className="mx-auto max-w-md px-6 py-16 sm:py-20">
      <p className="tag-numbered text-xs text-brand">Prueba gratis</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">7 días, sin costo.</h1>
      <p className="mt-3 text-[15px] text-foreground/60">
        Te mandamos el instalador y una clave que funciona por 7 días. Sin tarjeta, sin crear cuenta.
      </p>
      <div className="mt-8">
        <TrialForm products={products} defaultSlug={product} />
      </div>
    </section>
  );
}
