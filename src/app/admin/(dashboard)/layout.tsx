import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/adminGuard";
import { logoutAction } from "@/lib/actions/adminAuth";
import AdminNavLink, { type AdminNavIcon } from "@/components/admin/AdminNavLink";

const NAV: Array<{ href: string; label: string; icon: AdminNavIcon }> = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/productos", label: "Productos", icon: "package" },
  { href: "/admin/carrusel", label: "Carrusel", icon: "gallery" },
  { href: "/admin/activaciones", label: "Activaciones", icon: "list" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-black/10 bg-white">
        <div className="border-b border-black/10 px-5 py-5">
          <Link href="/admin">
            <Image src="/mercalin-logo.svg" alt="Mercalin" width={110} height={34} style={{ height: "auto" }} />
          </Link>
          <p className="tag-numbered mt-1 text-[10px] text-foreground/35">Panel admin</p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => (
            <AdminNavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>

        <form action={logoutAction} className="border-t border-black/10 p-3">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-brand"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
            Salir
          </button>
        </form>
      </aside>

      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
