"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { track } from "@/lib/track";

/**
 * Video del sistema en grande dentro de una sección de la home.
 *
 * Para que la página cargue rápido, al principio no se baja nada del video:
 * se ve la portada como imagen optimizada con carga diferida (recién se pide
 * cuando la sección se acerca a la pantalla al hacer scroll — el `poster` del
 * <video> en cambio se descarga siempre, apenas carga la página) y un botón de
 * play grande en el medio. El video se descarga al tocar play.
 * `src` admite el fragmento #t=segundos para arrancar en una parte puntual.
 */
export default function VideoPantalla({ src, poster, modulo }: { src: string; poster: string; modulo: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [empezado, setEmpezado] = useState(false);

  function reproducir() {
    setEmpezado(true);
    track("demo_video_opened", { module: modulo });
    // play() dentro del clic: así el navegador deja reproducir con sonido.
    ref.current?.play().catch(() => {});
  }

  return (
    <div className="relative aspect-video w-full bg-ink">
      <video
        ref={ref}
        src={src}
        controls={empezado}
        playsInline
        preload="none"
        className="block h-full w-full"
      >
        Tu navegador no puede reproducir este video.
      </video>

      {!empezado && (
        <button
          type="button"
          onClick={reproducir}
          aria-label={`Reproducir el video de ${modulo}`}
          className="group absolute inset-0 flex items-center justify-center"
        >
          <Image src={poster} alt="" fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
          <span className="absolute inset-0 bg-ink/10 transition-colors group-hover:bg-ink/25" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-ink bg-cream shadow-[0_0_0_4px_var(--cream),6px_6px_0_4px_#161412] transition-transform group-hover:scale-110 sm:h-28 sm:w-28">
            <Play className="ml-1.5 h-9 w-9 fill-brand text-brand sm:h-12 sm:w-12" />
          </span>
        </button>
      )}
    </div>
  );
}
