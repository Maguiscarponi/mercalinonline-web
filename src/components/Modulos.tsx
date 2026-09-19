import { Check } from "lucide-react";
import CapturaModal from "./CapturaModal";
import { ACENTO, GRUPOS, medidas } from "@/lib/modulos-data";

export default function Modulos() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
      <div className="max-w-2xl">
        <p className="tag-numbered text-xs text-brand">Los 18 módulos</p>
        <h2 className="font-condensed mt-3 text-[32px] font-extrabold leading-[1.06] tracking-tight sm:text-[40px]">
          Mirá el sistema por dentro
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-foreground/60">
          Cada módulo con lo que podés hacer adentro. Los colores son los mismos que vas a ver en el
          menú del sistema.
        </p>
      </div>

      <div className="mt-14 space-y-16">
        {GRUPOS.map((grupo) => {
          const a = ACENTO[grupo.color];
          return (
            <div key={grupo.label}>
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${a.punto}`} />
                <h3 className="tag-numbered text-[15px] text-foreground/70">{grupo.label}</h3>
                <span className="ml-1 text-[13px] text-foreground/35">
                  {grupo.modulos.length} {grupo.modulos.length === 1 ? "módulo" : "módulos"}
                </span>
                <span className="ml-3 h-px flex-1 bg-black/[0.08]" />
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {grupo.modulos.map((m) => {
                  const med = medidas(m.archivo);
                  return (
                  <article
                    key={m.nombre}
                    className={`flex flex-col overflow-hidden rounded-2xl border ${a.borde} bg-white`}
                  >
                    <div className="flex flex-1 flex-col p-6">
                      <span
                        className={`tag-numbered self-start rounded-full px-2.5 py-1 text-[11px] ${a.chip} ${a.texto}`}
                      >
                        {grupo.label}
                      </span>
                      <h4 className="font-condensed mt-3 text-[26px] font-bold leading-tight">
                        {m.nombre}
                      </h4>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-foreground/55">{m.desc}</p>

                      <ul className="mt-4 space-y-2">
                        {m.items.map((it) => (
                          <li key={it} className="flex gap-2.5 text-[14.5px] leading-relaxed text-foreground/70">
                            <Check className={`mt-1 h-3.5 w-3.5 shrink-0 ${a.texto}`} strokeWidth={3} />
                            {it}
                          </li>
                        ))}
                      </ul>

                      {med && (
                        <CapturaModal
                          src={`/capturas/${m.archivo}`}
                          titulo={m.nombre}
                          ancho={med.ancho}
                          alto={med.alto}
                        />
                      )}
                    </div>
                  </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
