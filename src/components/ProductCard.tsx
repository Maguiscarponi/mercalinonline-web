import Link from "next/link";
import ProductFrame from "./ProductFrame";
import type { Product } from "@/lib/products";

// Reusable — cuando exista más de un producto, la grilla los lista así sin
// cambios de estructura.
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl focus-within:ring-2 focus-within:ring-brand/40">
      {/* Un solo link que cubre la tarjeta entera. El botón de abajo queda
          decorativo: así se puede clickear en cualquier parte sin anidar
          dos <a>, que es inválido y rompe lectores de pantalla. */}
      <Link
        href={`/productos/${product.slug}`}
        className="absolute inset-0 z-20 rounded-xl outline-none"
        aria-label={`Ver detalle de ${product.name}`}
      />
      {product.featured && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
          Destacado
        </span>
      )}

      <div className="overflow-hidden">
        <div className="transition-transform duration-300 group-hover:scale-105">
          <ProductFrame label={product.name} src={product.imageUrl} aspect="aspect-[4/3]" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">Sistema de gestión</p>
        <h2 className="mt-1 text-base font-bold leading-snug text-foreground">{product.name}</h2>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-foreground/55">{product.tagline}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
            Pago único
          </span>
          <span className="rounded-full bg-accent-green-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-green">
            7 días gratis
          </span>
        </div>

        <div className="mt-3 text-xl font-bold tracking-tight text-foreground">
          ${product.priceArs.toLocaleString("es-AR")}
          <span className="ml-1 text-[11px] font-semibold text-foreground/40">ARS</span>
        </div>

        <span
          aria-hidden
          className="mt-4 block rounded-md bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-brand-dark"
        >
          VER DETALLE
        </span>
      </div>
    </div>
  );
}
