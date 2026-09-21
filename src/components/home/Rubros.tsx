/* Rubros: solo lo que el sistema efectivamente resuelve. Cada frase se apoya
   en módulos que existen (vencimientos, presupuestos, cuenta corriente,
   combos, permisos, etiquetas, promociones). Si sumás un rubro, escribí para
   qué le sirve de verdad, no un adjetivo. */
const RUBROS: [string, string][] = [
  ["Kiosco", "Cobro rápido con código de barras y ventas fiadas."],
  ["Almacén", "Muchos productos, vencimientos por lote y cuenta corriente."],
  ["Minimercado", "Varios empleados con permisos por rol y auditoría."],
  ["Dietética", "Combos, promociones y control de vencimientos."],
  ["Ferretería", "Catálogo grande, presupuestos y cuenta corriente."],
  ["Bazar", "Etiquetas con código de barras y packs a precio fijo."],
  ["Pet shop", "Promociones y proyección de reposición por proveedor."],
  ["Autoservicio", "Cajero, supervisor y administrador, cada uno con sus permisos."],
];

// En la grilla de 2 columnas se lee por columnas (4 y 4), no fila por fila.
const IZQ = RUBROS.slice(0, 4);
const DER = RUBROS.slice(4);

function Fila({ nombre, desc }: { nombre: string; desc: string }) {
  return (
    <div className="flex flex-col gap-1 border-b-[1.5px] border-[var(--line)] py-5 sm:flex-row sm:items-baseline sm:gap-3.5 sm:py-6">
      <span className="font-slab whitespace-nowrap text-[clamp(26px,2.7vw,34px)] leading-none text-ink">{nombre}</span>
      <span aria-hidden className="mb-1.5 hidden flex-1 border-b-[3px] border-dotted border-[#b8ab93] sm:block" />
      <span className="font-typewriter text-[14.5px] leading-snug text-ink-soft sm:w-[17rem] sm:text-right">{desc}</span>
    </div>
  );
}

export default function Rubros() {
  return (
    <section className="flex min-h-[100svh] items-center">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-0">
        <p className="rt-label">Nº 01 · Rubros</p>
        <h2 className="mt-2 text-[clamp(38px,6.6vw,88px)] leading-[1.05] text-ink">Para qué comercios sirve</h2>
        <p className="mt-3 text-[20px] text-ink-soft sm:text-[22px]">Cualquier negocio que venda productos con código de barras.</p>

        <div className="mt-10 grid gap-x-14 sm:mt-14 md:grid-cols-2">
          <div>
            {IZQ.map(([n, d]) => (
              <Fila key={n} nombre={n} desc={d} />
            ))}
          </div>
          <div>
            {DER.map(([n, d]) => (
              <Fila key={n} nombre={n} desc={d} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
