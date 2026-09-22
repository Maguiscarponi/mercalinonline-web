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

// Estilo retro de la web (mismos colores/tipografías que src/app/globals.css)
// llevado a HTML de mail: sin flexbox/grid (Outlook de escritorio no los
// soporta, así que el layout de dos columnas del encabezado usa <table>) y
// con familias tipográficas de respaldo por si el cliente de mail bloquea la
// fuente de Google Fonts.
const FONTS_LINK =
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Barlow+Condensed:wght@600;700&family=Courier+Prime:wght@400;700&family=Source+Sans+3:wght@400;600;700&display=swap">';
const F_SLAB = "'Alfa Slab One', Georgia, serif";
const F_LABEL = "'Barlow Condensed', Impact, sans-serif";
const F_MONO = "'Courier Prime', 'Courier New', monospace";
const F_BODY = "'Source Sans 3', Arial, sans-serif";
const BRAND = "#e1251b";
const INK = "#232120";
const INK_SOFT = "#4f4942";
const INK_MUTE = "#8a8175";
// El crema clarito (--cream, #f3eee2) casi no se distingue del blanco de la
// página en una bandeja real -- acá conviene el crema más oscuro del sitio
// (--cream-2) para que el contraste se note de verdad, no solo en la vista
// previa del navegador.
const CREAM = "#eadfcc";

function boton(href: string, texto: string, opts?: { sombra?: string; grande?: boolean }): string {
  const sombra = opts?.sombra ?? BRAND;
  const pad = opts?.grande ? "15px 26px" : "12px 20px";
  const size = opts?.grande ? "15px" : "13.5px";
  return `<a href="${href}" style="display:inline-block;background:${INK};color:#fff;font-family:${F_LABEL};font-weight:700;letter-spacing:0.5px;text-transform:uppercase;font-size:${size};text-decoration:none;padding:${pad};border:3px solid ${INK};box-shadow:4px 4px 0 ${sombra};">${texto}</a>`;
}

function botonWhatsApp(texto = "Escribinos por WhatsApp"): string {
  return boton("https://wa.me/542344502904", texto);
}

function etiqueta(texto: string): string {
  return `<div style="font-family:${F_LABEL};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${INK_MUTE};margin-bottom:8px;">${texto}</div>`;
}

function sello(arriba: string, abajo: string, color: string, rot = -8): string {
  return `<div style="width:70px;height:70px;border:3px solid ${color};border-radius:50%;text-align:center;transform:rotate(${rot}deg);">
    <div style="padding-top:${abajo ? "20px" : "27px"};font-family:${F_LABEL};font-weight:700;color:${color};letter-spacing:0.5px;line-height:1.15;">
      <div style="font-size:10px;">${arriba}</div>
      ${abajo ? `<div style="font-size:12.5px;">${abajo}</div>` : ""}
    </div>
  </div>`;
}

// Encabezado de todos los mails: isotipo + wordmark + sello, en una tabla (no
// flex) para que Outlook de escritorio también alinee las columnas bien. El
// isotipo es un PNG real (no SVG: en Outlook y algunos webmail no se ve) --
// vive en /apple-icon.png, ya publicado en el sitio.
function encabezado(selloHtml: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;"><tr>
    <td style="vertical-align:middle;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle;"><img src="https://mercalinonline.com/apple-icon.png" width="34" height="34" alt="Mercalin" style="display:block;border-radius:8px;"></td>
        <td style="vertical-align:middle;padding-left:9px;font-family:'Caprasimo',${F_SLAB};font-size:22px;color:${INK};">Merca<span style="color:${BRAND};">lin</span></td>
      </tr></table>
    </td>
    <td align="right" style="vertical-align:middle;">${selloHtml}</td>
  </tr></table>`;
}

function avisoComputadora(): string {
  return `<div style="margin-top:16px;background:#fdfbf5;border:2px solid ${BRAND};padding:14px 16px;">
    <p style="margin:0;font-size:13px;line-height:1.55;color:${INK};font-family:${F_BODY};">⚠ <strong>Importante:</strong> instalalo en tu <strong>computadora con Windows</strong>, no en el celular. Mercalin no funciona en Android ni iOS.</p>
  </div>`;
}

// Todos los mails comparten esta cáscara: la tarjeta con borde duro (el
// mismo lenguaje visual que las "ventanas" y tickets del sitio), fondo de
// PÁGINA blanco y adentro el crema del sitio. Armada con <table>, no <div>
// -- es el formato a prueba de balas para mail: la app de Gmail en el
// celular usa un motor de renderizado distinto al de Gmail en la web, y un
// <div> con max-width/background puede perderse ahí aunque en el navegador
// (o en la vista previa del admin) se vea perfecto. Con tablas, todo motor
// de mail sabe qué hacer.
function cascara(bodyHtml: string): string {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">${FONTS_LINK}</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:${F_BODY};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;"><tr><td align="center" style="padding:24px 12px;">

  <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="width:520px;max-width:520px;background:#ffffff;border:3px solid ${INK};box-shadow:6px 6px 0 ${INK};"><tr><td style="padding:30px 26px 26px;background:${CREAM};">
    ${bodyHtml}
  </td></tr></table>

  <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="width:520px;max-width:520px;"><tr><td align="center" style="padding-top:14px;font-family:${F_MONO};font-size:10.5px;color:${INK_MUTE};">mercalinonline.com</td></tr></table>

</td></tr></table>
</body>
</html>`;
}

// Pie de los avisos de la prueba, con la baja en un clic.
function bajaFooter(unsubscribeUrl: string): string {
  return `<div style="margin-top:26px;padding-top:14px;border-top:2px dashed ${INK};font-size:12px;color:${INK_MUTE};line-height:1.6;font-family:${F_BODY};">
    Te escribimos porque pediste una prueba de Mercalin. <a href="${unsubscribeUrl}" style="color:${INK_MUTE};">Darte de baja de estos avisos</a>.
  </div>`;
}

// Día 3 de la prueba: todavía activa, es solo un empujón para que la instale
// si no lo hizo, o siga usándola si ya arrancó.
export function trialDay3EmailHtml(opts: { productName: string; siteUrl: string; unsubscribeUrl: string }): string {
  const { siteUrl, unsubscribeUrl } = opts;
  return cascara(`
    ${encabezado(`<div style="font-family:${F_LABEL};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${INK_MUTE};border:2px solid ${INK_MUTE};padding:5px 10px;display:inline-block;">Día 3 de 7</div>`)}
    <h1 style="margin:0 0 10px;font-family:${F_SLAB};font-size:27px;line-height:1.12;color:${INK};">¿Ya instalaste<br/>Mercalin?</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${INK_SOFT};">Van 3 días de tu prueba gratis. Si todavía no la instalaste, es un buen momento — te quedan unos días para probarla con tus productos reales, no con datos de ejemplo.</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${INK_SOFT};">Si te trabaste en algo, escribinos y te ayudamos.</p>
    ${botonWhatsApp()}
    <p style="margin:22px 0 0;font-size:13.5px;font-family:${F_BODY};"><a href="${siteUrl}/preguntas-frecuentes" style="color:#b91d15;">Ver preguntas frecuentes →</a></p>
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
    ${encabezado(sello("ÚLTIMO", "DÍA", BRAND, 7))}
    <h1 style="margin:0 0 8px;font-family:${F_SLAB};font-size:28px;line-height:1.1;color:${INK};">Tu prueba se<br/>vence mañana.</h1>
    <p style="margin:0;font-size:15px;line-height:1.6;color:${INK_SOFT};">${fechaAr(expiresAt)} — cuando se venza, el sistema se bloquea. <strong style="color:${INK};">Nada de lo que cargaste se borra.</strong> Si comprás la licencia completa, seguís exactamente donde estabas.</p>
    <div style="margin-top:22px;">${boton(`${siteUrl}/carrito?product=${productSlug}`, "Comprar ahora", { grande: true })}</div>
    <p style="margin:22px 0 0;font-size:14px;color:${INK_SOFT};font-family:${F_BODY};">¿Alguna duda antes de decidir?</p>
    <div style="margin-top:10px;">${botonWhatsApp()}</div>
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
    ${encabezado(sello("VENCIDO", "", INK_MUTE, -6))}
    <h1 style="margin:0 0 8px;font-family:${F_SLAB};font-size:28px;line-height:1.1;color:${INK};">Se venció<br/>tu prueba.</h1>
    <p style="margin:0;font-size:15px;line-height:1.6;color:${INK_SOFT};"><strong style="color:${INK};">Nada de lo que cargaste se borró.</strong> Cuando quieras seguir, comprás la licencia completa y la activás con el mismo mail — retomás justo donde quedaste.</p>
    <div style="margin-top:22px;">${boton(`${siteUrl}/carrito?product=${productSlug}`, "Comprar la licencia", { grande: true })}</div>
    <p style="margin:22px 0 0;font-size:14px;color:${INK_SOFT};font-family:${F_BODY};">Si probaste y no te sirvió, contanos por qué — a veces se resuelve con una respuesta.</p>
    <div style="margin-top:10px;">${botonWhatsApp()}</div>
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
  const { kind, licenseKey, downloadUrl, expiresAt } = opts;
  const esFull = kind === "full";
  const selloHtml = esFull ? sello("PAGO", "ÚNICO", "#0a7d3e", -9) : sello("7 DÍAS", "GRATIS", BRAND, -9);
  const titulo = esFull ? "¡Gracias por<br/>tu compra!" : "Tu prueba<br/>está lista.";
  const intro = esFull
    ? `Tu licencia de Mercalin ya es tuya. <strong style="color:${INK};">No vence</strong> ni se renueva — la pagaste una sola vez.`
    : `Tenés <strong style="color:${INK};">7 días</strong> para probarla con tus productos reales, hasta el ${expiresAt ? fechaAr(expiresAt) : ""}. Después se bloquea, pero no se borra nada.`;

  return cascara(`
    ${encabezado(selloHtml)}
    <h1 style="margin:0 0 8px;font-family:${F_SLAB};font-size:30px;line-height:1.08;color:${INK};">${titulo}</h1>
    <p style="margin:0 0 26px;font-size:15px;line-height:1.6;color:${INK_SOFT};">${intro}</p>

    ${etiqueta("01 · Descargá el instalador")}
    ${downloadUrl ? boton(downloadUrl, "↓ Descargar Mercalin-setup.exe") : `<p style="margin:0;font-size:14px;color:${INK_SOFT};">Todavía no hay un link de descarga cargado — respondé este mail y te lo mandamos a mano.</p>`}
    ${avisoComputadora()}

    <div style="margin-top:26px;">${etiqueta(`02 · Activalo con este código${esFull ? " · no vence" : ""}`)}</div>
    <div style="border:2px dashed ${INK};background:#fff;padding:16px 18px;">
      <div style="font-family:${F_LABEL};font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${INK_MUTE};margin-bottom:6px;">Clave de activación</div>
      <div style="font-family:${F_MONO};font-size:12.5px;color:${INK};word-break:break-all;line-height:1.5;">${licenseKey}</div>
    </div>

    <div style="margin-top:30px;padding-top:16px;border-top:2px dashed ${INK};font-size:12.5px;color:${INK_MUTE};line-height:1.6;font-family:${F_BODY};margin-bottom:14px;">
      ¿Alguna duda? Respondé este mail o:
    </div>
    ${botonWhatsApp()}
  `);
}
