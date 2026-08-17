"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export interface Slide {
  label: string;
  src?: string | null;
}

const AUTOPLAY_MS = 3000;

// Solo muestra slides con imagen real cargada desde el admin. Si no hay
// ninguna, no renderiza nada — nunca un placeholder inventado.
export default function Carousel({ slides, aspect = "aspect-[3/1]" }: { slides: Slide[]; aspect?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const withImage = slides.filter((s) => s.src);
  const count = withImage.length;

  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = setInterval(() => {
      setI((n) => (n + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, paused]);

  if (withImage.length === 0) return null;

  const prev = () => setI((n) => (n - 1 + withImage.length) % withImage.length);
  const next = () => setI((n) => (n + 1) % withImage.length);
  const current = withImage[Math.min(i, withImage.length - 1)];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative">
        <div className={`relative ${aspect} w-full overflow-hidden bg-background`}>
          <Image
            src={current.src!}
            alt={current.label ?? ""}
            fill
            priority
            sizes="100vw"
            quality={100}
            className="object-contain"
          />
        </div>
        {withImage.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50 sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50 sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      {withImage.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {withImage.map((s, idx) => (
            <button
              key={s.label + idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={s.label}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${idx === i ? "bg-brand" : "bg-foreground/20"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
