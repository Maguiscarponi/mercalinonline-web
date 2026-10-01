"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { track } from "@/lib/track";

/**
 * Tutorial en video de un módulo. En la ficha se ve solo la portada (liviana,
 * con carga diferida); el video recién se descarga cuando alguien lo abre, así
 * los 19 videos no pesan nada en la carga de la página.
 */
export default function VideoModal({ src, poster, titulo }: { src: string; poster: string; titulo: string }) {
  const [abierto, setAbierto] = useState(false);
  const cerrar = useCallback(() => setAbierto(false), []);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [abierto, cerrar]);

  function abrir() {
    setAbierto(true);
    track("demo_video_opened", { module: titulo });
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        aria-label={`Ver el video de ${titulo}`}
        className="group relative mt-5 block w-full overflow-hidden border-[3px] border-ink bg-ink shadow-[6px_6px_0_#e1251b] transition-transform hover:-translate-y-0.5"
      >
        {poster ? (
          <Image
            src={poster}
            alt={`Video de ${titulo}`}
            width={1280}
            height={720}
            sizes="(min-width: 640px) 460px, 100vw"
            className="block aspect-video h-auto w-full object-cover"
          />
        ) : (
          <span className="block aspect-video w-full" />
        )}
        {/* El play va en la esquina: en el centro de la portada está el nombre del módulo. */}
        <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/15" />
        <span className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-ink bg-cream shadow-[0_0_0_2px_var(--cream)] transition-transform group-hover:scale-110">
          <Play className="ml-0.5 h-5 w-5 fill-brand text-brand" />
        </span>
        <span className="tag-numbered absolute bottom-3 left-3 bg-ink px-2 py-1 text-[11px] uppercase text-cream">
          Ver cómo se usa
        </span>
      </button>

      {abierto && (
        <div
          role="dialog"
          data-lenis-prevent
          aria-modal="true"
          aria-label={`Video de ${titulo}`}
          onClick={cerrar}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-ink/90 p-4 sm:p-6"
        >
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-2 border-cream bg-ink text-cream transition-colors hover:bg-brand sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </button>

          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[min(94vw,138vh)]">
            <video
              src={src}
              poster={poster || undefined}
              controls
              autoPlay
              playsInline
              preload="none"
              className="block aspect-video w-full border-[3px] border-ink bg-ink shadow-[10px_10px_0_#e1251b]"
            >
              Tu navegador no puede reproducir este video.
            </video>
            <p className="font-slab mt-5 text-center text-[22px] text-cream">{titulo}</p>
          </div>

          <p className="tag-numbered text-[12px] uppercase text-cream/55">Clic afuera o Esc para cerrar</p>
        </div>
      )}
    </>
  );
}
