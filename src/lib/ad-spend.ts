import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import type { Platform } from "./ad-spend-platforms";

export type { Platform };
export { PLATFORMS } from "./ad-spend-platforms";

// Gasto en publicidad, cargado a mano (no hay integración con Meta Ads ni
// Google Ads). Sirve para comparar contra los ingresos del mismo período:
// ganancia real, costo por prueba, costo por compra. Ver /admin/marketing.
// El tipo Platform y la lista PLATFORMS viven en ad-spend-platforms.ts, sin
// dependencias de servidor, para que el formulario (Client Component) los
// pueda importar sin arrastrar el driver de Postgres al navegador.

export interface AdSpend {
  id: string;
  spentOn: string; // fecha (YYYY-MM-DD)
  platform: Platform;
  amountArs: number;
  note: string | null;
  createdAt: string;
}

interface Row {
  id: string;
  spent_on: string;
  platform: string;
  amount_ars: number;
  note: string | null;
  created_at: string;
}

function toAdSpend(r: Row): AdSpend {
  return { id: r.id, spentOn: r.spent_on, platform: r.platform as Platform, amountArs: r.amount_ars, note: r.note, createdAt: r.created_at };
}

export async function listAdSpend(dias: number): Promise<AdSpend[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM ad_spend
    WHERE spent_on >= (now() - make_interval(days => ${dias}::int))::date
    ORDER BY spent_on DESC, created_at DESC
  `) as unknown as Row[];
  return rows.map(toAdSpend);
}

export async function totalAdSpend(dias: number): Promise<number> {
  const sql = getDb();
  const [row] = (await sql`
    SELECT COALESCE(SUM(amount_ars), 0)::int AS total FROM ad_spend
    WHERE spent_on >= (now() - make_interval(days => ${dias}::int))::date
  `) as unknown as { total: number }[];
  return row?.total ?? 0;
}

export interface CreateAdSpendInput {
  spentOn: string;
  platform: Platform;
  amountArs: number;
  note?: string | null;
}

export async function createAdSpend(input: CreateAdSpendInput): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO ad_spend (id, spent_on, platform, amount_ars, note)
    VALUES (${randomUUID()}, ${input.spentOn}, ${input.platform}, ${input.amountArs}, ${input.note ?? null})
  `;
}

export async function deleteAdSpend(id: string): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM ad_spend WHERE id = ${id}`;
}
