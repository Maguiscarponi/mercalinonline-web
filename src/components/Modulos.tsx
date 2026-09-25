import CapturaModal from "./CapturaModal";
import { GRUPOS, medidas } from "@/lib/modulos-data";

// Mismo color de solapa por grupo que las carpetas de la home.
const TAB: Record<string, string> = {
  Operación: "#e1251b",
  Catálogo: "#f2a51c",
  Gestión: "#232120",
  Análisis: "#0a7d3e",
  Sistema: "#fdfbf5",
};

export default function Modulos() {
  const totalModulos = GRUPOS.reduce((n, g) => n + g.modulos.length, 0);
  return (
    <section className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="rt-label">Los {totalModulos} módulos</p>
        <h2 className="mt-3 text-[clamp(32px,4.6vw,52px)] leading-[1.06] text-ink">Mirá el sistema por dentro</h2>
        <p className="mt-4 text-[18px] leading-relaxed text-ink-soft">
          Cada módulo con lo que podés hacer adentro. Los colores son los mismos que vas a ver en el menú del sistema.
        </p>
      </div>

      <div className="mt-14 space-y-16">
        {GRUPOS.map((grupo) => (
          <div key={grupo.label}>
            <div className="flex items-center gap-3">
              <span className="h-3.5 w-7 border-2 border-ink" style={{ background: TAB[grupo.label] }} />
              <h3 className="tag-numbered text-[15px] uppercase text-ink">{grupo.label}</h3>
              <span className="tag-numbered text-[12px] uppercase text-ink-mute">
                {grupo.modulos.length} {grupo.modulos.length === 1 ? "módulo" : "módulos"}
              </span>
              <span className="ml-2 h-0 flex-1 border-t-2 border-dashed border-ink/40" />
            </div>

            <div className="mt-7 grid gap-8 pr-2 sm:grid-cols-2">
              {grupo.modulos.map((m) => {
                const med = medidas(m.archivo);
                return (
                  <article key={m.nombre} className="rt-card flex flex-col p-6">
                    <span
                      className="tag-numbered self-start border-2 border-ink px-2.5 py-1 text-[11px] uppercase"
                      style={{ background: TAB[grupo.label], color: grupo.label === "Gestión" || grupo.label === "Operación" || grupo.label === "Análisis" ? "#fff" : "#232120" }}
                    >
                      {grupo.label}
                    </span>
                    <h4 className="font-slab mt-3 text-[26px] leading-tight text-ink">{m.nombre}</h4>
                    <p className="mt-1.5 text-[16px] leading-relaxed text-ink-soft">{m.desc}</p>

                    <ul className="font-typewriter mt-4 space-y-2 text-[14px] leading-snug">
                      {m.items.map((it) => (
                        <li key={it}>
                          <span className="font-bold text-brand">/</span> {it}
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
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
