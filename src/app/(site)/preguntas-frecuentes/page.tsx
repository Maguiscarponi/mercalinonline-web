import ContactoArca from "@/components/ContactoArca";
import FaqList from "@/components/FaqList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes — Mercalin",
  description: "Dudas sobre la prueba gratis, el pago, la activación y la instalación de Mercalin.",
};

export default function PreguntasFrecuentes() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="rt-label">Preguntas frecuentes</p>
        <h1 className="mt-3 text-[clamp(38px,6vw,64px)] leading-[1.05] text-ink">Dudas antes de comprar.</h1>
        <div className="mt-10">
          <FaqList columnas={1} />
        </div>
      </section>
      <ContactoArca />
    </>
  );
}
