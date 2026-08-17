"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Expand, X } from "lucide-react";

/**
 * Abre la captura del módulo en grande. El contenedor NO tiene medida fija:
 * se adapta a la proporción real de cada imagen, así no queda espacio muerto
 * a los costados ni recortes.
 */
export default function CapturaModal({
  src,
  titulo,
  ancho,
  alto,
}: {
  src: string;
  titulo: string;
  ancho: number;
  alto: number;
}) {
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

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="tag-numbered mt-5 inline-flex items-center gap-2 self-start rounded-full border border-black/12 px-4 py-2 text-[12px] text-foreground/60 transition-colors hover:border-black/30 hover:text-foreground"
      >
        <Expand className="h-3.5 w-3.5" strokeWidth={2.5} />
        Abrir vista previa
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Vista previa de ${titulo}`}
          onClick={cerrar}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/85 p-4 backdrop-blur-sm sm:p-6"
        >
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </button>

          {/* El wrapper se encoge al tamaño de la imagen: nada de caja fija. */}
          <div onClick={(e) => e.stopPropagation()} className="max-w-full">
            <Image
              src={src}
              alt={titulo}
              width={ancho}
              height={alto}
              quality={100}
              priority
              className="h-auto max-h-[82vh] w-auto max-w-[94vw] rounded-lg shadow-2xl"
            />
            <p className="font-condensed mt-3 text-center text-[20px] font-bold text-white">{titulo}</p>
          </div>

          <p className="text-[13px] text-white/45">Clic afuera o Esc para cerrar</p>
        </div>
      )}
    </>
  );
}
