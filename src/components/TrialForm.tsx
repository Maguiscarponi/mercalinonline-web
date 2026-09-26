"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import Ventana from "@/components/retro/Ventana";
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
      <Ventana titulo="Mercalin — Prueba gratis">
        <div role="status" className="p-8 text-center">
          <p className="rt-label">Listo</p>
          <h2 className="mt-3 text-3xl leading-tight text-ink">Revisá tu mail.</h2>
          <p className="mt-3 text-[16px] text-ink-soft">
            Te mandamos el instalador y el código de activación a <strong className="break-all text-ink">{email}</strong>.
          </p>
          <p className="mt-3 text-[14px] text-ink-mute">
            Si en unos minutos no aparece, mirá la carpeta de spam o escribinos por WhatsApp.
          </p>
        </div>
      </Ventana>
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
      className="rt-window"
      style={{ "--sh": "10px" } as React.CSSProperties}
    >
      <div className="rt-window-bar">
        <span>Mercalin — Prueba gratis</span>
        <span aria-hidden className="opacity-80">✕</span>
      </div>
      <div className="p-6 sm:p-8">
      {products.length > 1 && (
        <div className="mb-5">
          <label className="tag-numbered block text-xs uppercase text-ink-soft" htmlFor="product">
            Producto
          </label>
          <select
            id="product"
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
            className="rt-input mt-2"
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
        <label className="tag-numbered block text-xs uppercase text-ink-soft" htmlFor="email">
          Tu mail
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rt-input mt-2"
          placeholder="vos@tunegocio.com"
        />
      </div>
      <div className="mb-6">
        <label className="tag-numbered block text-xs uppercase text-ink-soft" htmlFor="businessName">
          Nombre del negocio (opcional)
        </label>
        <input
          id="businessName"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="rt-input mt-2"
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
      {status === "error" && (
        <p role="alert" className="mb-4 text-sm font-semibold text-brand">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rt-btn rt-btn-red w-full"
      >
        {status === "loading" ? "Enviando…" : "Empezar prueba de 7 días"}
      </button>
      <p className="mt-4 text-center text-[13px] leading-relaxed text-ink-mute">
        Usamos tu mail solo para enviarte la clave y avisarte de tu prueba.{" "}
        <Link href="/privacidad" className="underline underline-offset-2 hover:text-foreground">
          Política de privacidad
        </Link>
      </p>
      </div>
    </form>
  );
}
