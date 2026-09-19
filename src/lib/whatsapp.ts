// El teléfono no se muestra en ningún lado como texto: sólo se usa para
// armar el link de WhatsApp, así nadie lo puede copiar de la página.
export const WHATSAPP_NUMBER = "542344502904";

export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Mensaje precargado según en qué parte del sitio está el visitante — para
// que quien escribe no tenga que explicar desde cero dónde está parado.
export function whatsappMessageForPath(pathname: string): string {
  if (pathname.startsWith("/prueba-gratis")) {
    return "Hola, estoy por probar Mercalin y tengo una consulta.";
  }
  if (pathname.startsWith("/carrito")) {
    return "Hola, quiero comprar Mercalin y tengo una consulta.";
  }
  if (pathname.startsWith("/gracias")) {
    return "Hola, acabo de pedir Mercalin y tengo una consulta.";
  }
  if (pathname.startsWith("/productos")) {
    return "Hola, estoy interesado en probar Mercalin.";
  }
  return "Hola, tengo una consulta sobre Mercalin.";
}
