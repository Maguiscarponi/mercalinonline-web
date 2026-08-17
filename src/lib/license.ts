import { createHmac } from "node:crypto";

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

export function generateLicenseKey(email: string, kind: "trial" | "full"): GeneratedLicense {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@") || normalizedEmail.includes("|")) {
    throw new Error("Mail inválido para generar una licencia.");
  }

  const expiresAtEpoch = kind === "trial" ? Math.floor(Date.now() / 1000) + TRIAL_SECONDS : 0;
  const payloadStr = buildPayload(kind, normalizedEmail, expiresAtEpoch);
  const sig = createHmac("sha256", getSecret()).update(payloadStr).digest();
  const key = `${b64url(Buffer.from(payloadStr, "utf8"))}.${b64url(sig)}`;

  return {
    key,
    kind,
    expiresAt: kind === "trial" ? new Date(expiresAtEpoch * 1000) : null,
  };
}

export function isLicensingConfigured(): boolean {
  return Boolean(process.env.LICENSE_SECRET);
}
