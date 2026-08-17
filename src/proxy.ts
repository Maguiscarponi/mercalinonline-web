import { NextRequest, NextResponse } from "next/server";
import { isValidSessionCookie, SESSION_COOKIE_NAME } from "@/lib/adminAuth";

// Corta la request ANTES de que Next.js renderice nada. Confiar solo en un
// chequeo dentro del layout de /admin no alcanza: React Server Components
// puede renderizar layout y página en paralelo, así que una página protegida
// puede terminar de renderizar (y quedar en el cuerpo de la respuesta) aunque
// el layout decida redirigir — se verificó en dev que esto filtraba datos de
// activaciones en el body de una respuesta 307. El middleware corre antes de
// que exista siquiera un componente para renderizar.
export async function proxy(req: NextRequest) {
  const value = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const valid = await isValidSessionCookie(value);
  if (!valid) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
