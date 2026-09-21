"use client";

import { usePathname } from "next/navigation";
import IconoWhatsApp from "@/components/retro/IconoWhatsApp";
import { whatsappHref, whatsappMessageForPath } from "@/lib/whatsapp";

// Botón flotante en todo el sitio público, con el mensaje precargado según la
// página (src/lib/whatsapp.ts). Con texto, no solo el ícono: tiene que quedar
// claro a cualquier hora que hay alguien del otro lado para responder.
export default function WhatsAppFloat() {
  const pathname = usePathname();
  const href = whatsappHref(whatsappMessageForPath(pathname));

  return (
    <a
      href={href}
      data-track="whatsapp_clicked"
      data-track-loc="float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp: soporte y consultas sobre el sistema"
      className="fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-full border-[3px] border-ink bg-paper-warm py-2 pl-2 pr-5 text-ink shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)] sm:bottom-6 sm:right-6"
    >
      <span className="rt-punto-vivo flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white sm:h-12 sm:w-12">
        <IconoWhatsApp className="h-6 w-6 sm:h-7 sm:w-7" />
      </span>
      <span className="leading-tight">
        <span className="block font-slab text-[15px] sm:text-[17px]">¿Dudas? Escribinos</span>
        <span className="tag-numbered block text-[10px] uppercase sm:text-[11px]">Soporte por WhatsApp</span>
      </span>
    </a>
  );
}
