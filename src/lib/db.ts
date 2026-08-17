import Database from "better-sqlite3";
import path from "node:path";
import { randomUUID } from "node:crypto";

// SQLite local para desarrollo — cero cuentas externas. En producción este
// archivo se reemplaza por consultas a Supabase Postgres (mismo modelo de
// datos: products, carousel_slides, activations), sin tocar el resto del
// sitio.
const DB_PATH = path.join(process.cwd(), "dev.db");

declare global {
  // eslint-disable-next-line no-var
  var __mercalinDb: Database.Database | undefined;
}

function seedIfEmpty(db: Database.Database) {
  const { count } = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (count > 0) return;

  const featureGroups = [
    {
      title: "Ventas y caja",
      items: [
        "Venta por escaneo de código de barras o búsqueda por nombre",
        "Efectivo, débito, crédito, QR, transferencia, cuenta corriente y pagos mixtos",
        "Apertura y cierre de caja con efectivo esperado calculado solo",
        "Devoluciones y cambios sin romper el historial de ventas",
        "Funciona sin conexión — la base de datos vive en la computadora del negocio",
      ],
    },
    {
      title: "Stock y productos",
      items: [
        "Alertas de stock crítico según la velocidad real de venta de cada producto",
        "Control de vencimientos y lotes",
        "Conteo físico de inventario con ajuste masivo",
        "Impresión de etiquetas con código de barras",
        "Combos y productos pesables",
      ],
    },
    {
      title: "Clientes y proveedores",
      items: [
        "Cuenta corriente por cliente, con alertas de cuentas vencidas",
        "Pedidos a proveedores con recepción de mercadería",
        "Presupuestos que se convierten en venta con un clic",
      ],
    },
    {
      title: "Informes",
      items: [
        "Reportes de ventas, márgenes reales y valor de stock",
        "Comparación con períodos anteriores",
        "Motor de consejos: analiza 90 días de ventas propias y recomienda acciones concretas — qué reponer, qué precio ajustar, qué cliente dejó de comprar",
      ],
    },
    {
      title: "Configuración",
      items: [
        "Múltiples usuarios con permisos por rol",
        "Metas de venta y costos fijos del negocio",
        "Backup automático — local o a una carpeta sincronizada con OneDrive, Google Drive o Dropbox",
        "Actualizaciones automáticas",
      ],
    },
  ];

  const idealFor = [
    "Kioscos",
    "Almacenes",
    "Minimercados",
    "Ferreterías",
    "Indumentaria",
    "Librerías",
    "Bazares",
    "Otros comercios con productos y stock",
  ];

  db.prepare(
    `INSERT INTO products (id, slug, name, tagline, description, price_ars, ideal_for, feature_groups, download_url, active)
     VALUES (@id, @slug, @name, @tagline, @description, @price_ars, @ideal_for, @feature_groups, @download_url, 1)`
  ).run({
    id: randomUUID(),
    slug: "mercalin",
    name: "Mercalin — Sistema de gestión sin ARCA",
    tagline: "Sistema de gestión para comercios que venden productos.",
    description:
      "Ventas, stock, caja, clientes y proveedores, todo en un solo sistema. Se instala en la computadora del negocio y funciona con o sin internet — no depende de un servidor externo. Incluye un motor de recomendaciones que analiza las ventas reales del negocio y avisa antes de que haga falta preguntar.",
    price_ars: 65000,
    ideal_for: JSON.stringify(idealFor),
    feature_groups: JSON.stringify(featureGroups),
    download_url: "https://raw.githubusercontent.com/Maguiscarponi/Mercalin/dist/Mercalin-setup.exe",
  });

  const insertSlide = db.prepare(
    `INSERT INTO carousel_slides (id, label, note, image_url, sort_order, active)
     VALUES (@id, @label, @note, @image_url, @sort_order, 1)`
  );
  [
    { label: "Mercalin — Dashboard", note: "Se instala en tu PC. Funciona sin internet." },
    { label: "Mercalin — Caja", note: "Vendé rápido, con o sin conexión." },
    { label: "Mercalin — Consejo del día", note: "Analiza tus ventas y te avisa antes." },
  ].forEach((s, i) => {
    insertSlide.run({ id: randomUUID(), label: s.label, note: s.note, image_url: null, sort_order: i });
  });
}

// Corre en cada llamada a getDb(), incluso reutilizando la conexión
// cacheada — barato (microsegundos) y evita que una migración agregada
// mientras el server de dev ya está corriendo quede "atada" a una conexión
// vieja que nunca la ve (eso fue exactamente lo que rompió el alta de
// productos con imagen: la conexión cacheada en globalThis se creó antes de
// que existiera la columna image_url).
function ensureSchema(db: Database.Database) {
  db.exec(`
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
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS carousel_slides (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      note TEXT,
      image_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS activations (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      business_name TEXT,
      product_slug TEXT NOT NULL,
      kind TEXT NOT NULL,
      license_key TEXT NOT NULL,
      expires_at TEXT,
      mp_payment_id TEXT,
      amount_ars INTEGER,
      email_sent INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const productColumns = db.prepare("PRAGMA table_info(products)").all() as Array<{ name: string }>;
  const productColumnNames = new Set(productColumns.map((c) => c.name));
  if (!productColumnNames.has("image_url")) {
    db.exec("ALTER TABLE products ADD COLUMN image_url TEXT");
  }
  if (!productColumnNames.has("featured")) {
    db.exec("ALTER TABLE products ADD COLUMN featured INTEGER NOT NULL DEFAULT 0");
  }

  seedIfEmpty(db);
}

export function getDb(): Database.Database {
  if (globalThis.__mercalinDb) {
    ensureSchema(globalThis.__mercalinDb);
    return globalThis.__mercalinDb;
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  ensureSchema(db);

  globalThis.__mercalinDb = db;
  return db;
}
