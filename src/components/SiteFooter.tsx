import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
   Footer: tarjeta de contacto roja montada sobre el cierre oscuro.

   La tarjeta existe porque el footer viejo no tenía ninguna forma de
   contactarte, y para vender software de pago único a alguien que no te
   conoce eso es lo primero que se busca.

   Los links son sólo rutas que existen hoy. Si más adelante creás páginas
   nuevas (instalación, formas de pago, facturación), se agregan acá.
   ───────────────────────────────────────────────────────────────────────── */

const CONTACTO = {
  // El teléfono no se muestra en ningún lado: sólo se usa para armar el
  // link de WhatsApp, así nadie lo puede copiar de la página.
  whatsapp: "542344502904",
  mail: "onlinemercalin@gmail.com",
  ciudad: "Buenos Aires, Argentina",
  horario: "Soporte 24/7 · respondemos todos los días",
};

const NAVEGACION = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
];

const COMPRA = [
  { href: "/carrito", label: "Carrito" },
  { href: "/prueba-gratis", label: "Probar 7 días gratis" },
];

function IconoWhatsApp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5 0-.2-.6-1.5-.9-2.1-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 .9-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" />
      <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1112 20.2z" />
    </svg>
  );
}

function Columna({ titulo, links }: { titulo: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="tag-numbered mb-3.5 text-[12px] text-white/40">{titulo}</p>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="mb-2.5 block text-[15px] text-white/60 transition-colors hover:text-white"
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="relative">
      {/* Tarjeta de contacto: se monta entre el contenido y el cierre oscuro.
          El translate no ocupa espacio en el flujo, por eso el bloque oscuro
          de abajo compensa con padding-top. */}
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="relative z-[1] translate-y-10 rounded-[20px] px-7 py-8 text-white shadow-[0_22px_50px_-12px_rgb(225_37_27/0.45)] sm:translate-y-12 sm:px-10 sm:py-9"
          style={{ background: "linear-gradient(115deg,#e1251b 0%,#b91d15 58%,#8e1a13 100%)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="font-condensed text-[26px] font-extrabold leading-none tracking-tight sm:text-[30px]">
                ¿Tenés dudas?
              </h2>
              <p className="mt-2 max-w-[46ch] text-[15px] text-white/75">
                Escribinos y te respondemos hoy mismo. Hablás directo con quien hizo el sistema.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
              <a
                href={`https://wa.me/${CONTACTO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-foreground transition-colors hover:bg-white/90"
              >
                <IconoWhatsApp className="h-[18px] w-[18px]" />
                WhatsApp
              </a>
              <a
                href={`mailto:${CONTACTO.mail}`}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-white/40 px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                {CONTACTO.mail}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cierre oscuro: mismo negro que el header, así la página abre y cierra igual. */}
      <div className="bg-dark-section pt-[72px] text-white sm:pt-[84px]">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 pb-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/mercalin-isotipo.svg" alt="" width={34} height={34} />
              <span className="text-[25px] font-bold leading-none tracking-[-0.02em]">
                Merca<span className="text-[#ff5b52]">lin</span>
              </span>
            </div>
            <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-white/50">
              Se paga una vez y es tuyo. Sin cuotas mensuales, con actualizaciones y soporte incluidos.
            </p>
            <p className="mt-3.5 flex items-center gap-2 text-[13.5px] text-white/45">
              <MapPin className="h-[15px] w-[15px]" strokeWidth={2} aria-hidden />
              {CONTACTO.ciudad}
            </p>
          </div>

          <Columna titulo="Navegación" links={NAVEGACION} />
          <Columna titulo="Tu compra" links={COMPRA} />
        </div>

        <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-3 border-t border-white/10 px-6 py-6 text-[13px] text-white/35">
          <span>{CONTACTO.horario}</span>
          <span>© {new Date().getFullYear()} Mercalin. Hecho en Argentina.</span>
        </div>
      </div>
    </footer>
  );
}
