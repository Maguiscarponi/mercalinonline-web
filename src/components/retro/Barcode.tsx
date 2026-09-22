/* Código de barras decorativo. Determinístico: siempre dibuja lo mismo para
   una misma `seed`, así el HTML del servidor y el del navegador coinciden
   (y dos códigos con distinta seed no se ven idénticos uno al lado del otro). */
function generarBarras(width: number, seed0: number): { x: number; w: number }[] {
  let seed = seed0;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const barras: { x: number; w: number }[] = [];
  let x = 0;
  while (x < width) {
    const w = 1 + Math.floor(rnd() * 3.4);
    const hueco = 1 + Math.floor(rnd() * 2.6);
    if (x + w > width) break;
    barras.push({ x, w });
    x += w + hueco;
  }
  return barras;
}

export default function Barcode({
  width = 320,
  height = 60,
  seed = 7,
  color = "#232120",
}: {
  width?: number;
  height?: number;
  seed?: number;
  color?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      className="block h-auto w-full"
      preserveAspectRatio="none"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {generarBarras(width, seed).map((b) => (
        <rect key={b.x} x={b.x} y={0} width={b.w} height={height} fill={color} />
      ))}
    </svg>
  );
}
