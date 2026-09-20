// Formato para el admin. Todo en horario de Argentina: el servidor corre en
// UTC, y sin fijar la zona una prueba iniciada a las 22 hs se vería como "del
// día siguiente".
const TZ = "America/Argentina/Buenos_Aires";

function toDate(v: string | Date): Date {
  return v instanceof Date ? v : new Date(v);
}

export function fmtDate(v: string | Date | null | undefined): string {
  if (!v) return "—";
  return toDate(v).toLocaleDateString("es-AR", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric" });
}

export function fmtDateTime(v: string | Date | null | undefined): string {
  if (!v) return "—";
  return toDate(v).toLocaleString("es-AR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function fmtArs(n: number | null | undefined): string {
  if (n == null) return "—";
  return "$" + n.toLocaleString("es-AR");
}

export function fmtPct(part: number, total: number): string {
  if (!total) return "—";
  const p = (part / total) * 100;
  return (p >= 10 ? p.toFixed(0) : p.toFixed(1).replace(".", ",")) + "%";
}

// "hace 5 min", "hace 3 h", "hace 2 días"
export function timeAgo(v: string | Date | null | undefined, now = new Date()): string {
  if (!v) return "—";
  const diff = now.getTime() - toDate(v).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "recién";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return `hace ${d} ${d === 1 ? "día" : "días"}`;
}

// Tiempo que falta hasta una fecha, en lenguaje de persona.
export function timeLeft(v: string | Date | null | undefined, now = new Date()): string {
  if (!v) return "—";
  const ms = toDate(v).getTime() - now.getTime();
  if (ms <= 0) return "venció";
  const hours = ms / 3600000;
  if (hours < 24) return `${Math.max(1, Math.round(hours))} h`;
  const days = Math.ceil(hours / 24);
  return `${days} ${days === 1 ? "día" : "días"}`;
}
