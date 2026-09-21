import { whatsappHref } from "@/lib/whatsapp";
import IconoWhatsApp from "@/components/retro/IconoWhatsApp";

const WHATSAPP_ARCA = whatsappHref("Hola! Necesito facturación con ARCA. ¿Me pasás info?");

export default function ContactoArca() {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-6">
      <div className="rt-card p-7 text-center sm:p-10">
        <p className="rt-label">¿Necesitás ARCA?</p>
        <h2 className="mt-3 text-[clamp(28px,4vw,42px)] leading-[1.08] text-ink">Hablemos antes de que compres.</h2>
        <p className="mx-auto mt-3 max-w-xl text-[18px] leading-relaxed text-ink-soft">
          Esta versión no factura con ARCA. Si tu comercio lo necesita, escribinos y te contamos cómo lo resolvemos.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href={WHATSAPP_ARCA}
            data-track="whatsapp_clicked"
            data-track-loc="arca"
            target="_blank"
            rel="noopener noreferrer"
            className="rt-btn rt-btn-red"
          >
            <IconoWhatsApp className="h-4 w-4" />
            Contactanos por WhatsApp
          </a>
        </div>

        <p className="tag-numbered mt-5 text-[12.5px] uppercase text-ink-mute">
          Soporte por WhatsApp · actualizaciones incluidas · te responde la persona que hizo el sistema
        </p>
      </div>
    </section>
  );
}
