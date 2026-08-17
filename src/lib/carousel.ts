import { randomUUID } from "node:crypto";
import { getDb } from "./db";

export interface CarouselSlideRecord {
  id: string;
  label: string;
  imageUrl: string | null;
  sortOrder: number;
}

interface SlideRow {
  id: string;
  label: string;
  image_url: string | null;
  sort_order: number;
}

function rowToSlide(row: SlideRow): CarouselSlideRecord {
  return {
    id: row.id,
    label: row.label,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
  };
}

export async function listActiveSlides(): Promise<CarouselSlideRecord[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM carousel_slides WHERE active = 1 ORDER BY sort_order ASC
  `) as unknown as SlideRow[];
  return rows.map(rowToSlide);
}

export async function listAllSlidesForAdmin(): Promise<CarouselSlideRecord[]> {
  const sql = getDb();
  const rows = (await sql`SELECT * FROM carousel_slides ORDER BY sort_order ASC`) as unknown as SlideRow[];
  return rows.map(rowToSlide);
}

// Solo imagen — sin título ni nota, se usan en el carrusel tal cual, sin
// texto encima.
export async function createSlide(imageUrl: string): Promise<CarouselSlideRecord> {
  const sql = getDb();
  const id = randomUUID();
  const [{ maxOrder }] = (await sql`
    SELECT COALESCE(MAX(sort_order), -1)::int as "maxOrder" FROM carousel_slides
  `) as unknown as [{ maxOrder: number }];
  await sql`
    INSERT INTO carousel_slides (id, label, note, image_url, sort_order, active)
    VALUES (${id}, 'Mercalin', NULL, ${imageUrl}, ${maxOrder + 1}, 1)
  `;
  return (await listAllSlidesForAdmin()).find((s) => s.id === id)!;
}

export async function deleteSlide(id: string): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM carousel_slides WHERE id = ${id}`;
}
