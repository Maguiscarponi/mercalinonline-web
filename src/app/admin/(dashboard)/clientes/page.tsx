import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { listClientes, matchesSegmento, countBy, isSegmento, SEGMENTOS, type Cliente } from "@/lib/clientes";
import { fmtArs, fmtDate, fmtDateTime, timeAgo, timeLeft } from "@/lib/format";
import { EstadoBadge, PageHeader } from "@/components/admin/stats";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

type Params = { segmento?: string; q?: string; canal?: string; orden?: string; page?: string };

function href(params: Params, overrides: Params): string {
  const merged = { ...params, ...overrides };
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v && !(k === "segmento" && v === "todos") && !(k === "page" && v === "1")) qs.set(k, v);
  }
  const s = qs.toString();
  return `/admin/clientes${s ? `?${s}` : ""}`;
}

function sortClientes(list: Cliente[], orden: string): Cliente[] {
  const copy = [...list];
  if (orden === "email") return copy.sort((a, b) => a.email.localeCompare(b.email));
  if (orden === "vencimiento") {
    const active = (c: Cliente) => c.estado === "activa" || c.estado === "por_vencer";
    return copy.sort((a, b) => {
      if (active(a) !== active(b)) return active(a) ? -1 : 1;
      if (active(a)) return new Date(a.trialExpiresAt!).getTime() - new Date(b.trialExpiresAt!).getTime();
      return new Date(b.firstSeenAt).getTime() - new Date(a.firstSeenAt).getTime();
    });
  }
  return copy.sort((a, b) => new Date(b.firstSeenAt).getTime() - new Date(a.firstSeenAt).getTime());
}

export default async function AdminClientes({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const segmento = isSegmento(params.segmento) ? params.segmento : "todos";
  const q = (params.q ?? "").trim().toLowerCase();
  const canal = params.canal ?? "";
  const orden = params.orden === "vencimiento" || params.orden === "email" ? params.orden : "recientes";

  const now = new Date();
  const todos = await listClientes();
  const counts = countBy(todos, now);
  const canales = [...new Set(todos.map((c) => c.source ?? "sin dato"))].sort();

  const filtrados = sortClientes(
    todos.filter((c) => {
      if (!matchesSegmento(c, segmento, now)) return false;
      if (canal && (c.source ?? "sin dato") !== canal) return false;
      if (q && !(c.email.includes(q) || (c.businessName ?? "").toLowerCase().includes(q))) return false;
      return true;
    }),
    orden
  );

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.page) || 1), totalPages);
  const visibles = filtrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const segActual = SEGMENTOS.find((s) => s.id === segmento)!;

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Clientes"
        subtitle="Quién probó Mercalin, en qué estado está y quién ya compró."
      />

      {/* Segmentos */}
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Segmentos">
        {SEGMENTOS.map((s) => (
          <Link
            key={s.id}
            href={href(params, { segmento: s.id, page: "1" })}
            className={`tag-numbered inline-flex items-center gap-2 border px-3.5 py-2 text-[13px] transition-colors ${
              s.id === segmento
                ? "border-foreground bg-foreground text-white"
                : "border-foreground/25 bg-white text-foreground hover:border-foreground"
            }`}
          >
            {s.label}
            <span
              className={`text-[12px] font-bold tabular-nums ${s.id === segmento ? "text-white/70" : "text-foreground/45"}`}
            >
              {counts[s.id]}
            </span>
          </Link>
        ))}
      </div>

      {/* Búsqueda y filtros */}
      <form method="get" className="mt-4 flex flex-wrap items-end gap-3">
        {segmento !== "todos" && <input type="hidden" name="segmento" value={segmento} />}
        <div className="min-w-[220px] flex-1">
          <label htmlFor="q" className="tag-numbered mb-1.5 block text-[12px] text-foreground/55">
            Buscar
          </label>
          <input id="q" name="q" defaultValue={params.q ?? ""} placeholder="mail o nombre del negocio" className="admin-input" />
        </div>
        <div>
          <label htmlFor="canal" className="tag-numbered mb-1.5 block text-[12px] text-foreground/55">
            Canal
          </label>
          <select id="canal" name="canal" defaultValue={canal} className="admin-input min-w-[160px]">
            <option value="">Todos</option>
            {canales.map((c) => (
              <option key={c} value={c}>
                {c === "sin dato" ? "Sin dato (antes de medir)" : c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="orden" className="tag-numbered mb-1.5 block text-[12px] text-foreground/55">
            Ordenar por
          </label>
          <select id="orden" name="orden" defaultValue={orden} className="admin-input min-w-[170px]">
            <option value="recientes">Más recientes</option>
            <option value="vencimiento">Vencimiento más cercano</option>
            <option value="email">Mail (A-Z)</option>
          </select>
        </div>
        <button type="submit" className="admin-btn admin-btn-dark px-5 py-[0.85rem]">
          Aplicar
        </button>
        {(q || canal || orden !== "recientes" || segmento !== "todos") && (
          <Link href="/admin/clientes" className="admin-btn admin-btn-ghost px-3 py-[0.85rem]">
            Limpiar
          </Link>
        )}
      </form>

      <p className="mt-5 text-[13.5px] text-foreground/55">
        {filtrados.length} {filtrados.length === 1 ? "persona" : "personas"}
        {segmento !== "todos" ? ` · ${segActual.label}` : ""}
      </p>

      {/* Tabla */}
      <div className="admin-card mt-2 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-[14px]">
          <thead>
            <tr className="tag-numbered border-b border-foreground/15 text-[12px] text-foreground/55">
              <th className="px-5 py-3">Cliente</th>
              <th className="py-3 pr-4">Estado</th>
              <th className="py-3 pr-4">Tiempo</th>
              <th className="py-3 pr-4">Empezó la prueba</th>
              <th className="py-3 pr-4">Vence</th>
              <th className="py-3 pr-4">Pagó</th>
              <th className="py-3 pr-4">Canal</th>
              <th className="py-3 pr-5">Última visita web</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.07]">
            {visibles.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-foreground/50">
                  No hay nadie que coincida con estos filtros.
                </td>
              </tr>
            )}
            {visibles.map((c) => {
              const activo = c.estado === "activa" || c.estado === "por_vencer";
              return (
                <tr key={c.email} className="transition-colors hover:bg-foreground/[0.02]">
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/clientes/detalle?email=${encodeURIComponent(c.email)}`}
                      className="font-semibold text-foreground underline-offset-2 hover:text-brand hover:underline"
                    >
                      {c.email}
                    </Link>
                    <p className="text-[12.5px] text-foreground/50">{c.businessName ?? "sin nombre de negocio"}</p>
                    {c.mailProblem && (
                      <p className="text-[12px] font-medium text-brand">
                        {c.mailBounced ? "el mail con su clave rebotó (no le llegó)" : "el mail con su clave no salió"}
                      </p>
                    )}
                    {c.optedOut && <p className="text-[12px] text-foreground/50">pidió no recibir avisos</p>}
                  </td>
                  <td className="py-3.5 pr-4">
                    <EstadoBadge estado={c.estado} />
                  </td>
                  <td className="py-3.5 pr-4 tabular-nums text-foreground/70">
                    {activo
                      ? `quedan ${timeLeft(c.trialExpiresAt, now)}`
                      : c.estado === "vencida"
                        ? `venció ${timeAgo(c.trialExpiresAt, now)}`
                        : "—"}
                  </td>
                  <td className="py-3.5 pr-4 tabular-nums text-foreground/70">{fmtDateTime(c.trialStartedAt)}</td>
                  <td className="py-3.5 pr-4 tabular-nums text-foreground/70">
                    {c.estado === "comprado" ? "no vence" : fmtDateTime(c.trialExpiresAt)}
                  </td>
                  <td className="py-3.5 pr-4 tabular-nums text-foreground/70">
                    {c.estado === "comprado" ? (
                      <>
                        <span className="font-semibold text-accent-green">{fmtArs(c.amountArs)}</span>
                        <span className="block text-[12.5px] text-foreground/50">{fmtDate(c.purchasedAt)}</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3.5 pr-4 text-foreground/70">
                    {c.source ?? "sin dato"}
                    {c.campaign && <span className="block text-[12.5px] text-foreground/50">{c.campaign}</span>}
                  </td>
                  <td className="py-3.5 pr-5 text-foreground/70">{c.lastWebVisit ? timeAgo(c.lastWebVisit, now) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-foreground/15 px-5 py-3">
            <p className="text-[13px] text-foreground/50">
              Página {page} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={href(params, { page: String(page - 1) })}
                aria-disabled={page <= 1}
                className={`admin-btn-icon border border-foreground/20 ${page <= 1 ? "pointer-events-none opacity-25" : ""}`}
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
              </Link>
              <Link
                href={href(params, { page: String(page + 1) })}
                aria-disabled={page >= totalPages}
                className={`admin-btn-icon border border-foreground/20 ${page >= totalPages ? "pointer-events-none opacity-25" : ""}`}
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-foreground/50">
        &ldquo;Última visita web&rdquo; es la última vez que esa persona abrió el sitio. La última actividad dentro de la
        app de escritorio no se puede saber todavía (ver el aviso en Resumen).
      </p>
    </div>
  );
}
