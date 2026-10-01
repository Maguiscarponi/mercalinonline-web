import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CompraForm from "@/components/CompraForm";
import { listProducts } from "@/lib/products";
import { planCuotas, pesos } from "@/lib/cuotas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Comprar — Mercalin",
  description: "Comprá tu licencia de Mercalin.",
};

export default async function Comprar({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; plan?: string; status?: string; collection_status?: string }>;
}) {
  const { product: slug, plan: planParam, status: statusParam, collection_status } = await searchParams;
  const products = await listProducts();
  const product = (slug ? products.find((p) => p.slug === slug) : undefined) ?? products[0];

  if (!product) notFound();
  const plan = planCuotas(product);

  // Mercado Pago vuelve acá (back_urls.failure) cuando el pago no se pudo
  // procesar -- cualquier estado que no sea aprobado/pendiente es un fallo
  // real, no solo "rejected" (MP también manda "cancelled" y otros).
  const status = statusParam ?? collection_status ?? "";
  const fallo = status !== "" && !["approved", "pending", "in_process"].includes(status);

  return (
    <section className="mx-auto max-w-lg px-5 py-14 sm:px-6 sm:py-20">
      <p className="rt-label">Comprar</p>
      <h1 className="mt-3 text-[clamp(34px,5.4vw,48px)] leading-[1.05] text-ink">{product.name}</h1>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="font-slab text-[34px] leading-none text-ink">{pesos(product.priceArs)}</span>
        <span className="tag-numbered text-xs uppercase text-ink-soft">ARS · en un pago</span>
      </p>
      {plan && (
        <p className="font-slab mt-2 text-[20px] leading-tight text-ink">
          o {plan.cuotas} cuotas fijas de <span className="text-brand">{pesos(plan.montoCuota)}</span>
        </p>
      )}
      <p className="mt-4 text-[18px] leading-relaxed text-ink-soft">
        Pagás con Mercado Pago y te llega el código de activación por mail. La licencia es tuya para siempre.
      </p>
      {fallo && (
        <div role="alert" className="mt-6 border-[3px] border-brand bg-brand/10 p-4">
          <p className="font-slab text-[18px] leading-tight text-ink">El pago no se pudo procesar.</p>
          <p className="font-typewriter mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
            Mercado Pago rechazó el intento anterior (tarjeta, fondos u otro motivo del medio de pago). No te cobramos nada — probá de nuevo, con otro medio de pago si hace falta.
          </p>
        </div>
      )}
      <div className="mt-9 pr-2.5">
        <CompraForm product={product} planInicial={planParam === "cuotas" ? "cuotas" : "contado"} />
      </div>
      <p className="tag-numbered mt-8 text-[12.5px] uppercase text-ink-soft">
        <Link href={`/productos/${product.slug}`} className="hover:text-brand">
          ← Volver al detalle del producto
        </Link>
      </p>
    </section>
  );
}
