import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes — Mercalin",
  description: "Dudas sobre la prueba gratis, el pago, la activación y la instalación de Mercalin.",
};

const FAQS = [
  {
    q: "¿Cómo funciona la prueba de 7 días?",
    a: "Al pedirla te llega un mail con el instalador y una clave de prueba. Los 7 días se cuentan desde que se genera esa clave. La instalás y activás como cualquier producto completo.",
  },
  {
    q: "¿Qué pasa cuando termina la prueba?",
    a: "El sistema se bloquea, pero no borra nada de lo que cargaste. Para seguir usándolo, comprás la clave completa y la ingresás en la misma pantalla — seguís exactamente donde estabas.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "$65.000 ARS, pago único.",
  },
  {
    q: "¿Es una suscripción?",
    a: "No. Se paga una sola vez. La clave completa no vence ni se renueva.",
  },
  {
    q: "¿Cómo se activa?",
    a: "Con tu mail y la clave que recibís. La activación se valida en tu propia computadora, sin necesitar conexión a internet en ese momento.",
  },
  {
    q: "¿Necesito internet para usarlo?",
    a: "Solo para descargarlo e instalarlo la primera vez. Después de instalado, funciona sin conexión — toda la información vive en tu computadora, no en un servidor externo.",
  },
  {
    q: "¿Qué incluye?",
    a: "Ventas y caja, stock y productos, clientes y proveedores, informes, y el motor de consejos que analiza tus ventas y te avisa. El detalle completo por módulo está en la ficha de producto.",
  },
  {
    q: "¿Tiene facturación electrónica (ARCA)?",
    a: "Este producto no incluye ARCA — es la versión sin facturación electrónica.",
  },
  {
    q: "¿En qué sistemas operativos funciona?",
    a: "Windows.",
  },
  {
    q: "¿Qué recibo después de comprar?",
    a: "El código de activación y el link de descarga por mail.",
  },
  {
    q: "¿Con quién hablo si tengo una duda?",
    a: "Directo por mail, respondemos nosotros mismos.",
  },
];

export default function PreguntasFrecuentes() {
  return (
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
  );
}
