/* Código de barras decorativo. Determinístico: siempre dibuja lo mismo, así
   el HTML del servidor y el del navegador coinciden. */
function generarBarras(width: number): { x: number; w: number }[] {
  let seed = 7;
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

export default function Barcode({ width = 320, height = 60 }: { width?: number; height?: number }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      className="block h-auto w-full"
      preserveAspectRatio="none"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {generarBarras(width).map((b) => (
        <rect key={b.x} x={b.x} y={0} width={b.w} height={height} fill="#232120" />
      ))}
    </svg>
  );
}
