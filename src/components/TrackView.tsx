"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/track";

// Marcador invisible: manda el evento una sola vez, cuando esta parte de la
// página entra en pantalla. Se pone al comienzo de la sección que interesa
// medir (la demo, el precio).
export default function TrackView({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track(name);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [name]);

  return <span ref={ref} aria-hidden className="block h-px w-full" />;
}
