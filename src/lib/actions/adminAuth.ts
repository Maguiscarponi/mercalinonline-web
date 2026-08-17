"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, getExpectedSessionCookie, isAdminAuthConfigured, SESSION_COOKIE_NAME } from "@/lib/adminAuth";

export async function loginAction(formData: FormData) {
  if (!isAdminAuthConfigured()) {
    return { error: "Falta configurar ADMIN_PASSWORD en .env.local." };
  }

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Contraseña incorrecta." };
  }

  const token = (await getExpectedSessionCookie())!;
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}
