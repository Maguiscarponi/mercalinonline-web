"use client";

import { useRef } from "react";
import { track } from "@/lib/track";

/**
 * Video del sistema en grande dentro de una sección de la home. Se ve la
 * portada (liviana) y el video recién se descarga cuando alguien le da play.
 * `src` admite el fragmento #t=segundos para arrancar en una parte puntual.
 */
export default function VideoPantalla({ src, poster, modulo }: { src: string; poster: string; modulo: string }) {
  const visto = useRef(false);
  return (
    <video
      src={src}
      poster={poster}
      controls
      playsInline
      preload="none"
      onPlay={() => {
        if (visto.current) return;
        visto.current = true;
        track("demo_video_opened", { module: modulo });
      }}
      className="block aspect-video w-full bg-ink"
    >
      Tu navegador no puede reproducir este video.
    </video>
  );
}
