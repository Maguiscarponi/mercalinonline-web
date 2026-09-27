import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Analytics from "@/components/Analytics";
import Barcode from "@/components/retro/Barcode";
import TicketTag from "@/components/retro/TicketTag";

export const metadata: Metadata = {
  title: "Página no encontrada — Mercalin",
  robots: { index: false, follow: false },
};

// Vive en la raíz (fuera del route group (site)) porque así lo pide Next.js
// para atrapar CUALQUIER URL que no matchee ninguna ruta -- por eso rearma acá
// mismo el header/footer/whatsapp del sitio público en vez de heredarlos.
export default function NotFound() {
  return (
    <div className="site-retro flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-md px-5 py-16 sm:py-24">
          <div className="relative">
            <TicketTag
              arriba="Código"
              centro="404"
              abajo="Sin stock"
              rot={-6}
              className="absolute -right-3 -top-5 z-10 sm:-right-5"
            />
            <div className="rt-ticket px-7 pb-8 pt-9 text-center">
              <p className="rt-label">Error 404</p>
              <h1 className="mt-3 text-[44px] leading-[1.02] text-ink sm:text-[52px]">
                Este código no escanea.
              </h1>
              <div className="rt-dashed my-6" />
              <p className="font-typewriter text-[15px] leading-relaxed text-ink-soft">
                Buscamos esta página en toda la góndola y no la encontramos. El link puede estar vencido, mal escrito, o llevar a algo que ya no existe.
              </p>

              <div className="mt-7">
                <Barcode width={320} height={50} seed={404} />
              </div>
              <p className="font-typewriter mt-2 text-[11px] uppercase tracking-[0.08em] text-ink-mute">
                ¡Error de lectura! Probá escanear de nuevo
              </p>

              <Link href="/" className="rt-btn rt-btn-red mt-8 w-full">
                ← Volver al inicio
              </Link>
            </div>
          </div>

          <div className="tag-numbered mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-[13px] uppercase">
            <Link href="/#modulos" className="text-brand-dark underline underline-offset-4">
              Módulos
            </Link>
            <Link href="/#precio" className="text-brand-dark underline underline-offset-4">
              Precio
            </Link>
            <Link href="/preguntas-frecuentes" className="text-brand-dark underline underline-offset-4">
              Preguntas frecuentes
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
      <Analytics />
    </div>
  );
}
