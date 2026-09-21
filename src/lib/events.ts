import { getDb } from "./db";

// Analítica propia. Los eventos del navegador entran por /api/track (solo
// los nombres de CLIENT_EVENTS); los de negocio los registra el servidor
// con recordEvent() al pasar algo real (prueba iniciada, pago aprobado…).

export const CLIENT_EVENTS = new Set([
  "page_view",
  "cta_trial_clicked",
  "cta_buy_clicked",
  "cta_detail_clicked",
  "whatsapp_clicked",
  "hero_demo_tab_clicked",
  "demo_section_viewed",
  "demo_module_viewed",
  "demo_capture_opened",
  "pricing_viewed",
  "trial_form_started",
  "buy_form_started",
]);

export const SERVER_EVENTS = [
  "trial_started",
  "trial_resent",
  "checkout_started",
  "payment_approved",
  "payment_failed",
  "email_day3_sent",
  "email_expiring_sent",
  "email_expired_sent",
  "email_delivered",
  "email_bounced",
  "email_complained",
  "email_opened",
  "email_clicked",
  "email_failed",
  "email_delayed",
  "unsubscribed",
] as const;

export function clip(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().slice(0, max);
  return t || null;
}

const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python-requests|facebookexternalhit|whatsapp/i;

export function isBot(userAgent: string | null): boolean {
  return !userAgent || BOT_RE.test(userAgent);
}

export interface RecordEventInput {
  name: string;
  visitorId?: string | null;
  sessionId?: string | null;
  email?: string | null;
  path?: string | null;
  referrer?: string | null;
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  device?: string | null;
  props?: Record<string, unknown>;
}

// Nunca tira error hacia afuera: si la analítica falla, el trial o el pago
// que la disparó tienen que seguir funcionando igual.
//
// En desarrollo local no registra nada (el dev server apunta a la misma
// base que producción y ensuciaría las métricas reales); con ANALYTICS_DEV=1
// registra igual pero marcando props.dev=true para poder borrarlo/filtrarlo.
export async function recordEvent(input: RecordEventInput): Promise<void> {
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev && !process.env.ANALYTICS_DEV) return;

  try {
    const sql = getDb();
    const props: Record<string, unknown> = { ...(input.props ?? {}) };
    if (isDev) props.dev = true;
    const safeProps = JSON.stringify(props).length > 1000 ? {} : props;

    await sql`
      INSERT INTO events (name, visitor_id, session_id, email, path, referrer, source, medium, campaign, device, props)
      VALUES (
        ${input.name},
        ${clip(input.visitorId, 64)},
        ${clip(input.sessionId, 64)},
        ${clip(input.email, 200)},
        ${clip(input.path, 300)},
        ${clip(input.referrer, 200)},
        ${clip(input.source, 100)},
        ${clip(input.medium, 100)},
        ${clip(input.campaign, 100)},
        ${clip(input.device, 20)},
        ${sql.json(safeProps as Parameters<typeof sql.json>[0])}
      )
    `;
  } catch (err) {
    console.error("[events] no se pudo registrar el evento", input.name, err);
  }
}
