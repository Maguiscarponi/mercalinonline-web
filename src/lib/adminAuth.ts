// Web Crypto (no node:crypto) a propósito: este módulo lo usa tanto el
// middleware/proxy como las Server Actions (runtimes distintos) y
// crypto.subtle está disponible en los dos. Un solo admin, sin registro
// público.
//
// La cookie de sesión es "<vence>.<firma>": la firma es un HMAC (con
// ADMIN_PASSWORD como clave) de la fecha de vencimiento. Así la sesión
// caduca sola, no se puede alargar a mano, y cambiar la contraseña invalida
// todas las sesiones abiertas. No hace falta un secreto aparte ni una tabla.

export const SESSION_COOKIE_NAME = "mercalin_admin_session";

// Cuánto dura una sesión abierta. Pasado ese tiempo hay que volver a entrar.
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

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

async function sign(expiresAt: number): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`mercalin-admin-session|${expiresAt}`));
  return bufToHex(sig);
}

export function checkPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return timingSafeEqualStr(candidate, password);
}

export async function createSessionToken(now = Date.now()): Promise<string | null> {
  const expiresAt = Math.floor(now / 1000) + SESSION_TTL_SECONDS;
  const sig = await sign(expiresAt);
  return sig ? `${expiresAt}.${sig}` : null;
}

export async function isValidSessionCookie(value: string | undefined, now = Date.now()): Promise<boolean> {
  if (!value) return false;
  const [expRaw, sig, ...rest] = value.split(".");
  if (!expRaw || !sig || rest.length) return false;
  const expiresAt = Number(expRaw);
  if (!Number.isInteger(expiresAt) || expiresAt * 1000 <= now) return false;
  const expected = await sign(expiresAt);
  if (!expected) return false;
  return timingSafeEqualStr(sig, expected);
}
