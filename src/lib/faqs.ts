export type Faq = { q: string; a: string };

// Fuente única: la usan preguntas-frecuentes/page.tsx (todas) y el teaser de
// la home (una selección chica, ver home/FaqTeaser.tsx).
export const FAQS: Faq[] = [
  {
    q: "¿Cómo funciona la prueba de 7 días?",
    a: "Al pedirla te llega un mail con el instalador y una clave de prueba. Los 7 días se cuentan desde que se genera esa clave. La instalás y activás como cualquier producto completo.",
  },
  {
    q: "¿Qué pasa cuando termina la prueba?",
    a: "El sistema se bloquea, pero no borra nada de lo que cargaste. Para seguir usándolo, comprás la clave completa y la ingresás en la misma pantalla — seguís exactamente donde estabas.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "$65.000 ARS, pago único.",
  },
  {
    q: "¿Es una suscripción?",
    a: "No. Se paga una sola vez. La clave completa no vence ni se renueva.",
  },
  {
    q: "¿Cómo se activa?",
    a: "Con tu mail y la clave que recibís. La activación se valida en tu propia computadora, sin necesitar conexión a internet en ese momento.",
  },
  {
    q: "¿Necesito internet para usarlo?",
    a: "Solo para descargarlo e instalarlo la primera vez. Después de instalado, funciona sin conexión — toda la información vive en tu computadora, no en un servidor externo.",
  },
  {
    q: "¿Qué incluye?",
    a: "Ventas y caja, stock y productos, clientes y proveedores, informes, y el motor de consejos que analiza tus ventas y te avisa. El detalle completo por módulo está en la ficha de producto.",
  },
  {
    q: "¿Tiene facturación electrónica (ARCA)?",
    a: "Esta versión no. Si tu comercio necesita facturación electrónica, escribinos por WhatsApp antes de comprar y te contamos cómo lo resolvemos.",
  },
  {
    q: "¿En qué sistemas operativos funciona?",
    a: "Windows.",
  },
  {
    q: "¿Qué recibo después de comprar?",
    a: "El código de activación y el link de descarga por mail.",
  },
  {
    q: "¿Con quién hablo si tengo una duda?",
    a: "Con nosotros, por WhatsApp al +54 2344 50-2904. Soporte 24/7: te responde la persona que hizo el sistema, no un call center.",
  },
  {
    q: "¿Las actualizaciones se pagan aparte?",
    a: "No. Las actualizaciones vienen incluidas: el sistema se actualiza solo y no te cobramos de nuevo.",
  },
];
