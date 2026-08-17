"use client";

import { useState } from "react";
import { loginAction } from "@/lib/actions/adminAuth";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await loginAction(formData);
    // Si loginAction hace redirect(), esto no se llega a ejecutar.
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-sm items-center px-6">
      <div className="w-full border border-black/10 p-8">
        <p className="tag-numbered text-xs text-brand">Admin</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Entrar</h1>
        <form action={handleSubmit} className="mt-6">
          <label className="tag-numbered block text-xs text-foreground/40" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="mt-2 w-full border border-black/15 px-3 py-2.5 text-sm"
          />
          {error && <p className="mt-3 text-sm text-brand">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </section>
  );
}
