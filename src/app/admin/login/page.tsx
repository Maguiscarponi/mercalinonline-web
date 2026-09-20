"use client";

import { useState } from "react";
import Image from "next/image";
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
    <section className="flex min-h-screen items-center justify-center bg-dark-section px-6">
      <div className="w-full max-w-[420px] bg-white p-9 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:p-11">
        <Image src="/mercalin-logo.svg" alt="Mercalin" width={140} height={44} style={{ height: "auto" }} priority />
        <p className="tag-numbered mt-3 text-[12px] text-foreground/45">Panel de administración</p>
        <form action={handleSubmit} className="mt-9">
          <label className="tag-numbered block text-[12px] text-foreground/60" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="admin-input mt-2"
          />
          {error && <p className="mt-3 text-[14px] text-brand">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-dark mt-6 w-full justify-center py-3.5 disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </section>
  );
}
