// Web Crypto (no node:crypto) a propósito: este módulo lo usa tanto el
// middleware (runtime Edge) como las Server Actions (runtime Node), y
// crypto.subtle está disponible en los dos. Un solo admin, sin registro
// público — la cookie de sesión es un HMAC derivado de ADMIN_PASSWORD, no
// hace falta un secreto de sesión aparte ni una base de usuarios.

export const SESSION_COOKIE_NAME = "mercalin_admin_session";

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sessionToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("mercalin-admin-session"));
  return bufToHex(sig);
}

export function checkPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return timingSafeEqualStr(candidate, password);
}

export async function getExpectedSessionCookie(): Promise<string | null> {
  return sessionToken();
}

export async function isValidSessionCookie(value: string | undefined): Promise<boolean> {
  const expected = await sessionToken();
  if (!expected || !value) return false;
  return timingSafeEqualStr(value, expected);
}
