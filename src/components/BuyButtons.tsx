"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

// Las dos puertas de conversión, siempre juntas: probar (formulario propio,
// sin pasarela) y comprar (agrega al carrito y lleva a pagar).
export default function BuyButtons({ product, className = "" }: { product: Product; className?: string }) {
  const { add } = useCart();
  const router = useRouter();

  function handleBuy() {
    add(product);
    router.push("/carrito");
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        href={`/prueba-gratis?product=${product.slug}`}
        className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-all hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md"
      >
        Probar 7 días gratis
      </Link>
      <button
        type="button"
        onClick={handleBuy}
        className="rounded-md border border-foreground/20 bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-md"
      >
        Comprar ahora
      </button>
    </div>
  );
}
