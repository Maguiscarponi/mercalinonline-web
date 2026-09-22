"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminGuard";
import { createAdSpend, deleteAdSpend, type Platform } from "@/lib/ad-spend";

const VALID_PLATFORMS: Platform[] = ["facebook", "instagram", "google", "otro"];

export async function createAdSpendAction(formData: FormData): Promise<{ error: string } | undefined> {
  await requireAdmin();

  const spentOn = String(formData.get("spentOn") ?? "");
  const platform = String(formData.get("platform") ?? "");
  const amountArs = Number(formData.get("amountArs"));
  const note = String(formData.get("note") ?? "").trim().slice(0, 200) || null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(spentOn)) return { error: "Fecha inválida." };
  if (!VALID_PLATFORMS.includes(platform as Platform)) return { error: "Plataforma inválida." };
  if (!Number.isFinite(amountArs) || amountArs <= 0) return { error: "El monto tiene que ser mayor a 0." };

  await createAdSpend({ spentOn, platform: platform as Platform, amountArs: Math.round(amountArs), note });
  revalidatePath("/admin/marketing");
  revalidatePath("/admin");
}

export async function deleteAdSpendAction(id: string) {
  await requireAdmin();
  await deleteAdSpend(id);
  revalidatePath("/admin/marketing");
  revalidatePath("/admin");
}
