"use client";

import { usePathname } from "next/navigation";
import { whatsappHref, whatsappMessageForPath } from "@/lib/whatsapp";

function IconoWhatsApp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5 0-.2-.6-1.5-.9-2.1-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 .9-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" />
      <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1112 20.2z" />
    </svg>
  );
}

// Flotante persistente en todo el sitio público, con el mensaje precargado
// según la página (src/lib/whatsapp.ts). El footer ya tiene su propio botón
// de WhatsApp para quien llega hasta ahí — este es para quien no quiere
// scrollear tanto.
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
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform hover:scale-105"
    >
      <IconoWhatsApp className="h-7 w-7" />
    </a>
  );
}
