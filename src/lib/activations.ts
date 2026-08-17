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

export function createActivation(input: CreateActivationInput): Activation {
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO activations (id, email, business_name, product_slug, kind, license_key, expires_at, mp_payment_id, amount_ars, email_sent)
       VALUES (@id, @email, @business_name, @product_slug, @kind, @license_key, @expires_at, @mp_payment_id, @amount_ars, @email_sent)`
    )
    .run({
      id,
      email: input.email,
      business_name: input.businessName ?? null,
      product_slug: input.productSlug,
      kind: input.kind,
      license_key: input.licenseKey,
      expires_at: input.expiresAt ? input.expiresAt.toISOString() : null,
      mp_payment_id: input.mpPaymentId ?? null,
      amount_ars: input.amountArs ?? null,
      email_sent: input.emailSent ? 1 : 0,
    });
  const row = getDb().prepare("SELECT * FROM activations WHERE id = ?").get(id) as ActivationRow;
  return rowToActivation(row);
}

export function listActivations(): Activation[] {
  const rows = getDb().prepare("SELECT * FROM activations ORDER BY created_at DESC").all() as ActivationRow[];
  return rows.map(rowToActivation);
}

export const ACTIVATIONS_PAGE_SIZE = 20;

export interface ActivationsPage {
  items: Activation[];
  page: number;
  totalPages: number;
  total: number;
}

export function listActivationsPage(page: number): ActivationsPage {
  const db = getDb();
  const { total } = db.prepare("SELECT COUNT(*) as total FROM activations").get() as { total: number };
  const totalPages = Math.max(1, Math.ceil(total / ACTIVATIONS_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const rows = db
    .prepare("SELECT * FROM activations ORDER BY created_at DESC LIMIT ? OFFSET ?")
    .all(ACTIVATIONS_PAGE_SIZE, (safePage - 1) * ACTIVATIONS_PAGE_SIZE) as ActivationRow[];
  return { items: rows.map(rowToActivation), page: safePage, totalPages, total };
}

export interface ActivationStats {
  totalTrials: number;
  totalSales: number;
  revenueArs: number;
  last30DaysActivations: number;
}

export function getActivationStats(): ActivationStats {
  const db = getDb();
  const { totalTrials } = db
    .prepare("SELECT COUNT(*) as totalTrials FROM activations WHERE kind = 'trial'")
    .get() as { totalTrials: number };
  const { totalSales } = db
    .prepare("SELECT COUNT(*) as totalSales FROM activations WHERE kind = 'full'")
    .get() as { totalSales: number };
  const { revenueArs } = db
    .prepare("SELECT COALESCE(SUM(amount_ars), 0) as revenueArs FROM activations WHERE kind = 'full'")
    .get() as { revenueArs: number };
  const { last30DaysActivations } = db
    .prepare("SELECT COUNT(*) as last30DaysActivations FROM activations WHERE created_at >= datetime('now', '-30 days')")
    .get() as { last30DaysActivations: number };
  return { totalTrials, totalSales, revenueArs, last30DaysActivations };
}
