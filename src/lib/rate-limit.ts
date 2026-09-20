import { createHash } from "node:crypto";
import { getDb } from "./db";

// Límites por visitante guardados en la base (tabla rate_events), así valen
// aunque Vercel atienda cada pedido con una instancia distinta. Se identifica
// por IP, guardada solo como hash: nunca queda la IP en claro.
//
// Si la base falla, se deja pasar (fail-open): un problema de base no tiene
// que dejar afuera a gente legítima ni a vos del panel.

export function clientKey(headers: Headers): string {
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim() || "unknown";
  return createHash("sha256")
    .update(ip + (process.env.ADMIN_PASSWORD ?? ""))
    .digest("hex")
    .slice(0, 32);
}

export async function countRecent(bucket: string, key: string, windowSeconds: number): Promise<number> {
  try {
    const sql = getDb();
    const [row] = (await sql`
      SELECT COUNT(*)::int AS c FROM rate_events
      WHERE bucket = ${bucket} AND key = ${key}
        AND created_at >= now() - make_interval(secs => ${windowSeconds}::int)
    `) as unknown as { c: number }[];
    return row?.c ?? 0;
  } catch (err) {
    console.error("[rate-limit] no se pudo contar", bucket, err);
    return 0;
  }
}

export async function recordHit(bucket: string, key: string): Promise<void> {
  try {
    const sql = getDb();
    await sql`INSERT INTO rate_events (bucket, key) VALUES (${bucket}, ${key})`;
    // Limpieza de paso: la tabla no crece para siempre.
    if (Math.random() < 0.02) {
      await sql`DELETE FROM rate_events WHERE created_at < now() - interval '2 days'`;
    }
  } catch (err) {
    console.error("[rate-limit] no se pudo registrar", bucket, err);
  }
}

export async function clearHits(bucket: string, key: string): Promise<void> {
  try {
    const sql = getDb();
    await sql`DELETE FROM rate_events WHERE bucket = ${bucket} AND key = ${key}`;
  } catch (err) {
    console.error("[rate-limit] no se pudo limpiar", bucket, err);
  }
}

// Atajo para los formularios públicos: ¿esta persona ya hizo demasiados
// pedidos? Si no, anota este y sigue.
export async function tooManyRequests(
  bucket: string,
  headers: Headers,
  max: number,
  windowSeconds: number
): Promise<boolean> {
  const key = clientKey(headers);
  if ((await countRecent(bucket, key, windowSeconds)) >= max) return true;
  await recordHit(bucket, key);
  return false;
}
