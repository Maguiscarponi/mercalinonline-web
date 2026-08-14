"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductFrame from "./ProductFrame";

export interface Slide {
  label: string;
  note?: string;
  src?: string;
}

// Carrusel real (no una imagen estática) — se usa tanto en la portada como
// en la galería de la ficha de producto. Cada slide es un ProductFrame, así
// que reemplazar los placeholders por capturas reales es solo pasar `src`.
export default function Carousel({ slides, aspect = "aspect-video" }: { slides: Slide[]; aspect?: string }) {
  const [i, setI] = useState(0);
  const prev = () => setI((n) => (n - 1 + slides.length) % slides.length);
  const next = () => setI((n) => (n + 1) % slides.length);

  return (
    <div>
      <div className="relative">
        <ProductFrame label={slides[i].label} note={slides[i].note} src={slides[i].src} aspect={aspect} />
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-foreground/15 bg-background/90 text-foreground/60 transition-colors hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-foreground/15 bg-background/90 text-foreground/60 transition-colors hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      {slides.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.label}
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
