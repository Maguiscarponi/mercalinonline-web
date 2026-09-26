import Link from "next/link";
import { listAllClientNotes } from "@/lib/notes";
import { listClientes } from "@/lib/clientes";
import { fmtDateTime } from "@/lib/format";
import { PageHeader } from "@/components/admin/stats";
import NoteForm from "@/components/admin/NoteForm";

export const dynamic = "force-dynamic";

export default async function AdminReportes() {
  const [notas, clientes] = await Promise.all([listAllClientNotes(), listClientes()]);
  const businessByEmail = new Map(clientes.map((c) => [c.email, c.businessName]));

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Reportes"
        subtitle="Notas de soporte: qué le pasó a cada persona y qué se hizo — para no depender de la memoria."
      />

      <div className="mt-6">
        <NoteForm />
      </div>

      <div className="admin-card mt-6 divide-y divide-black/[0.07]">
        {notas.length === 0 && (
          <p className="px-5 py-12 text-center text-foreground/50">Todavía no hay ninguna nota cargada.</p>
        )}
        {notas.map((n) => {
          const negocio = businessByEmail.get(n.email);
          return (
            <div key={n.id} className="px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <Link
                  href={`/admin/clientes/detalle?email=${encodeURIComponent(n.email)}`}
                  className="font-semibold text-foreground underline-offset-2 hover:text-brand hover:underline"
                >
                  {n.email}
                </Link>
                <span className="text-[13px] tabular-nums text-foreground/50">{fmtDateTime(n.createdAt)}</span>
              </div>
              {negocio && <p className="text-[12.5px] text-foreground/50">{negocio}</p>}
              <p className="mt-1.5 whitespace-pre-line text-[14.5px] text-foreground/80">{n.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
