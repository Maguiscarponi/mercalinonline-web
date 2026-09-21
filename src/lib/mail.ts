import { Resend } from "resend";

// Sin RESEND_API_KEY configurada (fase de credenciales, todavía no hecha),
// el mail se loguea en la consola del servidor en vez de enviarse — así el
// flujo completo (prueba gratis, compra) se puede probar de punta a punta
// en desarrollo sin depender de una cuenta externa. En producción, alcanza
// con cargar la variable de entorno: no hay que tocar el código de acá.

const FROM = "Mercalin <ventas@mercalinonline.com>";

// Casilla real de soporte/negocio -- avisos de venta y respuestas de clientes
// llegan acá, no a ventas@mercalinonline.com (esa solo manda, no recibe: el
// dominio no tiene "Enable Receiving" activado en Resend).
export const ADMIN_NOTIFY_EMAIL = "onlinemercalin@gmail.com";

// Tipos de mail: van como etiqueta a Resend y vuelven en el webhook, así el
// admin sabe de qué mail se trata cada entrega, rebote o apertura.
export type MailType =
  | "trial_license"
  | "purchase_license"
  | "trial_day3"
  | "trial_expiring"
  | "trial_expired"
  | "admin_notify";

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  type?: MailType;
  // Solo para los avisos de la prueba: agrega el encabezado List-Unsubscribe
  // (el botón "Cancelar suscripción" de Gmail) apuntando a /api/baja.
  unsubscribeUrl?: string;
}

export async function sendMail(input: SendMailInput): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("\n[mail:dev] RESEND_API_KEY no configurada — mail simulado, no se envió de verdad.");
    console.log(`[mail:dev] Para: ${input.to}`);
    console.log(`[mail:dev] Asunto: ${input.subject}`);
    console.log(`[mail:dev] Cuerpo:\n${input.html}\n`);
    return { sent: false };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to: input.to,
    replyTo: ADMIN_NOTIFY_EMAIL,
    subject: input.subject,
    html: input.html,
    ...(input.type ? { tags: [{ name: "type", value: input.type }] } : {}),
    ...(input.unsubscribeUrl
      ? {
          headers: {
            "List-Unsubscribe": `<${input.unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }
      : {}),
  });

  if (error) {
    console.error("[mail] Error enviando con Resend:", error);
    return { sent: false };
  }
  return { sent: true };
}

function fechaAr(d: Date): string {
  return d.toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
}

function wrap(bodyHtml: string): string {
  return `<div style="font-family: sans-serif; max-width: 480px;">${bodyHtml}</div>`;
}

// Pie de los avisos de la prueba, con la baja en un clic.
function bajaFooter(unsubscribeUrl: string): string {
  return `<p style="margin-top:28px;padding-top:12px;border-top:1px solid #e5e5e5;font-size:12px;color:#888;">
    Te escribimos porque pediste una prueba de Mercalin. Si no querés recibir más estos avisos,
    <a href="${unsubscribeUrl}" style="color:#888;">darte de baja</a>.
  </p>`;
}

// Día 3 de la prueba: todavía activa, es solo un empujón para que la instale
// si no lo hizo, o siga usándola si ya arrancó.
export function trialDay3EmailHtml(opts: { productName: string; siteUrl: string; unsubscribeUrl: string }): string {
  const { productName, siteUrl, unsubscribeUrl } = opts;
  return wrap(`
    <h2>¿Ya instalaste ${productName}?</h2>
    <p>Van 3 días de tu prueba gratis. Si todavía no la instalaste, es un buen momento — te quedan unos días para probarla con tus productos reales, no con datos de ejemplo.</p>
    <p>Si te trabaste en algo, respondé este mail o escribinos por WhatsApp: <a href="https://wa.me/542344502904">+54 2344 50-2904</a>.</p>
    <p><a href="${siteUrl}/preguntas-frecuentes">Preguntas frecuentes</a></p>
    ${bajaFooter(unsubscribeUrl)}
  `);
}

// Falta ~1 día para que venza: el mensaje con más urgencia real de la
// secuencia, con el link directo a comprar.
export function trialExpiringEmailHtml(opts: {
  productName: string;
  expiresAt: Date;
  siteUrl: string;
  productSlug: string;
  unsubscribeUrl: string;
}): string {
  const { productName, expiresAt, siteUrl, productSlug, unsubscribeUrl } = opts;
  return wrap(`
    <h2>Tu prueba de ${productName} se vence mañana (${fechaAr(expiresAt)})</h2>
    <p>Cuando se venza, el sistema se bloquea — pero no se borra nada de lo que cargaste. Si comprás la licencia completa, seguís exactamente donde estabas.</p>
    <p><a href="${siteUrl}/carrito?product=${productSlug}" style="display:inline-block;background:#c0241b;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">Comprar ahora</a></p>
    <p>¿Alguna duda antes de decidir? Escribinos por WhatsApp: <a href="https://wa.me/542344502904">+54 2344 50-2904</a>.</p>
    ${bajaFooter(unsubscribeUrl)}
  `);
}

// Ya venció: sin la presión de la cuenta regresiva, pero recordando que se
// puede retomar sin perder nada.
export function trialExpiredEmailHtml(opts: {
  productName: string;
  siteUrl: string;
  productSlug: string;
  unsubscribeUrl: string;
}): string {
  const { productName, siteUrl, productSlug, unsubscribeUrl } = opts;
  return wrap(`
    <h2>Se venció tu prueba de ${productName}</h2>
    <p>Nada de lo que cargaste se borró. Cuando quieras seguir, comprás la licencia completa y la activás con el mismo mail — retomás justo donde quedaste.</p>
    <p><a href="${siteUrl}/carrito?product=${productSlug}" style="display:inline-block;background:#c0241b;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">Comprar la licencia</a></p>
    <p>Si probaste y no te sirvió, contanos por qué — nos ayuda, y a veces se resuelve con una respuesta. WhatsApp: <a href="https://wa.me/542344502904">+54 2344 50-2904</a>.</p>
    ${bajaFooter(unsubscribeUrl)}
  `);
}

export function licenseEmailHtml(opts: {
  productName: string;
  kind: "trial" | "full";
  licenseKey: string;
  downloadUrl: string | null;
  expiresAt: Date | null;
}): string {
  const { productName, kind, licenseKey, downloadUrl, expiresAt } = opts;
  const intro =
    kind === "trial"
      ? `Tu prueba gratis de ${productName} está lista. Tenés 7 días para usarla, hasta el ${expiresAt?.toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })}.`
      : `Gracias por tu compra de ${productName}. Tu licencia no vence.`;

  return `
    <div style="font-family: sans-serif; max-width: 480px;">
      <h2>${intro}</h2>
      <p><strong>1. Descargá el instalador:</strong><br/>
        ${downloadUrl ? `<a href="${downloadUrl}">${downloadUrl}</a>` : "Todavía no hay un link de descarga cargado — respondé este mail y te lo mandamos a mano."}
      </p>
      <p><strong>2. Activalo con este código:</strong></p>
      <pre style="background:#f4f4f4; padding:12px; word-break:break-all; font-size:13px;">${licenseKey}</pre>
      <p>Cualquier duda, respondé este mail.</p>
    </div>
  `;
}
