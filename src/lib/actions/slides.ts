"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminGuard";
import { createSlide, deleteSlide } from "@/lib/carousel";
import { saveUploadedImage } from "@/lib/upload";

export async function createSlideAction(formData: FormData) {
  await requireAdmin();

  const file = formData.get("image") as File | null;
  const imageUrl = await saveUploadedImage(file);
  if (!imageUrl) return;

  createSlide(imageUrl);
  revalidatePath("/");
  revalidatePath("/admin/carrusel");
}

export async function deleteSlideAction(id: string) {
  await requireAdmin();
  deleteSlide(id);
  revalidatePath("/");
  revalidatePath("/admin/carrusel");
}
