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

// Mail simple: texto normal (fuente del sistema, sin Google Fonts ni
// tipografías del sitio), sin cajas, sin sombras, sin sellos. El diseño
// "retro" completo (tablas anidadas, box-shadow, fuentes custom) le llegó a
// una clienta con el cuerpo colapsado en la app de Gmail del celular --
// Gmail lo trató como "contenido extra" y lo escondió detrás de un botón de
// "mostrar más". Cuanto más simple el HTML, menos margen para que un
// cliente de mail lo recorte o lo rompa. El color de marca queda solo como
// detalle (el "lin" del logo, los links, el botón principal).
const F_BODY = "Arial, Helvetica, sans-serif";
const F_MONO = "'Courier New', Courier, monospace";
const BRAND = "#e1251b";
const INK = "#232120";
const INK_SOFT = "#4f4942";
const INK_MUTE = "#8a8175";

function boton(href: string, texto: string): string {
  return `<a href="${href}" style="display:inline-block;background:${BRAND};color:#ffffff;font-family:${F_BODY};font-weight:bold;font-size:15px;text-decoration:none;padding:12px 22px;border-radius:5px;">${texto}</a>`;
}

function linkWhatsApp(texto = "escribinos por WhatsApp"): string {
  return `<a href="https://wa.me/542344502904" style="color:${BRAND};font-weight:bold;text-decoration:none;">${texto}</a>`;
}

// Logo + wordmark chicos, en tabla (no flex/div) para que se vea igual en
// cualquier cliente de mail.
function encabezado(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:22px;"><tr>
    <td style="vertical-align:middle;"><img src="https://mercalinonline.com/apple-icon.png" width="28" height="28" alt="Mercalin" style="display:block;border-radius:6px;"></td>
    <td style="vertical-align:middle;padding-left:8px;font-family:${F_BODY};font-size:18px;font-weight:bold;color:${INK};">Merca<span style="color:${BRAND};">lin</span></td>
  </tr></table>`;
}

// Todos los mails comparten esta cáscara: sin tarjeta, sin fondo de color,
// solo el contenido centrado con un ancho máximo, como un mail normal.
function cascara(bodyHtml: string): string {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:${F_BODY};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 16px;">
  <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px;max-width:480px;text-align:left;"><tr><td>
    ${bodyHtml}
  </td></tr></table>
</td></tr></table>
</body>
</html>`;
}

// Pie de los avisos de la prueba, con la baja en un clic.
function bajaFooter(unsubscribeUrl: string): string {
  return `<p style="margin:28px 0 0;padding-top:14px;border-top:1px solid #e0d9cc;font-size:12px;color:${INK_MUTE};line-height:1.6;font-family:${F_BODY};">
    Te escribimos porque pediste una prueba de Mercalin. <a href="${unsubscribeUrl}" style="color:${INK_MUTE};">Darte de baja de estos avisos</a>.
  </p>`;
}

// Día 3 de la prueba: todavía activa, es solo un empujón para que la instale
// si no lo hizo, o siga usándola si ya arrancó.
export function trialDay3EmailHtml(opts: { productName: string; siteUrl: string; unsubscribeUrl: string }): string {
  const { siteUrl, unsubscribeUrl } = opts;
  return cascara(`
    ${encabezado()}
    <h1 style="margin:0 0 12px;font-family:${F_BODY};font-size:21px;color:${INK};">¿Ya instalaste Mercalin?</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${INK_SOFT};">Van 3 días de tu prueba gratis. Si todavía no la instalaste, es un buen momento — te quedan unos días para probarla con tus productos reales, no con datos de ejemplo.</p>
    <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:${INK_SOFT};">Si te trabaste en algo, ${linkWhatsApp()} y te ayudamos.</p>
    <p style="margin:0;font-size:13.5px;font-family:${F_BODY};"><a href="${siteUrl}/preguntas-frecuentes" style="color:${BRAND};">Ver preguntas frecuentes →</a></p>
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
  const { expiresAt, siteUrl, productSlug, unsubscribeUrl } = opts;
  return cascara(`
    ${encabezado()}
    <h1 style="margin:0 0 12px;font-family:${F_BODY};font-size:21px;color:${INK};">Tu prueba se vence mañana</h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${INK_SOFT};">${fechaAr(expiresAt)} — cuando se venza, el sistema se bloquea. <strong style="color:${INK};">Nada de lo que cargaste se borra.</strong> Si comprás la licencia completa, seguís exactamente donde estabas.</p>
    ${boton(`${siteUrl}/carrito?product=${productSlug}`, "Comprar ahora")}
    <p style="margin:20px 0 0;font-size:14px;color:${INK_SOFT};font-family:${F_BODY};">¿Alguna duda antes de decidir? ${linkWhatsApp()}.</p>
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
  const { siteUrl, productSlug, unsubscribeUrl } = opts;
  return cascara(`
    ${encabezado()}
    <h1 style="margin:0 0 12px;font-family:${F_BODY};font-size:21px;color:${INK};">Se venció tu prueba</h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${INK_SOFT};"><strong style="color:${INK};">Nada de lo que cargaste se borró.</strong> Cuando quieras seguir, comprás la licencia completa y la activás con el mismo mail — retomás justo donde quedaste.</p>
    ${boton(`${siteUrl}/carrito?product=${productSlug}`, "Comprar la licencia")}
    <p style="margin:20px 0 0;font-size:14px;color:${INK_SOFT};font-family:${F_BODY};">Si probaste y no te sirvió, contanos por qué — a veces se resuelve con una respuesta. ${linkWhatsApp()}.</p>
    ${bajaFooter(unsubscribeUrl)}
  `);
}

export function licenseEmailHtml(opts: {
  productName: string;
  kind: "trial" | "full";
  licenseKey: string;
  downloadUrl: string | null;
  expiresAt: Date | null;
  gifted?: boolean;
}): string {
  const { kind, licenseKey, downloadUrl, expiresAt, gifted } = opts;
  const esFull = kind === "full";
  const titulo = gifted ? "¡Tenés Mercalin!" : esFull ? "¡Gracias por tu compra!" : "Tu prueba está lista";
  const intro = gifted
    ? `Te regalamos tu licencia de Mercalin. <strong style="color:${INK};">No vence</strong> ni se renueva.`
    : esFull
    ? `Tu licencia de Mercalin ya es tuya. <strong style="color:${INK};">No vence</strong> ni se renueva — la pagaste una sola vez.`
    : `Tenés <strong style="color:${INK};">7 días</strong> para probarla con tus productos reales, hasta el ${expiresAt ? fechaAr(expiresAt) : ""}. Después se bloquea, pero no se borra nada.`;

  return cascara(`
    ${encabezado()}
    <h1 style="margin:0 0 12px;font-family:${F_BODY};font-size:22px;color:${INK};">${titulo}</h1>
    <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:${INK_SOFT};">${intro}</p>

    <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:${INK};">1. Descargá el instalador</p>
    ${downloadUrl ? boton(downloadUrl, "Descargar Mercalin-setup.exe") : `<p style="margin:0;font-size:14px;color:${INK_SOFT};">Todavía no hay un link de descarga cargado — respondé este mail y te lo mandamos a mano.</p>`}
    <p style="margin:12px 0 0;font-size:13.5px;line-height:1.5;color:${INK_SOFT};"><strong style="color:${BRAND};">Importante:</strong> instalalo en tu computadora con Windows, no en el celular. Mercalin no funciona en Android ni iOS.</p>

    <p style="margin:24px 0 6px;font-size:15px;font-weight:bold;color:${INK};">2. Activalo con este código${esFull ? " (no vence)" : ""}</p>
    <p style="margin:0;padding:12px 14px;background:#f5f2ea;border-radius:5px;font-family:${F_MONO};font-size:13px;color:${INK};word-break:break-all;line-height:1.5;">${licenseKey}</p>

    <p style="margin:24px 0 0;font-size:14px;color:${INK_SOFT};font-family:${F_BODY};">¿Alguna duda? Respondé este mail o ${linkWhatsApp()}.</p>
  `);
}
