import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Server-only. El algoritmo tiene que ser IDÉNTICO al de build_payload/hmac_sign
// en kiosco-pos/src-tauri/src/commands/device.rs — incluido LICENSE_SECRET.
// Ver kiosco-pos/scripts/generate-license.mjs, de donde se portó esta lógica.

const TRIAL_SECONDS = 7 * 24 * 60 * 60;

function getSecret(): string {
  const secret = process.env.LICENSE_SECRET;
  if (!secret) {
    throw new Error(
      "Falta LICENSE_SECRET en el entorno. Sin esto no se pueden generar claves de activación válidas."
    );
  }
  return secret;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

function buildPayload(kind: "trial" | "full", email: string, expiresAt: number): string {
  return `LICPAYLOAD1|${kind}|${email}|${expiresAt}`;
}

export interface GeneratedLicense {
  key: string;
  kind: "trial" | "full";
  expiresAt: Date | null;
}

// `trialDurationSeconds` solo importa cuando kind === "trial" -- para el
// soporte manual (extender una prueba puntual desde el admin), en vez de
// los 7 días fijos de siempre. La cuenta arranca desde AHORA, no se suma al
// vencimiento viejo -- lo decide quien llama a esto (ver extendTrialAction).
export function generateLicenseKey(
  email: string,
  kind: "trial" | "full",
  trialDurationSeconds: number = TRIAL_SECONDS
): GeneratedLicense {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@") || normalizedEmail.includes("|")) {
    throw new Error("Mail inválido para generar una licencia.");
  }

  const expiresAtEpoch = kind === "trial" ? Math.floor(Date.now() / 1000) + trialDurationSeconds : 0;
  const payloadStr = buildPayload(kind, normalizedEmail, expiresAtEpoch);
  const sig = createHmac("sha256", getSecret()).update(payloadStr).digest();
  const key = `${b64url(Buffer.from(payloadStr, "utf8"))}.${b64url(sig)}`;

  return {
    key,
    kind,
    expiresAt: kind === "trial" ? new Date(expiresAtEpoch * 1000) : null,
  };
}

// true si la clave está firmada con el LICENSE_SECRET actual: el mismo chequeo
// que hace la app al activar (parse_and_verify_license_key en device.rs).
// Sirve para no reenviar una clave vieja que la app ya no acepta (pasó cuando
// el LICENSE_SECRET de la web quedó distinto al de la app).
export function isLicenseKeyValid(key: string): boolean {
  try {
    const [payloadB64, sigB64] = key.replace(/\s/g, "").split(".");
    if (!payloadB64 || !sigB64) return false;
    const expected = createHmac("sha256", getSecret()).update(Buffer.from(payloadB64, "base64url")).digest();
    const got = Buffer.from(sigB64, "base64url");
    return got.length === expected.length && timingSafeEqual(got, expected);
  } catch {
    return false;
  }
}

// Huella (8 primeros caracteres del SHA-256) del LICENSE_SECRET con el que se
// compila la app que se publica (secret de GitHub Actions del repo Mercalin).
// No revela el secreto. Si la huella del de la web no coincide, las claves que
// manda la web (prueba y compra) la app las rechaza como "La clave no es válida":
// el panel admin lo avisa. Pasó en 09/2026 (6 de 7 pruebas con clave inválida).
const HUELLA_SECRETO_APP = "ad852dd9";

export function licenseSecretMatchesApp(): boolean | null {
  const secret = process.env.LICENSE_SECRET;
  if (!secret) return null;
  return createHash("sha256").update(secret).digest("hex").slice(0, 8) === HUELLA_SECRETO_APP;
}

export function isLicensingConfigured(): boolean {
  return Boolean(process.env.LICENSE_SECRET);
}
