// Un solo producto existe hoy — la estructura está pensada para poder sumar
// otros (ej. "Mercalin con ARCA", "Mercalin Ferreterías") sin rediseñar nada,
// pero NO se crea contenido ficticio para productos que todavía no existen.

export interface FeatureGroup {
  title: string;
  items: string[];
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceArs: number;
  idealFor: string[];
  featureGroups: FeatureGroup[];
}

export const PRODUCTS: Product[] = [
  {
    slug: "mercalin",
    name: "Mercalin — Sistema de gestión sin ARCA",
    tagline: "Sistema de gestión para comercios que venden productos.",
    description:
      "Ventas, stock, caja, clientes y proveedores, todo en un solo sistema. Se instala en la computadora del negocio y funciona con o sin internet — no depende de un servidor externo. Incluye un motor de recomendaciones que analiza las ventas reales del negocio y avisa antes de que haga falta preguntar.",
    priceArs: 65000,
    idealFor: [
      "Kioscos",
      "Almacenes",
      "Minimercados",
      "Ferreterías",
      "Indumentaria",
      "Librerías",
      "Bazares",
      "Otros comercios con productos y stock",
    ],
    featureGroups: [
      {
        title: "Ventas y caja",
        items: [
          "Venta por escaneo de código de barras o búsqueda por nombre",
          "Efectivo, débito, crédito, QR, transferencia, cuenta corriente y pagos mixtos",
          "Apertura y cierre de caja con efectivo esperado calculado solo",
          "Devoluciones y cambios sin romper el historial de ventas",
          "Funciona sin conexión — la base de datos vive en la computadora del negocio",
        ],
      },
      {
        title: "Stock y productos",
        items: [
          "Alertas de stock crítico según la velocidad real de venta de cada producto",
          "Control de vencimientos y lotes",
          "Conteo físico de inventario con ajuste masivo",
          "Impresión de etiquetas con código de barras",
          "Combos y productos pesables",
        ],
      },
      {
        title: "Clientes y proveedores",
        items: [
          "Cuenta corriente por cliente, con alertas de cuentas vencidas",
          "Pedidos a proveedores con recepción de mercadería",
          "Presupuestos que se convierten en venta con un clic",
        ],
      },
      {
        title: "Informes",
        items: [
          "Reportes de ventas, márgenes reales y valor de stock",
          "Comparación con períodos anteriores",
          "Motor de consejos: analiza 90 días de ventas propias y recomienda acciones concretas — qué reponer, qué precio ajustar, qué cliente dejó de comprar",
        ],
      },
      {
        title: "Configuración",
        items: [
          "Múltiples usuarios con permisos por rol",
          "Metas de venta y costos fijos del negocio",
          "Backup automático — local o a una carpeta sincronizada con OneDrive, Google Drive o Dropbox",
          "Actualizaciones automáticas",
        ],
      },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
