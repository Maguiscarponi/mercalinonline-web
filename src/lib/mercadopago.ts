import { MercadoPagoConfig, Preference, Payment, WebhookSignatureValidator } from "mercadopago";

// Sin MP_ACCESS_TOKEN configurado (fase de credenciales), el checkout no se
// arma y el carrito lo muestra honestamente en vez de fallar en silencio.

export function isPaymentsConfigured(): boolean {
  return Boolean(process.env.MP_ACCESS_TOKEN);
}

function getClient(): MercadoPagoConfig {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error("Falta MP_ACCESS_TOKEN en el entorno.");
  return new MercadoPagoConfig({ accessToken });
}

export interface CreatePreferenceInput {
  productSlug: string;
  productName: string;
  priceArs: number;
  email: string;
  siteUrl: string; // base URL, ej. https://mercalin.online
}

// Mercado Pago valida que back_urls y notification_url sean alcanzables desde
// internet. Con el sitio en localhost las rechaza y la preferencia no se crea
// ("No se pudo iniciar el pago"). En local las omitimos: se puede probar el
// checkout igual, lo único que no llega es la notificación del webhook.
function esLocal(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?/i.test(url);
}

export async function createCheckoutPreference(input: CreatePreferenceInput): Promise<string> {
  const preference = new Preference(getClient());
  const local = esLocal(input.siteUrl);

  const response = await preference.create({
    body: {
      items: [
        {
          id: input.productSlug,
          title: input.productName,
          quantity: 1,
          unit_price: input.priceArs,
          currency_id: "ARS",
        },
      ],
      payer: { email: input.email },
      external_reference: `${input.productSlug}|${input.email}`,
      back_urls: {
        success: `${input.siteUrl}/gracias`,
        pending: `${input.siteUrl}/gracias`,
        failure: `${input.siteUrl}/carrito`,
      },
      ...(local
        ? {}
        : {
            auto_return: "approved" as const,
            notification_url: `${input.siteUrl}/api/mercadopago/webhook`,
          }),
      binary_mode: true,
    },
  });

  if (!response.init_point) throw new Error("Mercado Pago no devolvió init_point.");
  return response.init_point;
}

export async function getPayment(paymentId: string) {
  const payment = new Payment(getClient());
  return payment.get({ id: paymentId });
}

export function isWebhookConfigured(): boolean {
  return Boolean(process.env.MP_WEBHOOK_SECRET);
}

export function verifyWebhookSignature(opts: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
}): void {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) throw new Error("Falta MP_WEBHOOK_SECRET en el entorno.");
  WebhookSignatureValidator.validate({
    xSignature: opts.xSignature,
    xRequestId: opts.xRequestId,
    dataId: opts.dataId,
    secret,
  });
}
