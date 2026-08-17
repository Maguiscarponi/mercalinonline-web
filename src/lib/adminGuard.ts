import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSessionCookie, SESSION_COOKIE_NAME } from "@/lib/adminAuth";

// Server-only. Usar al principio de cada Server Action de mutación y en el
// layout del dashboard — así queda protegido tanto el HTML como las acciones,
// aunque alguien intente invocar la acción directo.
export async function requireAdmin(): Promise<void> {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE_NAME)?.value;
  if (!(await isValidSessionCookie(value))) {
    redirect("/admin/login");
  }
}
