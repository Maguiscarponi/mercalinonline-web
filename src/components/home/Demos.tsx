import Image from "next/image";
import Stamp from "@/components/retro/Stamp";
import Ventana from "@/components/retro/Ventana";

/* Dos secciones de pantalla completa con capturas reales del sistema, en
   ventanas retro. Las capturas están en /public/capturas (sin la barra de
   título de Windows). Los textos salen de lib/modulos-data.ts. */

export function DemoCaja() {
  return (
    <section className="flex min-h-[100svh] items-center">
      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.3fr)] lg:gap-12">
        <div>
          <p className="rt-label">Nº 04 · La pantalla real</p>
          <h2 className="mt-2 text-[clamp(72px,10vw,128px)] leading-[0.95] tracking-[-0.02em] text-ink">Caja.</h2>
          <p className="font-slab mt-4 text-[clamp(26px,2.6vw,33px)] leading-[1.08] text-brand">La pantalla donde se vende.</p>
          <p className="mt-4 text-[19px] leading-relaxed text-ink-soft">Pensada para que el cajero no toque el mouse.</p>
          <ul className="font-typewriter mt-6 space-y-1.5 border-t-[3px] border-ink pt-4 text-[14px] leading-snug">
            {[
              "Código de barras o nombre",
              "Cobrar con Enter o F2, precio con F3",
              "Lista minorista y mayorista",
              "Descuento por monto o porcentaje",
              "Cliente asignado para vender fiado",
            ].map((t) => (
              <li key={t}>
                <span className="font-bold text-brand">/</span> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-w-0 pb-10 pr-2.5 sm:pr-3">
          <Ventana titulo="Mercalin — Caja">
            <Image
              src="/capturas/caja.png"
              alt="Pantalla de Caja de Mercalin: lista de productos, total a cobrar y botón Cobrar"
              width={1919}
              height={983}
              quality={90}
              sizes="(min-width: 1024px) 860px, 100vw"
              className="block h-auto w-full"
            />
          </Ventana>
          <Stamp
            id="sello-caja"
            arriba="COBRAR CON"
            centro="F2"
            abajo="O ENTER"
            size={170}
            fuente={44}
            rot={8}
            className="absolute -bottom-2 right-0 sm:-bottom-24 sm:right-2"
          />
        </div>
      </div>
    </section>
  );
}

function Puntos({ items }: { items: string[] }) {
  return (
    <ul className="font-typewriter mt-3 space-y-2 border-t-2 border-cream pt-3 text-[13.5px] leading-snug">
      {items.map((t) => (
        <li key={t}>
          <span className="font-bold text-[#ff5b52]">/</span> {t}
        </li>
      ))}
    </ul>
  );
}

export function DemoConsejosEtiquetas() {
  return (
    <section className="flex min-h-[100svh] items-center bg-ink text-cream">
      <div className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
        <p className="rt-label !text-[#ff5b52]">Nº 05 · La pantalla real</p>

        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-8">
          <div className="pr-2.5 sm:pr-3">
            <Ventana titulo="Mercalin — Consejo del día" sombra="#e1251b">
              <Image
                src="/capturas/consejos.png"
                alt="Consejo del día de Mercalin: alertas urgentes de stock y clientes con deuda"
                width={739}
                height={812}
                quality={90}
                sizes="(min-width: 1024px) 480px, 100vw"
                className="block h-auto w-full bg-white"
              />
            </Ventana>
          </div>

          <div className="pr-2.5 sm:pr-3 lg:max-w-[370px]">
            <Ventana titulo="Mercalin — Etiquetas" sombra="#e1251b">
              <Image
                src="/capturas/etiquetas-preview.png"
                alt="Vista previa de etiquetas de góndola con precio y código de barras"
                width={586}
                height={840}
                quality={90}
                sizes="(min-width: 1024px) 370px, 100vw"
                className="block h-auto w-full bg-white"
              />
            </Ventana>
          </div>

          <div className="space-y-9 lg:pl-3">
            <div>
              <p className="tag-numbered text-[12px] text-[#ff5b52]">05.1</p>
              <h3 className="mt-1 text-[clamp(30px,3vw,40px)] leading-[1.04]">Consejo del día</h3>
              <p className="mt-2 text-[18px] leading-snug text-cream/85">No muestra gráficos: te dice qué hacer hoy.</p>
              <Puntos
                items={[
                  "Qué producto se agota y en cuántos días",
                  "Clientes con deuda sin compras hace 30+ días",
                  "Plata inmovilizada en productos sin vender",
                  "Ordenado por urgencia",
                ]}
              />
            </div>
            <div>
              <p className="tag-numbered text-[12px] text-[#ff5b52]">05.2</p>
              <h3 className="mt-1 text-[clamp(30px,3vw,40px)] leading-[1.04]">Etiquetas</h3>
              <p className="mt-2 text-[18px] leading-snug text-cream/85">De góndola, con código de barras, listas para imprimir.</p>
              <Puntos
                items={[
                  "Cuatro plantillas: góndola, precio, completa, código",
                  "A4 o impresora térmica",
                  "Vista previa antes de imprimir",
                  "Imprimir solo las de stock bajo",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
