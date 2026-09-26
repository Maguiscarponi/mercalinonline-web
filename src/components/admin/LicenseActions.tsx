"use client";

import { useActionState, useRef, useState } from "react";
import { resendLicenseAction, regenerateLicenseAction, extendTrialAction } from "@/lib/actions/clientes";

type Result = { ok: true } | { error: string } | null;

// Soporte manual desde la ficha del cliente: "reenviar" manda la misma
// clave otra vez (nada cambia); "regenerar" crea una clave nueva —en una
// prueba, con 7 días nuevos desde ahora— así que pide confirmar antes.
export function ResendLicenseButton({ activationId }: { activationId: string }) {
  const [result, formAction, pending] = useActionState<Result, FormData>(
    async () => resendLicenseAction(activationId),
    null
  );

  return (
    <form action={formAction} className="inline-flex items-center gap-2">
      <button type="submit" disabled={pending} className="admin-btn admin-btn-outline px-3 py-1.5 text-[11.5px]">
        {pending ? "Enviando…" : "Reenviar clave"}
      </button>
      {result && "ok" in result && <span className="text-[12px] text-accent-green">Enviado ✓</span>}
      {result && "error" in result && <span className="text-[12px] text-brand">{result.error}</span>}
    </form>
  );
}

export function RegenerateLicenseButton({ activationId, kind }: { activationId: string; kind: "trial" | "full" }) {
  const [result, formAction, pending] = useActionState<Result, FormData>(
    async () => regenerateLicenseAction(activationId),
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="inline-flex items-center gap-2"
      onSubmit={(e) => {
        const msg =
          kind === "trial"
            ? "Esto genera una clave nueva y le da 7 días nuevos desde ahora. ¿Confirmás?"
            : "Esto genera una clave nueva para esta compra (no cambia nada más). ¿Confirmás?";
        if (!window.confirm(msg)) e.preventDefault();
      }}
    >
      <button type="submit" disabled={pending} className="admin-btn admin-btn-ghost px-3 py-1.5 text-[11.5px]">
        {pending ? "Generando…" : "Generar clave nueva"}
      </button>
      {result && "ok" in result && <span className="text-[12px] text-accent-green">Enviada ✓</span>}
      {result && "error" in result && <span className="text-[12px] text-brand">{result.error}</span>}
    </form>
  );
}

// Extiende una prueba puntual N días más (sobre lo que le quede) -- distinto
// de "Generar clave nueva", que resetea siempre a 7 días fijos.
export function ExtendTrialButton({ activationId }: { activationId: string }) {
  const [days, setDays] = useState("7");
  const [result, formAction, pending] = useActionState<Result, FormData>(
    async () => extendTrialAction(activationId, Number(days)),
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="inline-flex items-center gap-1.5"
      onSubmit={(e) => {
        if (!window.confirm(`Esto genera una clave nueva con ${days} día(s) más y se la manda por mail. ¿Confirmás?`)) {
          e.preventDefault();
        }
      }}
    >
      <input
        type="number"
        min={1}
        max={365}
        value={days}
        onChange={(e) => setDays(e.target.value)}
        className="admin-input w-14 px-1.5 py-1 text-center text-[11.5px]"
        aria-label="Días a extender"
      />
      <button type="submit" disabled={pending} className="admin-btn admin-btn-ghost px-3 py-1.5 text-[11.5px]">
        {pending ? "Extendiendo…" : "Extender días"}
      </button>
      {result && "ok" in result && <span className="text-[12px] text-accent-green">Extendida ✓</span>}
      {result && "error" in result && <span className="text-[12px] text-brand">{result.error}</span>}
    </form>
  );
}
