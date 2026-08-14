import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Carousel from "@/components/Carousel";
import ProductFrame from "@/components/ProductFrame";
import BuyButtons from "@/components/BuyButtons";
import ConsejoCard from "@/components/ConsejoCard";
import { PRODUCTS, getProduct } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: `${product.name} — Mercalin`, description: product.tagline };
}

const GALERIA = [
  { label: "Dashboard" },
  { label: "Caja" },
  { label: "Stock" },
  { label: "Clientes" },
  { label: "Proveedores" },
  { label: "Reportes" },
];

export default async function ProductoDetalle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <>
      {/* Nombre + galería + precio + compra — todo antes de explicar nada */}
      <section className="mx-auto max-w-4xl px-6 pb-6 pt-12">
        <p className="tag-numbered text-xs text-brand">Sistema de gestión</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
        <p className="mt-2 max-w-xl text-[15px] text-foreground/55">{product.tagline}</p>

        <div className="mt-8">
          <Carousel slides={GALERIA} />
        </div>

        <div className="mt-8 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-foreground">
            ${product.priceArs.toLocaleString("es-AR")}
          </span>
          <span className="tag-numbered text-xs text-foreground/40">ARS · Pago único</span>
        </div>
        <BuyButtons product={product} className="mt-5" />
      </section>

      {/* Descripción completa */}
      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="tag-numbered text-xs text-foreground/40">Descripción</p>
          <p className="mt-4 text-[16px] leading-relaxed text-foreground/70">{product.description}</p>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-foreground">
            <span className="tag-numbered mr-2 text-xs text-foreground/40">Ideal para</span>
            {product.idealFor.map((r, i) => (
              <span key={r}>
                <span className="font-semibold">{r}</span>
                {i < product.idealFor.length - 1 ? <span className="text-foreground/30"> · </span> : "."}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Funcionalidades completas */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <p className="tag-numbered text-xs text-foreground/40">Funcionalidades</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Todo lo que incluye.
        </h2>
        <div className="mt-8 divide-y divide-black/10 border-t border-black/10">
          {product.featureGroups.map((group, i) => (
            <div key={group.title} className="grid gap-3 py-7 sm:grid-cols-[140px_1fr] sm:gap-8">
              <div className="tag-numbered text-sm text-brand">
                {String(i + 1).padStart(2, "0")} — {group.title}
              </div>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[14.5px] leading-relaxed text-foreground/65">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* El motor de consejos — recurso de identidad, acotado */}
      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="tag-numbered text-xs text-foreground/40">El motor de consejos</p>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-foreground/65">
            Analiza tus ventas y avisa antes de que preguntes.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <ConsejoCard level="urgente" mensaje="Coca-Cola 2.5L se agota mañana." detalle="Pedí hoy" />
            <ConsejoCard level="importante" mensaje="María López hace 31 días que no vuelve." detalle="Ver cuenta corriente" />
            <ConsejoCard level="consejo" mensaje="8 productos por debajo del margen mínimo." detalle="+$48.000/mes si los ajustás" />
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <p className="tag-numbered text-xs text-foreground/40">Video</p>
        <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground">Mirá cómo funciona.</h2>
        <div className="mt-6">
          <ProductFrame label="Video" note="Próximamente" />
        </div>
      </section>

      {/* FAQ + compra final */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
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
