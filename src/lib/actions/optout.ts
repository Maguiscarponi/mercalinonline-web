"use server";

import { redirect } from "next/navigation";
import { optOut, verifyUnsubscribeToken } from "@/lib/optout";

export async function confirmUnsubscribeAction(formData: FormData) {
  const email = String(formData.get("e") ?? "");
  const token = String(formData.get("t") ?? "");
  if (!verifyUnsubscribeToken(email, token)) redirect("/baja");
  await optOut(email);
  redirect(`/baja?e=${encodeURIComponent(email)}&t=${token}&ok=1`);
}
