import Link from "next/link";
import type { Product } from "@/lib/products";

// Reusable — cuando exista más de un producto, el índice los lista así sin
// cambios de estructura.
export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="block border border-black/10 p-6 transition-colors hover:border-foreground/30 sm:p-8"
    >
      <p className="tag-numbered text-xs text-foreground/40">Sistema de gestión</p>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">{product.name}</h2>
      <p className="mt-2 max-w-lg text-[14.5px] leading-relaxed text-foreground/55">{product.tagline}</p>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          ${product.priceArs.toLocaleString("es-AR")}
        </span>
        <span className="tag-numbered text-[11px] text-foreground/40">ARS · Pago único</span>
      </div>
      <span className="mt-5 inline-block text-sm font-semibold text-brand">Ver producto →</span>
    </Link>
  );
}
