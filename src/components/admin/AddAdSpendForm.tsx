"use client";

import { useActionState } from "react";
import { createAdSpendAction } from "@/lib/actions/ad-spend";
import { PLATFORMS } from "@/lib/ad-spend-platforms";

type Result = { ok: true } | { error: string } | null;

export default function AddAdSpendForm({ today }: { today: string }) {
  const [result, formAction, pending] = useActionState<Result, FormData>(async (_prev, formData) => {
    const r = await createAdSpendAction(formData);
    return r ?? { ok: true };
  }, null);

  return (
    <form action={formAction} className="admin-card space-y-3 p-5">
      <p className="tag-numbered text-[12px] text-foreground/50">Cargar gasto</p>
      <div>
        <label className="tag-numbered block text-[11px] text-foreground/45" htmlFor="spentOn">
          Fecha
        </label>
        <input id="spentOn" name="spentOn" type="date" defaultValue={today} max={today} required className="admin-input mt-1" />
      </div>
      <div>
        <label className="tag-numbered block text-[11px] text-foreground/45" htmlFor="platform">
          Plataforma
        </label>
        <select id="platform" name="platform" required className="admin-input mt-1" defaultValue="facebook">
          {PLATFORMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="tag-numbered block text-[11px] text-foreground/45" htmlFor="amountArs">
          Monto (ARS)
        </label>
        <input id="amountArs" name="amountArs" type="number" min="1" step="1" required className="admin-input mt-1" placeholder="5000" />
      </div>
      <div>
        <label className="tag-numbered block text-[11px] text-foreground/45" htmlFor="note">
          Nota (opcional)
        </label>
        <input id="note" name="note" type="text" maxLength={200} className="admin-input mt-1" placeholder="Ej: campaña lanzamiento" />
      </div>
      {result && "error" in result && <p className="text-[13px] text-brand">{result.error}</p>}
      {result && "ok" in result && <p className="text-[13px] text-accent-green">Agregado ✓</p>}
      <button type="submit" disabled={pending} className="admin-btn admin-btn-primary w-full justify-center">
        {pending ? "Agregando…" : "Agregar"}
      </button>
    </form>
  );
}
