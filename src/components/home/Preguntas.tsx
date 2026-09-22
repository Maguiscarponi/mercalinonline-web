import Link from "next/link";
import FaqList from "@/components/FaqList";
import { getFaqs } from "@/lib/faqs";

export default function Preguntas({ priceArs }: { priceArs: number }) {
  return (
    <section id="preguntas" className="flex min-h-[100svh] scroll-mt-20 items-center">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-0">
        <p className="rt-label">Nº 06 · Preguntas</p>
        <h2 className="mt-2 text-[clamp(38px,6.6vw,88px)] leading-[1.05] text-ink">Preguntas frecuentes</h2>

        <div className="mt-10 sm:mt-14">
          <FaqList faqs={getFaqs(priceArs)} columnas={2} />
        </div>

        <p className="tag-numbered mt-8 text-[13px] uppercase text-ink-soft">
          ¿No está tu duda?{" "}
          <Link href="/preguntas-frecuentes" className="text-brand underline underline-offset-4">
            Ver en una sola página
          </Link>
        </p>
      </div>
    </section>
  );
}
