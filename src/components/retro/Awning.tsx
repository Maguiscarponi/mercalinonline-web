/* Toldo de comercio: franjas rojas y blancas con feston. Es un patrón SVG que
   se repite, así se estira a cualquier ancho sin deformarse. Dos tamaños: uno
   más bajo para celular. Colores planos, sin degradés. */

function Franja({ id, franja, alto, feston }: { id: string; franja: number; alto: number; feston: number }) {
  const cuerpo = alto - feston;
  const r = franja / 2;
  return (
    <svg aria-hidden width="100%" height={alto} className="block">
      <defs>
        <pattern id={id} width={franja * 2} height={alto} patternUnits="userSpaceOnUse">
          <rect width={franja} height={cuerpo} fill="#e1251b" />
          <path d={`M0 ${cuerpo}a${r} ${feston} 0 0 0 ${franja} 0z`} fill="#e1251b" />
          <rect x={franja} width={franja} height={cuerpo} fill="#fffdf7" />
          <path d={`M${franja} ${cuerpo}a${r} ${feston} 0 0 0 ${franja} 0z`} fill="#fffdf7" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default function Awning({ id = "toldo" }: { id?: string }) {
  return (
    <div aria-hidden className="w-full overflow-hidden leading-[0]">
      <div className="hidden sm:block">
        <Franja id={`${id}-l`} franja={60} alto={90} feston={30} />
      </div>
      <div className="sm:hidden">
        <Franja id={`${id}-s`} franja={36} alto={54} feston={18} />
      </div>
    </div>
  );
}
