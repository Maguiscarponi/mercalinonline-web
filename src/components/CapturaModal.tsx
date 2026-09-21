"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Expand, X } from "lucide-react";
import { track } from "@/lib/track";

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
        onClick={() => {
          setAbierto(true);
          track("demo_capture_opened", { module: titulo });
        }}
        className="rt-btn rt-btn-line mt-5 self-start !px-4 !py-2.5 !text-[12px]"
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

          {/* El wrapper se encoge al tamaño de la imagen: nada de caja fija. */}
          <div onClick={(e) => e.stopPropagation()} className="max-w-full">
            <Image
              src={src}
              alt={titulo}
              width={ancho}
              height={alto}
              quality={100}
              priority
              className="h-auto max-h-[82vh] w-auto max-w-[94vw] border-[3px] border-ink bg-white shadow-[10px_10px_0_#e1251b]"
            />
            <p className="font-slab mt-5 text-center text-[22px] text-cream">{titulo}</p>
          </div>

          <p className="tag-numbered text-[12px] uppercase text-cream/55">Clic afuera o Esc para cerrar</p>
        </div>
      )}
    </>
  );
}
