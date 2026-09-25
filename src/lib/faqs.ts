export type Faq = { q: string; a: string };

// Función, no una lista fija: el precio sale del producto (lo que se cargó
// en el panel admin, Productos → editar) para que cambiarlo ahí lo actualice
// acá también, sin tener que tocar código. La usan preguntas-frecuentes/
// page.tsx (todas) y el teaser de la home (home/Preguntas.tsx, con todas).
export function getFaqs(priceArs: number): Faq[] {
  const precioFmt = `$${priceArs.toLocaleString("es-AR")} ARS`;
  return [
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
    a: `${precioFmt}, pago único.`,
  },
  {
    q: "¿Es una suscripción?",
    a: "No. Se paga una sola vez. La clave completa no vence ni se renueva.",
  },
  {
    q: "¿Cómo se activa?",
    a: "Con tu mail y la clave que recibís. La activación se valida en tu propia computadora.",
  },
  {
    q: "¿Qué incluye?",
    a: "Ventas y caja, stock y productos, clientes y proveedores, informes, y el motor de consejos que analiza tus ventas y te avisa. El detalle completo por módulo está en la ficha de producto.",
  },
  {
    q: "¿Tiene facturación electrónica (ARCA)?",
    a: "Sí. Emite Factura A, B o C real ante ARCA al momento de cobrar, con CAE, y nota de crédito automática si hay una devolución. La configuración es guiada, en 3 pasos.",
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
    q: "¿Las actualizaciones se pagan aparte?",
    a: "No. Las actualizaciones vienen incluidas: el sistema se actualiza solo y no te cobramos de nuevo.",
  },
  ];
}
