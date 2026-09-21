import { NextRequest, NextResponse } from "next/server";
import { optOut, verifyUnsubscribeToken } from "@/lib/optout";

// Baja en un clic desde el botón "Cancelar suscripción" de Gmail y similares
// (encabezado List-Unsubscribe-Post de los avisos). Solo POST: un GET (por
// ejemplo de un escáner de links) lleva a la página de confirmación en vez
// de dar de baja.
export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("e") ?? "";
  const token = req.nextUrl.searchParams.get("t") ?? "";
  if (!verifyUnsubscribeToken(email, token)) {
    return NextResponse.json({ error: "Link inválido." }, { status: 400 });
  }
  await optOut(email);
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const url = new URL("/baja", req.nextUrl.origin);
  for (const k of ["e", "t"]) {
    const v = req.nextUrl.searchParams.get(k);
    if (v) url.searchParams.set(k, v);
  }
  return NextResponse.redirect(url);
}
