import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CajaMock from "./CajaMock";

/* ─────────────────────────────────────────────────────────────
   CAMBIÁ ESTA LETRA PARA VER LAS TRES VARIANTES:
     "a" → fondo oscuro
     "b" → claro con panel rojo en diagonal
     "c" → centrado, la captura entra desde abajo
   ───────────────────────────────────────────────────────────── */
const VARIANTE: "a" | "b" | "c" = "b";

const COPY = {
  kicker: "7.500+ productos precargados",
  h1a: "Escaneá y vendé.",
  h1b: "El catálogo ya viene cargado.",
  parrafo: "con código de barras, listos para usar. Solo les ponés el precio.",
  destacado: "Más de 7.500 productos argentinos",
  micro: "7 días gratis sin tarjeta · pago único · soporte 24/7 · actualizaciones incluidas",
};

function Botones({ oscuro = false, centrado = false }: { oscuro?: boolean; centrado?: boolean }) {
  return (
    <div className={`mt-7 flex flex-wrap gap-3 ${centrado ? "justify-center" : ""}`}>
      <Link
        href="/prueba-gratis"
        className="cta-latido tag-numbered inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] text-white transition-colors hover:bg-brand-dark"
      >
        Probar 7 días gratis
        <ArrowRight className="h-4 w-4" strokeWidth={3} />
      </Link>
      <Link
        href="/productos"
        className={`tag-numbered inline-flex items-center rounded-full border px-7 py-3.5 text-[15px] transition-colors ${
          oscuro
            ? "border-white/25 text-white/85 hover:border-white/50 hover:text-white"
            : "border-black/15 text-foreground/65 hover:border-black/30 hover:text-foreground"
        }`}
      >
        Ver precio y detalle
      </Link>
    </div>
  );
}

function Titulo({
  oscuro = false,
  size = "grande",
  angosto = false,
}: {
  oscuro?: boolean;
  size?: "grande" | "medio";
  angosto?: boolean;
}) {
  return (
    <h1
      className={`font-condensed mt-3 font-extrabold leading-[1.0] tracking-tight ${
        angosto ? "max-w-[520px]" : ""
      } ${
        size === "grande"
          ? "text-[42px] sm:text-[58px] lg:text-[64px]"
          : "text-[40px] sm:text-[54px] lg:text-[60px]"
      } ${oscuro ? "text-white" : ""}`}
    >
      {COPY.h1a}
      <br />
      <span className={oscuro ? "text-[#ff5b52]" : "text-brand"}>{COPY.h1b}</span>
    </h1>
  );
}

function Parrafo({ oscuro = false, centrado = false }: { oscuro?: boolean; centrado?: boolean }) {
  return (
    <p
      className={`mt-5 text-[17px] leading-relaxed sm:text-[19px] ${
        oscuro ? "text-white/70" : "text-foreground/60"
      } ${centrado ? "mx-auto max-w-[620px]" : "max-w-[460px]"}`}
    >
      <strong className={`font-semibold ${oscuro ? "text-white" : "text-foreground"}`}>
        {COPY.destacado}
      </strong>{" "}
      {COPY.parrafo}
    </p>
  );
}

export default function Hero() {
  /* ───────── A · oscuro ───────── */
  if (VARIANTE === "a") {
    return (
      <section className="relative overflow-hidden bg-[#161412]">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-48 h-[560px] w-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(225,37,27,.42), rgba(225,37,27,0) 68%)",
          }}
        />
        <div className="relative mx-auto grid max-w-5xl items-center gap-12 px-6 py-16 sm:py-20 md:grid-cols-[1fr_0.92fr]">
          <div>
            <p className="tag-numbered text-[13px] text-[#ff6a60]">{COPY.kicker}</p>
            <Titulo oscuro />
            <Parrafo oscuro />
            <Botones oscuro />
            <p className="mt-5 text-[14px] text-white/40">{COPY.micro}</p>
          </div>
          <CajaMock />
        </div>
      </section>
    );
  }

  /* ───────── B · claro con panel rojo en diagonal ───────── */
  if (VARIANTE === "b") {
    return (
      // min-h: el hero ocupa la pantalla entera menos el header, asi el
      // carrusel no asoma cortado por abajo.
      <section className="relative flex min-h-[calc(100svh-76px)] items-center overflow-hidden bg-background">
        <span
          aria-hidden
          className="hero-diag pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] md:block"
          style={{ background: "linear-gradient(135deg,#ef4136,#c11d14)" }}
        />
        <div className="relative grid w-full items-center gap-14 px-6 py-16 sm:px-10 md:grid-cols-[1fr_0.8fr] lg:gap-24 lg:px-20 xl:px-28">
          <div>
            <p className="tag-numbered text-[13px] text-brand">{COPY.kicker}</p>
            <Titulo angosto />
            <Parrafo />
            <Botones />
            <p className="mt-5 text-[14px] text-foreground/40">{COPY.micro}</p>
          </div>
          <CajaMock />
        </div>
      </section>
    );
  }

  /* ───────── C · centrado, captura desde abajo ───────── */
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg,#ffffff 0%,var(--background) 55%)" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 -top-64 h-[520px] w-[900px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(225,37,27,.13), rgba(225,37,27,0) 70%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-6 pt-16 text-center sm:pt-20">
        <p className="tag-numbered text-[13px] text-brand">{COPY.kicker}</p>
        <Titulo size="medio" />
        <Parrafo centrado />
        <Botones centrado />
        <p className="mt-5 text-[14px] text-foreground/40">{COPY.micro}</p>
        <CajaMock className="mx-auto mt-12 -mb-px w-full max-w-[760px]" />
      </div>
    </section>
  );
}
