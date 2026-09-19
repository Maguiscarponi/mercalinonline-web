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

CREATE TABLE IF NOT EXISTS carousel_slides (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  note TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- UNIQUE, no solo índice: el webhook de MP puede reintentar/duplicar
-- notificaciones para el mismo pago (ver src/app/api/mercadopago/webhook/
-- route.ts), y sin esta restricción dos notificaciones casi simultáneas
-- podían colarse antes de que la primera terminara de insertar y generar
-- dos licencias + dos ventas contadas para el mismo pago. NULL (pruebas
-- gratis, que no tienen pago) no cuenta como duplicado para Postgres, así
-- que esto no afecta a los trials.
CREATE UNIQUE INDEX IF NOT EXISTS idx_activations_mp_payment_id ON activations (mp_payment_id);
