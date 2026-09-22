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
  visitorId: string | null;
  source: string | null;
  campaign: string | null;
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
  visitor_id: string | null;
  source: string | null;
  campaign: string | null;
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
    visitorId: row.visitor_id,
    source: row.source,
    campaign: row.campaign,
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
  visitorId?: string | null;
  source?: string | null;
  campaign?: string | null;
}

export async function createActivation(input: CreateActivationInput): Promise<Activation> {
  const sql = getDb();
  const id = randomUUID();
  await sql`
    INSERT INTO activations (id, email, business_name, product_slug, kind, license_key, expires_at, mp_payment_id, amount_ars, email_sent, visitor_id, source, campaign)
    VALUES (${id}, ${input.email}, ${input.businessName ?? null}, ${input.productSlug}, ${input.kind},
            ${input.licenseKey}, ${input.expiresAt ? input.expiresAt.toISOString() : null},
            ${input.mpPaymentId ?? null}, ${input.amountArs ?? null}, ${input.emailSent ? 1 : 0},
            ${input.visitorId ?? null}, ${input.source ?? null}, ${input.campaign ?? null})
  `;
  const rows = (await sql`SELECT * FROM activations WHERE id = ${id}`) as unknown as ActivationRow[];
  return rowToActivation(rows[0]);
}

export async function setActivationEmailSent(id: string, sent: boolean): Promise<void> {
  const sql = getDb();
  await sql`UPDATE activations SET email_sent = ${sent ? 1 : 0} WHERE id = ${id}`;
}

export async function getActivation(id: string): Promise<Activation | null> {
  const sql = getDb();
  const rows = (await sql`SELECT * FROM activations WHERE id = ${id}`) as unknown as ActivationRow[];
  return rows[0] ? rowToActivation(rows[0]) : null;
}

// Para el soporte manual desde el admin: reemplaza la clave de una activación
// existente por una nueva (misma persona, mismo tipo). En una prueba, esto
// también le da 7 días nuevos desde ahora -- es una decisión deliberada del
// admin, no algo que pueda disparar el propio cliente.
export async function updateActivationLicense(
  id: string,
  licenseKey: string,
  expiresAt: Date | null,
  emailSent: boolean
): Promise<void> {
  const sql = getDb();
  await sql`
    UPDATE activations
    SET license_key = ${licenseKey}, expires_at = ${expiresAt ? expiresAt.toISOString() : null}, email_sent = ${emailSent ? 1 : 0}
    WHERE id = ${id}
  `;
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

