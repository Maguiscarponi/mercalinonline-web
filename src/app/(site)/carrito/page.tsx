"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function Carrito() {
  const { items, total, remove } = useCart();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "not-configured" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCheckout() {
    if (!email || !email.includes("@")) {
      setErrorMsg("Ingresá un mail válido para continuar.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productSlug: items[0]?.slug }),
      });
      const data = await res.json();
      if (res.status === 503) {
        setStatus("not-configured");
        return;
      }
      if (!res.ok) {
        setErrorMsg(data.error || "No se pudo iniciar el pago.");
        setStatus("error");
        return;
      }
      window.location.href = data.url;
    } catch {
      setErrorMsg("No se pudo conectar. Probá de nuevo en un rato.");
      setStatus("error");
    }
  }

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

      <div className="mt-8">
        <label className="tag-numbered block text-xs text-foreground/40" htmlFor="checkout-email">
          Tu mail (ahí te mandamos el código de activación)
        </label>
        <input
          id="checkout-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-black/15 px-3 py-2.5 text-sm"
          placeholder="vos@tunegocio.com"
        />
      </div>

      {status === "error" && <p className="mt-4 text-sm text-brand">{errorMsg}</p>}

      {status === "not-configured" ? (
        <div className="mt-6 border border-black/10 bg-foreground/[0.03] p-5 text-sm text-foreground/70">
          <p>El pago con Mercado Pago todavía no está conectado en este sitio.</p>
          <a
            href={`mailto:magaliscarponi@gmail.com?subject=Quiero%20comprar%20Mercalin&body=Hola%2C%20quiero%20comprar%20Mercalin.%0D%0A%0D%0AMi%20mail%3A%20${encodeURIComponent(email)}`}
            className="mt-3 inline-block font-semibold text-brand"
          >
            Escribinos directo para coordinar la compra →
          </a>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleCheckout}
          disabled={status === "loading"}
          className="mt-8 block w-full rounded-md bg-brand px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {status === "loading" ? "Redirigiendo…" : "Continuar al pago"}
        </button>
      )}
    </section>
  );
}
