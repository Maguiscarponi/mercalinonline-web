"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { getAttribution, getVisitorId, track } from "@/lib/track";

export default function TrialForm({ products, defaultSlug }: { products: Product[]; defaultSlug?: string }) {
  const started = useRef(false);
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  // Campo señuelo anti-bots: una persona nunca lo ve ni lo completa.
  const [website, setWebsite] = useState("");
  const [productSlug, setProductSlug] = useState(defaultSlug ?? products[0]?.slug ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, businessName, productSlug, website, visitorId: getVisitorId(), ...getAttribution() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "No se pudo procesar la prueba. Probá de nuevo.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMsg("No se pudo conectar. Probá de nuevo en un rato.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-black/10 p-8 text-center">
        <p className="tag-numbered text-xs text-brand">Listo</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Revisá tu mail.</h2>
        <p className="mt-3 text-[15px] text-foreground/60">
          Te mandamos el instalador y el código de activación a <strong>{email}</strong>.
        </p>
        <p className="mt-3 text-[13.5px] text-foreground/45">
          Si en unos minutos no aparece, mirá la carpeta de spam o escribinos por WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={() => {
        if (started.current) return;
        started.current = true;
        track("trial_form_started");
      }}
      className="border border-black/10 p-8"
    >
      {products.length > 1 && (
        <div className="mb-5">
          <label className="tag-numbered block text-xs text-foreground/40" htmlFor="product">
            Producto
          </label>
          <select
            id="product"
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
            className="mt-2 w-full border border-black/15 px-3 py-2.5 text-sm"
          >
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="mb-5">
        <label className="tag-numbered block text-xs text-foreground/40" htmlFor="email">
          Tu mail
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-black/15 px-3 py-2.5 text-sm"
          placeholder="vos@tunegocio.com"
        />
      </div>
      <div className="mb-6">
        <label className="tag-numbered block text-xs text-foreground/40" htmlFor="businessName">
          Nombre del negocio (opcional)
        </label>
        <input
          id="businessName"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="mt-2 w-full border border-black/15 px-3 py-2.5 text-sm"
          placeholder="Kiosco Don José"
        />
      </div>
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
      {status === "error" && <p className="mb-4 text-sm text-brand">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
      >
        {status === "loading" ? "Enviando…" : "Empezar prueba de 7 días"}
      </button>
      <p className="mt-4 text-center text-[12.5px] leading-relaxed text-foreground/45">
        Usamos tu mail solo para enviarte la clave y avisarte de tu prueba.{" "}
        <Link href="/privacidad" className="underline underline-offset-2 hover:text-foreground">
          Política de privacidad
        </Link>
      </p>
    </form>
  );
}
