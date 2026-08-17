import Image from "next/image";
import { ImageOff } from "lucide-react";

// Sin `src`, no se inventa nada — queda vacío hasta que se cargue una
// imagen real desde el panel admin.
export default function ProductFrame({
  label,
  aspect = "aspect-video",
  src,
  fit = "contain",
  sizes = "(min-width: 1024px) 480px, 100vw",
  bordered = true,
}: {
  label?: string;
  aspect?: string;
  src?: string | null;
  fit?: "contain" | "cover";
  sizes?: string;
  bordered?: boolean;
}) {
  if (src) {
    return (
      <div
        className={`relative ${aspect} w-full overflow-hidden bg-white ${bordered ? "border border-black/10" : ""}`}
      >
        <Image
          src={src}
          alt={label ?? ""}
          fill
          sizes={sizes}
          quality={100}
          className={fit === "cover" ? "object-cover" : "object-contain"}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${aspect} w-full border border-dashed border-black/10 bg-foreground/[0.02]`}>
      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-foreground/25">
        <ImageOff className="h-6 w-6" strokeWidth={1.5} />
        <span className="text-[11px]">Sin imagen</span>
      </div>
    </div>
  );
}
