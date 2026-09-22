"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminGuard";
import { getActivation, updateActivationLicense } from "@/lib/activations";
import { generateLicenseKey } from "@/lib/license";
import { getProduct } from "@/lib/products";
import { sendMail, licenseEmailHtml } from "@/lib/mail";
import { recordEvent } from "@/lib/events";

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
