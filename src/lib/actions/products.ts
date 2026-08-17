"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminGuard";
import { createProduct, updateProduct, deleteProduct, setProductFeatured, type ProductInput } from "@/lib/products";
import { saveUploadedImage } from "@/lib/upload";

async function parseProductForm(formData: FormData, existingImageUrl: string | null): Promise<ProductInput> {
  const idealFor = String(formData.get("idealFor") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const featureGroups = JSON.parse(String(formData.get("featureGroupsJson") ?? "[]"));

  const file = formData.get("image") as File | null;
  const uploadedUrl = file && file.size > 0 ? await saveUploadedImage(file) : null;

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    priceArs: Number(formData.get("priceArs") ?? 0),
    idealFor,
    featureGroups,
    downloadUrl: String(formData.get("downloadUrl") ?? "").trim() || null,
    imageUrl: uploadedUrl ?? existingImageUrl,
    active: formData.get("active") === "on",
  };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const input = await parseProductForm(formData, null);
  await createProduct(input);
  revalidatePath("/");
  revalidatePath("/productos");
  redirect("/admin/productos");
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();
  const existingImageUrl = String(formData.get("existingImageUrl") ?? "") || null;
  const input = await parseProductForm(formData, existingImageUrl);
  await updateProduct(id, input);
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath(`/productos/${input.slug}`);
  redirect("/admin/productos");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await deleteProduct(id);
  revalidatePath("/");
  revalidatePath("/productos");
}

export async function toggleFeaturedAction(id: string, featured: boolean) {
  await requireAdmin();
  await setProductFeatured(id, featured);
  revalidatePath("/");
  revalidatePath("/admin/productos");
}
