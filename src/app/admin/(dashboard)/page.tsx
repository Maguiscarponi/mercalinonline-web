import Link from "next/link";
import { DollarSign, ShoppingBag, Gift, Activity } from "lucide-react";
import { getActivationStats, listActivations } from "@/lib/activations";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await getActivationStats();
  const recent = (await listActivations()).slice(0, 8);

  const tiles = [
    { icon: ShoppingBag, label: "Ventas", value: stats.totalSales },
    { icon: DollarSign, label: "Ingresos", value: `$${stats.revenueArs.toLocaleString("es-AR")}` },
    { icon: Gift, label: "Pruebas gratis", value: stats.totalTrials },
    { icon: Activity, label: "Últimos 30 días", value: stats.last30DaysActivations },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="admin-card p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10">
              <t.icon className="h-[18px] w-[18px] text-brand" strokeWidth={1.8} />
            </div>
            <p className="tag-numbered mt-3 text-xs text-foreground/40">{t.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{t.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Actividad reciente</h2>
        <Link href="/admin/activaciones" className="text-sm font-semibold text-brand hover:text-brand-dark">
          Ver todo →
        </Link>
      </div>

      <div className="admin-card mt-4 divide-y divide-black/6">
        {recent.length === 0 && <p className="p-8 text-center text-sm text-foreground/50">Todavía no hay actividad.</p>}
        {recent.map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-foreground/[0.02]">
            <div>
              <p className="text-sm font-semibold text-foreground">{a.email}</p>
              <p className="text-xs text-foreground/40">{new Date(a.createdAt).toLocaleString("es-AR")}</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                a.kind === "full" ? "bg-brand/10 text-brand" : "bg-foreground/8 text-foreground/50"
              }`}
            >
              {a.kind === "full" ? "Compra" : "Prueba"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
