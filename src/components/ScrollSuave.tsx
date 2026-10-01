"use client";

import { useEffect } from "react";

/**
 * Scroll suave (con inercia) para la rueda del mouse y el trackpad, con Lenis.
 *
 * - Solo en compu (puntero fino): en el celular el scroll táctil ya es suave
 *   y no se toca.
 * - Respeta "reducir movimiento" del sistema (accesibilidad).
 * - Se carga después de que la página ya se ve (import dinámico en el efecto),
 *   así no suma nada a la carga inicial.
 * - Los links a secciones (#modulos, #precio…) también bajan deslizando, con
 *   el alto del encabezado fijo descontado.
 * - Las ventanas (videos, capturas) llevan data-lenis-prevent: adentro de
 *   ellas la rueda no mueve la página de atrás.
 */
export default function ScrollSuave() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!matchMedia("(pointer: fine)").matches) return;

    let cancelado = false;
    let destruir: (() => void) | undefined;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelado) return;
      const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -84 } });
      destruir = () => lenis.destroy();
    });
    return () => {
      cancelado = true;
      destruir?.();
    };
  }, []);

  return null;
}
