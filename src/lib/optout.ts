import { createHmac, timingSafeEqual } from "node:crypto";
import { getDb } from "./db";
import { recordEvent } from "./events";

// Baja de los avisos de la prueba. El link de cada mail lleva una firma del
// mail: sin ella nadie puede dar de baja a otra persona probando direcciones.
// La firma usa LICENSE_SECRET, que nunca cambia (está atada a la app de
// escritorio), así los links de mails viejos siguen valiendo.

function secret(): string {
  return process.env.LICENSE_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function unsubscribeToken(email: string): string {
  return createHmac("sha256", secret())
    .update(`baja|${email.trim().toLowerCase()}`)
    .digest("hex")
    .slice(0, 40);
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!secret() || !email || !token) return false;
  const expected = Buffer.from(unsubscribeToken(email));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function unsubscribeUrl(siteUrl: string, email: string, path: "/baja" | "/api/baja" = "/baja"): string {
  const e = encodeURIComponent(email.trim().toLowerCase());
  return `${siteUrl}${path}?e=${e}&t=${unsubscribeToken(email)}`;
}

export async function optOut(email: string): Promise<void> {
  const sql = getDb();
  const normalized = email.trim().toLowerCase();
  const rows = await sql`
    INSERT INTO email_optouts (email) VALUES (${normalized})
    ON CONFLICT (email) DO NOTHING RETURNING email
  `;
  // Solo se registra la primera vez (los scanners de mail y los reintentos
  // no duplican el evento).
  if (rows.length) await recordEvent({ name: "unsubscribed", email: normalized });
}

export async function listOptedOutEmails(): Promise<Set<string>> {
  const sql = getDb();
  const rows = (await sql`SELECT email FROM email_optouts`) as unknown as { email: string }[];
  return new Set(rows.map((r) => r.email));
}
