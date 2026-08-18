import { MessageCircle } from "lucide-react";

// Un solo lugar para el contacto: si cambia el número, se cambia acá.
export const WHATSAPP =
  "https://wa.me/542344502904?text=" +
  encodeURIComponent("Hola! Tengo una consulta sobre Mercalin.");
export const WHATSAPP_ARCA =
  "https://wa.me/542344502904?text=" +
  encodeURIComponent("Hola! Necesito facturación con ARCA. ¿Me pasás info?");

export default function ContactoArca() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16">
      <div className="rounded-2xl border border-black/[0.08] bg-white p-8 text-center sm:p-10">
        <p className="tag-numbered text-xs text-brand">¿Necesitás ARCA?</p>
        <h2 className="font-condensed mt-3 text-[30px] font-extrabold leading-tight tracking-tight sm:text-[38px]">
          Hablemos antes de que compres.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-foreground/55 sm:text-[17px]">
          Esta versión no factura con ARCA. Si tu comercio lo necesita, escribinos y te contamos
          cómo lo resolvemos.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href={WHATSAPP_ARCA}
            target="_blank"
            rel="noopener noreferrer"
            className="tag-numbered inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] text-white transition-colors hover:bg-brand-dark"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
            Contactanos por WhatsApp
          </a>
        </div>

        <p className="mt-5 text-[14px] text-foreground/45">
          Soporte 24/7 · actualizaciones incluidas · te responde la persona que hizo el sistema
        </p>
      </div>
    </section>
  );
}
