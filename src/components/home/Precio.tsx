import Image from "next/image";
import Link from "next/link";
import TrackView from "@/components/TrackView";
import Awning from "@/components/retro/Awning";
import Barcode from "@/components/retro/Barcode";
import Stamp from "@/components/retro/Stamp";
import type { Product } from "@/lib/products";

/* Precio: mismo lenguaje que el hero (toldo, crema, sello y ticket). El precio
   sale del producto en la base, no está escrito acá. Las dos puertas de
   conversión (probar y comprar) llevan los mismos data-track que antes. */

const INCLUYE = ["Actualizaciones incluidas", "Funciona sin internet", "Soporte por WhatsApp", "Windows"];

const PASOS = [
  ["1", "Pedís la prueba. Tu mail y listo."],
  ["2", "Instalás y probás 7 días con tus productos."],
  ["3", "Si te sirve, comprás. Un solo pago."],
];

export default function Precio({ product }: { product: Product }) {
  const precio = `$${product.priceArs.toLocaleString("es-AR")}`;

  return (
    <section id="precio" className="relative min-h-[100svh] scroll-mt-16 overflow-hidden border-t-[3px] border-ink">
      <Awning id="toldo-precio" />
      <TrackView name="pricing_viewed" />

      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10 lg:pt-14">
        <div className="min-w-0">
          <span className="rt-label-box">Nº 07 · Precio</span>
          <p className="font-slab mt-4 text-[clamp(64px,12vw,152px)] leading-none tracking-[-0.02em] text-ink">{precio}</p>
          <p className="font-slab mt-2 text-[clamp(30px,3.7vw,52px)] leading-[1.04] text-brand">Pago único.</p>
          <p className="font-slab text-[clamp(30px,3.7vw,52px)] leading-[1.04] text-ink">Sin cuotas mensuales.</p>

          <ul className="tag-numbered mt-7 grid gap-x-6 gap-y-2.5 text-[13.5px] uppercase sm:grid-cols-2 sm:max-w-[36rem]">
            {INCLUYE.map((t) => (
              <li key={t}>
                <span className="text-brand">✦</span> {t}
              </li>
            ))}
          </ul>

          <ol className="mt-10 grid gap-5 sm:grid-cols-3 sm:max-w-[34rem]">
            {PASOS.map(([n, t]) => (
              <li key={n} className="border-t-[3px] border-ink pt-2.5">
                <span className="font-slab block text-[38px] leading-none text-brand">{n}</span>
                <span className="font-typewriter mt-1.5 block text-[13.5px] font-bold leading-snug">{t}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Ticket de licencia */}
        <div className="relative mx-auto w-full max-w-[440px] lg:mx-0 lg:ml-auto">
          <div className="rt-ticket -rotate-[1.8deg] px-6 pb-7 pt-8 sm:px-[30px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src="/mercalin-isotipo.svg" alt="" width={30} height={30} />
                <span className="font-slab text-[22px] leading-none">
                  Merca<span className="text-brand">lin</span>
                </span>
              </div>
              <span className="tag-numbered text-[11.5px] text-ink-mute">LICENCIA</span>
            </div>
            <div className="rt-dashed my-4" />

            <p className="font-slab text-[27px] leading-[1.05]">¿CÓMO QUERÉS EMPEZAR?</p>

            {/* Opción 1: probar (la recomendada) */}
            <div className="mt-5 border-[3px] border-ink bg-paper-warm p-4">
              <p className="font-slab text-[19px] leading-tight">PROBAR 7 DÍAS GRATIS</p>
              <p className="font-typewriter mt-1.5 text-[12.5px] leading-snug text-ink-soft">
                Tu mail y listo. Sin tarjeta, sin crear cuenta. Te llega el instalador y la clave por mail.
              </p>
              <Link
                href={`/prueba-gratis?product=${product.slug}`}
                data-track="cta_trial_clicked"
                data-track-loc="precio"
                className="rt-btn rt-btn-red mt-3.5 w-full !py-3 !text-[13px]"
              >
                Probar gratis →
              </Link>
            </div>

            {/* Opción 2: comprar */}
            <div className="mt-3 border-2 border-[#cfc6b4] bg-paper-warm p-4">
              <p className="font-slab text-[19px] leading-tight">COMPRAR LA LICENCIA · {precio}</p>
              <p className="font-typewriter mt-1.5 text-[12.5px] leading-snug text-ink-soft">
                Un solo pago con Mercado Pago. La clave completa no vence.
              </p>
              <Link
                href={`/carrito?product=${product.slug}`}
                data-track="cta_buy_clicked"
                data-track-loc="precio"
                className="rt-btn rt-btn-line mt-3.5 w-full !py-3 !text-[13px]"
              >
                Comprar
              </Link>
            </div>

            <div className="rt-dashed mb-3 mt-5" />
            <p className="font-typewriter text-[12px] leading-snug text-ink-soft">
              Esta versión no factura con ARCA. Si lo necesitás, escribinos antes de comprar.
            </p>
            <div className="mt-4">
              <Barcode width={380} height={44} />
            </div>
            <p className="font-typewriter mt-2 text-center text-[12px] tracking-[0.06em]">¡GRACIAS POR SU COMPRA!</p>
          </div>

          <Stamp
            id="sello-precio"
            arriba="PAGO"
            centro="ÚNICO"
            abajo={precio}
            size={180}
            fuente={28}
            rot={10}
            className="absolute -bottom-8 -left-3 sm:-left-36 sm:bottom-8"
          />
        </div>
      </div>
    </section>
  );
}
