"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkPassword,
  createSessionToken,
  isAdminAuthConfigured,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from "@/lib/adminAuth";
import { clearHits, clientKey, countRecent, recordHit } from "@/lib/rate-limit";

// Después de 5 contraseñas incorrectas desde la misma IP, se bloquea el
// login 15 minutos. Con una contraseña larga alcanza para que adivinarla a
// fuerza bruta sea inviable.
const LOGIN_BUCKET = "admin_login_fail";
const MAX_FAILS = 5;
const WINDOW_SECONDS = 15 * 60;

export async function loginAction(formData: FormData) {
  if (!isAdminAuthConfigured()) {
    return { error: "Falta configurar ADMIN_PASSWORD en .env.local." };
  }

  const key = clientKey(await headers());
  if ((await countRecent(LOGIN_BUCKET, key, WINDOW_SECONDS)) >= MAX_FAILS) {
    return { error: "Demasiados intentos. Esperá 15 minutos y probá de nuevo." };
  }

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    await recordHit(LOGIN_BUCKET, key);
    return { error: "Contraseña incorrecta." };
  }

  await clearHits(LOGIN_BUCKET, key);
  const token = (await createSessionToken())!;
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}
