"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { track } from "@/lib/track";

export type ModuloCarpeta = {
  nombre: string;
  grupo: string;
  corta: string;
  desc: string;
  items: string[];
  src: string;
  ancho: number | null;
  alto: number | null;
};

// Color de la solapa por grupo (los mismos cinco grupos del menú de la app).
const TAB: Record<string, string> = {
  Operación: "#e1251b",
  Catálogo: "#f2a51c",
  Gestión: "#232120",
  Análisis: "#0a7d3e",
  Sistema: "#fdfbf5",
};
const GRUPOS = Object.keys(TAB);

export default function CarpetasClient({ modulos }: { modulos: ModuloCarpeta[] }) {
  const [abierto, setAbierto] = useState<number | null>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const ultimoFoco = useRef<HTMLElement | null>(null);

  const abrir = useCallback(
    (i: number) => {
      const m = modulos[i];
      track("demo_module_viewed", { group: m.grupo, module: m.nombre });
      setAbierto(i);
    },
    [modulos],
  );

  const cerrar = useCallback(() => {
    setAbierto(null);
    ultimoFoco.current?.focus();
  }, []);

  useEffect(() => {
    if (abierto === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowRight") abrir((abierto + 1) % modulos.length);
      if (e.key === "ArrowLeft") abrir((abierto - 1 + modulos.length) % modulos.length);
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cerrarRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [abierto, abrir, cerrar, modulos.length]);

  const m = abierto !== null ? modulos[abierto] : null;

  return (
    <>
      {/* Leyenda de colores */}
      <div className="tag-numbered mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[12px] uppercase text-ink">
        {GRUPOS.map((g) => (
          <span key={g} className="inline-flex items-center gap-2">
            <span className="h-3 w-[22px] border-2 border-ink" style={{ background: TAB[g] }} />
            {g}
          </span>
        ))}
        <span className="text-ink-soft normal-case tracking-normal sm:ml-auto">Tocá una carpeta para ver la pantalla real.</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-3 lg:grid-cols-6">
        {modulos.map((mod, i) => (
          <button
            key={mod.nombre}
            type="button"
            className="rt-folder"
            style={{ "--tab": TAB[mod.grupo] } as CSSProperties}
            onClick={(e) => {
              ultimoFoco.current = e.currentTarget;
              abrir(i);
            }}
            aria-haspopup="dialog"
          >
            <span className="rt-folder-tab" aria-hidden />
            <span className="rt-folder-body block">
              <span className="tag-numbered block text-[11px] text-ink-mute">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-slab mt-1 block text-[19px] leading-[1.08] text-ink">{mod.nombre}</span>
              <span className="mt-2 block text-[14.5px] leading-snug text-ink-soft">{mod.corta}</span>
            </span>
          </button>
        ))}
      </div>

      {m && abierto !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Módulo ${m.nombre}`}
          onClick={cerrar}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/85 p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="rt-window my-auto w-full max-w-[1100px]"
            style={{ "--sh": "10px", "--sh-color": "#e1251b" } as CSSProperties}
          >
            <div className="rt-window-bar">
              <span className="truncate">
                Mercalin — {m.nombre} <span className="opacity-60">· {m.grupo}</span>
              </span>
              <button
                ref={cerrarRef}
                type="button"
                onClick={cerrar}
                aria-label="Cerrar"
                className="ml-3 px-2 text-[15px] opacity-80 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-white">
              {m.ancho && m.alto ? (
                <Image
                  key={m.src}
                  src={m.src}
                  alt={`Pantalla de ${m.nombre} en Mercalin`}
                  width={m.ancho}
                  height={m.alto}
                  quality={90}
                  priority
                  className="mx-auto h-auto max-h-[52vh] w-auto max-w-full object-contain"
                  sizes="(min-width: 1100px) 1100px, 100vw"
                />
              ) : (
                <div className="tag-numbered flex aspect-video items-center justify-center text-[13px] uppercase text-ink-mute">
                  Captura próximamente
                </div>
              )}
            </div>

            <div className="grid gap-6 border-t-[3px] border-ink p-5 sm:grid-cols-[1fr_1.1fr] sm:p-7">
              <div>
                <h3 className="text-[clamp(26px,3vw,36px)] leading-[1.05] text-ink">{m.nombre}</h3>
                <p className="mt-2 text-[17px] leading-relaxed text-ink-soft">{m.desc}</p>
              </div>
              <ul className="font-typewriter space-y-1.5 text-[14px] leading-snug">
                {m.items.map((it) => (
                  <li key={it}>
                    <span className="font-bold text-brand">/</span> {it}
                  </li>
                ))}
              </ul>
            </div>

            <div className="tag-numbered flex items-center justify-between border-t-2 border-ink/15 px-5 py-3 text-[12px] uppercase sm:px-7">
              <button type="button" onClick={() => abrir((abierto - 1 + modulos.length) % modulos.length)} className="hover:text-brand">
                ← Anterior
              </button>
              <span className="text-ink-mute">
                {abierto + 1} / {modulos.length}
              </span>
              <button type="button" onClick={() => abrir((abierto + 1) % modulos.length)} className="hover:text-brand">
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
