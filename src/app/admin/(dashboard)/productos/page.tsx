import Link from "next/link";
import { Star, Pencil, Trash2 } from "lucide-react";
import ProductFrame from "@/components/ProductFrame";
import { listAllProductsForAdmin } from "@/lib/products";
import { deleteProductAction, toggleFeaturedAction } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

export default async function AdminProductos() {
  const products = await listAllProductsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Productos</h1>
        <Link href="/admin/productos/nuevo" className="admin-btn admin-btn-primary">
          + Nuevo producto
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {products.length === 0 && (
          <p className="admin-card p-8 text-center text-sm text-foreground/50">Todavía no hay productos.</p>
        )}
        {products.map((p) => (
          <div key={p.id} className="admin-card flex items-center gap-4 p-3">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
              <ProductFrame label={p.name} src={p.imageUrl} aspect="aspect-square" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-bold text-foreground">{p.name}</p>
                {p.featured && (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                    Destacado
                  </span>
                )}
                {!p.active && (
                  <span className="rounded-full bg-foreground/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground/45">
                    Oculto
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-foreground/45">
                /{p.slug} · ${p.priceArs.toLocaleString("es-AR")}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <form action={toggleFeaturedAction.bind(null, p.id, !p.featured)}>
                <button
                  type="submit"
                  title={p.featured ? "Quitar de destacados" : "Destacar"}
                  className={`admin-btn-icon ${p.featured ? "text-brand" : ""}`}
                >
                  <Star className="h-4 w-4" strokeWidth={1.8} fill={p.featured ? "currentColor" : "none"} />
                </button>
              </form>
              <Link href={`/admin/productos/${p.id}`} title="Editar" className="admin-btn-icon">
                <Pencil className="h-4 w-4" strokeWidth={1.8} />
              </Link>
              <form action={deleteProductAction.bind(null, p.id)}>
                <button type="submit" title="Eliminar" className="admin-btn-icon hover:!bg-brand/10 hover:!text-brand">
                  <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
