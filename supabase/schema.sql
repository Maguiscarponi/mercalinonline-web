-- Esquema para Supabase Postgres, traducido 1 a 1 desde el SQLite local
-- (ver src/lib/db.ts). Pegar en el SQL Editor de Supabase una vez creado
-- el proyecto -- no hace falta tocar nada más de este archivo.
--
-- Nota: activo/featured/email_sent quedan como INTEGER (0/1), no BOOLEAN,
-- a propósito: el código de la app (products.ts, activations.ts) ya los
-- trata como 0/1 en el resto del sitio, y cambiar a boolean obligaría a
-- tocar esos archivos también. Se puede migrar a boolean más adelante si
-- hace falta, pero no es necesario para que esto funcione.

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  price_ars INTEGER NOT NULL,
  ideal_for TEXT NOT NULL,
  feature_groups TEXT NOT NULL,
  download_url TEXT,
  image_url TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- carousel_slides existió para el carrusel de la home vieja, que ya no está
-- en el sitio (etapa de rediseño). Se deja de crear en instalaciones nuevas;
-- si tu base ya tiene la tabla con datos, no pasa nada por dejarla — no la
-- lee ni la escribe ningún código de la app.

CREATE TABLE IF NOT EXISTS activations (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  business_name TEXT,
  product_slug TEXT NOT NULL,
  kind TEXT NOT NULL,
  license_key TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  mp_payment_id TEXT,
  amount_ars INTEGER,
  email_sent INTEGER NOT NULL DEFAULT 0,
  -- Recordatorios del trial (ver src/app/api/cron/trial-emails/route.ts):
  -- un flag por email de la secuencia para que el cron sea idempotente aunque
  -- corra más de una vez por día o se reintente.
  reminder3_sent INTEGER NOT NULL DEFAULT 0,
  reminder_expiry_sent INTEGER NOT NULL DEFAULT 0,
  expired_sent INTEGER NOT NULL DEFAULT 0,
  -- Atribución: de qué visitante y de qué canal vino esta prueba/compra
  -- (ver src/lib/track.ts). NULL en las activaciones anteriores a la Etapa 4.
  visitor_id TEXT,
  source TEXT,
  campaign TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- lower(email): las búsquedas por cliente siempre comparan en minúsculas.
-- (kind, created_at): las cuentas de pruebas/compras del Resumen filtran por
-- los dos. created_at solo: el resto de los filtros por período.
CREATE INDEX IF NOT EXISTS idx_activations_email_lower ON activations (lower(email));
CREATE INDEX IF NOT EXISTS idx_activations_kind_created_at ON activations (kind, created_at);
CREATE INDEX IF NOT EXISTS idx_activations_created_at ON activations (created_at);

-- Personas que pidieron no recibir más los avisos de la prueba (link "darte
-- de baja" de los mails). No afecta al mail con la clave ni al de compra.
-- Ver src/lib/optout.ts.
CREATE TABLE IF NOT EXISTS email_optouts (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Límites de intentos (login del admin, formularios públicos). La clave es un
-- hash de la IP, nunca la IP. Ver src/lib/rate-limit.ts.
CREATE TABLE IF NOT EXISTS rate_events (
  id BIGSERIAL PRIMARY KEY,
  bucket TEXT NOT NULL,
  key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rate_events_lookup ON rate_events (bucket, key, created_at);

-- Analítica propia (sin terceros, sin cookies): un evento por fila. Los
-- eventos del navegador entran por /api/track; los de negocio (prueba
-- iniciada, pago aprobado, mails enviados) los registra el servidor. Ver
-- src/lib/events.ts para la lista de nombres válidos.
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  visitor_id TEXT,
  session_id TEXT,
  email TEXT,
  path TEXT,
  referrer TEXT,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  device TEXT,
  props JSONB
);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at);
CREATE INDEX IF NOT EXISTS idx_events_name_created_at ON events (name, created_at);
CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON events (visitor_id);

-- UNIQUE, no solo índice: el webhook de MP puede reintentar/duplicar
-- notificaciones para el mismo pago (ver src/app/api/mercadopago/webhook/
-- route.ts), y sin esta restricción dos notificaciones casi simultáneas
-- podían colarse antes de que la primera terminara de insertar y generar
-- dos licencias + dos ventas contadas para el mismo pago. NULL (pruebas
-- gratis, que no tienen pago) no cuenta como duplicado para Postgres, así
-- que esto no afecta a los trials.
CREATE UNIQUE INDEX IF NOT EXISTS idx_activations_mp_payment_id ON activations (mp_payment_id);

-- Gasto en publicidad, cargado a mano desde /admin/marketing: no hay
-- integración con Meta Ads, es un registro simple para poder comparar
-- contra los ingresos (ganancia real, costo por prueba, costo por compra).
CREATE TABLE IF NOT EXISTS ad_spend (
  id TEXT PRIMARY KEY,
  spent_on DATE NOT NULL,
  platform TEXT NOT NULL,
  amount_ars INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ad_spend_spent_on ON ad_spend (spent_on);
