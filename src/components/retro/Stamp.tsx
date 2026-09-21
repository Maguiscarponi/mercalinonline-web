/* Sello de goma rojo: dos aros, texto en arco arriba y abajo, y la palabra
   grande al medio, inclinada. `id` tiene que ser distinto en cada uso de la
   misma página porque los arcos se referencian por id. */
export default function Stamp({
  id,
  arriba,
  centro,
  abajo,
  className = "",
  size = 170,
  fuente = 36,
}: {
  id: string;
  arriba: string;
  centro: string;
  abajo: string;
  className?: string;
  size?: number;
  fuente?: number;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 170 170"
      width={size}
      height={size}
      className={className}
      style={{ opacity: 0.95 }}
    >
      <defs>
        <path id={`${id}-t`} d="M 27 85 a 58 58 0 0 1 116 0" />
        <path id={`${id}-b`} d="M 22 85 a 63 63 0 0 0 126 0" />
      </defs>
      <circle cx="85" cy="85" r="80" fill="none" stroke="#e1251b" strokeWidth="5" />
      <circle cx="85" cy="85" r="70" fill="none" stroke="#e1251b" strokeWidth="1.6" />
      <text
        fontFamily="var(--font-courier), monospace"
        fontWeight="700"
        fontSize="13.5"
        letterSpacing="3"
        fill="#e1251b"
        textAnchor="middle"
      >
        <textPath href={`#${id}-t`} startOffset="50%">
          {arriba}
        </textPath>
      </text>
      <text
        fontFamily="var(--font-courier), monospace"
        fontWeight="700"
        fontSize="13.5"
        letterSpacing="3"
        fill="#e1251b"
        textAnchor="middle"
        dominantBaseline="hanging"
      >
        <textPath href={`#${id}-b`} startOffset="50%">
          {abajo}
        </textPath>
      </text>
      <text
        x="85"
        y="97"
        fontFamily="var(--font-alfa), Georgia, serif"
        fontSize={fuente}
        fill="#e1251b"
        textAnchor="middle"
        transform="rotate(-8 85 85)"
      >
        {centro}
      </text>
    </svg>
  );
}
