import ContactoArca from "@/components/ContactoArca";
import type { Metadata } from "next";
import { FAQS } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "Preguntas frecuentes — Mercalin",
  description: "Dudas sobre la prueba gratis, el pago, la activación y la instalación de Mercalin.",
};

export default function PreguntasFrecuentes() {
  return (
    <>
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="tag-numbered text-xs text-brand">Preguntas frecuentes</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Dudas antes de comprar.
      </h1>
      <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
        {FAQS.map((f) => (
          <div key={f.q} className="py-6">
            <h2 className="text-base font-bold text-foreground">{f.q}</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/60">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
    <ContactoArca />
    </>
  );
}
