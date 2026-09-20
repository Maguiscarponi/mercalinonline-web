"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/track";

// Se monta una vez en el layout del sitio público (el admin no lo tiene).
// - Cada cambio de página manda un page_view.
// - Cualquier elemento con data-track="nombre_evento" (y opcionalmente
//   data-track-loc="dónde está") manda ese evento al hacer clic, sin
//   necesidad de tocar JavaScript en cada botón.
export default function Analytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    track("page_view");
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest?.("[data-track]") as HTMLElement | null;
      if (!el?.dataset.track) return;
      const loc = el.dataset.trackLoc;
      track(el.dataset.track, loc ? { location: loc } : undefined);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
