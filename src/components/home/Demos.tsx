import Ventana from "@/components/retro/Ventana";
import VideoPantalla from "@/components/VideoPantalla";

/* Consejo del día y Etiquetas, con el video real de cada pantalla en grande
   (antes eran pantallas recreadas con código). La Caja ya se ve en "Así se usa."
   Consejo del día arranca directo en esa parte del tutorial del Dashboard. */

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
      <div className="mx-auto w-full max-w-[1240px] space-y-16 px-5 py-16 sm:px-8 sm:py-20 lg:space-y-20">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-12">
          <div className="min-w-0 pr-2.5 sm:pr-3">
            <Ventana titulo="Mercalin — Consejo del día" sombra="#e1251b">
              <VideoPantalla
                src="/videos/modulos/dashboard.mp4#t=32"
                poster="/videos/modulos/dashboard-consejo.jpg"
                modulo="Consejo del día"
              />
            </Ventana>
          </div>
          <div>
            <p className="tag-numbered text-[12px] text-[#ff5b52]">04.1</p>
            <h3 className="mt-1 text-[clamp(30px,3vw,40px)] leading-[1.04]">Consejo del día</h3>
            <p className="mt-2 text-[18px] leading-snug text-cream/85">No muestra gráficos: te dice qué hacer hoy.</p>
            <Puntos
              items={[
                "Qué producto se agota y en cuántos días",
                "Si quedó una caja abierta de ayer",
                "Clientes con deuda sin compras hace 30+ días",
                "Ordenado por urgencia; lo que ya viste, lo sacás",
              ]}
            />
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-12">
          <div className="min-w-0 pr-2.5 sm:pr-3 lg:order-2">
            <Ventana titulo="Mercalin — Etiquetas" sombra="#e1251b">
              <VideoPantalla
                src="/videos/modulos/etiquetas.mp4"
                poster="/videos/modulos/etiquetas-impresion.jpg"
                modulo="Etiquetas"
              />
            </Ventana>
          </div>
          <div className="lg:order-1">
            <p className="tag-numbered text-[12px] text-[#ff5b52]">04.2</p>
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
    </section>
  );
}
