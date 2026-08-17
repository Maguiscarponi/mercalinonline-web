import { randomUUID } from "node:crypto";
import { getDb } from "./db";

// Antes esto era un array hardcodeado. Ahora vive en SQLite (dev.db) para
// que el panel admin pueda publicar productos nuevos sin tocar código —
// pero la forma de los datos (Product, FeatureGroup) no cambió, así que
// nada que consuma este módulo tuvo que rediseñarse.

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

export function listProducts(): Product[] {
  const rows = getDb()
    .prepare("SELECT * FROM products WHERE active = 1 ORDER BY featured DESC, created_at ASC")
    .all() as ProductRow[];
  return rows.map(rowToProduct);
}

export function listAllProductsForAdmin(): Product[] {
  const rows = getDb()
    .prepare("SELECT * FROM products ORDER BY featured DESC, created_at ASC")
    .all() as ProductRow[];
  return rows.map(rowToProduct);
}

export function getProduct(slug: string): Product | undefined {
  const row = getDb().prepare("SELECT * FROM products WHERE slug = ?").get(slug) as ProductRow | undefined;
  return row ? rowToProduct(row) : undefined;
}

export function getProductById(id: string): Product | undefined {
  const row = getDb().prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow | undefined;
  return row ? rowToProduct(row) : undefined;
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

export function createProduct(input: ProductInput): Product {
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO products (id, slug, name, tagline, description, price_ars, ideal_for, feature_groups, download_url, image_url, active)
       VALUES (@id, @slug, @name, @tagline, @description, @price_ars, @ideal_for, @feature_groups, @download_url, @image_url, @active)`
    )
    .run({
      id,
      slug: input.slug,
      name: input.name,
      tagline: input.tagline,
      description: input.description,
      price_ars: input.priceArs,
      ideal_for: JSON.stringify(input.idealFor),
      feature_groups: JSON.stringify(input.featureGroups),
      download_url: input.downloadUrl,
      image_url: input.imageUrl,
      active: input.active ? 1 : 0,
    });
  return getProductById(id)!;
}

export function updateProduct(id: string, input: ProductInput): Product {
  getDb()
    .prepare(
      `UPDATE products SET slug = @slug, name = @name, tagline = @tagline, description = @description,
       price_ars = @price_ars, ideal_for = @ideal_for, feature_groups = @feature_groups,
       download_url = @download_url, image_url = @image_url, active = @active WHERE id = @id`
    )
    .run({
      id,
      slug: input.slug,
      name: input.name,
      tagline: input.tagline,
      description: input.description,
      price_ars: input.priceArs,
      ideal_for: JSON.stringify(input.idealFor),
      feature_groups: JSON.stringify(input.featureGroups),
      download_url: input.downloadUrl,
      image_url: input.imageUrl,
      active: input.active ? 1 : 0,
    });
  return getProductById(id)!;
}

export function deleteProduct(id: string): void {
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
}

export function setProductFeatured(id: string, featured: boolean): void {
  getDb()
    .prepare("UPDATE products SET featured = ? WHERE id = ?")
    .run(featured ? 1 : 0, id);
}
