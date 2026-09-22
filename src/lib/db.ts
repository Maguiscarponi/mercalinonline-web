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

  const sql = postgres(url, {
    prepare: false, // necesario contra el connection pooler (pgbouncer en modo transaction)
    // Tope explícito y bajo: el pooler de Supabase se comparte entre esta
    // instancia y todo lo demás que le pega a la base (el sitio público
    // registrando eventos, otras funciones serverless). Pedir de más termina
    // en queries que quedan esperando una conexión libre y quedan colgadas
    // -- justo el "se colapsa con tráfico" que hay que evitar.
    max: 8,
    connect_timeout: 10,
    idle_timeout: 20,
    // statement_timeout a nivel de sesión (todas las queries de este
    // cliente, no solo las del panel admin): si una query queda esperando
    // más de 10s -- por congestión del pooler o lo que sea -- Postgres la
    // corta sola en vez de dejarla colgada indefinidamente.
    connection: { statement_timeout: 10000 },
  });
  globalThis.__mercalinSql = sql;
  return sql;
}
