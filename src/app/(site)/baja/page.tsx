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
          <p className="rt-label">Baja de avisos</p>
          <h1 className="mt-3 text-[clamp(28px,4.4vw,38px)] leading-[1.1] text-ink">Este link no es válido.</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
            Puede haberse cortado al copiarlo. Si querés dejar de recibir los avisos, escribinos y lo resolvemos.
          </p>
        </>
      ) : ok ? (
        <>
          <p className="rt-label">Listo</p>
          <h1 className="mt-3 text-[clamp(28px,4.4vw,38px)] leading-[1.1] text-ink">No te enviamos más avisos.</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
            Ya no vas a recibir los recordatorios de tu prueba. Si más adelante querés comprar Mercalin, podés hacerlo
            desde el sitio cuando quieras.
          </p>
        </>
      ) : (
        <>
          <p className="rt-label">Baja de avisos</p>
          <h1 className="mt-3 text-[clamp(28px,4.4vw,38px)] leading-[1.1] text-ink">
            ¿Dejar de recibir los avisos de tu prueba?
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
            Dejamos de escribirte a <strong className="break-all text-ink">{e}</strong>. Esto no afecta al mail con tu clave
            de activación ni a tu prueba.
          </p>
          <form action={confirmUnsubscribeAction} className="mt-7">
            <input type="hidden" name="e" value={e} />
            <input type="hidden" name="t" value={t} />
            <button
              type="submit"
              className="rt-btn rt-btn-red"
            >
              Sí, darme de baja
            </button>
          </form>
        </>
      )}
      <Link href="/" className="tag-numbered mt-8 inline-block text-[13px] uppercase text-ink-soft hover:text-brand">
        Ir al inicio →
      </Link>
    </section>
  );
}
