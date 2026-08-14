"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

const CHECKOUT_MAILTO =
  "mailto:magaliscarponi@gmail.com?subject=Quiero%20comprar%20Mercalin&body=Hola%2C%20quiero%20comprar%20Mercalin.%0D%0A%0D%0AMi%20mail%3A%20%0D%0AMi%20negocio%3A%20";

export default function Carrito() {
  const { items, total, remove } = useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-28">
        <p className="tag-numbered text-xs text-foreground/40">Carrito</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Todavía no agregaste nada.
        </h1>
        <Link
          href="/productos"
          className="mt-7 inline-block rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Ver productos
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
      <p className="tag-numbered text-xs text-brand">Carrito</p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Tu compra</h1>

      <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
        {items.map((item) => (
          <div key={item.slug} className="flex items-center justify-between gap-4 py-5">
            <div>
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              <p className="tag-numbered mt-1 text-[11px] text-foreground/40">Cantidad: {item.qty}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold tabular-nums text-foreground">
                ${(item.priceArs * item.qty).toLocaleString("es-AR")}
              </span>
              <button
                type="button"
                onClick={() => remove(item.slug)}
                className="text-xs font-medium text-foreground/40 transition-colors hover:text-brand"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="tag-numbered text-sm text-foreground/50">Total</span>
        <span className="text-2xl font-bold tracking-tight text-foreground">${total.toLocaleString("es-AR")}</span>
      </div>

      <a
        href={CHECKOUT_MAILTO}
        className="mt-8 block rounded-md bg-brand px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Continuar al pago
      </a>
      <p className="mt-3 text-center text-xs text-foreground/40">
        El pago con Mercado Pago todavía no está conectado — este botón te manda un mail directo para coordinar la compra.
      </p>
    </section>
  );
}
