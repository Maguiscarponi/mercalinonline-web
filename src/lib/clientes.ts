import { getDb } from "./db";
import { listActivations, type Activation } from "./activations";
import { listOptedOutEmails } from "./optout";

// Un "cliente" es una persona (mail), no una fila de activación: puede haber
// pedido la prueba, vuelto a pedirla y después comprado. El estado se calcula
// acá, comparando el vencimiento contra "ahora" — la base no lo guarda.

export type Estado = "comprado" | "activa" | "por_vencer" | "vencida";

export const POR_VENCER_HORAS = 48;

export interface Cliente {
  email: string;
  businessName: string | null;
  estado: Estado;
  // Prueba
  trialStartedAt: string | null;
  trialExpiresAt: string | null;
  // Compra
  purchasedAt: string | null;
  amountArs: number | null;
  // Origen (primer contacto)
  source: string | null;
  campaign: string | null;
  visitorIds: string[];
  // Cuándo apareció por primera vez y si algún mail no salió
  firstSeenAt: string;
  // El mail con su clave no salió (no se pudo enviar) o rebotó (no llegó)
  mailProblem: boolean;
  mailBounced: boolean;
  // Pidió no recibir más los avisos de la prueba
  optedOut: boolean;
  activations: Activation[];
  // Última vez que su navegador vio la web (solo si hay visitor_id)
  lastWebVisit: string | null;
}

export function buildClientes(activations: Activation[], now = new Date()): Cliente[] {
  const byEmail = new Map<string, Activation[]>();
  for (const a of activations) {
    const key = a.email.trim().toLowerCase();
    const list = byEmail.get(key);
    if (list) list.push(a);
    else byEmail.set(key, [a]);
  }

  const clientes: Cliente[] = [];
  for (const [email, acts] of byEmail) {
    // listActivations viene ordenado de más nuevo a más viejo
    const trials = acts.filter((a) => a.kind === "trial");
    const fulls = acts.filter((a) => a.kind === "full");
    const lastTrial = trials[0]; // la más reciente
    const firstTrial = trials[trials.length - 1];
    const purchase = fulls[fulls.length - 1]; // la primera compra

    let estado: Estado;
    if (purchase) {
      estado = "comprado";
    } else if (lastTrial?.expiresAt && new Date(lastTrial.expiresAt).getTime() > now.getTime()) {
      const hoursLeft = (new Date(lastTrial.expiresAt).getTime() - now.getTime()) / 3600000;
      estado = hoursLeft <= POR_VENCER_HORAS ? "por_vencer" : "activa";
    } else {
      estado = "vencida";
    }

    const withOrigin = [...acts].reverse().find((a) => a.source || a.visitorId);
    const businessName = acts.find((a) => a.businessName)?.businessName ?? null;

    clientes.push({
      email,
      businessName,
      estado,
      trialStartedAt: firstTrial?.createdAt ?? null,
      trialExpiresAt: lastTrial?.expiresAt ?? null,
      purchasedAt: purchase?.createdAt ?? null,
      amountArs: purchase?.amountArs ?? null,
      source: withOrigin?.source ?? null,
      campaign: withOrigin?.campaign ?? null,
      visitorIds: [...new Set(acts.map((a) => a.visitorId).filter((v): v is string => !!v))],
      firstSeenAt: acts[acts.length - 1].createdAt,
      mailProblem: acts.some((a) => !a.emailSent),
      mailBounced: false,
      optedOut: false,
      activations: acts,
      lastWebVisit: null,
    });
  }
  return clientes;
}

// Trae la última visita web de cada cliente (por su visitor_id) en una sola consulta.
async function attachLastWebVisit(clientes: Cliente[]): Promise<void> {
  const ids = [...new Set(clientes.flatMap((c) => c.visitorIds))];
  if (!ids.length) return;
  const sql = getDb();
  const rows = (await sql`
    SELECT visitor_id, MAX(created_at) AS last
    FROM events
    WHERE visitor_id IN ${sql(ids)} AND COALESCE(props->>'dev','') <> 'true'
    GROUP BY visitor_id
  `) as unknown as { visitor_id: string; last: Date }[];
  const lastById = new Map(rows.map((r) => [r.visitor_id, new Date(r.last).toISOString()]));
  for (const c of clientes) {
    const dates = c.visitorIds.map((v) => lastById.get(v)).filter((d): d is string => !!d);
    if (dates.length) c.lastWebVisit = dates.sort().at(-1)!;
  }
}

// Mails con la clave que rebotaron y todavía no se reemplazaron por uno
// entregado, y personas que se dieron de baja de los avisos.
async function attachMailStatus(clientes: Cliente[]): Promise<void> {
  const sql = getDb();
  const bounced = (await sql`
    SELECT lower(b.email) AS email FROM events b
    WHERE b.name IN ('email_bounced','email_failed')
      AND b.props->>'type' IN ('trial_license','purchase_license')
      AND COALESCE(b.props->>'dev','') <> 'true'
      AND NOT EXISTS (
        SELECT 1 FROM events d
        WHERE d.name = 'email_delivered' AND lower(d.email) = lower(b.email)
          AND d.props->>'type' IN ('trial_license','purchase_license')
          AND d.created_at > b.created_at
          AND COALESCE(d.props->>'dev','') <> 'true'
      )
    GROUP BY 1
  `) as unknown as { email: string }[];
  const bouncedSet = new Set(bounced.map((r) => r.email));
  const optedOut = await listOptedOutEmails();
  for (const c of clientes) {
    c.mailBounced = bouncedSet.has(c.email);
    c.optedOut = optedOut.has(c.email);
    if (c.mailBounced) c.mailProblem = true;
  }
}

export async function listClientes(): Promise<Cliente[]> {
  const clientes = buildClientes(await listActivations());
  await Promise.all([attachLastWebVisit(clientes), attachMailStatus(clientes)]);
  return clientes;
}

// ── Segmentos: las preguntas que se hacen todos los días ──

export const SEGMENTOS = [
  { id: "todos", label: "Todos" },
  { id: "vencen48", label: "Vencen en 48 hs" },
  { id: "activas", label: "En prueba" },
  { id: "vencidas", label: "Probaron y no compraron" },
  { id: "semana", label: "Nuevos esta semana" },
  { id: "pagos", label: "Clientes que pagaron" },
  { id: "sinmail", label: "Mail con problemas" },
] as const;

export type SegmentoId = (typeof SEGMENTOS)[number]["id"];

export function isSegmento(v: string | undefined): v is SegmentoId {
  return SEGMENTOS.some((s) => s.id === v);
}

export function matchesSegmento(c: Cliente, seg: SegmentoId, now = new Date()): boolean {
  switch (seg) {
    case "todos":
      return true;
    case "vencen48":
      return c.estado === "por_vencer";
    case "activas":
      return c.estado === "activa" || c.estado === "por_vencer";
    case "vencidas":
      return c.estado === "vencida";
    case "semana":
      return now.getTime() - new Date(c.firstSeenAt).getTime() <= 7 * 86400000;
    case "pagos":
      return c.estado === "comprado";
    case "sinmail":
      return c.mailProblem;
  }
}

export function countBy(clientes: Cliente[], now = new Date()): Record<SegmentoId, number> {
  const out = {} as Record<SegmentoId, number>;
  for (const s of SEGMENTOS) out[s.id] = clientes.filter((c) => matchesSegmento(c, s.id, now)).length;
  return out;
}
