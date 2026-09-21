import Link from "next/link";
import type { Product } from "@/lib/products";

// Las dos puertas de conversión, siempre juntas: probar (formulario propio,
// sin pasarela) y comprar (mail + Mercado Pago, sin carrito de por medio —
// un solo producto no necesita ese paso extra).
export default function BuyButtons({
  product,
  className = "",
  location = "product",
}: {
  product: Product;
  className?: string;
  location?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        href={`/prueba-gratis?product=${product.slug}`}
        data-track="cta_trial_clicked"
        data-track-loc={location}
        className="rt-btn rt-btn-red"
      >
        Probar 7 días gratis
      </Link>
      <Link
        href={`/carrito?product=${product.slug}`}
        data-track="cta_buy_clicked"
        data-track-loc={location}
        className="rt-btn rt-btn-paper"
      >
        Comprar ahora
      </Link>
    </div>
  );
}
