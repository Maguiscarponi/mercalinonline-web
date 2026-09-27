"use client";

import { usePathname } from "next/navigation";
import IconoWhatsApp from "@/components/retro/IconoWhatsApp";
import { whatsappHref, whatsappMessageForPath } from "@/lib/whatsapp";

// Botón flotante en todo el sitio público, con el mensaje precargado según la
// página (src/lib/whatsapp.ts). Mismo lenguaje que los botones del sitio: rojo
// de la marca, borde de tinta y sombra dura, sin colores ajenos. Por defecto
// es solo el ícono (para no tapar contenido de abajo) y el texto se despliega
// al pasar el mouse -- en mobile no hay hover real, así que ahí queda el
// ícono solo todo el tiempo, que es justamente lo que menos tapa.
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
      className="group fixed bottom-4 right-4 z-40 flex items-center gap-0 overflow-hidden border-[3px] border-ink bg-brand p-2.5 text-white shadow-[4px_4px_0_var(--ink)] transition-[transform,box-shadow,gap,padding-right] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:gap-2.5 hover:pr-4 hover:shadow-[6px_6px_0_var(--ink)] sm:bottom-6 sm:right-6 sm:p-3"
    >
      <IconoWhatsApp className="h-6 w-6 shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap leading-tight opacity-0 transition-[max-width,opacity] duration-200 group-hover:max-w-[220px] group-hover:opacity-100">
        <span className="font-slab block text-[14px] sm:text-[15px]">¿Dudas? Escribinos</span>
        <span className="tag-numbered hidden text-[10px] uppercase text-white/85 sm:block">Soporte por WhatsApp</span>
      </span>
    </a>
  );
}
