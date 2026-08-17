// Maqueta de la pantalla de Caja. Es un placeholder: cuando tengas una
// captura real con productos cargados, guardala en /public y reemplazá
// este componente por un <Image src="/caja.png" ... />.
export default function CajaMock({ className = "" }: { className?: string }) {
  const items = [
    ["Coca-Cola 2,5 L", "×1", "$3.200"],
    ["Alfajor Havanna (25 g)", "×2", "$3.000"],
    ["Fernet Branca (750 ml)", "×1", "$12.400"],
  ];

  return (
    <div
      className={`overflow-hidden rounded-xl bg-white ${className}`}
      style={{ boxShadow: "0 30px 60px rgba(0,0,0,.35), 0 4px 12px rgba(0,0,0,.18)" }}
    >
      <div className="flex h-6 items-center gap-1.5 bg-[#1b1b1b] px-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      </div>
      <div
        className="tag-numbered flex h-7 items-center px-3 text-[10px] text-white"
        style={{ background: "linear-gradient(90deg,#5b21c9,#7c3aed)" }}
      >
        Caja
      </div>

      <div className="flex gap-2 bg-[#f7f6f4] p-2.5">
        <div className="flex-[1.6] rounded-lg bg-white p-2.5">
          <div className="flex h-7 items-center rounded border-[1.5px] border-[#7c3aed] px-2 font-mono text-[9px] text-[#a8a29e]">
            Código de barras o nombre del producto…
          </div>
          {items.map(([n, q, p]) => (
            <div key={n} className="flex items-center gap-2 border-b border-[#f0eeec] px-1 py-2 text-[9px]">
              <span className="flex-1 font-semibold text-[#292524]">{n}</span>
              <span className="text-[#78716c]">{q}</span>
              <span className="text-[#78716c]">{p}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <div className="rounded-lg bg-white p-2.5 text-center">
            <p className="tag-numbered text-[8px] text-[#a8a29e]">Total a cobrar</p>
            <p className="font-condensed text-[30px] font-extrabold leading-none">$18.600</p>
          </div>
          <div className="tag-numbered rounded-lg bg-[#6d28d9] px-2 py-2.5 text-center text-[12px] text-white">
            Cobrar · F2
          </div>
          <div className="rounded-lg bg-white p-2 text-[8px] text-[#78716c]">
            <b className="block text-[9px] font-semibold text-[#292524]">Acceso rápido</b>
            Cigarrillo suelto · $500
          </div>
        </div>
      </div>
    </div>
  );
}
