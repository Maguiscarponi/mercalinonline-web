import { randomUUID } from "node:crypto";
import { getDb } from "./db";

// Notas de soporte: "me escribió por tal problema", "le regeneré la clave
// porque perdió el mail", etc. Una fila por nota, sin editar ni borrar --
// es un registro de lo que pasó, no una libreta que se corrige. Ver
// /admin/reportes (todas) y la ficha de cada cliente (las de ese mail).

export interface ClientNote {
  id: string;
  email: string;
  note: string;
  createdAt: string;
}

interface ClientNoteRow {
  id: string;
  email: string;
  note: string;
  created_at: string;
}

function rowToNote(row: ClientNoteRow): ClientNote {
  return { id: row.id, email: row.email, note: row.note, createdAt: row.created_at };
}

export async function createClientNote(email: string, note: string): Promise<ClientNote> {
  const sql = getDb();
  const id = randomUUID();
  await sql`INSERT INTO client_notes (id, email, note) VALUES (${id}, ${email.trim().toLowerCase()}, ${note.trim()})`;
  const rows = (await sql`SELECT * FROM client_notes WHERE id = ${id}`) as unknown as ClientNoteRow[];
  return rowToNote(rows[0]);
}

export async function listAllClientNotes(): Promise<ClientNote[]> {
  const sql = getDb();
  const rows = (await sql`SELECT * FROM client_notes ORDER BY created_at DESC`) as unknown as ClientNoteRow[];
  return rows.map(rowToNote);
}

export async function listClientNotesFor(email: string): Promise<ClientNote[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM client_notes WHERE lower(email) = ${email.trim().toLowerCase()} ORDER BY created_at DESC
  `) as unknown as ClientNoteRow[];
  return rows.map(rowToNote);
}
