import { randomUUID } from "node:crypto";
import { getDb } from "./db";

export type ActivationKind = "trial" | "full";

export interface Activation {
  id: string;
  email: string;
  businessName: string | null;
  productSlug: string;
  kind: ActivationKind;
  licenseKey: string;
  expiresAt: string | null;
  mpPaymentId: string | null;
  amountArs: number | null;
  emailSent: boolean;
  reminder3Sent: boolean;
  reminderExpirySent: boolean;
  expiredSent: boolean;
  createdAt: string;
}

interface ActivationRow {
  id: string;
  email: string;
  business_name: string | null;
  product_slug: string;
  kind: string;
  license_key: string;
  expires_at: string | null;
  mp_payment_id: string | null;
  amount_ars: number | null;
  email_sent: number;
  reminder3_sent: number;
  reminder_expiry_sent: number;
  expired_sent: number;
  created_at: string;
}

function rowToActivation(row: ActivationRow): Activation {
  return {
    id: row.id,
    email: row.email,
    businessName: row.business_name,
    productSlug: row.product_slug,
    kind: row.kind as ActivationKind,
    licenseKey: row.license_key,
    expiresAt: row.expires_at,
    mpPaymentId: row.mp_payment_id,
    amountArs: row.amount_ars,
    emailSent: row.email_sent === 1,
    reminder3Sent: row.reminder3_sent === 1,
    reminderExpirySent: row.reminder_expiry_sent === 1,
    expiredSent: row.expired_sent === 1,
    createdAt: row.created_at,
  };
}

export interface CreateActivationInput {
  email: string;
  businessName?: string | null;
  productSlug: string;
  kind: ActivationKind;
  licenseKey: string;
  expiresAt?: Date | null;
  mpPaymentId?: string | null;
  amountArs?: number | null;
  emailSent: boolean;
}

export async function createActivation(input: CreateActivationInput): Promise<Activation> {
  const sql = getDb();
  const id = randomUUID();
  await sql`
    INSERT INTO activations (id, email, business_name, product_slug, kind, license_key, expires_at, mp_payment_id, amount_ars, email_sent)
    VALUES (${id}, ${input.email}, ${input.businessName ?? null}, ${input.productSlug}, ${input.kind},
            ${input.licenseKey}, ${input.expiresAt ? input.expiresAt.toISOString() : null},
            ${input.mpPaymentId ?? null}, ${input.amountArs ?? null}, ${input.emailSent ? 1 : 0})
  `;
  const rows = (await sql`SELECT * FROM activations WHERE id = ${id}`) as unknown as ActivationRow[];
  return rowToActivation(rows[0]);
}

export async function setActivationEmailSent(id: string, sent: boolean): Promise<void> {
  const sql = getDb();
  await sql`UPDATE activations SET email_sent = ${sent ? 1 : 0} WHERE id = ${id}`;
}

// Evita que un mismo mail junte pruebas gratis infinitas: si ya tiene una
// activación "trial" de este producto que todavía no venció, se reusa esa
// en vez de generar una licencia nueva (ver src/app/api/trial/route.ts).
export async function findActiveTrialActivation(
  email: string,
  productSlug: string
): Promise<Activation | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM activations
    WHERE lower(email) = ${email.trim().toLowerCase()}
      AND product_slug = ${productSlug}
      AND kind = 'trial'
      AND expires_at IS NOT NULL
      AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1
  `) as unknown as ActivationRow[];
  return rows[0] ? rowToActivation(rows[0]) : null;
}

export async function listActivations(): Promise<Activation[]> {
  const sql = getDb();
  const rows = (await sql`SELECT * FROM activations ORDER BY created_at DESC`) as unknown as ActivationRow[];
  return rows.map(rowToActivation);
}

export const ACTIVATIONS_PAGE_SIZE = 20;

export interface ActivationsPage {
  items: Activation[];
  page: number;
  totalPages: number;
  total: number;
}

export async function listActivationsPage(page: number): Promise<ActivationsPage> {
  const sql = getDb();
  const [{ total }] = (await sql`SELECT COUNT(*)::int as total FROM activations`) as unknown as [{ total: number }];
  const totalPages = Math.max(1, Math.ceil(total / ACTIVATIONS_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const rows = (await sql`
    SELECT * FROM activations ORDER BY created_at DESC
    LIMIT ${ACTIVATIONS_PAGE_SIZE} OFFSET ${(safePage - 1) * ACTIVATIONS_PAGE_SIZE}
  `) as unknown as ActivationRow[];
  return { items: rows.map(rowToActivation), page: safePage, totalPages, total };
}

// ── Secuencia de emails del trial (ver src/app/api/cron/trial-emails/route.ts) ──
// Cada consulta trae solo lo que todavía no recibió ESE email puntual, así el
// cron puede correr todos los días sin mandar nada duplicado.

export async function listTrialsNeedingDay3Reminder(): Promise<Activation[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM activations
    WHERE kind = 'trial'
      AND reminder3_sent = 0
      AND expires_at > now()
      AND created_at <= now() - interval '3 days'
  `) as unknown as ActivationRow[];
  return rows.map(rowToActivation);
}

export async function listTrialsNeedingExpiryReminder(): Promise<Activation[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM activations
    WHERE kind = 'trial'
      AND reminder_expiry_sent = 0
      AND expires_at > now()
      AND expires_at <= now() + interval '1 day'
  `) as unknown as ActivationRow[];
  return rows.map(rowToActivation);
}

export async function listTrialsNeedingExpiredEmail(): Promise<Activation[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM activations
    WHERE kind = 'trial'
      AND expired_sent = 0
      AND expires_at <= now()
  `) as unknown as ActivationRow[];
  return rows.map(rowToActivation);
}

export async function markReminder3Sent(id: string): Promise<void> {
  const sql = getDb();
  await sql`UPDATE activations SET reminder3_sent = 1 WHERE id = ${id}`;
}

export async function markReminderExpirySent(id: string): Promise<void> {
  const sql = getDb();
  await sql`UPDATE activations SET reminder_expiry_sent = 1 WHERE id = ${id}`;
}

export async function markExpiredSent(id: string): Promise<void> {
  const sql = getDb();
  await sql`UPDATE activations SET expired_sent = 1 WHERE id = ${id}`;
}

export interface ActivationStats {
  totalTrials: number;
  totalSales: number;
  revenueArs: number;
  last30DaysActivations: number;
}

export async function getActivationStats(): Promise<ActivationStats> {
  const sql = getDb();
  const [{ totalTrials }] = (await sql`
    SELECT COUNT(*)::int as "totalTrials" FROM activations WHERE kind = 'trial'
  `) as unknown as [{ totalTrials: number }];
  const [{ totalSales }] = (await sql`
    SELECT COUNT(*)::int as "totalSales" FROM activations WHERE kind = 'full'
  `) as unknown as [{ totalSales: number }];
  const [{ revenueArs }] = (await sql`
    SELECT COALESCE(SUM(amount_ars), 0)::int as "revenueArs" FROM activations WHERE kind = 'full'
  `) as unknown as [{ revenueArs: number }];
  const [{ last30DaysActivations }] = (await sql`
    SELECT COUNT(*)::int as "last30DaysActivations" FROM activations WHERE created_at >= now() - interval '30 days'
  `) as unknown as [{ last30DaysActivations: number }];
  return { totalTrials, totalSales, revenueArs, last30DaysActivations };
}
