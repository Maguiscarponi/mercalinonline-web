/* Toldo de comercio: franjas rojas y blancas con festón. Es un patrón SVG que
   se repite, así se estira a cualquier ancho sin deformarse. Dos tamaños: uno
   más bajo para celular. Colores planos, sin degradés.

   Cada franja es UN solo trazado (cuerpo + curva), no un rectángulo más una
   curva: al dibujarlos por separado quedaba una línea finita en la unión. La
   curva termina un píxel antes del borde del patrón para que tampoco se marque
   ahí.

   El patrón es más alto que el dibujo (alto + 24): si no, con zoom o pantallas
   de escala fraccionaria (125 %, 150 %) se asoma la primera fila de la repetición
   siguiente y aparece una línea roja fina debajo de cada curva roja. */

function Franja({ id, franja, alto, feston }: { id: string; franja: number; alto: number; feston: number }) {
  const cuerpo = alto - feston;
  const r = franja / 2;
  const ry = feston - 1;
  const trazo = (x: number) => `M${x} 0H${x + franja}V${cuerpo}A${r} ${ry} 0 0 1 ${x} ${cuerpo}Z`;
  return (
    <svg aria-hidden width="100%" height={alto} className="block">
      <defs>
        <pattern id={id} width={franja * 2} height={alto + 24} patternUnits="userSpaceOnUse">
          <path d={trazo(0)} fill="#e1251b" />
          <path d={trazo(franja)} fill="#fffdf7" />
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
