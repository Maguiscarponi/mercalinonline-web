"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createManualLicenseAction } from "@/lib/actions/clientes";
import type { Product } from "@/lib/products";

type Result = { ok: true } | { error: string } | null;

// Alta manual de licencia completa: para regalarla (dejando el monto en 0)
// o para asentar un pago que llegó por afuera de Mercado Pago (transferencia,
// efectivo) con su monto real -- las dos usan la misma acción, la diferencia
// es solo si el monto queda en 0 o no.
export default function GiftLicenseForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [result, formAction, pending] = useActionState<Result, FormData>(
    async (_prev, fd) => {
      const r = await createManualLicenseAction(_prev, fd);
      if ("ok" in r) router.push("/admin/clientes");
      return r;
    },
    null
  );

  return (
    <form action={formAction} className="admin-card max-w-lg space-y-5 p-6">
      <div>
        <label htmlFor="email" className="tag-numbered mb-1.5 block text-[12px] text-foreground/55">
          Mail
        </label>
        <input id="email" name="email" type="email" required className="admin-input w-full" placeholder="persona@negocio.com" />
      </div>

      <div>
        <label htmlFor="businessName" className="tag-numbered mb-1.5 block text-[12px] text-foreground/55">
          Nombre del negocio (opcional)
        </label>
        <input id="businessName" name="businessName" type="text" className="admin-input w-full" placeholder="Kiosco Don Jorge" />
      </div>

      {products.length > 1 && (
        <div>
          <label htmlFor="productSlug" className="tag-numbered mb-1.5 block text-[12px] text-foreground/55">
            Producto
          </label>
          <select id="productSlug" name="productSlug" className="admin-input w-full">
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>{p.name}</option>
            ))}
          </select>
        </div>
      )}
      {products.length === 1 && <input type="hidden" name="productSlug" value={products[0].slug} />}

      <div>
        <label htmlFor="amountArs" className="tag-numbered mb-1.5 block text-[12px] text-foreground/55">
          Monto (ARS)
        </label>
        <input id="amountArs" name="amountArs" type="number" min={0} step={1} defaultValue={0} className="admin-input w-full" />
        <p className="mt-1.5 text-[12.5px] text-foreground/50">
          Dejalo en 0 para regalarla. Si el pago llegó por otro medio (transferencia, efectivo), poné el monto real —
          así queda contado en las estadísticas de ventas.
        </p>
      </div>

      {result && "error" in result && <p className="text-[13px] text-brand">{result.error}</p>}

      <button type="submit" disabled={pending} className="admin-btn admin-btn-dark w-full py-3">
        {pending ? "Creando…" : "Crear licencia y mandar mail"}
      </button>
    </form>
  );
}
