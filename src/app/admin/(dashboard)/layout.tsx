import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/adminGuard";
import { logoutAction } from "@/lib/actions/adminAuth";
import { getPorVencerCount } from "@/lib/admin-stats";
import AdminNavLink, { type AdminNavIcon } from "@/components/admin/AdminNavLink";

type Item = { href: string; label: string; icon: AdminNavIcon };

const SECCIONES: { titulo: string; items: Item[] }[] = [
  {
    titulo: "Día a día",
    items: [
      { href: "/admin", label: "Resumen", icon: "dashboard" },
      { href: "/admin/clientes", label: "Clientes", icon: "users" },
    ],
  },
  {
    titulo: "Marketing",
    items: [
      { href: "/admin/marketing", label: "Marketing", icon: "chart" },
      { href: "/admin/actividad", label: "Actividad", icon: "activity" },
    ],
  },
  {
    titulo: "Sitio",
    items: [{ href: "/admin/productos", label: "Productos", icon: "package" }],
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const porVencer = await getPorVencerCount().catch(() => 0);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col bg-dark-section text-white lg:sticky lg:top-0 lg:h-screen lg:w-64">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="flex items-center gap-2.5" aria-label="Mercalin — panel">
            <Image src="/mercalin-isotipo.svg" alt="" width={30} height={30} />
            <span className="text-[24px] font-bold leading-none tracking-[-0.02em]">
              <span className="text-white">Merca</span>
              <span className="text-[#ff5b52]">lin</span>
            </span>
          </Link>
          <p className="tag-numbered mt-2 text-[11px] text-white/40">Panel</p>
        </div>

        <nav className="flex overflow-x-auto lg:flex-1 lg:flex-col lg:overflow-y-auto">
          {SECCIONES.map((sec) => (
            <div key={sec.titulo} className="flex lg:block lg:border-b lg:border-white/10 lg:pb-3 lg:pt-5">
              <p className="tag-numbered hidden px-5 pb-2 text-[11px] text-white/40 lg:block">{sec.titulo}</p>
              {sec.items.map((item) => (
                <AdminNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  badge={item.href === "/admin/clientes" ? porVencer : undefined}
                />
              ))}
            </div>
          ))}
          <form action={logoutAction} className="flex lg:hidden">
            <button type="submit" className="shrink-0 px-5 py-3 text-[15px] font-medium text-white/60 hover:text-white">
              Salir
            </button>
          </form>
        </nav>

        <div className="hidden border-t border-white/10 px-5 py-4 lg:block">
          <Link
            href="/"
            target="_blank"
            className="tag-numbered text-[12px] text-white/60 transition-colors hover:text-white"
          >
            Ver sitio ↗
          </Link>
          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="flex items-center gap-2 text-[13px] text-white/50 transition-colors hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
              Salir
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
