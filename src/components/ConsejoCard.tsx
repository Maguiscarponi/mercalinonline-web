// El componente central de toda la landing: es exactamente el mismo diseño
// que la tarjeta real de "Consejo del día" dentro de la app (borde de color
// por nivel, mensaje + detalle) — la página no muestra capturas de pantalla,
// muestra al sistema hablando con avisos reales, tal como le va a hablar al
// visitante el día que lo instale.
export type ConsejoLevel = "urgente" | "importante" | "consejo";

const STYLES: Record<ConsejoLevel, { border: string; bg: string; text: string; label: string }> = {
  urgente: { border: "border-brand", bg: "bg-brand/5", text: "text-brand", label: "Urgente" },
  importante: { border: "border-amber-400", bg: "bg-amber-50", text: "text-amber-600", label: "Importante" },
  consejo: { border: "border-indigo-400", bg: "bg-indigo-50", text: "text-indigo-600", label: "Consejo" },
};

export default function ConsejoCard({
  level,
  mensaje,
  detalle,
  className = "",
}: {
  level: ConsejoLevel;
  mensaje: string;
  detalle?: string;
  className?: string;
}) {
  const s = STYLES[level];
  return (
    <div className={`rounded-xl border-l-[3px] ${s.border} ${s.bg} px-4 py-3.5 ${className}`}>
      <div className={`text-[10px] font-bold uppercase tracking-widest ${s.text}`}>{s.label}</div>
      <div className="mt-1 text-[14px] font-semibold leading-snug text-foreground">{mensaje}</div>
      {detalle && <div className="mt-1 text-[12.5px] leading-snug text-foreground/55">{detalle}</div>}
    </div>
  );
}
