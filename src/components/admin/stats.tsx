import Link from "next/link";
import { CircleCheck, CircleX, Clock, TriangleAlert } from "lucide-react";
import type { Estado } from "@/lib/clientes";
import { fmtDate } from "@/lib/format";

// Piezas visuales del admin: planas, con líneas finas y etiquetas en
// mayúsculas espaciadas. En los gráficos: una sola serie en el rojo de la
// marca, valor en la punta de cada barra y texto siempre en tonos de texto
// (nunca en el color de la barra). Los estados llevan ícono + palabra, no
// solo color.

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-foreground pb-5">
      <div>
        <h1 className="font-condensed text-[38px] font-extrabold uppercase leading-none tracking-tight text-foreground sm:text-[44px]">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-[15px] text-foreground/60">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function SectionTitle({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="mb-4 mt-12 flex flex-wrap items-end justify-between gap-x-6 gap-y-1 border-b border-foreground pb-2.5">
      <h2 className="font-condensed text-[19px] font-bold uppercase tracking-[0.07em] text-foreground">{children}</h2>
      {note && <p className="text-[13px] text-foreground/50">{note}</p>}
    </div>
  );
}

const TONES = {
  ink: { line: "#1c1917", text: "text-foreground" },
  green: { line: "#0a7d3e", text: "text-accent-green" },
  red: { line: "#e1251b", text: "text-brand" },
  amber: { line: "#b45309", text: "text-amber-700" },
} as const;

export type Tone = keyof typeof TONES;

export function Tile({
  label,
  value,
  hint,
  href,
  tone = "ink",
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  tone?: Tone;
}) {
  const t = TONES[tone];
  const body = (
    <div className="admin-tile h-full px-5 py-5" style={{ ["--tile" as string]: t.line }}>
      <p className="tag-numbered text-[13px] text-foreground/55">{label}</p>
      <p className={`mt-3 text-[36px] font-bold leading-none tracking-tight ${t.text}`}>{value}</p>
      {hint && <p className="mt-3 text-[13px] leading-snug text-foreground/50">{hint}</p>}
    </div>
  );
  return href ? (
    <Link href={href} className="block h-full transition-colors hover:[&>div]:bg-foreground/[0.02]">
      {body}
    </Link>
  ) : (
    body
  );
}

// Aviso de una línea: rótulo · texto · enlace. El borde izquierdo marca el tono.
export function Aviso({
  kicker,
  children,
  href,
  cta,
  tone = "ink",
}: {
  kicker: string;
  children: React.ReactNode;
  href?: string;
  cta?: string;
  tone?: Tone;
}) {
  return (
    <div
      className="flex flex-col gap-1 border border-foreground/12 bg-white/60 px-5 py-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5"
      style={{ borderLeft: `4px solid ${TONES[tone].line}` }}
    >
      <p className="tag-numbered text-[13px] text-foreground">{kicker}</p>
      <p className="min-w-0 flex-1 text-[14.5px] text-foreground/70">{children}</p>
      {href && cta && (
        <Link href={href} className="text-[14px] font-medium text-foreground underline underline-offset-2 hover:text-brand">
          {cta} →
        </Link>
      )}
    </div>
  );
}

// Alerta grande: para lo que pide acción hoy.
export function Alerta({
  kicker,
  title,
  children,
  href,
  cta,
}: {
  kicker: string;
  title: string;
  children?: React.ReactNode;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 border-2 border-brand bg-[#fbe9e7] px-6 py-6">
      <div className="min-w-0 max-w-2xl">
        <p className="tag-numbered text-[13px] text-brand">{kicker}</p>
        <p className="font-condensed mt-1.5 text-[30px] font-extrabold uppercase leading-[1.05] tracking-tight text-brand sm:text-[36px]">
          {title}
        </p>
        {children && <div className="mt-3 text-[15px] leading-relaxed text-foreground/75">{children}</div>}
      </div>
      <Link href={href} className="admin-btn admin-btn-dark px-6 py-3.5">
        {cta}
      </Link>
    </div>
  );
}

const ESTADOS: Record<Estado, { label: string; cls: string; Icon: typeof Clock }> = {
  comprado: { label: "Compró", cls: "bg-emerald-50 text-emerald-800 border-emerald-200", Icon: CircleCheck },
  activa: { label: "En prueba", cls: "bg-stone-100 text-stone-700 border-stone-300", Icon: Clock },
  por_vencer: { label: "Vence pronto", cls: "bg-amber-50 text-amber-800 border-amber-300", Icon: TriangleAlert },
  vencida: { label: "Venció", cls: "bg-red-50 text-red-800 border-red-200", Icon: CircleX },
};

export function EstadoBadge({ estado }: { estado: Estado }) {
  const { label, cls, Icon } = ESTADOS[estado];
  return (
    <span className={`tag-numbered inline-flex items-center gap-1.5 whitespace-nowrap border px-2 py-1 text-[12px] ${cls}`}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
      {label}
    </span>
  );
}

// Barra horizontal: etiqueta · barra · valor en la punta.
export function BarRow({
  label,
  value,
  max,
  right,
  sub,
}: {
  label: string;
  value: number;
  max: number;
  right?: string;
  sub?: string;
}) {
  const pct = max > 0 ? Math.max(value > 0 ? 1.5 : 0, (value / max) * 100) : 0;
  return (
    <div className="grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-3 py-2 sm:grid-cols-[minmax(0,15rem)_1fr_auto]">
      <div className="min-w-0">
        <p className="truncate text-[14px] text-foreground/80">{label}</p>
        {sub && <p className="truncate text-[12px] text-foreground/45">{sub}</p>}
      </div>
      <div className="h-4 bg-foreground/[0.06]">
        <div className="h-4 rounded-r-[2px] bg-brand" style={{ width: `${pct}%` }} />
      </div>
      <p className="min-w-[4.5rem] text-right text-[14px] font-semibold tabular-nums text-foreground">
        {right ?? value.toLocaleString("es-AR")}
      </p>
    </div>
  );
}

// Visitantes por día. Cada columna tiene su valor en el tooltip y hay una
// tabla equivalente debajo para quien prefiera leer los números.
export function Columnas({ data }: { data: { day: string; visitors: number }[] }) {
  const max = Math.max(...data.map((d) => d.visitors), 0);
  const withData = data.filter((d) => d.visitors > 0);
  const short = (day: string) => `${day.slice(8, 10)}/${day.slice(5, 7)}`;
  return (
    <div>
      <div className="flex h-36 items-end gap-[3px]" role="img" aria-label="Visitantes por día">
        {data.map((d) => (
          <div
            key={d.day}
            className="group flex h-full flex-1 items-end"
            title={`${short(d.day)}: ${d.visitors} visitantes`}
          >
            <div
              className="w-full rounded-t-[2px] bg-brand/85 transition-colors group-hover:bg-brand"
              style={{ height: max ? `${Math.max(d.visitors > 0 ? 3 : 0, (d.visitors / max) * 100)}%` : "0%" }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-foreground/45">
        <span>{short(data[0].day)}</span>
        <span>máximo en un día: {max}</span>
        <span>{short(data[data.length - 1].day)}</span>
      </div>
      {withData.length > 0 && (
        <details className="mt-3 text-[13.5px]">
          <summary className="cursor-pointer text-foreground/55 hover:text-foreground">Ver como tabla</summary>
          <table className="mt-2 w-full max-w-xs text-left">
            <tbody className="divide-y divide-black/[0.07]">
              {[...withData].reverse().map((d) => (
                <tr key={d.day}>
                  <td className="py-1.5 text-foreground/65">{fmtDate(d.day + "T12:00:00")}</td>
                  <td className="py-1.5 text-right font-semibold tabular-nums">{d.visitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </div>
  );
}
