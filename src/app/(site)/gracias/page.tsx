import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gracias — Mercalin",
};

export default function Gracias() {
  return (
    <section className="mx-auto max-w-md px-6 py-24 text-center sm:py-32">
      <p className="tag-numbered text-xs text-brand">Compra recibida</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">Gracias.</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-foreground/60">
        En unos minutos te llega un mail con el instalador y el código de activación. Si no aparece, revisá spam.
      </p>
      <Link href="/" className="mt-8 inline-block font-semibold text-brand">
        Volver al inicio →
      </Link>
    </section>
  );
}
