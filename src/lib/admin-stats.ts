import { getDb } from "./db";

// Consultas del Resumen del admin. Todas excluyen los eventos marcados como
// desarrollo (props.dev) para que las pruebas locales no ensucien nada.

export const PERIODOS = [7, 30, 90] as const;
export type Periodo = (typeof PERIODOS)[number];

export function parsePeriodo(v: string | undefined): Periodo {
  const n = Number(v);
  return (PERIODOS as readonly number[]).includes(n) ? (n as Periodo) : 30;
}

const TZ = "America/Argentina/Buenos_Aires";

// Pruebas que vencen en las próximas 48 hs y todavía no compraron. Es liviana
// a propósito: la barra lateral la muestra en cada pantalla del admin.
export async function getPorVencerCount(): Promise<number> {
  const sql = getDb();
  const [row] = (await sql`
    SELECT COUNT(DISTINCT lower(t.email))::int AS c
    FROM activations t
    WHERE t.kind = 'trial' AND t.expires_at > now() AND t.expires_at <= now() + interval '48 hours'
      AND NOT EXISTS (SELECT 1 FROM activations f WHERE f.kind = 'full' AND lower(f.email) = lower(t.email))
  `) as unknown as { c: number }[];
  return row?.c ?? 0;
}

export interface Overview {
  dias: number;
  analyticsSince: string | null;
  visitors: number;
  pageViews: number;
  funnel: { visitors: number; demo: number; cta: number; form: number; trials: number; purchases: number };
  revenueArs: number;
  daily: { day: string; visitors: number }[];
  sources: { source: string; visitors: number; trials: number; purchases: number; revenue: number }[];
  modules: { module: string; group: string; visitors: number; interactions: number }[];
  buttons: { name: string; location: string; clicks: number; visitors: number }[];
  devices: { device: string; visitors: number }[];
  cartsAbandoned: { email: string; at: string }[];
  paymentsFailed: number;
  trialToPurchase: { trials: number; converted: number };
  recent: { at: string; name: string; email: string | null; source: string | null; path: string | null; props: Record<string, unknown> | null }[];
}

export async function getOverview(dias: number): Promise<Overview> {
  const sql = getDb();
  const since = sql`now() - make_interval(days => ${dias}::int)`;
  const notDev = sql`COALESCE(props->>'dev','') <> 'true'`;

  const [first] = (await sql`
    SELECT MIN(created_at) AS first FROM events WHERE ${notDev}
  `) as unknown as { first: Date | null }[];

  const [traffic] = (await sql`
    SELECT
      COUNT(DISTINCT visitor_id) FILTER (WHERE name = 'page_view')::int AS visitors,
      COUNT(*) FILTER (WHERE name = 'page_view')::int AS views,
      COUNT(DISTINCT visitor_id) FILTER (WHERE name = 'demo_section_viewed')::int AS demo,
      COUNT(DISTINCT visitor_id) FILTER (WHERE name IN ('cta_trial_clicked','cta_buy_clicked'))::int AS cta,
      COUNT(DISTINCT visitor_id) FILTER (WHERE name IN ('trial_form_started','buy_form_started'))::int AS form
    FROM events
    WHERE created_at >= ${since} AND ${notDev}
  `) as unknown as { visitors: number; views: number; demo: number; cta: number; form: number }[];

  const [acts] = (await sql`
    SELECT
      COUNT(DISTINCT lower(email)) FILTER (WHERE kind = 'trial')::int AS trials,
      COUNT(*) FILTER (WHERE kind = 'full')::int AS purchases,
      COALESCE(SUM(amount_ars) FILTER (WHERE kind = 'full'), 0)::int AS revenue
    FROM activations
    WHERE created_at >= ${since}
  `) as unknown as { trials: number; purchases: number; revenue: number }[];

  const dailyRows = (await sql`
    SELECT to_char((created_at AT TIME ZONE ${TZ})::date, 'YYYY-MM-DD') AS day,
           COUNT(DISTINCT visitor_id)::int AS visitors
    FROM events
    WHERE name = 'page_view' AND created_at >= ${since} AND ${notDev}
    GROUP BY 1 ORDER BY 1
  `) as unknown as { day: string; visitors: number }[];

  // Completa los días sin visitas con 0 para que el gráfico no salte fechas.
  const byDay = new Map(dailyRows.map((r) => [r.day, r.visitors]));
  const daily: { day: string; visitors: number }[] = [];
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toLocaleDateString("en-CA", { timeZone: TZ });
    daily.push({ day: key, visitors: byDay.get(key) ?? 0 });
  }

  const sourceVisitors = (await sql`
    SELECT COALESCE(source, 'sin dato') AS source, COUNT(DISTINCT visitor_id)::int AS visitors
    FROM events WHERE name = 'page_view' AND created_at >= ${since} AND ${notDev}
    GROUP BY 1
  `) as unknown as { source: string; visitors: number }[];

  const sourceActs = (await sql`
    SELECT COALESCE(source, 'sin dato') AS source,
           COUNT(*) FILTER (WHERE kind = 'trial')::int AS trials,
           COUNT(*) FILTER (WHERE kind = 'full')::int AS purchases,
           COALESCE(SUM(amount_ars) FILTER (WHERE kind = 'full'), 0)::int AS revenue
    FROM activations WHERE created_at >= ${since}
    GROUP BY 1
  `) as unknown as { source: string; trials: number; purchases: number; revenue: number }[];

  const sourceMap = new Map<string, Overview["sources"][number]>();
  for (const s of sourceVisitors) sourceMap.set(s.source, { source: s.source, visitors: s.visitors, trials: 0, purchases: 0, revenue: 0 });
  for (const s of sourceActs) {
    const cur = sourceMap.get(s.source) ?? { source: s.source, visitors: 0, trials: 0, purchases: 0, revenue: 0 };
    cur.trials = s.trials;
    cur.purchases = s.purchases;
    cur.revenue = s.revenue;
    sourceMap.set(s.source, cur);
  }
  const sources = [...sourceMap.values()].sort((a, b) => b.visitors + b.trials * 5 - (a.visitors + a.trials * 5));

  const modules = (await sql`
    SELECT COALESCE(props->>'module', '—') AS module,
           COALESCE(MAX(props->>'group'), '') AS "group",
           COUNT(DISTINCT visitor_id)::int AS visitors,
           COUNT(*)::int AS interactions
    FROM events
    WHERE name IN ('demo_module_viewed','demo_capture_opened') AND created_at >= ${since} AND ${notDev}
    GROUP BY 1 ORDER BY visitors DESC, interactions DESC LIMIT 12
  `) as unknown as Overview["modules"];

  const buttons = (await sql`
    SELECT name, COALESCE(props->>'location', '') AS location,
           COUNT(*)::int AS clicks, COUNT(DISTINCT visitor_id)::int AS visitors
    FROM events
    WHERE name IN ('cta_trial_clicked','cta_buy_clicked','cta_detail_clicked','whatsapp_clicked')
      AND created_at >= ${since} AND ${notDev}
    GROUP BY 1, 2 ORDER BY clicks DESC LIMIT 14
  `) as unknown as Overview["buttons"];

  const devices = (await sql`
    SELECT COALESCE(device, 'sin dato') AS device, COUNT(DISTINCT visitor_id)::int AS visitors
    FROM events WHERE name = 'page_view' AND created_at >= ${since} AND ${notDev}
    GROUP BY 1 ORDER BY visitors DESC
  `) as unknown as Overview["devices"];

  // Fueron a pagar y no compraron: gente a la que vale la pena escribirle.
  const cartsAbandoned = (await sql`
    SELECT e.email, MAX(e.created_at) AS at
    FROM events e
    WHERE e.name = 'checkout_started' AND e.email IS NOT NULL
      AND e.created_at >= now() - interval '7 days' AND COALESCE(e.props->>'dev','') <> 'true'
      AND NOT EXISTS (
        SELECT 1 FROM activations a WHERE a.kind = 'full' AND lower(a.email) = lower(e.email)
      )
    GROUP BY e.email ORDER BY MAX(e.created_at) DESC LIMIT 8
  `) as unknown as { email: string; at: Date }[];

  const [failed] = (await sql`
    SELECT COUNT(*)::int AS c FROM events
    WHERE name = 'payment_failed' AND created_at >= now() - interval '7 days' AND ${notDev}
  `) as unknown as { c: number }[];

  // De las personas que pidieron prueba en el período, cuántas terminaron comprando (en cualquier momento).
  const [conv] = (await sql`
    SELECT COUNT(DISTINCT lower(t.email))::int AS trials,
           COUNT(DISTINCT lower(t.email)) FILTER (
             WHERE EXISTS (SELECT 1 FROM activations f WHERE f.kind = 'full' AND lower(f.email) = lower(t.email))
           )::int AS converted
    FROM activations t WHERE t.kind = 'trial' AND t.created_at >= ${since}
  `) as unknown as { trials: number; converted: number }[];

  const recent = (await sql`
    SELECT created_at AS at, name, email, source, path, props
    FROM events
    WHERE name IN ('trial_started','trial_resent','checkout_started','payment_approved','payment_failed','whatsapp_clicked')
      AND ${notDev}
    ORDER BY created_at DESC LIMIT 20
  `) as unknown as { at: Date; name: string; email: string | null; source: string | null; path: string | null; props: Record<string, unknown> | null }[];

  return {
    dias,
    analyticsSince: first?.first ? new Date(first.first).toISOString() : null,
    visitors: traffic.visitors,
    pageViews: traffic.views,
    funnel: {
      visitors: traffic.visitors,
      demo: traffic.demo,
      cta: traffic.cta,
      form: traffic.form,
      trials: acts.trials,
      purchases: acts.purchases,
    },
    revenueArs: acts.revenue,
    daily,
    sources,
    modules,
    buttons,
    devices,
    cartsAbandoned: cartsAbandoned.map((c) => ({ email: c.email, at: new Date(c.at).toISOString() })),
    paymentsFailed: failed.c,
    trialToPurchase: conv,
    recent: recent.map((r) => ({ ...r, at: new Date(r.at).toISOString() })),
  };
}

// Recorrido de un cliente: todo lo que se sabe de su mail y de los navegadores
// (visitor_id) desde los que pidió la prueba o compró — incluye lo que hizo
// ANTES de dejar su mail.
export async function getClienteTimeline(email: string, visitorIds: string[]) {
  const sql = getDb();
  const rows = (await sql`
    SELECT created_at AS at, name, path, source, props
    FROM events
    WHERE (lower(email) = ${email.toLowerCase()} ${visitorIds.length ? sql`OR visitor_id IN ${sql(visitorIds)}` : sql``})
      AND COALESCE(props->>'dev','') <> 'true'
    ORDER BY created_at ASC LIMIT 300
  `) as unknown as { at: Date; name: string; path: string | null; source: string | null; props: Record<string, unknown> | null }[];
  return rows.map((r) => ({ ...r, at: new Date(r.at).toISOString() }));
}
