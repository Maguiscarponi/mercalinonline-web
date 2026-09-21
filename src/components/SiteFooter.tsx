import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import IconoWhatsApp from "@/components/retro/IconoWhatsApp";
import { whatsappHref } from "@/lib/whatsapp";

/* ─────────────────────────────────────────────────────────────────────────
   Cierre de todas las páginas: banda mostaza con el contacto directo (el
   soporte tiene que verse siempre) y el pie oscuro con el wordmark gigante.

   Los links son sólo rutas que existen hoy. Si más adelante creás páginas
   nuevas (instalación, formas de pago, facturación), se agregan acá.
   ───────────────────────────────────────────────────────────────────────── */

const CONTACTO = {
  mail: "onlinemercalin@gmail.com",
  ciudad: "Buenos Aires, Argentina",
};

const NAVEGACION = [
  { href: "/", label: "Inicio" },
  { href: "/#modulos", label: "Módulos" },
  { href: "/#precio", label: "Precio" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
];

const COMPRA = [
  { href: "/prueba-gratis", label: "Probar 7 días gratis" },
  { href: "/carrito", label: "Comprar" },
];

function Columna({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="tag-numbered mb-3.5 text-[12px] uppercase text-amber">{titulo}</p>
      <div className="space-y-2.5 text-[16px] text-cream/85">{children}</div>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer>
      {/* Banda mostaza: contacto directo */}
      <div className="border-y-[3px] border-ink bg-amber">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:px-0">
          <div className="max-w-[34rem]">
            <h2 className="font-slab text-[clamp(36px,5vw,64px)] leading-none text-ink">¿Tenés dudas?</h2>
            <p className="mt-4 text-[19px] leading-relaxed text-ink sm:text-[21px]">
              Escribinos por WhatsApp o por mail. Te responde directamente quien desarrolla el sistema.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={whatsappHref("Hola, tengo una consulta sobre Mercalin.")}
              data-track="whatsapp_clicked"
              data-track-loc="footer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-[3px] border-ink bg-paper-warm px-8 py-3.5 text-[18px] font-bold text-ink shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)]"
            >
              <IconoWhatsApp className="h-5 w-5" />
              WhatsApp
            </a>
            <a
              href={`mailto:${CONTACTO.mail}`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border-[3px] border-ink bg-paper-warm px-8 py-3.5 text-[18px] font-bold text-ink shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)]"
            >
              {CONTACTO.mail}
            </a>
          </div>
        </div>
      </div>

      {/* Pie oscuro */}
      <div className="overflow-hidden bg-ink text-cream">
        <div className="mx-auto max-w-[1200px] px-5 pt-14 sm:px-8 lg:px-0">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <Image src="/mercalin-isotipo.svg" alt="" width={38} height={38} />
                <span className="font-slab text-[30px] leading-none">
                  Merca<span className="text-brand">lin</span>
                </span>
              </div>
              <p className="mt-4 max-w-[30ch] text-[16px] leading-relaxed text-cream/70">
                Sistema de gestión para comercios. Pago único, con actualizaciones incluidas.
              </p>
            </div>

            <Columna titulo="Navegación">
              {NAVEGACION.map((l) => (
                <Link key={l.href} href={l.href} className="block transition-colors hover:text-white hover:underline">
                  {l.label}
                </Link>
              ))}
            </Columna>

            <Columna titulo="Tu compra">
              {COMPRA.map((l) => (
                <Link key={l.href} href={l.href} className="block transition-colors hover:text-white hover:underline">
                  {l.label}
                </Link>
              ))}
            </Columna>

            <Columna titulo="Contacto">
              <a
                href={whatsappHref("Hola, tengo una consulta sobre Mercalin.")}
                data-track="whatsapp_clicked"
                data-track-loc="footer_links"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-white hover:underline"
              >
                WhatsApp
              </a>
              <a href={`mailto:${CONTACTO.mail}`} className="block break-all transition-colors hover:text-white hover:underline">
                {CONTACTO.mail}
              </a>
              <p className="flex items-center gap-2 text-cream/70">
                <MapPin className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                {CONTACTO.ciudad}
              </p>
            </Columna>
          </div>

          {/* Wordmark gigante */}
          <div
            aria-hidden
            className="mt-14 flex items-center justify-center gap-[0.1em] sm:mt-16"
            style={{ fontSize: "clamp(54px, 14.5vw, 210px)", lineHeight: 1 }}
          >
            <Image src="/mercalin-isotipo.svg" alt="" width={200} height={200} className="h-[0.82em] w-[0.82em] shrink-0" />
            <span className="font-wordmark text-cream">
              Merca<span className="text-brand">lin</span>
            </span>
          </div>

          <div className="tag-numbered mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-cream/20 py-6 pr-0 text-[13px] text-cream/55 sm:pr-72">
            <span>© {new Date().getFullYear()} Mercalin · Hecho en Argentina</span>
            <Link href="/privacidad" className="underline underline-offset-2 hover:text-cream">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
