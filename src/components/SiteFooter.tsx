import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/carrito", label: "Carrito" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <Image
            src="/mercalin-logo.svg"
            alt="Mercalin"
            width={110}
            height={34}
            style={{ height: "auto" }}
            className="opacity-70"
          />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-foreground/55">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="tag-numbered text-xs text-foreground/40">Se paga una vez. Es tuyo.</p>
          <p className="text-xs text-foreground/35">© {new Date().getFullYear()} Mercalin. Hecho en Argentina.</p>
        </div>
      </div>
    </footer>
  );
}
