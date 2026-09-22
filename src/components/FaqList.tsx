import type { Faq } from "@/lib/faqs";

/* Acordeón con <details>: funciona sin JavaScript y con teclado. Se usa en la
   sección de la home (dos columnas) y en /preguntas-frecuentes (una).
   Las preguntas y respuestas las arma lib/faqs.ts (getFaqs) con el precio
   del producto -- cada página las pide y se las pasa por props acá. */
function Item({ q, a, abierta }: { q: string; a: string; abierta?: boolean }) {
  return (
    <details className="rt-faq" open={abierta}>
      <summary>{q}</summary>
      <p className="rt-faq-a">{a}</p>
    </details>
  );
}

export default function FaqList({ faqs, columnas = 1 }: { faqs: Faq[]; columnas?: 1 | 2 }) {
  if (columnas === 1) {
    return (
      <div className="border-t-2 border-dashed border-ink">
        {faqs.map((f, i) => (
          <Item key={f.q} q={f.q} a={f.a} abierta={i === 0} />
        ))}
      </div>
    );
  }
  const mitad = Math.ceil(faqs.length / 2);
  return (
    <div className="grid gap-x-14 md:grid-cols-2">
      {[faqs.slice(0, mitad), faqs.slice(mitad)].map((col, ci) => (
        <div key={ci} className="border-t-2 border-dashed border-ink">
          {col.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} abierta={ci === 0 && i === 0} />
          ))}
        </div>
      ))}
    </div>
  );
}
