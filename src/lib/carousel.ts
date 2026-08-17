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

export function listActiveSlides(): CarouselSlideRecord[] {
  const rows = getDb()
    .prepare("SELECT * FROM carousel_slides WHERE active = 1 ORDER BY sort_order ASC")
    .all() as SlideRow[];
  return rows.map(rowToSlide);
}

export function listAllSlidesForAdmin(): CarouselSlideRecord[] {
  const rows = getDb().prepare("SELECT * FROM carousel_slides ORDER BY sort_order ASC").all() as SlideRow[];
  return rows.map(rowToSlide);
}

// Solo imagen — sin título ni nota, se usan en el carrusel tal cual, sin
// texto encima.
export function createSlide(imageUrl: string): CarouselSlideRecord {
  const id = randomUUID();
  const { maxOrder } = getDb()
    .prepare("SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM carousel_slides")
    .get() as { maxOrder: number };
  getDb()
    .prepare(
      `INSERT INTO carousel_slides (id, label, note, image_url, sort_order, active)
       VALUES (@id, 'Mercalin', NULL, @image_url, @sort_order, 1)`
    )
    .run({ id, image_url: imageUrl, sort_order: maxOrder + 1 });
  return listAllSlidesForAdmin().find((s) => s.id === id)!;
}

export function deleteSlide(id: string): void {
  getDb().prepare("DELETE FROM carousel_slides WHERE id = ?").run(id);
}
