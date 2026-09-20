import { redirect } from "next/navigation";

// La vista de Activaciones pasó a ser Clientes (una fila por persona, con su
// estado). Se deja la ruta vieja para que los marcadores sigan funcionando.
export default function AdminActivaciones() {
  redirect("/admin/clientes");
}
