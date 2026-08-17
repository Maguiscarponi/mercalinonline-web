import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { listActivationsPage } from "@/lib/activations";

export const dynamic = "force-dynamic";

export default async function AdminActivaciones({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1") || 1;
  const { items: activations, page: currentPage, totalPages, total } = listActivationsPage(page);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Activaciones</h1>
      <p className="mt-2 text-sm text-foreground/50">
        Quién compró y quién pidió la prueba gratis, más reciente primero — {total} en total.
      </p>

      <div className="admin-card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="tag-numbered border-b border-black/8 bg-foreground/[0.02] text-xs text-foreground/40">
                <th className="py-3 pl-5 pr-4">Fecha</th>
                <th className="py-3 pr-4">Tipo</th>
                <th className="py-3 pr-4">Mail</th>
                <th className="py-3 pr-4">Negocio</th>
                <th className="py-3 pr-4">Producto</th>
                <th className="py-3 pr-4">Monto</th>
                <th className="py-3 pr-5">Mail enviado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {activations.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-foreground/40">
                    Todavía no hay actividad.
                  </td>
                </tr>
              )}
              {activations.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-foreground/[0.02]">
                  <td className="py-3 pl-5 pr-4 text-foreground/60">
                    {new Date(a.createdAt).toLocaleString("es-AR")}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        a.kind === "full" ? "bg-brand/10 text-brand" : "bg-foreground/8 text-foreground/50"
                      }`}
                    >
                      {a.kind === "full" ? "Compra" : "Prueba"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium text-foreground">{a.email}</td>
                  <td className="py-3 pr-4 text-foreground/60">{a.businessName ?? "—"}</td>
                  <td className="py-3 pr-4 text-foreground/60">{a.productSlug}</td>
                  <td className="py-3 pr-4 text-foreground/60">
                    {a.amountArs ? `$${a.amountArs.toLocaleString("es-AR")}` : "—"}
                  </td>
                  <td className="py-3 pr-5">{a.emailSent ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-black/8 px-5 py-3">
            <p className="text-xs text-foreground/40">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/activaciones?page=${currentPage - 1}`}
                aria-disabled={currentPage <= 1}
                className={`admin-btn-icon ${currentPage <= 1 ? "pointer-events-none opacity-25" : ""}`}
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
              </Link>
              <Link
                href={`/admin/activaciones?page=${currentPage + 1}`}
                aria-disabled={currentPage >= totalPages}
                className={`admin-btn-icon ${currentPage >= totalPages ? "pointer-events-none opacity-25" : ""}`}
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
