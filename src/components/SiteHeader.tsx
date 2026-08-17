"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/preguntas-frecuentes", label: "Preguntas" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-20 bg-[#161412] shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        {/* Marca: isotipo rojo + wordmark en minuscula, como el logo original */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="Mercalin — inicio">
          <Image src="/mercalin-isotipo.svg" alt="" width={34} height={34} priority />
          <span className="text-[26px] font-bold leading-none tracking-[-0.02em]">
            <span className="text-white">Merca</span>
            <span className="text-[#ff5b52]">lin</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`tag-numbered relative px-3.5 py-2 text-[15px] transition-colors ${
                  isActive(l.href) ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-brand transition-opacity ${
                    isActive(l.href) ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            ))}
          </div>

          <Link
            href="/carrito"
            aria-label="Carrito"
            className="relative ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={2.2} />
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <Link
            href="/prueba-gratis"
            className="tag-numbered ml-1 rounded-full bg-brand px-5 py-2.5 text-[15px] text-white transition-colors hover:bg-brand-dark"
          >
            Probar 7 días
          </Link>
        </nav>
      </div>
    </header>
  );
}
