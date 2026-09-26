/* Etiqueta rectangular tipo "pegatina de precio", pinchada en una esquina del
   ticket -- reemplaza al sello circular (Stamp.tsx). Usa el mismo lenguaje
   visual que ya existe en todo el sitio (borde grueso de tinta + sombra dura,
   como los botones rt-btn), en vez de inventar un elemento nuevo.

   A propósito va arriba del ticket, no colgando del borde inferior: el botón
   flotante de WhatsApp es `fixed bottom-*` en toda la página, así que
   cualquier cosa que cuelgue de la parte de abajo del ticket termina, en
   algún punto del scroll, exactamente en esa esquina y se tapan entre sí. */
export default function TicketTag({
  arriba,
  centro,
  abajo,
  rot = 7,
  className = "",
}: {
  arriba: string;
  centro: string;
  abajo?: string;
  rot?: number;
  className?: string;
}) {
  return (
    <div
      className={`border-[3px] border-ink bg-brand px-3 py-2 text-center text-white shadow-[3px_3px_0_var(--ink)] ${className}`}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <p className="font-typewriter text-[10px] font-bold uppercase leading-none tracking-[0.08em]">{arriba}</p>
      <p className="font-slab text-[19px] leading-tight">{centro}</p>
      {abajo && <p className="font-typewriter text-[10px] font-bold uppercase leading-none tracking-[0.08em]">{abajo}</p>}
    </div>
  );
}
