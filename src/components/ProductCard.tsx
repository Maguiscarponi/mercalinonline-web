import Link from "next/link";
import ProductFrame from "./ProductFrame";
import type { Product } from "@/lib/products";

// Reusable — cuando exista más de un producto, la grilla los lista así sin
// cambios de estructura.
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rt-card group relative flex cursor-pointer flex-col overflow-hidden transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 focus-within:outline focus-within:outline-[3px] focus-within:outline-brand">
      {/* Un solo link que cubre la tarjeta entera. El botón de abajo queda
          decorativo: así se puede clickear en cualquier parte sin anidar
          dos <a>, que es inválido y rompe lectores de pantalla. */}
      <Link
        href={`/productos/${product.slug}`}
        data-track="cta_detail_clicked"
        data-track-loc="product_card"
        className="absolute inset-0 z-20 outline-none"
        aria-label={`Ver detalle de ${product.name}`}
      />
      {product.featured && (
        <span className="tag-numbered absolute left-3 top-3 z-10 border-2 border-ink bg-brand px-2.5 py-1 text-[10px] uppercase text-white">
          Destacado
        </span>
      )}

      <div className="overflow-hidden border-b-[3px] border-ink">
        <ProductFrame label={product.name} src={product.imageUrl} aspect="aspect-[4/3]" bordered={false} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="tag-numbered text-[11px] uppercase text-ink-mute">Sistema de gestión</p>
        <h2 className="mt-1 text-[24px] leading-tight text-ink">{product.name}</h2>
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink-soft">{product.tagline}</p>

        <div className="tag-numbered mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase">
          <span>
            <span className="text-brand">✦</span> Pago único
          </span>
          <span>
            <span className="text-brand">✦</span> 7 días gratis
          </span>
        </div>

        <div className="font-slab mt-4 text-[28px] leading-none text-ink">
          ${product.priceArs.toLocaleString("es-AR")}
          <span className="tag-numbered ml-1.5 text-[11px] text-ink-mute">ARS</span>
        </div>

        <span aria-hidden className="rt-btn rt-btn-red mt-5 w-full">
          Ver detalle
        </span>
      </div>
    </div>
  );
}
