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

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
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
  });

  if (error) {
    console.error("[mail] Error enviando con Resend:", error);
    return { sent: false };
  }
  return { sent: true };
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
      ? `Tu prueba gratis de ${productName} está lista. Tenés 7 días para usarla, hasta el ${expiresAt?.toLocaleDateString("es-AR")}.`
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
