import Link from "next/link";
import { getOverview, parsePeriodo, PERIODOS } from "@/lib/admin-stats";
import { listAdSpend, PLATFORMS, totalAdSpend } from "@/lib/ad-spend";
import { deleteAdSpendAction } from "@/lib/actions/ad-spend";
import AddAdSpendForm from "@/components/admin/AddAdSpendForm";
import { locationLabel, mailTypeLabel } from "@/lib/event-labels";
import { fmtArs, fmtDate, fmtPct } from "@/lib/format";
import { PageHeader, SectionTitle, Tile, BarRow } from "@/components/admin/stats";

export const dynamic = "force-dynamic";

const BOTONES: Record<string, string> = {
  cta_trial_clicked: "Probar gratis",
  cta_buy_clicked: "Comprar",
  cta_detail_clicked: "Ver detalle",
  whatsapp_clicked: "WhatsApp",
};

const PLATAFORMA_LABEL: Record<string, string> = Object.fromEntries(PLATFORMS.map((p) => [p.id, p.label]));

function canalLabel(s: string): string {
  if (s === "sin dato") return "Sin dato (antes de medir)";
  if (s === "directo") return "Directo";
  return s;
}

export default async function AdminMarketing({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  const { dias: diasParam } = await searchParams;
  const dias = parsePeriodo(diasParam);

  const [o, gastos, gastoTotal] = await Promise.all([getOverview(dias), listAdSpend(dias), totalAdSpend(dias)]);
  const maxModulo = Math.max(...o.modules.map((m) => m.visitors), 1);
  const ganancia = o.revenueArs - gastoTotal;
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Marketing"
        subtitle="De dónde viene la gente, qué mira, y cuánto cuesta traerla."
        action={
          <div className="flex" role="group" aria-label="Período">
            {PERIODOS.map((p) => (
              <Link
                key={p}
                href={`/admin/marketing?dias=${p}`}
                className={`admin-btn -ml-px border border-foreground px-4 py-2.5 ${
                  p === dias ? "bg-foreground text-white" : "bg-white text-foreground hover:bg-foreground/5"
                }`}
              >
                {p} días
              </Link>
            ))}
          </div>
        }
      />

      {/* Plata: ingresos vs. publicidad */}
      <SectionTitle note={`Últimos ${dias} días`}>Ingresos vs. publicidad</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="Ingresos" value={fmtArs(o.revenueArs)} tone={o.revenueArs > 0 ? "green" : "ink"} />
        <Tile label="Gastado en publicidad" value={fmtArs(gastoTotal)} />
        <Tile label="Ganancia" value={fmtArs(ganancia)} tone={ganancia > 0 ? "green" : ganancia < 0 ? "red" : "ink"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <AddAdSpendForm today={hoy} />
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/50">
            Cargado a mano: no hay conexión con Facebook ni Google Ads. Cargá lo que gastaste cada día (o cada semana, en
            una sola fila) para poder comparar contra lo que entró.
          </p>
        </div>

        <div className="admin-card overflow-x-auto">
          {gastos.length === 0 ? (
            <p className="p-8 text-center text-[14.5px] text-foreground/50">Todavía no cargaste ningún gasto.</p>
          ) : (
            <table className="w-full min-w-[420px] text-left text-[14px]">
              <thead>
                <tr className="tag-numbered border-b border-foreground/15 text-[12px] text-foreground/55">
                  <th className="px-5 py-3">Fecha</th>
                  <th className="py-3 pr-4">Plataforma</th>
                  <th className="py-3 pr-4 text-right">Monto</th>
                  <th className="py-3 pr-4">Nota</th>
                  <th className="py-3 pr-5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.07]">
                {gastos.map((g) => (
                  <tr key={g.id}>
                    <td className="px-5 py-3 tabular-nums text-foreground/70">{fmtDate(g.spentOn + "T12:00:00")}</td>
                    <td className="py-3 pr-4 font-medium">{PLATAFORMA_LABEL[g.platform] ?? g.platform}</td>
                    <td className="py-3 pr-4 text-right tabular-nums">{fmtArs(g.amountArs)}</td>
                    <td className="py-3 pr-4 text-foreground/60">{g.note ?? "—"}</td>
                    <td className="py-3 pr-5 text-right">
                      <form action={deleteAdSpendAction.bind(null, g.id)}>
                        <button type="submit" className="admin-btn-ghost-danger admin-btn-icon" title="Eliminar">
                          ✕
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Canales */}
      <SectionTitle note="Cómo llegó cada persona la primera vez">De dónde vienen</SectionTitle>
      {o.sources.length === 0 ? (
        <p className="text-[14.5px] text-foreground/60">Todavía no hay datos de canales.</p>
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead>
              <tr className="tag-numbered border-b border-foreground/15 text-[12px] text-foreground/55">
                <th className="px-5 py-3">Canal</th>
                <th className="py-3 pr-4 text-right">Visitantes</th>
                <th className="py-3 pr-4 text-right">Pruebas</th>
                <th className="py-3 pr-4 text-right">Compras</th>
                <th className="py-3 pr-4 text-right">Ingresos</th>
                <th className="py-3 pr-5 text-right">Visita → prueba</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.07]">
              {o.sources.map((s) => (
                <tr key={s.source}>
                  <td className="px-5 py-3 font-medium">
                    <Link href={`/admin?dias=${dias}&canal=${encodeURIComponent(s.source)}`} className="hover:text-brand hover:underline">
                      {canalLabel(s.source)}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums">{s.visitors}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{s.trials}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{s.purchases}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{s.revenue ? fmtArs(s.revenue) : "—"}</td>
                  <td className="py-3 pr-5 text-right tabular-nums">{fmtPct(s.trials, s.visitors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/55">
        Para distinguir una campaña, usá links con etiqueta, por ejemplo:{" "}
        <span className="font-mono text-[12.5px]">mercalinonline.com/?utm_source=instagram&amp;utm_campaign=lanzamiento</span>. Tocá un
        canal para ver el Resumen filtrado solo por ese canal.
      </p>

      {/* Demo */}
      <SectionTitle note="Personas distintas que miraron o abrieron cada módulo">Qué miran de la demo</SectionTitle>
      {o.modules.length === 0 ? (
        <p className="text-[14.5px] text-foreground/60">Todavía no hay datos.</p>
      ) : (
        <div className="admin-card px-5 py-3">
          {o.modules.map((m) => (
            <BarRow key={m.module} label={m.module} sub={m.group || undefined} value={m.visitors} max={maxModulo} />
          ))}
        </div>
      )}

      {/* Botones */}
      <SectionTitle note="Cuántas veces se tocó cada uno">Botones y WhatsApp</SectionTitle>
      {o.buttons.length === 0 ? (
        <p className="text-[14.5px] text-foreground/60">Todavía no hay datos.</p>
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[14px]">
            <thead>
              <tr className="tag-numbered border-b border-foreground/15 text-[12px] text-foreground/55">
                <th className="px-5 py-3">Botón</th>
                <th className="py-3 pr-4">Dónde está</th>
                <th className="py-3 pr-4 text-right">Clics</th>
                <th className="py-3 pr-5 text-right">Personas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.07]">
              {o.buttons.map((b) => (
                <tr key={b.name + b.location}>
                  <td className="px-5 py-3 font-medium">{BOTONES[b.name] ?? b.name}</td>
                  <td className="py-3 pr-4 text-foreground/65">{locationLabel(b.location)}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{b.clicks}</td>
                  <td className="py-3 pr-5 text-right tabular-nums">{b.visitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mails */}
      <SectionTitle note="Lo informa Resend, el servicio que envía los mails">Qué pasó con los mails</SectionTitle>
      {o.mails.length === 0 ? (
        <p className="text-[14.5px] leading-relaxed text-foreground/60">
          Todavía no hay datos de entrega. Aparecen cuando se conecta Resend con el sitio (un paso de una sola vez) y sale el
          próximo mail.
        </p>
      ) : (
        <>
          <div className="admin-card overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[14px]">
              <thead>
                <tr className="tag-numbered border-b border-foreground/15 text-[12px] text-foreground/55">
                  <th className="px-5 py-3">Mail</th>
                  <th className="py-3 pr-4 text-right">Entregados</th>
                  <th className="py-3 pr-4 text-right">Rebotados</th>
                  <th className="py-3 pr-4 text-right">Abiertos</th>
                  <th className="py-3 pr-5 text-right">Con clic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.07]">
                {o.mails.map((m) => (
                  <tr key={m.type}>
                    <td className="px-5 py-3 font-medium">{mailTypeLabel(m.type)}</td>
                    <td className="py-3 pr-4 text-right tabular-nums">{m.delivered}</td>
                    <td className={`py-3 pr-4 text-right tabular-nums ${m.bounced > 0 ? "font-semibold text-brand" : ""}`}>
                      {m.bounced}
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">{m.opened}</td>
                    <td className="py-3 pr-5 text-right tabular-nums">{m.clicked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/55">
            Las aperturas son aproximadas: Apple Mail y algunos programas las esconden o las cuentan de más. Los rebotes y
            las entregas sí son confiables.{" "}
            <Link href="/admin/mails/vista-previa" className="font-medium text-foreground underline underline-offset-2 hover:text-brand">
              Ver cómo se ven los mails →
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
