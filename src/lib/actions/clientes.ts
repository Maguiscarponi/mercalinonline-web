"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminGuard";
import { getActivation, updateActivationLicense, createActivation, setActivationEmailSent } from "@/lib/activations";
import { generateLicenseKey, isLicensingConfigured } from "@/lib/license";
import { getProduct } from "@/lib/products";
import { sendMail, licenseEmailHtml } from "@/lib/mail";
import { recordEvent } from "@/lib/events";
import { isValidEmail } from "@/lib/validate";
import { listClientes, filterClientes, isSegmento } from "@/lib/clientes";

// Soporte manual: "no le llegó la clave" o "la perdió" son el pedido más
// común de un cliente. Las dos acciones de acá son deliberadamente distintas:
// reenviar no toca nada (la misma clave, el mismo vencimiento); regenerar sí
// (clave nueva, y en una prueba, 7 días nuevos desde ahora) — por eso el
// botón de regenerar pide confirmación en el cliente (ver ConfirmSubmit).

type ActionResult = { ok: true } | { error: string };

export async function resendLicenseAction(activationId: string): Promise<ActionResult> {
  await requireAdmin();

  const activation = await getActivation(activationId);
  if (!activation) return { error: "No se encontró esa activación." };

  const product = await getProduct(activation.productSlug);
  const { sent } = await sendMail({
    type: activation.kind === "trial" ? "trial_license" : "purchase_license",
    to: activation.email,
    subject: activation.kind === "trial" ? `Tu prueba gratis de ${product?.name ?? "Mercalin"}` : `Tu clave de ${product?.name ?? "Mercalin"}`,
    html: licenseEmailHtml({
      productName: product?.name ?? "Mercalin",
      kind: activation.kind,
      licenseKey: activation.licenseKey,
      downloadUrl: product?.downloadUrl ?? null,
      expiresAt: activation.expiresAt ? new Date(activation.expiresAt) : null,
    }),
  });

  if (sent) await recordEvent({ name: "trial_resent", email: activation.email, props: { product: activation.productSlug, manual: true } });
  revalidatePath("/admin/clientes/detalle");
  return sent ? { ok: true } : { error: "No se pudo enviar el mail. Revisá que Resend esté configurado." };
}

export async function regenerateLicenseAction(activationId: string): Promise<ActionResult> {
  await requireAdmin();

  const activation = await getActivation(activationId);
  if (!activation) return { error: "No se encontró esa activación." };

  const license = generateLicenseKey(activation.email, activation.kind);
  const product = await getProduct(activation.productSlug);

  const { sent } = await sendMail({
    type: activation.kind === "trial" ? "trial_license" : "purchase_license",
    to: activation.email,
    subject: activation.kind === "trial" ? `Tu nueva clave de prueba de ${product?.name ?? "Mercalin"}` : `Tu nueva clave de ${product?.name ?? "Mercalin"}`,
    html: licenseEmailHtml({
      productName: product?.name ?? "Mercalin",
      kind: activation.kind,
      licenseKey: license.key,
      downloadUrl: product?.downloadUrl ?? null,
      expiresAt: license.expiresAt,
    }),
  });

  await updateActivationLicense(activationId, license.key, license.expiresAt, sent);
  await recordEvent({ name: "trial_resent", email: activation.email, props: { product: activation.productSlug, manual: true, regenerated: true } });
  revalidatePath("/admin/clientes/detalle");
  return sent ? { ok: true } : { error: "Se generó la clave nueva pero no se pudo enviar el mail. Revisá Resend." };
}

// Extiende una prueba puntual N días más allá de lo que le quede (o desde
// ahora si ya venció) -- a diferencia de "Generar clave nueva", que siempre
// resetea a 7 días fijos. Como el vencimiento va FIRMADO adentro de la clave
// (ver license.ts), no alcanza con tocar la base: hay que generar una clave
// nueva con el vencimiento nuevo y que la persona la vuelva a activar.
async function extendActivation(activationId: string, days: number): Promise<ActionResult & { email?: string }> {
  const activation = await getActivation(activationId);
  if (!activation) return { error: "No se encontró esa activación." };
  if (activation.kind !== "trial") return { error: "Esto solo aplica a pruebas, no a compras." };

  const now = Date.now();
  const currentExpiry = activation.expiresAt ? new Date(activation.expiresAt).getTime() : now;
  const base = Math.max(now, currentExpiry);
  const newExpirySeconds = Math.round((base - now) / 1000) + days * 86400;

  const license = generateLicenseKey(activation.email, "trial", newExpirySeconds);
  const product = await getProduct(activation.productSlug);

  const { sent } = await sendMail({
    type: "trial_license",
    to: activation.email,
    subject: `Te extendimos la prueba de ${product?.name ?? "Mercalin"}`,
    html: licenseEmailHtml({
      productName: product?.name ?? "Mercalin",
      kind: "trial",
      licenseKey: license.key,
      downloadUrl: product?.downloadUrl ?? null,
      expiresAt: license.expiresAt,
    }),
  });

  await updateActivationLicense(activationId, license.key, license.expiresAt, sent);
  await recordEvent({ name: "trial_resent", email: activation.email, props: { product: activation.productSlug, manual: true, extended_days: days } });
  return sent
    ? { ok: true, email: activation.email }
    : { error: "Se extendió pero no se pudo enviar el mail nuevo.", email: activation.email };
}

export async function extendTrialAction(activationId: string, days: number): Promise<ActionResult> {
  await requireAdmin();
  if (!Number.isFinite(days) || days <= 0 || days > 365) return { error: "Ingresá una cantidad de días válida (1 a 365)." };

  const result = await extendActivation(activationId, days);
  revalidatePath("/admin/clientes/detalle");
  revalidatePath("/admin/clientes");
  return result;
}

// Igual que extenderla una por una, pero para todas las que caen dentro del
// filtro actual de Clientes (mismo segmento/canal/búsqueda que se está
// viendo en pantalla) -- ej. "vencen en 48hs" + canal "facebook" antes de
// una campaña. Tope de 200 para no mandar un mail masivo por accidente.
type BulkResult = { ok: true; count: number; failed: number } | { error: string };

export async function bulkExtendTrialAction(_prev: unknown, formData: FormData): Promise<BulkResult> {
  await requireAdmin();

  const segmentoRaw = String(formData.get("segmento") ?? "todos");
  const segmento = isSegmento(segmentoRaw) ? segmentoRaw : "todos";
  const canal = String(formData.get("canal") ?? "");
  const q = String(formData.get("q") ?? "");
  const days = Number(formData.get("days"));

  if (!Number.isFinite(days) || days <= 0 || days > 365) return { error: "Ingresá una cantidad de días válida (1 a 365)." };

  const todos = await listClientes();
  const filtrados = filterClientes(todos, { segmento, canal, q }).filter(
    (c) => c.estado === "activa" || c.estado === "por_vencer"
  );
  if (filtrados.length === 0) return { error: "No hay ninguna prueba activa en este filtro para extender." };
  if (filtrados.length > 200) {
    return { error: `Son ${filtrados.length} personas -- por seguridad el máximo por tanda es 200. Acotá el filtro.` };
  }

  let count = 0;
  let failed = 0;
  for (const cliente of filtrados) {
    const lastTrial = cliente.activations.find((a) => a.kind === "trial");
    if (!lastTrial) { failed++; continue; }
    const r = await extendActivation(lastTrial.id, days);
    if ("ok" in r) count++; else failed++;
  }

  revalidatePath("/admin/clientes");
  return { ok: true, count, failed };
}

// Alta manual de una licencia completa, sin pasar por Mercado Pago -- para
// regalarla (montoArs en 0) o para asentar un pago que se recibió por otro
// medio (transferencia, efectivo). Es el mismo camino que dispara el webhook
// de Mercado Pago cuando aprueba un pago real, nada más que lo activa la
// admin a mano en vez de una notificación de pago.
export async function createManualLicenseAction(
  _prev: unknown,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const businessName = String(formData.get("businessName") ?? "").trim() || null;
  const productSlug = String(formData.get("productSlug") ?? "").trim();
  const montoRaw = String(formData.get("amountArs") ?? "0").trim();
  const amountArs = Math.max(0, Math.round(Number(montoRaw.replace(/[^\d.-]/g, "")) || 0));

  if (!isValidEmail(email)) return { error: "Ingresá un mail válido." };
  if (!isLicensingConfigured()) return { error: "Falta LICENSE_SECRET en el entorno — no se puede generar la clave." };

  const product = await getProduct(productSlug);
  if (!product) return { error: "No se encontró el producto." };

  const license = generateLicenseKey(email, "full");
  const gifted = amountArs === 0;

  const activation = await createActivation({
    email,
    businessName,
    productSlug: product.slug,
    kind: "full",
    licenseKey: license.key,
    expiresAt: null,
    mpPaymentId: null,
    amountArs,
    emailSent: false,
    source: gifted ? "regalo" : "manual",
  });

  const { sent } = await sendMail({
    type: "purchase_license",
    to: email,
    subject: gifted ? `Tenés ${product.name}` : `Tu clave de ${product.name}`,
    html: licenseEmailHtml({
      productName: product.name,
      kind: "full",
      licenseKey: license.key,
      downloadUrl: product.downloadUrl,
      expiresAt: null,
      gifted,
    }),
  });
  if (sent) await setActivationEmailSent(activation.id, true);

  await recordEvent({
    name: "payment_approved",
    email,
    props: { product: product.slug, amount: amountArs, manual: true, gifted },
  });

  revalidatePath("/admin/clientes");
  return sent
    ? { ok: true }
    : { error: "Se creó la licencia pero no se pudo enviar el mail. Revisá Resend y reenviala desde la ficha del cliente." };
}
