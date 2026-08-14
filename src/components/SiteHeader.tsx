"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

const TRIAL_MAILTO =
  "mailto:magaliscarponi@gmail.com?subject=Quiero%20probar%20Mercalin%20gratis&body=Hola%2C%20quiero%20probar%20Mercalin%207%20d%C3%ADas%20gratis.%0D%0A%0D%0AMi%20mail%3A%20%0D%0AMi%20negocio%3A%20";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Image src="/mercalin-logo.svg" alt="Mercalin" width={126} height={38} priority />
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <div className="hidden items-center gap-6 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href))
                    ? "text-foreground"
                    : "text-foreground/50 transition-colors hover:text-foreground"
                }
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/carrito" className="relative text-foreground/70 transition-colors hover:text-foreground" aria-label="Carrito">
            <ShoppingCart className="h-5 w-5" strokeWidth={2} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <a
            href={TRIAL_MAILTO}
            className="rounded-md bg-brand px-4 py-2 text-white transition-colors hover:bg-brand-dark"
          >
            Probar 7 días
          </a>
        </nav>
      </div>
    </header>
  );
}
