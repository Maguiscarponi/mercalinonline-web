import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductFrame from "@/components/ProductFrame";
import BuyButtons from "@/components/BuyButtons";
import Modulos from "@/components/Modulos";
import ContactoArca from "@/components/ContactoArca";
import { getProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return { title: `${product.name} — Mercalin`, description: product.tagline };
}

export default async function ProductoDetalle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <>
      {/* Breadcrumb + galería + precio + compra — todo antes de explicar nada */}
      <section className="mx-auto max-w-5xl px-6 pb-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-foreground/40">
          <Link href="/" className="hover:text-foreground">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-foreground">Productos</Link>
          <span>/</span>
          <span className="text-foreground/60">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="overflow-hidden rounded-xl">
            <ProductFrame label={product.name} src={product.imageUrl} aspect="aspect-square" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
                Pago único
              </span>
              <span className="rounded-full bg-accent-green-bg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-green">
                7 días gratis
              </span>
              <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground/60">
                Soporte 24/7
              </span>
              <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground/60">
                Actualizaciones incluidas
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
            <p className="mt-2 max-w-md text-[15px] text-foreground/55">{product.tagline}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                ${product.priceArs.toLocaleString("es-AR")}
              </span>
              <span className="tag-numbered text-xs text-foreground/40">ARS</span>
            </div>
            <BuyButtons product={product} className="mt-5" />

            <div className="mt-8 border-t border-black/10 pt-5">
              <p className="tag-numbered text-xs text-foreground/40">Ideal para</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/70">
                {product.idealFor.map((r, i) => (
                  <span key={r}>
                    <span className="font-semibold text-foreground">{r}</span>
                    {i < product.idealFor.length - 1 ? <span className="text-foreground/30"> · </span> : "."}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Descripción completa */}
      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="tag-numbered text-xs text-brand">Qué es</p>
          <p className="mt-5 text-[19px] leading-[1.7] text-foreground/75 sm:text-[21px]">
            {product.description}
          </p>
        </div>
      </section>

      <Modulos />

      <ContactoArca />

      {/* FAQ + compra final */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-10 text-center">
          <p className="text-[15px] text-foreground/55">
            ¿Dudas sobre la prueba, el pago o la instalación?{" "}
            <Link href="/preguntas-frecuentes" className="font-semibold text-brand">
              Ver preguntas frecuentes
            </Link>
          </p>
          <BuyButtons product={product} className="mt-7 justify-center" />
        </div>
      </section>
    </>
  );
}
