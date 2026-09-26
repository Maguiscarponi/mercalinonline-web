"use client";

import { useActionState, useRef } from "react";
import { createNoteAction } from "@/lib/actions/notes";

type Result = { ok: true } | { error: string } | null;

// Se usa en dos lugares: /admin/reportes (con el campo de mail visible, para
// cargar una nota sobre cualquier persona) y en la ficha de un cliente
// (con el mail ya fijo, sin mostrar el campo).
export default function NoteForm({ email }: { email?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [result, formAction, pending] = useActionState<Result, FormData>(
    async (_prev, fd) => {
      const r = await createNoteAction(_prev, fd);
      if ("ok" in r) formRef.current?.reset();
      return r;
    },
    null
  );

  return (
    <form ref={formRef} action={formAction} className="admin-card space-y-3 p-5">
      {!email && (
        <div>
          <label htmlFor="note-email" className="tag-numbered mb-1.5 block text-[12px] text-foreground/55">
            Mail
          </label>
          <input id="note-email" name="email" type="email" required className="admin-input w-full" placeholder="persona@negocio.com" />
        </div>
      )}
      {email && <input type="hidden" name="email" value={email} />}

      <div>
        <label htmlFor="note-text" className="tag-numbered mb-1.5 block text-[12px] text-foreground/55">
          Nota
        </label>
        <textarea
          id="note-text"
          name="note"
          required
          rows={3}
          className="admin-input w-full resize-none"
          placeholder="Me escribió porque no le funcionaba la clave, se la regeneré…"
        />
      </div>

      {result && "error" in result && <p className="text-[13px] text-brand">{result.error}</p>}
      {result && "ok" in result && <p className="text-[13px] text-accent-green">Nota guardada ✓</p>}

      <button type="submit" disabled={pending} className="admin-btn admin-btn-dark px-5 py-2">
        {pending ? "Guardando…" : "Guardar nota"}
      </button>
    </form>
  );
}
