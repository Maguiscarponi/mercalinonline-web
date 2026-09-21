// Nombres legibles para los eventos y lugares de la analítica (ver
// src/lib/events.ts). Si se agrega un evento nuevo, agregarlo acá también.

export const EVENT_LABELS: Record<string, string> = {
  page_view: "Vio una página",
  cta_trial_clicked: "Clic en probar gratis",
  cta_buy_clicked: "Clic en comprar",
  cta_detail_clicked: "Clic en ver detalle",
  whatsapp_clicked: "Clic en WhatsApp",
  hero_demo_tab_clicked: "Miró una pestaña de la demo (portada)",
  demo_section_viewed: "Llegó a la demo",
  demo_module_viewed: "Miró un módulo de la demo",
  demo_capture_opened: "Abrió una captura",
  pricing_viewed: "Llegó al precio",
  trial_form_started: "Empezó el formulario de prueba",
  buy_form_started: "Empezó el formulario de compra",
  trial_started: "Pidió la prueba gratis",
  trial_resent: "Volvió a pedir la prueba (se le reenvió la misma)",
  checkout_started: "Fue a pagar a Mercado Pago",
  payment_approved: "Pago aprobado",
  payment_failed: "Pago rechazado o cancelado",
  email_day3_sent: "Mail de día 3 enviado",
  email_expiring_sent: "Mail de \"vence mañana\" enviado",
  email_expired_sent: "Mail de \"venció\" enviado",
  email_delivered: "Mail entregado",
  email_bounced: "Mail rebotado (no llegó)",
  email_complained: "Marcó un mail como spam",
  email_opened: "Abrió un mail",
  email_clicked: "Hizo clic en un mail",
  email_failed: "Mail que no se pudo enviar",
  email_delayed: "Mail demorado",
  unsubscribed: "Pidió no recibir más avisos",
};

export const MAIL_TYPE_LABELS: Record<string, string> = {
  trial_license: "Clave de la prueba",
  purchase_license: "Clave de la compra",
  trial_day3: "Aviso de día 3",
  trial_expiring: "Aviso de \"vence mañana\"",
  trial_expired: "Aviso de \"venció\"",
};

export function mailTypeLabel(t: string | null | undefined): string {
  if (!t) return "Otro";
  return MAIL_TYPE_LABELS[t] ?? t;
}

export const LOCATION_LABELS: Record<string, string> = {
  hero: "Portada",
  hero_more_modules: "Portada · \"+15 módulos\"",
  navbar: "Barra superior",
  product_top: "Ficha del producto (arriba)",
  product_bottom: "Ficha del producto (abajo)",
  product_card: "Tarjeta de precio",
  float: "Botón flotante",
  footer: "Pie de página",
  arca: "Sección ARCA",
  gracias: "Página de gracias",
};

export function eventLabel(name: string): string {
  return EVENT_LABELS[name] ?? name;
}

export function locationLabel(loc: string | null | undefined): string {
  if (!loc) return "—";
  return LOCATION_LABELS[loc] ?? loc;
}

type Props = Record<string, unknown> | null;

// Detalle corto de un evento para la línea de tiempo.
export function eventDetail(name: string, props: Props, path: string | null): string {
  const p = props ?? {};
  switch (name) {
    case "page_view":
      return path ?? "";
    case "demo_module_viewed":
      return [p.group, p.module].filter(Boolean).join(" › ");
    case "demo_capture_opened":
    case "hero_demo_tab_clicked":
      return String(p.module ?? "");
    case "payment_approved":
      return p.amount ? `$${Number(p.amount).toLocaleString("es-AR")}` : "";
    case "payment_failed":
      return [p.status, p.detail].filter(Boolean).join(" · ");
    case "email_delivered":
    case "email_opened":
    case "email_clicked":
    case "email_failed":
    case "email_delayed":
    case "email_complained":
      return mailTypeLabel(p.type as string | null);
    case "email_bounced":
      return [mailTypeLabel(p.type as string | null), p.bounce].filter(Boolean).join(" · ");
    case "checkout_started":
      return p.amount ? `$${Number(p.amount).toLocaleString("es-AR")}` : "";
    default:
      return p.location ? locationLabel(String(p.location)) : "";
  }
}
