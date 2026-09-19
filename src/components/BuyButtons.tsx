import Link from "next/link";
import type { Product } from "@/lib/products";

// Las dos puertas de conversión, siempre juntas: probar (formulario propio,
// sin pasarela) y comprar (mail + Mercado Pago, sin carrito de por medio —
// un solo producto no necesita ese paso extra).
export default function BuyButtons({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        href={`/prueba-gratis?product=${product.slug}`}
        className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-all hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md"
      >
        Probar 7 días gratis
      </Link>
      <Link
        href={`/carrito?product=${product.slug}`}
        className="rounded-md border border-foreground/20 bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-md"
      >
        Comprar ahora
      </Link>
    </div>
  );
}
