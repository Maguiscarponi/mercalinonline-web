import Ventana from "@/components/retro/Ventana";
import VideoPantalla from "@/components/VideoPantalla";

/* "Así se usa.": el tutorial de Caja en grande (fondo rojo, pantalla completa).
   Reemplaza a la vieja sección "Caja." que recreaba la pantalla con código:
   ahora se ve el sistema real funcionando. */

const PUNTOS = [
  "Código de barras o nombre",
  "Cobrar con Enter o F2, precio con F3",
  "Lista minorista y mayorista",
  "Descuento por monto o porcentaje",
  "Cliente asignado para vender fiado",
];

export default function VideoSlot() {
  return (
    <section id="video" className="flex min-h-[100svh] scroll-mt-20 items-center bg-brand text-white">
      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)] lg:gap-14">
        <div>
          <h2 className="text-[clamp(44px,6vw,78px)] leading-none text-white">Así se usa.</h2>
          <p className="mt-5 max-w-sm text-[19px] leading-relaxed sm:text-[21px]">
            El sistema funcionando, en pantalla real. Empezando por la Caja, donde se vende sin tocar el mouse.
          </p>
          <ul className="font-typewriter mt-6 max-w-sm space-y-1.5 border-t-[3px] border-white/80 pt-4 text-[14px] leading-snug">
            {PUNTOS.map((t) => (
              <li key={t}>
                <span className="font-bold text-ink">/</span> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 pr-2.5 sm:pr-4">
          <Ventana titulo="Mercalin — Caja" sombra="#161412" tamano={12}>
            <VideoPantalla src="/videos/modulos/caja.mp4" poster="/videos/modulos/caja.jpg" modulo="Caja" />
          </Ventana>
        </div>
      </div>
    </section>
  );
}
