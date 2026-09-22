import Link from "next/link";
import { listProducts } from "@/lib/products";
import { unsubscribeUrl } from "@/lib/optout";
import {
  licenseEmailHtml,
  trialDay3EmailHtml,
  trialExpiringEmailHtml,
  trialExpiredEmailHtml,
} from "@/lib/mail";
import { PageHeader } from "@/components/admin/stats";

export const dynamic = "force-dynamic";

const OPCIONES = [
  { id: "trial", label: "Clave de la prueba gratis", subject: (p: string) => `Tu prueba gratis de ${p}` },
  { id: "compra", label: "Clave de la compra", subject: (p: string) => `Gracias por tu compra de ${p}` },
  { id: "dia3", label: "Aviso · día 3 de la prueba", subject: (p: string) => `¿Ya instalaste ${p}?` },
  { id: "vence", label: "Aviso · la prueba vence mañana", subject: (p: string) => `Tu prueba de ${p} se vence mañana` },
  { id: "vencio", label: "Aviso · la prueba venció", subject: (p: string) => `Se venció tu prueba de ${p}` },
] as const;
type OpcionId = (typeof OPCIONES)[number]["id"];

function parseTipo(v: string | undefined): OpcionId {
  return OPCIONES.some((o) => o.id === v) ? (v as OpcionId) : "trial";
}

export default async function AdminMailsVistaPrevia({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const { tipo: tipoParam } = await searchParams;
  const tipo = parseTipo(tipoParam);

  const [producto] = await listProducts();
  const productName = producto?.name ?? "Mercalin";
  const productSlug = producto?.slug ?? "mercalin";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mercalinonline.com";
  const sampleEmail = "vos@tunegocio.com";
  const unsubUrl = unsubscribeUrl(siteUrl, sampleEmail);
  const en7Dias = new Date();
  en7Dias.setDate(en7Dias.getDate() + 7);
  const mañana = new Date();
  mañana.setDate(mañana.getDate() + 1);

  const html =
    tipo === "trial"
      ? licenseEmailHtml({ productName, kind: "trial", licenseKey: "eyJraW5kIjoidHJpYWwifQ.EJEMPLO_DE_CLAVE_FIRMADA", downloadUrl: producto?.downloadUrl ?? `${siteUrl}/descargar`, expiresAt: en7Dias })
      : tipo === "compra"
        ? licenseEmailHtml({ productName, kind: "full", licenseKey: "eyJraW5kIjoiZnVsbCJ9.EJEMPLO_DE_CLAVE_FIRMADA", downloadUrl: producto?.downloadUrl ?? `${siteUrl}/descargar`, expiresAt: null })
        : tipo === "dia3"
          ? trialDay3EmailHtml({ productName, siteUrl, unsubscribeUrl: unsubUrl })
          : tipo === "vence"
            ? trialExpiringEmailHtml({ productName, expiresAt: mañana, siteUrl, productSlug, unsubscribeUrl: unsubUrl })
            : trialExpiredEmailHtml({ productName, siteUrl, productSlug, unsubscribeUrl: unsubUrl });

  const subject = OPCIONES.find((o) => o.id === tipo)!.subject(productName);

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Vista previa de los mails"
        subtitle="Exactamente el HTML que le llega al cliente — con datos de ejemplo, no se envía nada."
        action={
          <Link href="/admin/marketing" className="admin-btn admin-btn-outline">
            ← Marketing
          </Link>
        }
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {OPCIONES.map((o) => (
          <Link
            key={o.id}
            href={`/admin/mails/vista-previa?tipo=${o.id}`}
            className={`admin-btn border border-foreground/25 px-3.5 py-2 text-[12px] ${
              tipo === o.id ? "bg-foreground text-white" : "bg-white text-foreground hover:bg-foreground/5"
            }`}
          >
            {o.label}
          </Link>
        ))}
      </div>

      <div className="admin-card mt-6 overflow-hidden">
        <div className="border-b border-foreground/15 bg-foreground/[0.03] px-5 py-3.5">
          <p className="text-[13px] text-foreground/50">
            Para: <span className="text-foreground/80">{sampleEmail}</span>
          </p>
          <p className="mt-0.5 text-[15px] font-semibold text-foreground">{subject}</p>
        </div>
        <iframe title="Vista previa del mail" srcDoc={html} sandbox="" className="h-[560px] w-full bg-white" />
      </div>

      <p className="mt-4 text-[13.5px] leading-relaxed text-foreground/55">
        La clave de la imagen es un ejemplo — no es una clave real, no activa nada. Los avisos de la prueba (día 3, vence
        mañana, venció) llevan el link de baja firmado de verdad, con el mail de ejemplo de arriba.
      </p>
    </div>
  );
}
