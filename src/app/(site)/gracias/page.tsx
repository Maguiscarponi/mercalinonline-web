import type { Metadata } from "next";
import Link from "next/link";
import { whatsappHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Gracias — Mercalin",
  robots: { index: false, follow: false },
};

// Mercado Pago vuelve acá con el estado del pago en el link (?status=...).
// Es solo para mostrar el mensaje correcto: la activación real la dispara el
// aviso de pago aprobado que MP le manda al sitio (webhook), no esta página.
export default async function Gracias({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; collection_status?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? sp.collection_status ?? "";
  const pendiente = status === "pending" || status === "in_process";

  return (
    <section className="mx-auto max-w-md px-6 py-24 text-center sm:py-32">
      <p className="tag-numbered text-xs text-brand">{pendiente ? "Pago en proceso" : "Compra recibida"}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">Gracias.</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-foreground/60">
        {pendiente
          ? "Tu pago todavía se está acreditando. Apenas se confirme te mandamos el instalador y el código de activación por mail."
          : "En unos minutos te llega un mail con el instalador y el código de activación. Si no aparece, revisá spam."}
      </p>
      <p className="mt-3 text-[14px] text-foreground/50">
        ¿Pasó un rato y no llegó?{" "}
        <a
          href={whatsappHref("Hola, hice el pago de Mercalin y todavía no me llegó el mail con la clave.")}
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp_clicked"
          data-track-loc="gracias"
          className="font-semibold text-foreground underline underline-offset-2 hover:text-brand"
        >
          Escribinos por WhatsApp
        </a>
        .
      </p>
      <Link href="/" className="mt-8 inline-block font-semibold text-brand">
        Volver al inicio →
      </Link>
    </section>
  );
}
