import Link from "next/link";
import { listProducts } from "@/lib/products";
import { PageHeader } from "@/components/admin/stats";
import GiftLicenseForm from "@/components/admin/GiftLicenseForm";

export const dynamic = "force-dynamic";

export default async function NuevaLicenciaManual() {
  const products = await listProducts();

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Regalar o cargar una licencia"
        subtitle="Da de alta una licencia completa a mano, sin pasar por Mercado Pago."
        action={
          <Link href="/admin/clientes" className="admin-btn admin-btn-outline">
            ← Clientes
          </Link>
        }
      />
      <div className="mt-6">
        <GiftLicenseForm products={products} />
      </div>
    </div>
  );
}
