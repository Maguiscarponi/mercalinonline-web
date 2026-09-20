// Validaciones y saneado para lo que escribe gente en los formularios públicos.

// "|" se rechaza a propósito: separa los campos del external_reference de
// Mercado Pago y la licencia; un mail con "|" rompería ambos.
const EMAIL_RE = /^[^\s@|<>"']+@[^\s@|<>"']+\.[^\s@|<>"']{2,}$/;

export function isValidEmail(email: string): boolean {
  return email.length <= 200 && EMAIL_RE.test(email);
}

// Para meter texto de usuario dentro de un mail HTML sin que pueda inyectar
// etiquetas (por ejemplo en el aviso de "nueva prueba" que llega a tu casilla).
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Campo señuelo de los formularios: invisible para personas, los bots lo
// completan. Si vino con algo, es un bot.
export function isHoneypotFilled(body: unknown): boolean {
  const v = (body as { website?: unknown } | null)?.website;
  return typeof v === "string" && v.trim().length > 0;
}
