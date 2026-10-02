import Ventana from "@/components/retro/Ventana";
import VideoPantalla from "@/components/VideoPantalla";
import { COLOR_GRUPO } from "@/lib/modulos-colores";

/* "Así se usa.": una sola sección oscura con tres pantallas del sistema en
   video (Caja, Consejo del día y Etiquetas), una debajo de la otra y
   alternando de lado. Antes la Caja iba aparte, en una sección roja entera.

   Cada fila lleva el color de su grupo en el sistema: la sombra de la ventana
   con el color tal cual, y los detalles de texto con una versión más clara del
   mismo color para que se lean sobre el fondo oscuro. Consejo del día arranca
   directo en esa parte del tutorial del Dashboard. */

type Fila = {
  numero: string;
  titulo: string;
  bajada: string;
  puntos: string[];
  ventana: string;
  src: string;
  poster: string;
  sombra: string;
  acento: string;
};

const FILAS: Fila[] = [
  {
    numero: "01",
    titulo: "Caja",
    bajada: "Donde se vende sin tocar el mouse.",
    puntos: [
      "Código de barras o nombre",
      "Cobrar con Enter o F2, precio con F3",
      "Lista minorista y mayorista",
      "Descuento por monto o porcentaje",
      "Cliente asignado para vender fiado",
    ],
    ventana: "Mercalin — Caja",
    src: "/videos/modulos/caja.mp4",
    poster: "/videos/modulos/caja-uso.jpg",
    sombra: COLOR_GRUPO["Operación"],
    acento: "#ff5b52",
  },
  {
    numero: "02",
    titulo: "Consejo del día",
    bajada: "No muestra gráficos: te dice qué hacer hoy.",
    puntos: [
      "Qué producto se agota y en cuántos días",
      "Si quedó una caja abierta de ayer",
      "Clientes con deuda sin compras hace 30+ días",
      "Ordenado por urgencia; lo que ya viste, lo sacás",
    ],
    ventana: "Mercalin — Consejo del día",
    src: "/videos/modulos/dashboard.mp4#t=32",
    poster: "/videos/modulos/dashboard-consejo.jpg",
    sombra: COLOR_GRUPO["Análisis"],
    acento: "#a78bfa",
  },
  {
    numero: "03",
    titulo: "Etiquetas",
    bajada: "De góndola, con código de barras, listas para imprimir.",
    puntos: [
      "Cuatro plantillas: góndola, precio, completa, código",
      "A4 o impresora térmica",
      "Vista previa antes de imprimir",
      "Imprimir solo las de stock bajo",
    ],
    ventana: "Mercalin — Etiquetas",
    src: "/videos/modulos/etiquetas.mp4",
    poster: "/videos/modulos/etiquetas-impresion.jpg",
    sombra: COLOR_GRUPO["Catálogo"],
    acento: "#34d399",
  },
];

export function AsiSeUsa() {
  return (
    <section id="video" className="scroll-mt-20 bg-ink text-cream">
      <div className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(44px,6vw,78px)] leading-none text-cream">Así se usa.</h2>
          <p className="mt-5 text-[19px] leading-relaxed text-cream/85 sm:text-[21px]">
            El sistema funcionando, en pantalla real. Tres videos cortos para empezar: la Caja, el Consejo del día y
            las Etiquetas.
          </p>
        </div>

        <div className="mt-14 space-y-16 lg:mt-20 lg:space-y-24">
          {FILAS.map((f, i) => {
            const videoALaIzquierda = i % 2 === 0;
            return (
              <div
                key={f.titulo}
                className={`grid items-center gap-8 lg:gap-12 ${
                  videoALaIzquierda
                    ? "lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]"
                    : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]"
                }`}
              >
                <div className={`min-w-0 pr-2.5 sm:pr-3 ${videoALaIzquierda ? "" : "lg:order-2"}`}>
                  <Ventana titulo={f.ventana} sombra={f.sombra}>
                    <VideoPantalla src={f.src} poster={f.poster} modulo={f.titulo} />
                  </Ventana>
                </div>
                <div className={videoALaIzquierda ? "" : "lg:order-1"}>
                  <p className="font-slab text-[44px] leading-none" style={{ color: f.acento }}>
                    {f.numero}
                  </p>
                  <h3 className="mt-2 text-[clamp(30px,3vw,40px)] leading-[1.04]">{f.titulo}</h3>
                  <p className="mt-2 text-[18px] leading-snug text-cream/85">{f.bajada}</p>
                  <ul className="font-typewriter mt-4 space-y-2 border-t-2 border-cream/70 pt-4 text-[13.5px] leading-snug">
                    {f.puntos.map((t) => (
                      <li key={t}>
                        <span className="font-bold" style={{ color: f.acento }}>
                          /
                        </span>{" "}
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
