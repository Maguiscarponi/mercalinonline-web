import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listProducts } from "@/lib/products";
import AppDemo from "./AppDemo";

/* ─────────────────────────────────────────────────────────────────────────
   Hero: fondo rojo profundo hacia negro + la ventana de Mercalin
   rotando entre módulos. El objetivo es que en los primeros segundos se
   entienda (a) qué hace el sistema y (b) que hay muchos módulos, sin tener
   que leer nada.

   Todo el copy está acá arriba para que lo puedas tocar sin bajar al markup.
   ───────────────────────────────────────────────────────────────────────── */
const COPY = {
  kicker: "7.500+ productos precargados",
  h1a: "Escaneá y vendé.",
  h1b: "El catálogo ya viene cargado.",
  destacado: "Más de 7.500 productos argentinos",
  parrafo: "con código de barras, listos para usar. Solo les ponés el precio.",
  micro: "7 días gratis sin tarjeta · pago único · soporte 24/7 · actualizaciones incluidas",
};

export default async function Hero() {
  // "+ 15 módulos más" lleva al detalle del producto destacado. listProducts
  // ya ordena featured primero. Si la base no responde caemos al listado:
  // un link roto no puede tirar abajo el hero.
  let hrefModulos = "/productos";
  try {
    const [destacado] = await listProducts();
    if (destacado) hrefModulos = `/productos/${destacado.slug}`;
  } catch {
    /* se queda con /productos */
  }

  return (
    <section
      className="relative flex items-center overflow-hidden text-white lg:min-h-[calc(100svh-76px)]"
      style={{
        background: "linear-gradient(118deg,#8e1a13 0%,#c0241b 30%,#1a1013 76%,#111113 100%)",
      }}
    >
      {/* trama de puntos: le saca el plano al degradado */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(rgb(255 255 255 / 0.085) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative z-[1] mx-auto grid w-full max-w-[1460px] items-center gap-8 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[1.35fr_1fr] lg:gap-12 lg:px-12 lg:py-16 xl:px-20">
        {/* En mobile primero el mensaje; en desktop la ventana va a la izquierda. */}
        <div className="order-1 min-w-0 lg:order-2">
          <p className="tag-numbered inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-[12px] sm:text-[13px]">
            <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-white" />
            {COPY.kicker}
          </p>

          <h1 className="font-condensed mt-4 text-[clamp(29px,8.4vw,40px)] font-extrabold leading-[1.0] tracking-tight sm:text-[46px] lg:text-[52px]">
            {COPY.h1a}
            <br />
            {COPY.h1b}
          </h1>

          <p className="mt-4 max-w-[44ch] text-[16px] leading-relaxed text-white/70 sm:mt-5 sm:text-[18px]">
            <strong className="font-semibold text-white">{COPY.destacado}</strong> {COPY.parrafo}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-7">
            <Link
              href="/prueba-gratis"
              className="cta-latido tag-numbered inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] text-foreground transition-colors hover:bg-white/90 sm:w-auto"
            >
              Probar 7 días gratis
              <ArrowRight className="h-4 w-4" strokeWidth={3} />
            </Link>
            <Link
              href="/productos"
              className="tag-numbered inline-flex w-full items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-[15px] text-white/85 transition-colors hover:border-white/50 hover:text-white sm:w-auto"
            >
              Ver precio y detalle
            </Link>
          </div>

          <p className="mt-5 text-[14px] text-white/45">{COPY.micro}</p>
        </div>

        <AppDemo className="order-2 min-w-0 lg:order-1" hrefModulos={hrefModulos} />
      </div>
    </section>
  );
}
