/* Sello de goma rojo: aro grueso afuera, aro fino adentro, texto en arco
   arriba y abajo entre los dos, y la palabra grande al centro.

   Es 100% vectorial y escala por CSS (el que lo usa le da el ancho con
   className, ej. "w-24 sm:w-40"): así se ve nítido y ocupa lo mismo,
   proporcionalmente, en cualquier pantalla — nunca desborda ni tapa texto
   de al lado porque quien lo usa reserva su lugar con márgenes, no con un
   tamaño en píxeles fijo que en un celular angosto termina siendo más
   grande que el hueco donde va.

   Para que se lea nítido:
   - la inclinación se aplica DENTRO del SVG (no con CSS): así el navegador
     lo dibuja como vector al tamaño final y no como imagen girada;
   - el texto de arriba y el de abajo corre por la franja entre los dos
     aros, con margen de sobra a cada lado — no la toca ninguno;
   - la tipografía va por `style` (en los atributos de SVG no funciona var()).

   `id` tiene que ser distinto en cada uso de la misma página porque los
   arcos se referencian por id. */
const MONO = { fontFamily: "var(--font-courier), 'Courier New', monospace", fontWeight: 700 } as const;
const SLAB = { fontFamily: "var(--font-alfa), Georgia, serif" } as const;

export default function Stamp({
  id,
  arriba,
  centro,
  abajo,
  className = "",
  fuente = 30,
  rot = -8,
  color = "#e1251b",
}: {
  id: string;
  arriba: string;
  centro: string;
  abajo: string;
  className?: string;
  /** Tamaño de la palabra del centro (en unidades del dibujo, que mide 170). */
  fuente?: number;
  /** Inclinación del sello en grados. */
  rot?: number;
  color?: string;
}) {
  // El arco de las palabras de arriba/abajo mide π·60 ≈ 188 unidades. Si el
  // texto es más largo que eso se corta (SVG no lo envuelve), así que la
  // letra se achica sola cuando hace falta en vez de romperse.
  const masLarga = Math.max(arriba.length, abajo.length);
  const letraArco = masLarga > 13 ? 11.5 : masLarga > 10 ? 13 : 14.5;

  return (
    <svg aria-hidden viewBox="0 0 170 170" className={className}>
      <defs>
        {/* Arriba: el texto se apoya en el arco y crece hacia afuera. */}
        <path id={`${id}-t`} d="M 22 85 a 63 63 0 0 1 126 0" />
        {/* Abajo: mismo radio, el texto "cuelga" hacia afuera. */}
        <path id={`${id}-b`} d="M 22 85 a 63 63 0 0 0 126 0" />
      </defs>
      <g transform={`rotate(${rot} 85 85)`}>
        <circle cx="85" cy="85" r="80" fill="none" stroke={color} strokeWidth="5" />
        <circle cx="85" cy="85" r="48" fill="none" stroke={color} strokeWidth="1.8" />
        <text style={MONO} fontSize={letraArco} letterSpacing="2.4" fill={color} textAnchor="middle">
          <textPath href={`#${id}-t`} startOffset="50%">
            {arriba}
          </textPath>
        </text>
        <text style={MONO} fontSize={letraArco} letterSpacing="2.4" fill={color} textAnchor="middle" dominantBaseline="hanging">
          <textPath href={`#${id}-b`} startOffset="50%">
            {abajo}
          </textPath>
        </text>
        <text x="85" y="86" style={SLAB} fontSize={fuente} fill={color} textAnchor="middle" dominantBaseline="central">
          {centro}
        </text>
      </g>
    </svg>
  );
}
