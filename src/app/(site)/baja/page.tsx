import type { Metadata } from "next";
import Link from "next/link";
import { verifyUnsubscribeToken } from "@/lib/optout";
import { confirmUnsubscribeAction } from "@/lib/actions/optout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Darte de baja — Mercalin",
  robots: { index: false, follow: false },
};

// El link del mail solo abre esta página: la baja se hace con el botón. Así
// los escáneres de links que revisan los mails no dan de baja a nadie sin querer.
export default async function Baja({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; t?: string; ok?: string }>;
}) {
  const { e = "", t = "", ok } = await searchParams;
  const valido = verifyUnsubscribeToken(e, t);

  return (
    <section className="mx-auto max-w-md px-6 py-20 text-center sm:py-28">
      {!valido ? (
        <>
          <p className="tag-numbered text-xs text-brand">Baja de avisos</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Este link no es válido.</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/60">
            Puede haberse cortado al copiarlo. Si querés dejar de recibir los avisos, escribinos y lo resolvemos.
          </p>
        </>
      ) : ok ? (
        <>
          <p className="tag-numbered text-xs text-brand">Listo</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">No te enviamos más avisos.</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/60">
            Ya no vas a recibir los recordatorios de tu prueba. Si más adelante querés comprar Mercalin, podés hacerlo
            desde el sitio cuando quieras.
          </p>
        </>
      ) : (
        <>
          <p className="tag-numbered text-xs text-brand">Baja de avisos</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            ¿Dejar de recibir los avisos de tu prueba?
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/60">
            Dejamos de escribirte a <strong className="text-foreground">{e}</strong>. Esto no afecta al mail con tu clave
            de activación ni a tu prueba.
          </p>
          <form action={confirmUnsubscribeAction} className="mt-7">
            <input type="hidden" name="e" value={e} />
            <input type="hidden" name="t" value={t} />
            <button
              type="submit"
              className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Sí, darme de baja
            </button>
          </form>
        </>
      )}
      <Link href="/" className="mt-8 inline-block text-[14px] font-semibold text-foreground/60 hover:text-foreground">
        Ir al inicio →
      </Link>
    </section>
  );
}
