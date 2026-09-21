import Image from "next/image";
import Link from "next/link";
import Barcode from "@/components/retro/Barcode";
import Stamp from "@/components/retro/Stamp";

/* ─────────────────────────────────────────────────────────────────────────
   Hero: el toldo está en el header; acá va el mensaje y un ticket de caja.
   El ticket es un ejemplo ilustrativo (un kiosco inventado), no una venta
   real. Todo el copy está en COPY para tocarlo sin bajar al markup.
   ───────────────────────────────────────────────────────────────────────── */
const COPY = {
  etiqueta: "Sistema de gestión para comercios",
  h1: ["Escaneá", "y vendé."],
  h1b: ["El catálogo ya", "viene cargado."],
  parrafo:
    "Más de 7.500 productos argentinos con código de barras, listos para usar. Vos cargás tu costo y tu precio.",
};

const ITEMS = [
  ["1 x Agua Mineral Villa San Remo (1,5 L)", "$1.200"],
  ["2 x Alfajor Havanna (25 g)", "$3.000"],
  ["1 x Fernet Branca (750 ml)", "$12.400"],
  ["1 x Alfajor de dulce de leche", "$2.000"],
];

const GARANTIAS = ["Pago único", "Funciona sin internet", "Actualizaciones incluidas", "Soporte por WhatsApp"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden lg:min-h-[calc(100svh-150px)]">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 pb-14 pt-10 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-6 lg:px-0 lg:pb-16 lg:pt-12">
        <div className="min-w-0">
          <span className="rt-label-box">{COPY.etiqueta}</span>

          <h1 className="mt-6 text-[clamp(56px,8.6vw,112px)] leading-[0.98] text-ink">
            {COPY.h1[0]}
            <br />
            {COPY.h1[1]}
          </h1>
          <p className="font-slab mt-3 text-[clamp(30px,4.1vw,58px)] leading-[1.03] text-brand">
            {COPY.h1b[0]}
            <br />
            {COPY.h1b[1]}
          </p>

          <p className="mt-7 max-w-[26rem] text-[19px] leading-relaxed text-ink-soft sm:text-[20px]">{COPY.parrafo}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/prueba-gratis"
              data-track="cta_trial_clicked"
              data-track-loc="hero"
              className="rt-btn rt-btn-red w-full !px-7 !py-4 sm:w-auto"
            >
              Probar 7 días gratis
            </Link>
            <Link
              href="/#precio"
              data-track="cta_detail_clicked"
              data-track-loc="hero"
              className="rt-btn rt-btn-line w-full !px-7 !py-4 sm:w-auto"
            >
              Ver precio
            </Link>
          </div>

          <ul className="tag-numbered mt-9 flex flex-wrap gap-x-7 gap-y-2 text-[12.5px] uppercase text-ink-soft">
            {GARANTIAS.map((g) => (
              <li key={g}>
                <span className="text-brand">✦</span> {g}
              </li>
            ))}
          </ul>
        </div>

        {/* Ticket + sello */}
        <div className="relative mx-auto w-full max-w-[380px] lg:mx-0 lg:ml-auto">
          <div className="rt-ticket rotate-[2.6deg] px-6 pb-8 pt-8 font-typewriter">
            <div className="flex flex-col items-center">
              <Image src="/mercalin-isotipo.svg" alt="" width={46} height={46} />
              <p className="font-slab mt-2 text-[30px] leading-none tracking-[0.02em]">MERCALIN</p>
              <p className="mt-3 text-[11.5px] tracking-[0.06em] text-ink-mute">KIOSCO DON JORGE · CAJA 1</p>
              <p className="text-[11.5px] tracking-[0.06em] text-ink-mute">18/08/2026 · 19:42</p>
            </div>

            <div className="rt-dashed my-4" />
            <div className="space-y-2.5 text-[13.5px] leading-snug">
              {ITEMS.map(([d, p]) => (
                <div key={d} className="flex justify-between gap-3">
                  <span>{d}</span>
                  <span className="shrink-0">{p}</span>
                </div>
              ))}
            </div>
            <div className="rt-dashed my-4" />

            <div className="flex justify-between text-[17px] font-bold">
              <span>TOTAL</span>
              <span>$18.600</span>
            </div>
            <div className="mt-3 flex justify-between text-[12.5px] text-ink-mute">
              <span>Efectivo</span>
              <span>$20.000</span>
            </div>
            <div className="mt-1 flex justify-between text-[12.5px] text-ink-mute">
              <span>Vuelto</span>
              <span>$1.400</span>
            </div>

            <div className="mt-5">
              <Barcode width={320} height={62} />
            </div>
            <p className="mt-1.5 text-center text-[11px] tracking-[0.2em]">7 790895 000102</p>
            <p className="mt-3 text-center text-[12.5px] tracking-[0.06em]">¡GRACIAS POR SU COMPRA!</p>
          </div>

          <Stamp
            id="sello-hero"
            arriba="PROBALO"
            centro="7 DÍAS"
            abajo="GRATIS"
            size={190}
            fuente={27}
            rot={-12}
            className="absolute -bottom-8 -left-4 sm:-bottom-16 sm:-left-32"
          />
        </div>
      </div>
    </section>
  );
}
