"use client";

import { useActionState } from "react";
import { bulkExtendTrialAction } from "@/lib/actions/clientes";

type Result = { ok: true; count: number; failed: number } | { error: string } | null;

// Extiende la prueba de todas las personas que caen en el filtro actual de
// Clientes (segmento + canal + búsqueda) de una sola vez -- para campañas
// puntuales, ej. "vencen en 48hs" de un canal antes de una fecha importante.
export default function BulkExtendForm({
  segmento, canal, q, extendibles,
}: {
  segmento: string; canal: string; q: string; extendibles: number;
}) {
  const [result, formAction, pending] = useActionState<Result, FormData>(
    async (_prev, fd) => bulkExtendTrialAction(_prev, fd),
    null
  );

  if (extendibles === 0) return null;

  return (
    <form
      action={formAction}
      className="mt-3 flex flex-wrap items-center gap-2.5 border border-dashed border-foreground/25 bg-foreground/[0.02] px-4 py-3"
      onSubmit={(e) => {
        const days = (new FormData(e.currentTarget).get("days") ?? "") as string;
        if (!window.confirm(`Esto le manda una clave nueva por mail a ${extendibles} persona(s), con ${days} día(s) más. ¿Confirmás?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="segmento" value={segmento} />
      <input type="hidden" name="canal" value={canal} />
      <input type="hidden" name="q" value={q} />
      <span className="text-[13.5px] text-foreground/70">
        Extender <strong>{extendibles}</strong> prueba{extendibles !== 1 ? "s" : ""} de este filtro
      </span>
      <input type="number" name="days" min={1} max={365} defaultValue={7} className="admin-input w-16 px-2 py-1.5 text-center text-[13px]" />
      <span className="text-[13.5px] text-foreground/70">días</span>
      <button type="submit" disabled={pending} className="admin-btn admin-btn-outline px-4 py-1.5 text-[13px]">
        {pending ? "Aplicando…" : "Aplicar a todas"}
      </button>
      {result && "ok" in result && (
        <span className="text-[13px] text-accent-green">
          {result.count} extendidas{result.failed > 0 ? `, ${result.failed} fallaron` : ""} ✓
        </span>
      )}
      {result && "error" in result && <span className="text-[13px] text-brand">{result.error}</span>}
    </form>
  );
}
