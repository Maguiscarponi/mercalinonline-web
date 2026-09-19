import fs from "node:fs";
import path from "node:path";

/**
 * Los 18 módulos del sistema, agrupados y con el mismo color que tienen en
 * la app (ver GROUP_ACCENT en kiosco-pos/src/components/Layout.tsx).
 *
 * Cada módulo busca su captura en /public/capturas/<archivo>. Si el archivo
 * todavía no está, el módulo se muestra igual pero sin imagen — así se puede
 * ir subiendo de a una.
 *
 * Fuente única: la usan tanto Modulos.tsx (ficha del producto) como
 * ModuloShowcase.tsx (demo grande de la home) para no mantener el mismo
 * contenido en dos lugares.
 */

export type Modulo = { nombre: string; archivo: string; desc: string; items: string[] };
export type Grupo = { label: string; color: keyof typeof ACENTO; modulos: Modulo[] };

export const ACENTO = {
  indigo:  { punto: "bg-indigo-500",  chip: "bg-indigo-50",  texto: "text-indigo-600",  borde: "border-indigo-100" },
  emerald: { punto: "bg-emerald-500", chip: "bg-emerald-50", texto: "text-emerald-600", borde: "border-emerald-100" },
  amber:   { punto: "bg-amber-500",   chip: "bg-amber-50",   texto: "text-amber-600",   borde: "border-amber-100" },
  violet:  { punto: "bg-violet-500",  chip: "bg-violet-50",  texto: "text-violet-600",  borde: "border-violet-100" },
  stone:   { punto: "bg-stone-400",   chip: "bg-stone-100",  texto: "text-stone-500",   borde: "border-stone-200" },
} as const;

export const GRUPOS: Grupo[] = [
  {
    label: "Operación",
    color: "indigo",
    modulos: [
      {
        nombre: "Caja",
        archivo: "caja.png",
        desc: "La pantalla donde se vende. Pensada para que el cajero no toque el mouse.",
        items: [
          "Buscar por código de barras o por nombre",
          "Cobrar con Enter o F2, precio con F3",
          "Listas de precios: minorista y mayorista",
          "Descuento por monto o por porcentaje",
          "Asignar cliente para vender fiado",
          "Accesos rápidos para lo que no tiene código",
        ],
      },
      {
        nombre: "Gestión de caja",
        archivo: "caja-gestion.png",
        desc: "Apertura, cierre y control del efectivo del turno.",
        items: [
          "Abrir caja con fondo inicial",
          "Registrar ingresos y retiros",
          "Cerrar y ver la diferencia contra lo esperado",
          "Historial de todas las sesiones",
        ],
      },
      {
        nombre: "Clientes",
        archivo: "clientes.png",
        desc: "Cuenta corriente y fiado, sin el cuaderno.",
        items: [
          "Ficha con teléfono y DNI",
          "Límite de crédito por cliente",
          "Deuda actualizada al instante",
          "Registrar pagos parciales",
          "Exportar a Excel",
        ],
      },
      {
        nombre: "Devoluciones",
        archivo: "devoluciones.png",
        desc: "Devolver contra la venta original, sin inventar números.",
        items: [
          "Buscar la venta por número o por cliente",
          "Devolución total o parcial",
          "El stock vuelve solo",
          "Historial de devoluciones",
        ],
      },
    ],
  },
  {
    label: "Catálogo",
    color: "emerald",
    modulos: [
      {
        nombre: "Productos",
        archivo: "productos.png",
        desc: "El corazón del sistema. Más de 7.500 productos ya vienen cargados.",
        items: [
          "Catálogo argentino precargado con código de barras",
          "Costo, precio y margen calculado",
          "Velocidad de venta y días de stock restantes",
          "Importar y exportar Excel",
          "Actualización masiva de precios",
          "Filtros: alertas, sin movimiento, sin precio, inactivos",
        ],
      },
      {
        nombre: "Proveedores",
        archivo: "proveedores.png",
        desc: "No solo la agenda: también cómo se comporta cada uno.",
        items: [
          "Ficha con CUIT y contacto",
          "Órdenes de compra",
          "Proyección de necesidad a 7 días",
          "Lead time real de entrega",
          "Inflación de costos por proveedor",
          "Score de riesgo",
        ],
      },
      {
        nombre: "Categorías y marcas",
        archivo: "categorias.png",
        desc: "Ordenar el catálogo para que los reportes sirvan.",
        items: [
          "Crear y renombrar categorías",
          "Marcas por separado",
          "Ver los productos de cada una",
          "Cantidad de productos a la vista",
        ],
      },
      {
        nombre: "Vencimientos",
        archivo: "vencimientos.png",
        desc: "Control por lote, no por producto. Cada lote con su fecha.",
        items: [
          "Orden FEFO: primero lo que vence antes",
          "Contadores de vencidos, críticos y próximos",
          "Retirar un lote vencido",
          "Generar órdenes de compra para reponer",
        ],
      },
      {
        nombre: "Inventario",
        archivo: "inventario.png",
        desc: "El conteo físico, sin planilla aparte.",
        items: [
          "Carga todos los productos activos",
          "Ingresás lo contado y ajusta solo",
          "Queda registrado en Auditoría",
        ],
      },
      {
        nombre: "Etiquetas",
        archivo: "etiquetas.png",
        desc: "Etiquetas de góndola con código de barras, listas para imprimir.",
        items: [
          "Cuatro plantillas: góndola, precio, completa, código",
          "A4 o impresora térmica",
          "Tamaño en milímetros",
          "Elegís la lista de precios",
          "Vista previa antes de imprimir",
          "Botón para imprimir solo las de stock bajo",
        ],
      },
      {
        nombre: "Combos",
        archivo: "combos.png",
        desc: "Packs a precio fijo que descuentan stock de cada componente.",
        items: [
          "Precio propio para el combo",
          "Código de barras propio",
          "Al venderlo baja el stock de cada producto",
          "Se puede apagar si no lo usás",
        ],
      },
    ],
  },
  {
    label: "Gestión",
    color: "amber",
    modulos: [
      {
        nombre: "Presupuestos",
        archivo: "presupuestos.png",
        desc: "Para el cliente que pregunta antes de comprar.",
        items: [
          "Con o sin cliente asociado",
          "Fecha de validez",
          "Ítems del catálogo o cargados a mano",
          "Descuento global y notas",
          "Seguimiento del estado",
        ],
      },
      {
        nombre: "Promociones",
        archivo: "promociones.png",
        desc: "Descuentos que se aplican solos en la caja.",
        items: [
          "Porcentaje, monto fijo, 2x1 y 3x2",
          "A todo el comercio o a una categoría",
          "Válidas entre dos fechas",
          "Condiciones por horario, días y cantidad",
        ],
      },
      {
        nombre: "Usuarios y permisos",
        archivo: "usuarios.png",
        desc: "Tres roles, para que el cajero vea solo lo que tiene que ver.",
        items: [
          "Administrador: acceso completo",
          "Supervisor: todo menos usuarios y configuración",
          "Cajero: solo ventas y caja",
          "Alta, baja y cambio de contraseña",
        ],
      },
    ],
  },
  {
    label: "Análisis",
    color: "violet",
    modulos: [
      {
        nombre: "Dashboard",
        archivo: "dashboard.png",
        desc: "No muestra gráficos: te dice qué hacer hoy.",
        items: [
          "Ventas, transacciones, ticket promedio y ganancia bruta",
          "Lo más vendido del día",
          "Metas configurables",
          "Tendencia de los últimos 7 días",
          "Alertas de stock crítico con días restantes",
          "Consejo del día ordenado por urgencia",
        ],
      },
      {
        nombre: "Reportes",
        archivo: "reportes.png",
        desc: "Los números que te pide el contador y los que necesitás vos.",
        items: [
          "Hoy, ayer, 7 días, este mes o rango propio",
          "Ventas por medio de pago y por categoría",
          "Márgenes reales y valor del stock",
          "Reposición y afinidad entre productos",
          "Libro IVA",
          "Exportar a Excel o PDF",
        ],
      },
    ],
  },
  {
    label: "Sistema",
    color: "stone",
    modulos: [
      {
        nombre: "Auditoría",
        archivo: "auditoria.png",
        desc: "Quién hizo qué y cuándo. Importante si tenés empleados.",
        items: [
          "Registro de acciones críticas",
          "Filtros por producto, venta, caja y usuario",
          "Búsqueda por detalle o acción",
        ],
      },
      {
        nombre: "Configuración",
        archivo: "configuracion.png",
        desc: "Los datos del negocio y las funciones que querés prender o apagar.",
        items: [
          "Nombre, dirección, teléfono y CUIT",
          "Control de stock opcional",
          "Combos opcionales",
          "Mensaje al pie del ticket",
          "Finanzas, respaldo y sistema",
        ],
      },
    ],
  },
];

/**
 * Lee ancho y alto directo de la cabecera IHDR del PNG (bytes 16 a 24).
 * Evita sumar una dependencia solo para saber el tamaño de una imagen.
 */
export function medidas(archivo: string): { ancho: number; alto: number } | null {
  try {
    const ruta = path.join(process.cwd(), "public", "capturas", archivo);
    if (!fs.existsSync(ruta)) return null;
    const fd = fs.openSync(ruta, "r");
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    const ancho = buf.readUInt32BE(16);
    const alto = buf.readUInt32BE(20);
    if (!ancho || !alto) return null;
    return { ancho, alto };
  } catch {
    return null;
  }
}
