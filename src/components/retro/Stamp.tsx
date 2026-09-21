/* Sello de goma rojo: aro grueso afuera, aro fino adentro, texto en arco
   arriba y abajo entre los dos, y la palabra grande al centro.

   Para que se lea nítido:
   - la inclinación se aplica DENTRO del SVG (no con CSS): así el navegador lo
     dibuja como vector al tamaño final y no como imagen girada;
   - el texto de arriba y el de abajo están en la franja entre los aros, sin que
     ninguno los pise, y la palabra del medio queda adentro del aro fino;
   - la tipografía va por `style` (en los atributos de SVG no funciona var()).

   `id` tiene que ser distinto en cada uso de la misma página porque los arcos
   se referencian por id. */
const MONO = { fontFamily: "var(--font-courier), 'Courier New', monospace", fontWeight: 700 } as const;
const SLAB = { fontFamily: "var(--font-alfa), Georgia, serif" } as const;

export default function Stamp({
  id,
  arriba,
  centro,
  abajo,
  className = "",
  size = 180,
  fuente = 30,
  rot = -8,
}: {
  id: string;
  arriba: string;
  centro: string;
  abajo: string;
  className?: string;
  size?: number;
  /** Tamaño de la palabra del centro (en unidades del dibujo, que mide 170). */
  fuente?: number;
  /** Inclinación del sello en grados. */
  rot?: number;
}) {
  return (
    <svg aria-hidden viewBox="0 0 170 170" width={size} height={size} className={className}>
      <defs>
        {/* Arriba: el texto se apoya en el arco y crece hacia afuera. */}
        <path id={`${id}-t`} d="M 25 85 a 60 60 0 0 1 120 0" />
        {/* Abajo: el arco va de izquierda a derecha por debajo y el texto
            "cuelga" hacia afuera, así queda a la misma distancia del centro. */}
        <path id={`${id}-b`} d="M 25 85 a 60 60 0 0 0 120 0" />
      </defs>
      <g transform={`rotate(${rot} 85 85)`}>
        <circle cx="85" cy="85" r="80" fill="none" stroke="#e1251b" strokeWidth="5" />
        <circle cx="85" cy="85" r="52" fill="none" stroke="#e1251b" strokeWidth="1.8" />
        <text style={MONO} fontSize="14.5" letterSpacing="2.6" fill="#e1251b" textAnchor="middle">
          <textPath href={`#${id}-t`} startOffset="50%">
            {arriba}
          </textPath>
        </text>
        <text style={MONO} fontSize="14.5" letterSpacing="2.6" fill="#e1251b" textAnchor="middle" dominantBaseline="hanging">
          <textPath href={`#${id}-b`} startOffset="50%">
            {abajo}
          </textPath>
        </text>
        <text x="85" y="85" style={SLAB} fontSize={fuente} fill="#e1251b" textAnchor="middle" dominantBaseline="central">
          {centro}
        </text>
      </g>
    </svg>
  );
}
