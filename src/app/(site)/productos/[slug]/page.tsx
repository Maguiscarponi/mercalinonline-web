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
      <section className="mx-auto max-w-5xl px-5 pb-10 pt-8 sm:px-6">
        <nav className="tag-numbered flex items-center gap-2 text-[12px] uppercase text-ink-mute">
          <Link href="/" className="hover:text-brand">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-brand">Productos</Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="rt-card overflow-hidden">
            <ProductFrame label={product.name} src={product.imageUrl} aspect="aspect-square" bordered={false} />
          </div>

          <div>
            <div className="tag-numbered flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] uppercase">
              {["Pago único", "7 días gratis", "Soporte por WhatsApp", "Actualizaciones incluidas"].map((t) => (
                <span key={t}>
                  <span className="text-brand">✦</span> {t}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-[clamp(34px,5vw,52px)] leading-[1.05] text-ink">{product.name}</h1>
            <p className="mt-3 max-w-md text-[18px] leading-relaxed text-ink-soft">{product.tagline}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-slab text-[clamp(44px,6vw,64px)] leading-none text-ink">
                ${product.priceArs.toLocaleString("es-AR")}
              </span>
              <span className="tag-numbered text-xs uppercase text-ink-mute">ARS</span>
            </div>
            <BuyButtons product={product} className="mt-5" location="product_top" />

            <div className="mt-8 border-t-[3px] border-ink pt-5">
              <p className="tag-numbered text-xs uppercase text-ink-mute">Ideal para</p>
              <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">
                {product.idealFor.map((r, i) => (
                  <span key={r}>
                    <span className="font-bold text-ink">{r}</span>
                    {i < product.idealFor.length - 1 ? <span className="text-ink-mute"> · </span> : "."}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Descripción completa */}
      <section className="border-y-[3px] border-ink bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6">
          <p className="rt-label">Qué es</p>
          <p className="mt-5 text-[20px] leading-[1.7] text-ink-soft sm:text-[22px]">
            {product.description}
          </p>
        </div>
      </section>

      <Modulos />

      <ContactoArca />

      {/* FAQ + compra final */}
      <section className="border-t-[3px] border-ink bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-12 text-center sm:px-6">
          <p className="text-[17px] text-ink-soft">
            ¿Dudas sobre la prueba, el pago o la instalación?{" "}
            <Link href="/preguntas-frecuentes" className="font-bold text-brand underline underline-offset-4">
              Ver preguntas frecuentes
            </Link>
          </p>
          <BuyButtons product={product} className="mt-7 justify-center" location="product_bottom" />
        </div>
      </section>
    </>
  );
}
