import Link from "next/link";
import { FAQS } from "@/lib/faqs";

// Contenido de confianza entre el precio y el pie: qué pasa en cada paso de
// la prueba, y las tres dudas que más frenan antes de pedirla. Nada de
// testimonios inventados — solo lo que ya está en la FAQ, adelantado acá.
const PASOS = [
  {
    n: "1",
    titulo: "Pedís la prueba",
    desc: "Tu mail y listo. Sin tarjeta, sin crear cuenta.",
  },
  {
    n: "2",
    titulo: "Instalás y probás 7 días",
    desc: "Con tus productos reales, no con datos de ejemplo.",
  },
  {
    n: "3",
    titulo: "Si te sirve, comprás",
    desc: "Un solo pago. La clave completa no vence.",
  },
];

const PREGUNTAS_CLAVE = ["¿Cómo funciona la prueba de 7 días?", "¿Qué pasa cuando termina la prueba?", "¿Es una suscripción?"];

export default function Confianza() {
  const preguntas = FAQS.filter((f) => PREGUNTAS_CLAVE.includes(f.q));

  return (
    <section className="border-t border-black/[0.06] bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {PASOS.map((p) => (
            <div key={p.n} className="flex gap-3.5">
              <span className="tag-numbered flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[13px] font-bold text-brand">
                {p.n}
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-foreground">{p.titulo}</h3>
                <p className="mt-0.5 text-[14px] leading-relaxed text-foreground/55">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 max-w-2xl">
          <p className="tag-numbered text-xs text-brand">Antes de pedirla</p>
          <h2 className="font-condensed mt-2 text-[26px] font-extrabold leading-tight tracking-tight sm:text-[32px]">
            Las dudas más comunes
          </h2>
        </div>
        <div className="mt-6 divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {preguntas.map((f) => (
            <div key={f.q} className="py-5">
              <h3 className="text-[15px] font-bold text-foreground">{f.q}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-foreground/60">{f.a}</p>
            </div>
          ))}
        </div>
        <Link
          href="/preguntas-frecuentes"
          className="mt-5 inline-block text-[14px] font-semibold text-brand hover:text-brand-dark"
        >
          Ver todas las preguntas →
        </Link>
      </div>
    </section>
  );
}
