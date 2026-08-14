import type { Metadata } from "next";
import ProductFrame from "@/components/ProductFrame";
import ConsejoCard from "@/components/ConsejoCard";
import BuyButtons from "@/components/BuyButtons";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Cómo funciona — Mercalin",
  description: "Cómo trabaja Mercalin durante un día real de negocio.",
};

const MOMENTOS = [
  { hora: "08:00", texto: "Abrís el negocio y arrancás a vender como cualquier otro día." },
  { hora: "09:30", texto: "Se corta internet. Mercalin sigue cobrando — la base de datos vive en tu computadora, no en un servidor." },
  { hora: "11:00", texto: "Mercalin avisa que un producto se agota mañana, antes de que lo notes vos." },
  { hora: "13:00", texto: "Detecta que un cliente habitual hace más de un mes que no vuelve." },
  { hora: "16:00", texto: "Encuentra productos vendiéndose por debajo del margen mínimo y te dice cuánto podés ganar de más si los ajustás." },
  { hora: "20:00", texto: "Mientras cerrás el local, hace un backup automático de todo." },
];

export default function ComoFunciona() {
  const mercalin = PRODUCTS[0];
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-8 pt-16 sm:pt-20">
        <p className="tag-numbered text-xs text-brand">Cómo funciona</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Un día real de negocio con Mercalin.
        </h1>
        <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-foreground/60">
          Corre en la computadora del negocio y avisa solo, sin que nadie tenga que preguntarle nada.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="divide-y divide-black/10 border-y border-black/10">
          {MOMENTOS.map((m) => (
            <div key={m.hora} className="grid gap-2 py-5 sm:grid-cols-[90px_1fr] sm:gap-6">
              <div className="tag-numbered text-sm text-brand">{m.hora}</div>
              <p className="text-[14.5px] leading-relaxed text-foreground/65">{m.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="tag-numbered text-xs text-foreground/40">Así se ven los avisos</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <ConsejoCard level="urgente" mensaje="Fernet Branca se agota en 0.3 días." detalle="Pedí hoy" />
            <ConsejoCard level="consejo" mensaje="Vendés más gaseosa entre 17 y 19hs." detalle="Tenela fría" />
            <ConsejoCard level="importante" mensaje="Este proveedor entrega cada vez más tarde." detalle="Revisalo" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <ProductFrame label="Mercalin — Consejo del día" />
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Probalo gratis durante 7 días.
          </h2>
          <BuyButtons product={mercalin} className="mt-6 justify-center" />
        </div>
      </section>
    </>
  );
}
