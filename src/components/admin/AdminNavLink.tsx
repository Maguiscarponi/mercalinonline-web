"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ClipboardList, LayoutDashboard, LineChart, Package, Users } from "lucide-react";

const ICONS = {
  dashboard: LayoutDashboard,
  users: Users,
  package: Package,
  chart: LineChart,
  activity: Activity,
  clipboard: ClipboardList,
};

export type AdminNavIcon = keyof typeof ICONS;

export default function AdminNavLink({
  href,
  label,
  icon,
  badge,
}: {
  href: string;
  label: string;
  icon: AdminNavIcon;
  badge?: number;
}) {
  const pathname = usePathname();
  const Icon = ICONS[icon];
  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex shrink-0 items-center gap-3 px-5 py-3 text-[15px] font-medium transition-colors ${
        active ? "bg-white text-foreground" : "text-white/75 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.9} />
      <span className="flex-1">{label}</span>
      {!!badge && badge > 0 && (
        <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-amber-600 px-1.5 text-[12px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}
