import Ventana from "@/components/retro/Ventana";

/* ─────────────────────────────────────────────────────────────────────────
   Sección reservada para el video del sistema (fondo rojo, pantalla completa).

   Para activarlo, pegá acá la ruta del video. Lo más simple es subir el .mp4
   a /public (por ejemplo /public/video/mercalin.mp4) y poner "/video/mercalin.mp4".
   Mientras esté vacío se muestra el marco con el botón de play, sin reproducir nada.
   ───────────────────────────────────────────────────────────────────────── */
const VIDEO_SRC = "";
const VIDEO_POSTER = ""; // opcional: imagen de portada, ej. "/capturas/caja.png"

export default function VideoSlot() {
  return (
    <section id="video" className="flex min-h-[100svh] scroll-mt-20 items-center bg-brand text-white">
      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)] lg:gap-14">
        <div>
          <p className="rt-label !text-white">Nº 03 · El sistema en video</p>
          <h2 className="mt-3 text-[clamp(44px,6vw,78px)] leading-none text-white">Así se usa.</h2>
          <p className="mt-5 max-w-sm text-[19px] leading-relaxed sm:text-[21px]">
            El sistema funcionando, en pantalla real.
          </p>
        </div>

        <div className="min-w-0 pr-2.5 sm:pr-4">
          <Ventana titulo="Mercalin — Demo" sombra="#161412" tamano={12}>
            {VIDEO_SRC ? (
              <video
                controls
                playsInline
                preload="metadata"
                poster={VIDEO_POSTER || undefined}
                className="block aspect-video w-full bg-ink"
                src={VIDEO_SRC}
              />
            ) : (
              <div className="relative flex aspect-video w-full items-center justify-center bg-ink">
                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-4 border-ink bg-cream shadow-[0_0_0_4px_var(--cream)] sm:h-[118px] sm:w-[118px]">
                  <span
                    aria-hidden
                    className="ml-2 h-0 w-0 border-y-[18px] border-l-[28px] border-y-transparent border-l-brand sm:ml-2.5 sm:border-y-[24px] sm:border-l-[38px]"
                  />
                </div>
                <p className="tag-numbered absolute bottom-3 left-4 text-[11px] uppercase text-cream/75 sm:text-[12px]">
                  Video del sistema · próximamente
                </p>
              </div>
            )}
          </Ventana>
        </div>
      </div>
    </section>
  );
}
