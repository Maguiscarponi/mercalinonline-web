import postgres from "postgres";

// Supabase Postgres — mismo motor en desarrollo y en producción (antes acá
// vivía un fallback a SQLite local, pero probar contra un motor distinto al
// de producción es justo lo que hizo que el primer deploy a Vercel se
// rompiera: SQLite necesita un archivo en disco, y el filesystem de las
// funciones serverless de Vercel es de solo lectura). El esquema vive en
// supabase/schema.sql -- se aplica una sola vez desde el panel SQL de
// Supabase, no en cada arranque de la app.
declare global {
  var __mercalinSql: ReturnType<typeof postgres> | undefined;
}

export function getDb() {
  if (globalThis.__mercalinSql) return globalThis.__mercalinSql;

  const url = process.env.SUPABASE_DB_URL;
  if (!url) {
    throw new Error("Falta SUPABASE_DB_URL en el entorno -- ver .env.local / variables de entorno en Vercel.");
  }

  const sql = postgres(url, { prepare: false }); // prepare:false -- necesario contra el connection pooler (pgbouncer en modo transaction)
  globalThis.__mercalinSql = sql;
  return sql;
}
