import { randomUUID } from "node:crypto";
import { getDb } from "./db";

// Vive en Postgres (Supabase) para que el panel admin pueda publicar
// productos nuevos sin tocar código — pero la forma de los datos (Product,
// FeatureGroup) no cambió, así que nada que consuma este módulo tuvo que
// rediseñarse más allá de agregar `await`.

export interface FeatureGroup {
  title: string;
  items: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceArs: number;
  idealFor: string[];
  featureGroups: FeatureGroup[];
  downloadUrl: string | null;
  imageUrl: string | null;
  active: boolean;
  featured: boolean;
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price_ars: number;
  ideal_for: string;
  feature_groups: string;
  download_url: string | null;
  image_url: string | null;
  active: number;
  featured: number;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    priceArs: row.price_ars,
    idealFor: JSON.parse(row.ideal_for),
    featureGroups: JSON.parse(row.feature_groups),
    downloadUrl: row.download_url,
    imageUrl: row.image_url,
    active: row.active === 1,
    featured: row.featured === 1,
  };
}

export async function listProducts(): Promise<Product[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM products WHERE active = 1 ORDER BY featured DESC, created_at ASC
  `) as unknown as ProductRow[];
  return rows.map(rowToProduct);
}

export async function listAllProductsForAdmin(): Promise<Product[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM products ORDER BY featured DESC, created_at ASC
  `) as unknown as ProductRow[];
  return rows.map(rowToProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const sql = getDb();
  const rows = (await sql`SELECT * FROM products WHERE slug = ${slug}`) as unknown as ProductRow[];
  return rows[0] ? rowToProduct(rows[0]) : undefined;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const sql = getDb();
  const rows = (await sql`SELECT * FROM products WHERE id = ${id}`) as unknown as ProductRow[];
  return rows[0] ? rowToProduct(rows[0]) : undefined;
}

export interface ProductInput {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceArs: number;
  idealFor: string[];
  featureGroups: FeatureGroup[];
  downloadUrl: string | null;
  imageUrl: string | null;
  active: boolean;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const sql = getDb();
  const id = randomUUID();
  await sql`
    INSERT INTO products (id, slug, name, tagline, description, price_ars, ideal_for, feature_groups, download_url, image_url, active)
    VALUES (${id}, ${input.slug}, ${input.name}, ${input.tagline}, ${input.description}, ${input.priceArs},
            ${JSON.stringify(input.idealFor)}, ${JSON.stringify(input.featureGroups)}, ${input.downloadUrl},
            ${input.imageUrl}, ${input.active ? 1 : 0})
  `;
  return (await getProductById(id))!;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const sql = getDb();
  await sql`
    UPDATE products SET
      slug = ${input.slug}, name = ${input.name}, tagline = ${input.tagline}, description = ${input.description},
      price_ars = ${input.priceArs}, ideal_for = ${JSON.stringify(input.idealFor)},
      feature_groups = ${JSON.stringify(input.featureGroups)}, download_url = ${input.downloadUrl},
      image_url = ${input.imageUrl}, active = ${input.active ? 1 : 0}
    WHERE id = ${id}
  `;
  return (await getProductById(id))!;
}

export async function deleteProduct(id: string): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM products WHERE id = ${id}`;
}

export async function setProductFeatured(id: string, featured: boolean): Promise<void> {
  const sql = getDb();
  await sql`UPDATE products SET featured = ${featured ? 1 : 0} WHERE id = ${id}`;
}
