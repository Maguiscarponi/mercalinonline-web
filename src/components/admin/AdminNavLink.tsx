"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, GalleryHorizontal, ListChecks } from "lucide-react";

const ICONS = {
  dashboard: LayoutDashboard,
  package: Package,
  gallery: GalleryHorizontal,
  list: ListChecks,
};

export type AdminNavIcon = keyof typeof ICONS;

export default function AdminNavLink({ href, label, icon }: { href: string; label: string; icon: AdminNavIcon }) {
  const pathname = usePathname();
  const Icon = ICONS[icon];
  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
        active ? "bg-brand/10 text-brand" : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.8} />
      {label}
    </Link>
  );
}
