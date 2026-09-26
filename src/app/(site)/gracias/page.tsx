import type { Metadata } from "next";
import Link from "next/link";
import Barcode from "@/components/retro/Barcode";
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
    <section className="mx-auto max-w-md px-5 py-16 sm:py-24">
      {/* Ticket de compra */}
      <div className="rt-ticket px-7 pb-8 pt-9 text-center">
        <p className="rt-label">{pendiente ? "Pago en proceso" : "Compra recibida"}</p>
        <h1 className="mt-3 text-[54px] leading-none text-ink">Gracias.</h1>
        <div className="rt-dashed my-6" />
        <p className="font-typewriter text-[15px] leading-relaxed text-ink-soft">
          {pendiente
            ? "Tu pago todavía se está acreditando. Apenas se confirme te mandamos el instalador y el código de activación por mail."
            : "En unos minutos te llega un mail con el instalador y el código de activación. Si no aparece, revisá spam."}
        </p>
        <p className="font-typewriter mt-4 text-[14px] leading-relaxed text-ink-soft">
          ¿Pasó un rato y no llegó?{" "}
          <a
            href={whatsappHref("Hola, hice el pago de Mercalin y todavía no me llegó el mail con la clave.")}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp_clicked"
            data-track-loc="gracias"
            className="font-bold text-ink underline underline-offset-4 hover:text-brand"
          >
            Escribinos por WhatsApp
          </a>
          .
        </p>
        <div className="mt-7">
          <Barcode width={300} height={44} />
        </div>
        <p className="font-typewriter mt-2 text-[12px] tracking-[0.06em]">¡GRACIAS POR SU COMPRA!</p>
      </div>

      <p className="tag-numbered mt-10 text-center text-[13px] uppercase">
        <Link href="/" className="text-brand-dark underline underline-offset-4">
          Volver al inicio →
        </Link>
      </p>
    </section>
  );
}
