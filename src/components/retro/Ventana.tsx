import type { CSSProperties, ReactNode } from "react";

/* Ventana de programa retro: barra oscura con título, borde de tinta y sombra
   dura. `sombra` cambia el color de la sombra (rojo sobre fondos oscuros). */
export default function Ventana({
  titulo,
  children,
  sombra = "var(--ink)",
  tamano = 10,
  className = "",
}: {
  titulo: string;
  children: ReactNode;
  sombra?: string;
  tamano?: number;
  className?: string;
}) {
  const style = { "--sh": `${tamano}px`, "--sh-color": sombra } as CSSProperties;
  return (
    <div className={`rt-window ${className}`} style={style}>
      <div className="rt-window-bar">
        <span className="truncate">{titulo}</span>
        <span aria-hidden className="ml-3 opacity-80">
          ✕
        </span>
      </div>
      {children}
    </div>
  );
}
