import { NextRequest, NextResponse } from "next/server";
import { CLIENT_EVENTS, clip, isBot, recordEvent } from "@/lib/events";
import { SESSION_COOKIE_NAME, isValidSessionCookie } from "@/lib/adminAuth";

// Siempre responde 204: la analítica jamás tiene que mostrarle un error (ni
// demorar nada) a quien está navegando.
const NO_CONTENT = () => new NextResponse(null, { status: 204 });

const ID_RE = /^[a-zA-Z0-9-]{8,64}$/;

// Tope por visitante para que un script no pueda llenar la tabla. Vive en la
// memoria de cada instancia: no es perfecto en serverless, pero corta lo obvio.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;
const hits = new Map<string, { count: number; resetAt: number }>();

function overLimit(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  entry.count++;
  return entry.count > MAX_PER_WINDOW;
}

// Solo valores simples y pocos: son datos de contexto (qué botón, qué módulo).
function cleanProps(raw: unknown): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>).slice(0, 8)) {
    if (typeof v === "string") out[k.slice(0, 30)] = v.slice(0, 100);
    else if (typeof v === "number" || typeof v === "boolean") out[k.slice(0, 30)] = v;
  }
  return out;
}

export async function POST(req: NextRequest) {
  if (isBot(req.headers.get("user-agent"))) return NO_CONTENT();

  // Si estás logueada en /admin, tus propias visitas no cuentan.
  if (await isValidSessionCookie(req.cookies.get(SESSION_COOKIE_NAME)?.value)) return NO_CONTENT();

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NO_CONTENT();

  const name = typeof body.name === "string" ? body.name : "";
  if (!CLIENT_EVENTS.has(name)) return NO_CONTENT();

  const visitorId = typeof body.visitorId === "string" && ID_RE.test(body.visitorId) ? body.visitorId : null;
  if (!visitorId) return NO_CONTENT();
  if (overLimit(visitorId)) return NO_CONTENT();

  const sessionId = typeof body.sessionId === "string" && ID_RE.test(body.sessionId) ? body.sessionId : null;

  await recordEvent({
    name,
    visitorId,
    sessionId,
    path: clip(body.path, 300),
    referrer: clip(body.referrer, 200),
    source: clip(body.source, 100),
    medium: clip(body.medium, 100),
    campaign: clip(body.campaign, 100),
    device: body.device === "mobile" || body.device === "desktop" ? body.device : null,
    props: cleanProps(body.props),
  });

  return NO_CONTENT();
}
