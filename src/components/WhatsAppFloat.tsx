"use client";

import { usePathname } from "next/navigation";
import IconoWhatsApp from "@/components/retro/IconoWhatsApp";
import { whatsappHref, whatsappMessageForPath } from "@/lib/whatsapp";

// Botón flotante en todo el sitio público, con el mensaje precargado según la
// página (src/lib/whatsapp.ts). Mismo lenguaje que los botones del sitio: rojo
// de la marca, borde de tinta y sombra dura, sin colores ajenos. En celular
// muestra solo el título para no tapar contenido.
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
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5 border-[3px] border-ink bg-brand px-3.5 py-2.5 text-white shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)] sm:bottom-6 sm:right-6 sm:px-4"
    >
      <IconoWhatsApp className="h-6 w-6 shrink-0" />
      <span className="leading-tight">
        <span className="font-slab block text-[14px] sm:text-[15px]">¿Dudas? Escribinos</span>
        <span className="tag-numbered hidden text-[10px] uppercase text-white/85 sm:block">Soporte por WhatsApp</span>
      </span>
    </a>
  );
}
