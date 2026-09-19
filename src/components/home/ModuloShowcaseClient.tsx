"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import type { ACENTO } from "@/lib/modulos-data";

type Acento = (typeof ACENTO)[keyof typeof ACENTO];

export type ModuloConMedidas = {
  nombre: string;
  desc: string;
  items: string[];
  src: string;
  ancho: number | null;
  alto: number | null;
};

export type GrupoConMedidas = {
  label: string;
  color: keyof typeof ACENTO;
  acento: Acento;
  modulos: ModuloConMedidas[];
};

export default function ModuloShowcaseClient({ grupos }: { grupos: GrupoConMedidas[] }) {
  const [grupoIdx, setGrupoIdx] = useState(0);
  const [moduloIdx, setModuloIdx] = useState(0);

  const grupo = grupos[grupoIdx];
  const modulo = grupo.modulos[moduloIdx] ?? grupo.modulos[0];

  function elegirGrupo(i: number) {
    setGrupoIdx(i);
    setModuloIdx(0);
  }

  return (
    <div className="mt-10">
      {/* Tabs por grupo — el color es el mismo que ese grupo tiene en la app */}
      <div className="flex flex-wrap gap-2">
        {grupos.map((g, i) => (
          <button
            key={g.label}
            type="button"
            onClick={() => elegirGrupo(i)}
            className={`tag-numbered inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition-colors ${
              i === grupoIdx
                ? `${g.acento.chip} ${g.acento.texto} ${g.acento.borde}`
                : "border-black/10 text-foreground/50 hover:border-black/20 hover:text-foreground"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${g.acento.punto}`} />
            {g.label}
          </button>
        ))}
      </div>

      {/* Si el grupo tiene más de un módulo, elegir cuál mostrar */}
      {grupo.modulos.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {grupo.modulos.map((m, i) => (
            <button
              key={m.nombre}
              type="button"
              onClick={() => setModuloIdx(i)}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                i === moduloIdx
                  ? "bg-foreground text-white"
                  : "bg-foreground/[0.05] text-foreground/55 hover:bg-foreground/10"
              }`}
            >
              {m.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Captura grande */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl shadow-black/[0.06]">
        {modulo.ancho && modulo.alto ? (
          <Image
            key={modulo.src}
            src={modulo.src}
            alt={`Pantalla de ${modulo.nombre} en Mercalin`}
            width={modulo.ancho}
            height={modulo.alto}
            quality={90}
            className="h-auto w-full"
            sizes="(min-width: 1024px) 1000px, 100vw"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center text-sm text-foreground/35">
            Captura próximamente
          </div>
        )}
      </div>

      {/* Explicación del módulo activo */}
      <div className="mt-7 grid gap-8 sm:grid-cols-[1fr_1.1fr]">
        <div>
          <span
            className={`tag-numbered inline-flex rounded-full px-2.5 py-1 text-[11px] ${grupo.acento.chip} ${grupo.acento.texto}`}
          >
            {grupo.label}
          </span>
          <h3 className="font-condensed mt-3 text-[28px] font-bold leading-tight">{modulo.nombre}</h3>
          <p className="mt-2 text-[15.5px] leading-relaxed text-foreground/60">{modulo.desc}</p>
        </div>
        <ul className="space-y-2.5">
          {modulo.items.map((it) => (
            <li key={it} className="flex gap-2.5 text-[14.5px] leading-relaxed text-foreground/70">
              <Check className={`mt-1 h-3.5 w-3.5 shrink-0 ${grupo.acento.texto}`} strokeWidth={3} />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
