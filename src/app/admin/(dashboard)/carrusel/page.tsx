import Image from "next/image";
import { X } from "lucide-react";
import { listAllSlidesForAdmin } from "@/lib/carousel";
import { createSlideAction, deleteSlideAction } from "@/lib/actions/slides";

export const dynamic = "force-dynamic";

export default async function AdminCarrusel() {
  const slides = await listAllSlidesForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Carrusel del home</h1>
      <p className="mt-2 text-sm text-foreground/50">
        Imagen recomendada: horizontal, relación 3:1 (ej. 1800×600, 1920×640). Sin ninguna cargada, el carrusel no
        aparece en el sitio.
      </p>

      <form action={createSlideAction} className="admin-card mt-6 flex flex-wrap items-center gap-3 p-5">
        <input type="file" name="image" accept="image/*" required className="admin-input flex-1" />
        <button type="submit" className="admin-btn admin-btn-primary">
          Agregar imagen
        </button>
      </form>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {slides.length === 0 && (
          <p className="admin-card col-span-full p-8 text-center text-sm text-foreground/50">
            Todavía no hay imágenes.
          </p>
        )}
        {slides.map((s) => (
          <div key={s.id} className="admin-card group relative overflow-hidden">
            <div className="relative aspect-[3/1]">
              <Image src={s.imageUrl!} alt="" fill className="object-cover" />
            </div>
            <form action={deleteSlideAction.bind(null, s.id)} className="absolute right-2 top-2">
              <button
                type="submit"
                title="Eliminar"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-brand"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
