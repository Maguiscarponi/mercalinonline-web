// Cliente de la analítica propia (ver src/lib/events.ts y /api/track).
// Sin cookies ni terceros: un id anónimo al azar en localStorage identifica
// al navegador, y otro en sessionStorage a la visita. No se guarda nada
// personal — el mail solo entra cuando la persona misma lo escribe en el
// formulario de prueba o de compra.

const VID_KEY = "mercalin_vid";
const SID_KEY = "mercalin_sid";
const FT_KEY = "mercalin_ft";

export interface Attribution {
  source: string;
  medium: string | null;
  campaign: string | null;
}

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Safari en modo privado (y bloqueos de almacenamiento) tiran error al tocar
// storage: en ese caso el id vale solo mientras la página siga abierta.
const memory: Record<string, string> = {};

function readOrCreate(store: "local" | "session", key: string): string {
  try {
    const s = store === "local" ? window.localStorage : window.sessionStorage;
    let v = s.getItem(key);
    if (!v) {
      v = randomId();
      s.setItem(key, v);
    }
    return v;
  } catch {
    return (memory[key] ??= randomId());
  }
}

export function getVisitorId(): string {
  return readOrCreate("local", VID_KEY);
}

export function getSessionId(): string {
  return readOrCreate("session", SID_KEY);
}

// Primer contacto: el canal por el que la persona llegó la primera vez. Se
// guarda para que, aunque compre días después entrando directo, la compra
// quede atribuida al canal que la trajo.
export function getAttribution(): Attribution {
  try {
    const saved = window.localStorage.getItem(FT_KEY);
    if (saved) return JSON.parse(saved) as Attribution;
  } catch {
    /* seguimos y la calculamos de nuevo */
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  let source = utmSource ? utmSource.toLowerCase() : "directo";

  if (!utmSource && document.referrer) {
    try {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host !== window.location.hostname.replace(/^www\./, "")) source = host;
    } catch {
      /* referrer inválido: queda "directo" */
    }
  }

  const attribution: Attribution = {
    source: source.slice(0, 100),
    medium: params.get("utm_medium")?.toLowerCase().slice(0, 100) ?? null,
    campaign: params.get("utm_campaign")?.toLowerCase().slice(0, 100) ?? null,
  };
  try {
    window.localStorage.setItem(FT_KEY, JSON.stringify(attribution));
  } catch {
    /* sin storage: se recalcula en cada página, es lo mejor que hay */
  }
  return attribution;
}

export function track(name: string, props?: Record<string, string | number | boolean>): void {
  if (typeof window === "undefined") return;
  try {
    let referrer: string | null = null;
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host !== window.location.hostname) referrer = host;
    }
    const a = getAttribution();
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        name,
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        path: window.location.pathname,
        referrer,
        source: a.source,
        medium: a.medium,
        campaign: a.campaign,
        device: window.innerWidth < 768 ? "mobile" : "desktop",
        props,
      }),
    }).catch(() => {});
  } catch {
    /* la analítica nunca rompe la página */
  }
}
