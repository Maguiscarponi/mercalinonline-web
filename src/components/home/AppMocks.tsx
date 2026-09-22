import Barcode from "@/components/retro/Barcode";

/* ─────────────────────────────────────────────────────────────────────────
   Recreaciones en código de tres pantallas reales de Mercalin (Caja,
   Consejo del día, Etiquetas), para la sección "La pantalla real" de la
   home. No son screenshots: son HTML/CSS armado con los mismos datos que
   ya usamos en el resto del sitio (el kiosco "Don Jorge", los mismos
   productos y precios del ticket del hero). Por qué:

   - Se ven nítidas en cualquier pantalla — una imagen de 1919px reescalada
     a 340px en un celular pierde definición; esto es vector y texto real.
   - Colores propios de la app (el índigo de "Operación", no el rojo del
     sitio) para que siga leyéndose como "esto es el programa de verdad",
     distinto del marketing alrededor.
   - Podemos animar la aparición (las etiquetas) y no arrastramos errores
     de una captura vieja.
   ───────────────────────────────────────────────────────────────────────── */

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

/* ── Caja ── */
const ITEMS_CAJA = [
  ["Agua Mineral Villa San Remo (1,5 L)", 1200],
  ["9 de Oro Azucaradas", 1200],
  ["Alfajor de Dulce de Leche", 2000],
  ["Arroz con Remolacha Molé", 1500],
  ["Azúcar Mascabo Ledesma (800 g)", 2000],
  ["Alfajor Havanna (25 g)", 1500],
  ["Alfajor Oreo (56 g)", 900],
] as const;
const TOTAL_CAJA = ITEMS_CAJA.reduce((acc, [, p]) => acc + p, 0); // $10.300, igual que el ticket del hero
const ARTICULOS_CAJA = ITEMS_CAJA.length;

export function CajaMock() {
  return (
    <div className="bg-white text-[#1a1a2e]">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] px-4 py-2.5">
        <span className="font-sans text-[13px] font-bold uppercase tracking-wide text-white">Caja</span>
        <span className="font-sans text-[11px] text-white/70">Lista: Minorista</span>
      </div>

      <div className="px-4 pt-4">
        <div className="rounded-md border border-[#e3e2ea] bg-[#f7f7fb] px-3 py-2.5 font-sans text-[13px] text-[#9491a8]">
          Código de barras o nombre del producto…
        </div>
      </div>

      <div className="mt-3 px-4">
        {ITEMS_CAJA.map(([nombre, precio]) => (
          <div key={nombre} className="flex items-center gap-2 border-b border-[#f0f0f5] py-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-[13px] font-semibold leading-tight">{nombre}</p>
              <p className="font-sans text-[11px] text-[#9491a8]">{money(precio)} c/u</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded border border-[#e3e2ea] font-sans text-[13px] text-[#6d28d9]">
                −
              </span>
              <span className="w-4 text-center font-sans text-[13px]">1</span>
              <span className="flex h-6 w-6 items-center justify-center rounded border border-[#e3e2ea] font-sans text-[13px] text-[#6d28d9]">
                +
              </span>
            </div>
            <span className="shrink-0 whitespace-nowrap text-right font-sans text-[13px] font-bold">{money(precio)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#eeedf3] bg-[#faf9fd] px-4 py-3">
        <p className="font-sans text-[10.5px] uppercase tracking-wide text-[#9491a8]">Total a cobrar</p>
        <p className="font-sans text-[30px] font-extrabold leading-tight">{money(TOTAL_CAJA)}</p>
        <p className="mt-0.5 font-sans text-[11.5px] text-[#9491a8]">{ARTICULOS_CAJA} artículos</p>
        <button
          type="button"
          tabIndex={-1}
          className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-md bg-[#4f46e5] py-3 font-sans text-[14px] font-bold text-white"
        >
          Cobrar
          <span className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px] font-normal tracking-wide">
            Enter · F2
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Consejo del día ── */
type Alerta = { nivel: "urgente" | "importante"; texto: string; nota: string; link: string };
const ALERTAS: Alerta[] = [
  {
    nivel: "urgente",
    texto: "Fernet Branca (750 ml) se agota en ~0,3 días al ritmo actual",
    nota: "3 unidades · velocidad 10,3/día · pedí hoy",
    link: "Ver proveedores →",
  },
  {
    nivel: "urgente",
    texto: "Alfajor Havanna (25 g) se agota en ~0,4 días al ritmo actual",
    nota: "4 unidades · velocidad 9,2/día · pedí hoy",
    link: "Ver proveedores →",
  },
  {
    nivel: "importante",
    texto: "$18.400 inmovilizados en productos sin vender hace 30 días",
    nota: "Arroz con Leche Light Tregar, Fideos Tallarín y 1 más",
    link: "Ver stock sin movimiento →",
  },
];

export function ConsejoMock() {
  return (
    <div className="bg-white px-4 py-4 text-[#1a1a2e]">
      <p className="font-sans text-[12px] font-bold text-[#6d28d9]">Consejo del día (9)</p>
      <div className="mt-3 space-y-2.5">
        {ALERTAS.map((a) => (
          <div
            key={a.texto}
            className={`rounded-r-md border-l-[3px] py-2 pl-3 pr-2.5 ${
              a.nivel === "urgente" ? "border-[#dc2626] bg-[#fef2f2]" : "border-[#d97706] bg-[#fffbeb]"
            }`}
          >
            <span
              className={`font-sans text-[9.5px] font-bold uppercase tracking-wide ${
                a.nivel === "urgente" ? "text-[#dc2626]" : "text-[#b45309]"
              }`}
            >
              {a.nivel === "urgente" ? "Urgente" : "Importante"}
            </span>
            <p className="mt-0.5 font-sans text-[12.5px] font-semibold leading-snug">{a.texto}</p>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <span className="font-sans text-[11px] text-[#726f85]">{a.nota}</span>
              <span className="font-sans text-[11px] font-semibold text-[#4f46e5]">{a.link}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Etiquetas ── */
const ETIQUETAS = [
  { nombre: "9 DE ORO AZUCARADAS", precio: 1200, cat: "Golosinas", seed: 3 },
  { nombre: "ALFAJOR DE DULCE DE LECHE", precio: 2000, cat: "Golosinas", seed: 9 },
  { nombre: "AGUA MINERAL VILLA SAN REMO (1,5 L)", precio: 1200, cat: "Bebidas", seed: 15 },
  { nombre: "ALFAJOR HAVANNA (25 G)", precio: 1500, cat: "Golosinas", seed: 21 },
];

export function EtiquetasMock() {
  return (
    <div className="bg-[#f4f3f8] p-3">
      <div className="grid grid-cols-2 gap-2.5">
        {ETIQUETAS.map((e, i) => (
          <div
            key={e.nombre}
            className="etiqueta-in rounded border border-[#e3e2ea] bg-white p-2.5"
            style={{ animationDelay: `${i * 0.22}s` }}
          >
            <p className="font-sans text-[9.5px] font-bold uppercase leading-tight text-[#1a1a2e]">{e.nombre}</p>
            <p className="mt-1 font-sans text-[19px] font-extrabold leading-none text-[#1a1a2e]">{money(e.precio)}</p>
            <div className="mt-1.5">
              <Barcode width={140} height={22} seed={e.seed} color="#1a1a2e" />
            </div>
            <div className="mt-0.5 flex justify-between font-sans text-[8px] text-[#a09dae]">
              <span>{e.cat}</span>
              <span>Kiosco Don Jorge</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
