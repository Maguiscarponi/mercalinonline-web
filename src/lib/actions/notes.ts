"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminGuard";
import { createClientNote } from "@/lib/notes";
import { isValidEmail } from "@/lib/validate";

type ActionResult = { ok: true } | { error: string };

export async function createNoteAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const note = String(formData.get("note") ?? "").trim();

  if (!isValidEmail(email)) return { error: "Ingresá un mail válido." };
  if (!note) return { error: "Escribí algo en la nota." };
  if (note.length > 2000) return { error: "La nota es demasiado larga (máx. 2000 caracteres)." };

  await createClientNote(email, note);
  revalidatePath("/admin/reportes");
  revalidatePath("/admin/clientes/detalle");
  return { ok: true };
}
