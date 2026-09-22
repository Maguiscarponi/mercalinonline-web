"use client";

export default function AdminDashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="admin-card mx-auto mt-10 max-w-md p-6 text-center">
      <p className="text-[15px] font-semibold text-foreground">No se pudo cargar esta página</p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/60">
        {error.message || "Hubo un problema al traer los datos. Puede ser un pico de tráfico momentáneo -- probá de nuevo."}
      </p>
      <button onClick={() => reset()} className="admin-btn admin-btn-primary mt-4">
        Reintentar
      </button>
    </div>
  );
}
