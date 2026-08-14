import Image from "next/image";

// Marco para capturas reales del sistema. Hoy no hay capturas reales
// disponibles (se verificó — las únicas imágenes existentes son de otro
// proyecto, no de esta app), así que sin `src` muestra un placeholder
// honesto con marcas de registro (estética técnica). El día que haya
// capturas reales, alcanza con pasar `src` — no hay que rediseñar nada.
export default function ProductFrame({
  label = "Captura del sistema",
  note = "Próximamente",
  aspect = "aspect-video",
  src,
}: {
  label?: string;
  note?: string;
  aspect?: string;
  src?: string;
}) {
  if (src) {
    return (
      <div className={`relative ${aspect} w-full overflow-hidden border border-foreground/15`}>
        <Image src={src} alt={label} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative ${aspect} w-full border border-foreground/15`}>
      <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-foreground/30" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-foreground/30" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-foreground/30" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-foreground/30" />
      <div className="flex h-full w-full flex-col items-center justify-center gap-1">
        <span className="tag-numbered text-xs text-foreground/40">{label}</span>
        <span className="text-[11px] text-foreground/25">{note}</span>
      </div>
    </div>
  );
}
