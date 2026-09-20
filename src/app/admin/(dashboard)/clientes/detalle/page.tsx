import Link from "next/link";
import { listClientes } from "@/lib/clientes";
import { getClienteTimeline } from "@/lib/admin-stats";
import { eventDetail, eventLabel } from "@/lib/event-labels";
import { fmtArs, fmtDateTime, timeAgo, timeLeft } from "@/lib/format";
import { EstadoBadge, PageHeader, SectionTitle } from "@/components/admin/stats";

export const dynamic = "force-dynamic";

export default async function AdminClienteDetalle({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email: emailParam } = await searchParams;
  const email = (emailParam ?? "").trim().toLowerCase();
  const now = new Date();

  const cliente = email ? (await listClientes()).find((c) => c.email === email) : undefined;

  if (!cliente) {
    return (
      <div className="max-w-5xl">
        <PageHeader title="Cliente" subtitle="No encontramos a esta persona." />
        <Link href="/admin/clientes" className="admin-btn admin-btn-outline mt-6">
          ← Volver a clientes
        </Link>
      </div>
    );
  }

  const timeline = await getClienteTimeline(cliente.email, cliente.visitorIds);
  const activo = cliente.estado === "activa" || cliente.estado === "por_vencer";

  const datos: { label: string; value: React.ReactNode }[] = [
    {
      label: "Tiempo",
      value: activo
        ? `Quedan ${timeLeft(cliente.trialExpiresAt, now)}`
        : cliente.estado === "vencida"
          ? `Venció ${timeAgo(cliente.trialExpiresAt, now)}`
          : "—",
    },
    { label: "Empezó la prueba", value: fmtDateTime(cliente.trialStartedAt) },
    { label: "Vence", value: cliente.estado === "comprado" ? "No vence" : fmtDateTime(cliente.trialExpiresAt) },
    {
      label: "Compra",
      value: cliente.purchasedAt ? `${fmtArs(cliente.amountArs)} · ${fmtDateTime(cliente.purchasedAt)}` : "Todavía no compró",
    },
    { label: "Canal", value: `${cliente.source ?? "sin dato"}${cliente.campaign ? ` · ${cliente.campaign}` : ""}` },
    { label: "Última visita web", value: cliente.lastWebVisit ? timeAgo(cliente.lastWebVisit, now) : "—" },
  ];

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={cliente.businessName ?? cliente.email}
        subtitle={cliente.businessName ? cliente.email : "Sin nombre de negocio"}
        action={
          <Link href="/admin/clientes" className="admin-btn admin-btn-outline">
            ← Clientes
          </Link>
        }
      />

      <div className="mt-6 flex items-center gap-3">
        <EstadoBadge estado={cliente.estado} />
        {cliente.mailProblem && (
          <span className="tag-numbered text-[12.5px] text-brand">El mail con su clave no salió</span>
        )}
      </div>

      <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {datos.map((d) => (
          <div key={d.label} className="border-t border-foreground/20 pt-3">
            <dt className="tag-numbered text-[12px] text-foreground/50">{d.label}</dt>
            <dd className="mt-1 text-[15.5px] font-medium">{d.value}</dd>
          </div>
        ))}
      </dl>

      <SectionTitle note="Cada vez que se le generó una clave">Pruebas y compras</SectionTitle>
      <div className="admin-card overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-[14px]">
          <thead>
            <tr className="tag-numbered border-b border-foreground/15 text-[12px] text-foreground/55">
              <th className="px-5 py-3">Fecha</th>
              <th className="py-3 pr-4">Tipo</th>
              <th className="py-3 pr-4">Vence</th>
              <th className="py-3 pr-4">Monto</th>
              <th className="py-3 pr-5">Mail enviado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.07]">
            {cliente.activations.map((a) => (
              <tr key={a.id}>
                <td className="px-5 py-3 tabular-nums text-foreground/70">{fmtDateTime(a.createdAt)}</td>
                <td className="py-3 pr-4 font-medium">{a.kind === "full" ? "Compra" : "Prueba"}</td>
                <td className="py-3 pr-4 tabular-nums text-foreground/70">
                  {a.kind === "full" ? "No vence" : fmtDateTime(a.expiresAt)}
                </td>
                <td className="py-3 pr-4 tabular-nums text-foreground/70">{a.amountArs ? fmtArs(a.amountArs) : "—"}</td>
                <td className={`py-3 pr-5 ${a.emailSent ? "text-foreground/70" : "font-medium text-brand"}`}>
                  {a.emailSent ? "Sí" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionTitle note="Todo lo que se sabe de esta persona, en orden — incluye lo que hizo antes de dejar su mail">
        Recorrido
      </SectionTitle>
      {timeline.length === 0 ? (
        <p className="text-[14.5px] text-foreground/60">
          No hay recorrido registrado. Las visitas se empezaron a medir con la última versión del sitio, así que las
          pruebas y compras anteriores no tienen historial de navegación.
        </p>
      ) : (
        <ol className="admin-card divide-y divide-black/[0.07]">
          {timeline.map((t, i) => (
            <li key={i} className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5 px-5 py-2.5">
              <span className="w-36 shrink-0 text-[13px] tabular-nums text-foreground/50">{fmtDateTime(t.at)}</span>
              <span className="text-[14.5px] font-medium">{eventLabel(t.name)}</span>
              <span className="min-w-0 flex-1 truncate text-[14px] text-foreground/60">
                {eventDetail(t.name, t.props, t.path)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
