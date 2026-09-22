import { getDb } from "./db";

// Consultas del panel admin. Todas excluyen los eventos marcados como
// desarrollo (props.dev) para que las pruebas locales no ensucien nada.
//
// Las de getOverview corren en paralelo, no una atrás de otra: son ~15
// consultas de solo lectura sin dependencias entre sí, así que esperar a que
// terminen todas a la vez tarda lo que tarda la más lenta, no la suma de
// todas. PERO lanzarlas todas juntas (15 conexiones de golpe) hacía que el
// pooler de Supabase matara algunas por statement_timeout apenas había algo
// de carga -- pedirle 15 conexiones simultáneas a un pooler compartido es
// justo lo que puede "colapsar" el panel con tráfico de verdad. runLimited
// las manda de a POOL_CONCURRENCY, así se sigue esperando por la más lenta
// del lote (no por la suma) pero nunca se piden más conexiones a la vez de
// las que el pooler entrega rápido.
const POOL_CONCURRENCY = 4;

async function runLimited<T>(tasks: (() => Promise<T>)[], limit: number, signal: { aborted: boolean }): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length && !signal.aborted) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}

// Si la base está saturada (mucho tráfico a la vez) preferimos que el
// Resumen muestre "no se pudo cargar, reintentá" en unos segundos, no que
// se quede colgado sin responder nunca -- eso sí que se sentiría "colapsado".
const OVERVIEW_TIMEOUT_MS = 12_000;

type Cancellable = { cancel?: () => void };

// Al vencer el timeout no alcanza con dejar de esperar la promesa: si la
// query real sigue viva del lado de Postgres, se queda ocupando una de las
// `max` conexiones del pool para siempre y la próxima visita ya tiene una
// menos disponible -- con suficientes timeouts el pool se termina vaciando
// solo. onTimeout cancela lo que haya quedado en vuelo para que esa conexión
// vuelva al pool.
function withTimeout<T>(p: Promise<T>, ms: number, message: string, onTimeout: () => void): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      onTimeout();
      reject(new Error(message));
    }, ms);
    p.then(
      (r) => {
        clearTimeout(timer);
        resolve(r);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

export const PERIODOS = [7, 30, 90] as const;
export type Periodo = (typeof PERIODOS)[number];

export function parsePeriodo(v: string | undefined): Periodo {
  const n = Number(v);
  return (PERIODOS as readonly number[]).includes(n) ? (n as Periodo) : 30;
}

// "todos" = sin filtrar. Cualquier otro valor tiene que ser uno de los
// canales que devolvió getOverview (se valida contra esa lista en la page,
// no acá, porque la lista de canales válidos depende de los datos).
export function parseCanal(v: string | undefined): string {
  return v && v.trim() ? v.trim() : "todos";
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
  canal: string;
  analyticsSince: string | null;
  visitors: number;
  pageViews: number;
  funnel: { visitors: number; demo: number; cta: number; form: number; trials: number; purchases: number };
  revenueArs: number;
  adSpendArs: number;
  daily: { day: string; visitors: number }[];
  sources: { source: string; visitors: number; trials: number; purchases: number; revenue: number }[];
  modules: { module: string; group: string; visitors: number; interactions: number }[];
  buttons: { name: string; location: string; clicks: number; visitors: number }[];
  devices: { device: string; visitors: number }[];
  cartsAbandoned: { email: string; at: string }[];
  paymentsFailed: number;
  mails: { type: string; delivered: number; bounced: number; opened: number; clicked: number }[];
  bouncedLicenses: { email: string; at: string }[];
  trialToPurchase: { trials: number; converted: number };
}

export async function getOverview(dias: number, canal = "todos"): Promise<Overview> {
  const sql = getDb();
  // Fragmentos como funciones, no como objetos compartidos: pasarle el MISMO
  // fragmento de postgres.js a muchas queries que corren en paralelo (este
  // Promise.all dispara 15 a la vez) hacía que dos de ellas nunca resolvieran
  // -- la librería no soporta reusar una instancia de fragmento entre queries
  // concurrentes. Cada llamada de abajo genera un fragmento nuevo.
  const since = () => sql`now() - make_interval(days => ${dias}::int)`;
  const notDev = () => sql`COALESCE(props->>'dev','') <> 'true'`;
  // Sin filtro de canal, o con AND source = 'x'/AND source IS NULL según lo
  // que haya elegido (los eventos sin canal quedan agrupados como "sin dato").
  const bySource = () =>
    canal === "todos"
      ? sql``
      : canal === "sin dato"
        ? sql`AND source IS NULL`
        : sql`AND source = ${canal}`;
  const bySourceActs = bySource;

  const inFlight: Cancellable[] = [];
  const abortSignal = { aborted: false };
  // tm registra cada query en inFlight (para poder cancelarla si el
  // resumen entero se pasa de tiempo) -- no hace nada más con el label,
  // pero se mantiene como parámetro para que quede claro qué es cada una.
  const tm = <T,>(_label: string, run: () => Promise<T>): (() => Promise<T>) =>
    () => {
      const q = run();
      inFlight.push(q as unknown as Cancellable);
      return q;
    };

  // Correrlas todas a la vez (15 conexiones de golpe) hacía que el pooler de
  // Supabase matara algunas por statement_timeout bajo carga -- exactamente
  // el "se colapsa con mucho tráfico" que había que evitar. runLimited las
  // manda de a POOL_CONCURRENCY para no pedir más conexiones que las que el
  // pooler entrega rápido, sin volver secuencial todo el resumen.
  const [
    [first],
    [traffic],
    [acts],
    dailyRows,
    sourceVisitors,
    sourceActs,
    modules,
    buttons,
    devices,
    cartsAbandoned,
    [failed],
    mails,
    bouncedLicenses,
    [conv],
    adSpend,
  ] = (await withTimeout(
    runLimited<unknown>(
      [
      tm("q1_first", () => sql`SELECT MIN(created_at) AS first FROM events WHERE ${notDev()}` as unknown as Promise<{ first: Date | null }[]>),
    tm("q2_traffic", () => sql`
      SELECT
        COUNT(DISTINCT visitor_id) FILTER (WHERE name = 'page_view')::int AS visitors,
        COUNT(*) FILTER (WHERE name = 'page_view')::int AS views,
        COUNT(DISTINCT visitor_id) FILTER (WHERE name = 'demo_section_viewed')::int AS demo,
        COUNT(DISTINCT visitor_id) FILTER (WHERE name IN ('cta_trial_clicked','cta_buy_clicked'))::int AS cta,
        COUNT(DISTINCT visitor_id) FILTER (WHERE name IN ('trial_form_started','buy_form_started'))::int AS form
      FROM events
      WHERE created_at >= ${since()} AND ${notDev()} ${bySource()}
    ` as unknown as Promise<{ visitors: number; views: number; demo: number; cta: number; form: number }[]>),
    tm("q3_acts", () => sql`
      SELECT
        COUNT(DISTINCT lower(email)) FILTER (WHERE kind = 'trial')::int AS trials,
        COUNT(*) FILTER (WHERE kind = 'full')::int AS purchases,
        COALESCE(SUM(amount_ars) FILTER (WHERE kind = 'full'), 0)::int AS revenue
      FROM activations
      WHERE created_at >= ${since()} ${bySourceActs()}
    ` as unknown as Promise<{ trials: number; purchases: number; revenue: number }[]>),
    tm("q4_daily", () => sql`
      SELECT to_char((created_at AT TIME ZONE ${TZ})::date, 'YYYY-MM-DD') AS day,
             COUNT(DISTINCT visitor_id)::int AS visitors
      FROM events
      WHERE name = 'page_view' AND created_at >= ${since()} AND ${notDev()} ${bySource()}
      GROUP BY 1 ORDER BY 1
    ` as unknown as Promise<{ day: string; visitors: number }[]>),
    tm("q5_sourceVisitors", () => sql`
      SELECT COALESCE(source, 'sin dato') AS source, COUNT(DISTINCT visitor_id)::int AS visitors
      FROM events WHERE name = 'page_view' AND created_at >= ${since()} AND ${notDev()}
      GROUP BY 1
    ` as unknown as Promise<{ source: string; visitors: number }[]>),
    tm("q6_sourceActs", () => sql`
      SELECT COALESCE(source, 'sin dato') AS source,
             COUNT(*) FILTER (WHERE kind = 'trial')::int AS trials,
             COUNT(*) FILTER (WHERE kind = 'full')::int AS purchases,
             COALESCE(SUM(amount_ars) FILTER (WHERE kind = 'full'), 0)::int AS revenue
      FROM activations WHERE created_at >= ${since()}
      GROUP BY 1
    ` as unknown as Promise<{ source: string; trials: number; purchases: number; revenue: number }[]>),
    tm("q7_modules", () => sql`
      SELECT COALESCE(props->>'module', '—') AS module,
             COALESCE(MAX(props->>'group'), '') AS "group",
             COUNT(DISTINCT visitor_id)::int AS visitors,
             COUNT(*)::int AS interactions
      FROM events
      WHERE name IN ('demo_module_viewed','demo_capture_opened') AND created_at >= ${since()} AND ${notDev()} ${bySource()}
      GROUP BY 1 ORDER BY visitors DESC, interactions DESC LIMIT 12
    ` as unknown as Promise<Overview["modules"]>),
    tm("q8_buttons", () => sql`
      SELECT name, COALESCE(props->>'location', '') AS location,
             COUNT(*)::int AS clicks, COUNT(DISTINCT visitor_id)::int AS visitors
      FROM events
      WHERE name IN ('cta_trial_clicked','cta_buy_clicked','cta_detail_clicked','whatsapp_clicked')
        AND created_at >= ${since()} AND ${notDev()} ${bySource()}
      GROUP BY 1, 2 ORDER BY clicks DESC LIMIT 14
    ` as unknown as Promise<Overview["buttons"]>),
    tm("q9_devices", () => sql`
      SELECT COALESCE(device, 'sin dato') AS device, COUNT(DISTINCT visitor_id)::int AS visitors
      FROM events WHERE name = 'page_view' AND created_at >= ${since()} AND ${notDev()} ${bySource()}
      GROUP BY 1 ORDER BY visitors DESC
    ` as unknown as Promise<Overview["devices"]>),
    // Fueron a pagar y no compraron: gente a la que vale la pena escribirle.
    tm("q10_cartsAbandoned", () => sql`
      SELECT e.email, MAX(e.created_at) AS at
      FROM events e
      WHERE e.name = 'checkout_started' AND e.email IS NOT NULL
        AND e.created_at >= now() - interval '7 days' AND COALESCE(e.props->>'dev','') <> 'true'
        AND NOT EXISTS (
          SELECT 1 FROM activations a WHERE a.kind = 'full' AND lower(a.email) = lower(e.email)
        )
      GROUP BY e.email ORDER BY MAX(e.created_at) DESC LIMIT 8
    ` as unknown as Promise<{ email: string; at: Date }[]>),
    tm("q11_failed", () => sql`
      SELECT COUNT(*)::int AS c FROM events
      WHERE name = 'payment_failed' AND created_at >= now() - interval '7 days' AND ${notDev()}
    ` as unknown as Promise<{ c: number }[]>),
    // Qué pasó con cada tipo de mail (lo informa Resend por webhook).
    tm("q12_mails", () => sql`
      SELECT COALESCE(props->>'type', 'otro') AS type,
             COUNT(*) FILTER (WHERE name = 'email_delivered')::int AS delivered,
             COUNT(*) FILTER (WHERE name IN ('email_bounced','email_failed'))::int AS bounced,
             COUNT(DISTINCT props->>'email_id') FILTER (WHERE name = 'email_opened')::int AS opened,
             COUNT(DISTINCT props->>'email_id') FILTER (WHERE name = 'email_clicked')::int AS clicked
      FROM events
      WHERE name IN ('email_delivered','email_bounced','email_failed','email_opened','email_clicked')
        AND created_at >= ${since()} AND ${notDev()}
      GROUP BY 1 ORDER BY delivered DESC
    ` as unknown as Promise<Overview["mails"]>),
    // Gente cuyo mail con la clave rebotó y todavía no recibió uno entregado:
    // sin escribirles no pueden activar Mercalin.
    tm("q13_bouncedLicenses", () => sql`
      SELECT lower(b.email) AS email, MAX(b.created_at) AS at
      FROM events b
      WHERE b.name IN ('email_bounced','email_failed') AND b.email IS NOT NULL
        AND b.props->>'type' IN ('trial_license','purchase_license')
        AND b.created_at >= now() - interval '14 days' AND COALESCE(b.props->>'dev','') <> 'true'
        AND NOT EXISTS (
          SELECT 1 FROM events d
          WHERE d.name = 'email_delivered' AND lower(d.email) = lower(b.email)
            AND d.props->>'type' IN ('trial_license','purchase_license') AND d.created_at > b.created_at
            AND COALESCE(d.props->>'dev','') <> 'true'
        )
      GROUP BY 1 ORDER BY MAX(b.created_at) DESC LIMIT 8
    ` as unknown as Promise<{ email: string; at: Date }[]>),
    // De las personas que pidieron prueba en el período, cuántas terminaron comprando (en cualquier momento).
    tm("q14_conv", () => sql`
      SELECT COUNT(DISTINCT lower(t.email))::int AS trials,
             COUNT(DISTINCT lower(t.email)) FILTER (
               WHERE EXISTS (SELECT 1 FROM activations f WHERE f.kind = 'full' AND lower(f.email) = lower(t.email))
             )::int AS converted
      FROM activations t WHERE t.kind = 'trial' AND t.created_at >= ${since()} ${bySourceActs()}
    ` as unknown as Promise<{ trials: number; converted: number }[]>),
      tm("q15_adSpend", () => sql`
        SELECT COALESCE(SUM(amount_ars), 0)::int AS total FROM ad_spend
        WHERE spent_on >= (now() - make_interval(days => ${dias}::int))::date
      ` as unknown as Promise<{ total: number }[]>),
      ],
      POOL_CONCURRENCY,
      abortSignal
    ),
    OVERVIEW_TIMEOUT_MS,
    "El resumen tardó demasiado en cargar -- probá de nuevo en unos segundos.",
    () => {
      abortSignal.aborted = true;
      for (const q of inFlight) q.cancel?.();
    }
  )) as unknown as [
    { first: Date | null }[],
    { visitors: number; views: number; demo: number; cta: number; form: number }[],
    { trials: number; purchases: number; revenue: number }[],
    { day: string; visitors: number }[],
    { source: string; visitors: number }[],
    { source: string; trials: number; purchases: number; revenue: number }[],
    Overview["modules"],
    Overview["buttons"],
    Overview["devices"],
    { email: string; at: Date }[],
    { c: number }[],
    Overview["mails"],
    { email: string; at: Date }[],
    { trials: number; converted: number }[],
    { total: number }[],
  ];

  // Completa los días sin visitas con 0 para que el gráfico no salte fechas.
  const byDay = new Map(dailyRows.map((r) => [r.day, r.visitors]));
  const daily: { day: string; visitors: number }[] = [];
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toLocaleDateString("en-CA", { timeZone: TZ });
    daily.push({ day: key, visitors: byDay.get(key) ?? 0 });
  }

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

  return {
    dias,
    canal,
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
    adSpendArs: adSpend[0]?.total ?? 0,
    daily,
    sources,
    modules,
    buttons,
    devices,
    cartsAbandoned: cartsAbandoned.map((c) => ({ email: c.email, at: new Date(c.at).toISOString() })),
    paymentsFailed: failed.c,
    mails,
    bouncedLicenses: bouncedLicenses.map((b) => ({ email: b.email, at: new Date(b.at).toISOString() })),
    trialToPurchase: conv,
  };
}

// ── Actividad: página propia, paginada y filtrable por tipo de evento, para
// que el Resumen no tenga que cargar (ni mostrar) todo esto de entrada. ──

export const TIPOS_ACTIVIDAD = [
  "trial_started",
  "trial_resent",
  "checkout_started",
  "payment_approved",
  "payment_failed",
  "whatsapp_clicked",
] as const;
export type TipoActividad = (typeof TIPOS_ACTIVIDAD)[number];

export function parseTipoActividad(v: string | undefined): TipoActividad | "todos" {
  return v && (TIPOS_ACTIVIDAD as readonly string[]).includes(v) ? (v as TipoActividad) : "todos";
}

export const ACTIVIDAD_PAGE_SIZE = 30;

export interface ActividadRow {
  at: string;
  name: string;
  email: string | null;
  source: string | null;
  path: string | null;
  props: Record<string, unknown> | null;
}

export async function getActividad(
  tipo: TipoActividad | "todos",
  page: number
): Promise<{ rows: ActividadRow[]; total: number; page: number; pageSize: number }> {
  const sql = getDb();
  const notDev = () => sql`COALESCE(props->>'dev','') <> 'true'`;
  const tipos = tipo === "todos" ? TIPOS_ACTIVIDAD : [tipo];
  const offset = Math.max(0, page - 1) * ACTIVIDAD_PAGE_SIZE;

  const [rows, [{ c: total }]] = await Promise.all([
    sql`
      SELECT created_at AS at, name, email, source, path, props
      FROM events
      WHERE name IN ${sql(tipos)} AND ${notDev()}
      ORDER BY created_at DESC
      LIMIT ${ACTIVIDAD_PAGE_SIZE} OFFSET ${offset}
    ` as unknown as Promise<{ at: Date; name: string; email: string | null; source: string | null; path: string | null; props: Record<string, unknown> | null }[]>,
    sql`
      SELECT COUNT(*)::int AS c FROM events WHERE name IN ${sql(tipos)} AND ${notDev()}
    ` as unknown as Promise<{ c: number }[]>,
  ]);

  return {
    rows: rows.map((r) => ({ ...r, at: new Date(r.at).toISOString() })),
    total,
    page: Math.max(1, page),
    pageSize: ACTIVIDAD_PAGE_SIZE,
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
