import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Guarda el archivo en /public/uploads (dev). En producción esto pasa a
// subir a Supabase Storage — Vercel no tiene filesystem persistente.
export async function saveUploadedImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  await mkdir(UPLOADS_DIR, { recursive: true });
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
}
