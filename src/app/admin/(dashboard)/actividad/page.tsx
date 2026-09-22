import Link from "next/link";
import { getActividad, parseTipoActividad, TIPOS_ACTIVIDAD } from "@/lib/admin-stats";
import { eventDetail, eventLabel } from "@/lib/event-labels";
import { fmtDateTime, timeAgo } from "@/lib/format";
import { PageHeader } from "@/components/admin/stats";

export const dynamic = "force-dynamic";

export default async function AdminActividad({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; pagina?: string }>;
}) {
  const { tipo: tipoParam, pagina: paginaParam } = await searchParams;
  const tipo = parseTipoActividad(tipoParam);
  const pagina = Math.max(1, Number(paginaParam) || 1);

  const { rows, total, pageSize } = await getActividad(tipo, pagina);
  const totalPaginas = Math.max(1, Math.ceil(total / pageSize));
  const now = new Date();

  const linkTipo = (t: string) => `/admin/actividad${t !== "todos" ? `?tipo=${t}` : ""}`;
  const linkPagina = (p: number) => `/admin/actividad?${tipo !== "todos" ? `tipo=${tipo}&` : ""}pagina=${p}`;

  return (
    <div className="max-w-6xl">
      <PageHeader title="Actividad" subtitle={`Lo que pasó, en orden. ${total.toLocaleString("es-AR")} eventos con este filtro.`} />

      <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2">
        <span className="tag-numbered text-[12px] text-foreground/45">Tipo:</span>
        <Link
          href={linkTipo("todos")}
          className={`admin-btn border border-foreground/25 px-3.5 py-2 text-[12px] ${
            tipo === "todos" ? "bg-foreground text-white" : "bg-white text-foreground hover:bg-foreground/5"
          }`}
        >
          Todos
        </Link>
        {TIPOS_ACTIVIDAD.map((t) => (
          <Link
            key={t}
            href={linkTipo(t)}
            className={`admin-btn border border-foreground/25 px-3.5 py-2 text-[12px] ${
              tipo === t ? "bg-foreground text-white" : "bg-white text-foreground hover:bg-foreground/5"
            }`}
          >
            {eventLabel(t)}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        {rows.length === 0 ? (
          <p className="text-[14.5px] text-foreground/60">No hay actividad registrada con este filtro.</p>
        ) : (
          <div className="admin-card divide-y divide-black/[0.07]">
            {rows.map((r, i) => (
              <div key={i} className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5 px-5 py-3">
                <p className="w-36 shrink-0 text-[13px] tabular-nums text-foreground/50" title={fmtDateTime(r.at)}>
                  {timeAgo(r.at, now)}
                </p>
                <p className="text-[14.5px] font-medium">{eventLabel(r.name)}</p>
                <p className="min-w-0 flex-1 truncate text-[14px] text-foreground/60">
                  {r.email ?? `visitante anónimo${r.source ? ` · ${r.source}` : ""}`}
                  {eventDetail(r.name, r.props, r.path) ? ` · ${eventDetail(r.name, r.props, r.path)}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <Link
            href={linkPagina(pagina - 1)}
            aria-disabled={pagina <= 1}
            className={`admin-btn admin-btn-outline ${pagina <= 1 ? "pointer-events-none opacity-40" : ""}`}
          >
            ← Más nuevo
          </Link>
          <p className="text-[13.5px] text-foreground/55">
            Página {pagina} de {totalPaginas}
          </p>
          <Link
            href={linkPagina(pagina + 1)}
            aria-disabled={pagina >= totalPaginas}
            className={`admin-btn admin-btn-outline ${pagina >= totalPaginas ? "pointer-events-none opacity-40" : ""}`}
          >
            Más viejo →
          </Link>
        </div>
      )}
    </div>
  );
}
