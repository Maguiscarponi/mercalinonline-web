"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { getAttribution, getVisitorId, track } from "@/lib/track";

export default function CompraForm({ product }: { product: Product }) {
  const started = useRef(false);
  const [email, setEmail] = useState("");
  // Campo señuelo anti-bots: una persona nunca lo ve ni lo completa.
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "not-configured" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        body: JSON.stringify({ email, productSlug: product.slug, website, visitorId: getVisitorId(), ...getAttribution() }),
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

  if (status === "not-configured") {
    return (
      <div className="border border-black/10 bg-foreground/[0.03] p-5 text-sm text-foreground/70">
        <p>El pago con Mercado Pago todavía no está conectado en este sitio.</p>
        <a
          href={`mailto:onlinemercalin@gmail.com?subject=Quiero%20comprar%20Mercalin&body=Hola%2C%20quiero%20comprar%20Mercalin.%0D%0A%0D%0AMi%20mail%3A%20${encodeURIComponent(email)}`}
          className="mt-3 inline-block font-semibold text-brand"
        >
          Escribinos directo para coordinar la compra →
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={() => {
        if (started.current) return;
        started.current = true;
        track("buy_form_started");
      }}
      className="border border-black/10 p-8"
    >
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

      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="mc_verif">Dejar vacío</label>
        <input
          id="mc_verif"
          type="text"
          name="mc_verif"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {status === "error" && <p className="mt-4 text-sm text-brand">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 block w-full rounded-md bg-brand px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
      >
        {status === "loading" ? "Redirigiendo…" : "Continuar al pago"}
      </button>
      <p className="mt-4 text-center text-[12.5px] leading-relaxed text-foreground/45">
        El pago lo procesa Mercado Pago: nosotros no vemos ni guardamos los datos de tu tarjeta.{" "}
        <Link href="/privacidad" className="underline underline-offset-2 hover:text-foreground">
          Política de privacidad
        </Link>
      </p>
    </form>
  );
}
