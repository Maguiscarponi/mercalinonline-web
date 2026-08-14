"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

const TRIAL_MAILTO =
  "mailto:magaliscarponi@gmail.com?subject=Quiero%20probar%20Mercalin%20gratis&body=Hola%2C%20quiero%20probar%20Mercalin%207%20d%C3%ADas%20gratis.%0D%0A%0D%0AMi%20mail%3A%20%0D%0AMi%20negocio%3A%20";

// Las dos puertas de conversión, siempre juntas: probar (mail directo, hoy
// es el único canal real) y comprar (agrega al carrito y lleva a pagar).
export default function BuyButtons({ product, className = "" }: { product: Product; className?: string }) {
  const { add } = useCart();
  const router = useRouter();

  function handleBuy() {
    add(product);
    router.push("/carrito");
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={TRIAL_MAILTO}
        className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Probar 7 días gratis
      </a>
      <button
        type="button"
        onClick={handleBuy}
        className="rounded-md border border-foreground/20 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40"
      >
        Comprar ahora
      </button>
    </div>
  );
}
