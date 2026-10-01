"use client";

import { useEffect } from "react";

/**
 * Hace que las secciones de la home (las que tienen .rt-diferida) aparezcan
 * recién cuando se llega a ellas con el scroll: arrancan ocultas y entran
 * subiendo con un fundido (ver .rt-oculta / .rt-visible en globals.css).
 *
 * Solo oculta las que al cargar todavía están abajo de la pantalla, así nunca
 * parpadea lo que ya se está viendo. Si el JavaScript no llega a correr, todo
 * queda visible como siempre.
 */
export default function RevelarSecciones() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const secciones = [...document.querySelectorAll<HTMLElement>(".rt-diferida")].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.85,
    );
    secciones.forEach((el) => el.classList.add("rt-oculta"));

    // Aparece cuando su borde de arriba pasa el 85% de la pantalla.
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("rt-visible");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    secciones.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
