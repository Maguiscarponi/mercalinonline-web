"use client";

import Image from "next/image";
import Link from "next/link";
import Awning from "@/components/retro/Awning";
import IconoWhatsApp from "@/components/retro/IconoWhatsApp";
import { whatsappHref, whatsappMessageForPath } from "@/lib/whatsapp";
import { usePathname } from "next/navigation";

// Las secciones de la home se alcanzan con ancla, así que desde cualquier otra
// página estos links llevan de vuelta a esa sección. El logo es el botón de
// inicio (por eso no hay un link "Inicio" aparte).
const LINKS = [
  { href: "/#modulos", label: "Módulos" },
  { href: "/#precio", label: "Precio" },
  { href: "/#preguntas", label: "Preguntas" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const wa = whatsappHref(whatsappMessageForPath(pathname));

  return (
    <>
      {/* El toldo se va con el scroll; la barra de abajo queda fija. */}
      <Awning id="toldo-nav" />
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-cream">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-5 py-3.5 sm:px-8 lg:px-0 lg:py-4">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80" aria-label="Mercalin — ir al inicio">
            <Image src="/mercalin-isotipo.svg" alt="" width={40} height={40} priority className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="font-slab text-[26px] leading-none tracking-[-0.01em] text-ink sm:text-[34px]">
              Merca<span className="text-brand">lin</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4 lg:gap-7">
            <div className="tag-numbered hidden items-center gap-6 text-[13px] uppercase text-ink lg:flex">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="underline-offset-[6px] transition-colors hover:text-brand hover:underline">
                  {l.label}
                </Link>
              ))}
              <a
                href={wa}
                data-track="whatsapp_clicked"
                data-track-loc="navbar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 underline-offset-[6px] transition-colors hover:text-brand hover:underline"
              >
                <span aria-hidden className="h-2 w-2 bg-brand" />
                Soporte
              </a>
            </div>

            <Link
              href="/prueba-gratis"
              data-track="cta_trial_clicked"
              data-track-loc="navbar"
              className="rt-btn rt-btn-red !px-3.5 !py-2.5 !text-[12px] sm:!px-5 sm:!py-3 sm:!text-[13px]"
            >
              <span className="sm:hidden">Probar gratis</span>
              <span className="hidden sm:inline">Probar 7 días gratis</span>
            </Link>
          </nav>
        </div>

        {/* En celular no entran todos los links en la barra: van en una segunda fila. */}
        <div className="tag-numbered flex items-center gap-5 overflow-x-auto border-t border-ink/15 px-5 py-2 text-[12px] uppercase text-ink sm:px-8 lg:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="shrink-0 hover:text-brand">
              {l.label}
            </Link>
          ))}
          <a
            href={wa}
            data-track="whatsapp_clicked"
            data-track-loc="navbar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 hover:text-brand"
          >
            <IconoWhatsApp className="h-3.5 w-3.5" />
            Soporte
          </a>
        </div>
      </header>
    </>
  );
}
