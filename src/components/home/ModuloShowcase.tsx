import { ACENTO, GRUPOS, medidas } from "@/lib/modulos-data";
import ModuloShowcaseClient, { type GrupoConMedidas } from "./ModuloShowcaseClient";

// Server Component: mide las capturas en disco (medidas() usa node:fs) y le
// pasa todo ya resuelto al cliente, que sólo se ocupa de qué tab está activo.
// Esta es la demo "grande" que pediste para la home — reutiliza el mismo
// contenido y las mismas capturas que ya existían en Modulos.tsx (la ficha
// de producto), no inventa nada nuevo.
export default function ModuloShowcase() {
  const grupos: GrupoConMedidas[] = GRUPOS.map((grupo) => ({
    label: grupo.label,
    color: grupo.color,
    acento: ACENTO[grupo.color],
    modulos: grupo.modulos.map((m) => {
      const med = medidas(m.archivo);
      return {
        nombre: m.nombre,
        desc: m.desc,
        items: m.items,
        src: `/capturas/${m.archivo}`,
        ancho: med?.ancho ?? null,
        alto: med?.alto ?? null,
      };
    }),
  }));

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="tag-numbered text-xs text-brand">Así es Mercalin por dentro</p>
        <h2 className="font-condensed mt-3 text-[32px] font-extrabold leading-[1.06] tracking-tight sm:text-[40px]">
          No son capturas sueltas. Es el sistema, módulo por módulo.
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-foreground/60">
          Elegí un módulo y mirá la pantalla real, en grande — con lo que podés hacer en cada una.
        </p>
      </div>

      <ModuloShowcaseClient grupos={grupos} />
    </section>
  );
}
