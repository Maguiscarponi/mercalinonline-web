import { FAQS } from "@/lib/faqs";

/* Acordeón con <details>: funciona sin JavaScript y con teclado. Se usa en la
   sección de la home (dos columnas) y en /preguntas-frecuentes (una).
   Las preguntas y respuestas salen de lib/faqs.ts. */
function Item({ q, a, abierta }: { q: string; a: string; abierta?: boolean }) {
  return (
    <details className="rt-faq" open={abierta}>
      <summary>{q}</summary>
      <p className="rt-faq-a">{a}</p>
    </details>
  );
}

export default function FaqList({ columnas = 1 }: { columnas?: 1 | 2 }) {
  if (columnas === 1) {
    return (
      <div className="border-t-2 border-dashed border-ink">
        {FAQS.map((f, i) => (
          <Item key={f.q} q={f.q} a={f.a} abierta={i === 0} />
        ))}
      </div>
    );
  }
  const mitad = Math.ceil(FAQS.length / 2);
  return (
    <div className="grid gap-x-14 md:grid-cols-2">
      {[FAQS.slice(0, mitad), FAQS.slice(mitad)].map((col, ci) => (
        <div key={ci} className="border-t-2 border-dashed border-ink">
          {col.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} abierta={ci === 0 && i === 0} />
          ))}
        </div>
      ))}
    </div>
  );
}
