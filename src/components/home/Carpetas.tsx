import { GRUPOS, medidas } from "@/lib/modulos-data";
import TrackView from "@/components/TrackView";
import CarpetasClient, { type ModuloCarpeta } from "./CarpetasClient";

// Server Component: mide las capturas en disco (medidas() usa node:fs) y le
// pasa todo resuelto al cliente, que solo maneja qué carpeta está abierta.
// Es la misma fuente que la ficha del producto (lib/modulos-data.ts).
export default function Carpetas() {
  const modulos: ModuloCarpeta[] = GRUPOS.flatMap((g) =>
    g.modulos.map((m) => {
      const med = medidas(m.archivo);
      return {
        nombre: m.nombre,
        grupo: g.label,
        corta: m.corta,
        desc: m.desc,
        items: m.items,
        src: `/capturas/${m.archivo}`,
        ancho: med?.ancho ?? null,
        alto: med?.alto ?? null,
      };
    }),
  );

  return (
    <section id="modulos" className="rt-dots flex min-h-[100svh] scroll-mt-20 items-center border-y-[3px] border-ink">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-0">
        <TrackView name="demo_section_viewed" />
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="rt-label">Nº 02 · Módulos</p>
            <h2 className="mt-2 text-[clamp(38px,6vw,80px)] leading-[1.05] text-ink">Módulos incluidos</h2>
            <p className="mt-3 text-[20px] text-ink-soft sm:text-[21px]">
              Todos vienen con el sistema. No hay que pagar nada aparte.
            </p>
          </div>
        </div>

        <CarpetasClient modulos={modulos} />
      </div>
    </section>
  );
}
