"use client";

// En producción Next.js no manda al navegador el mensaje real de un error
// tirado en el servidor (por seguridad, para no filtrar detalles internos) --
// lo reemplaza por un texto genérico tipo "Minified React error #441", que
// no le dice nada a quien lo ve. Por eso acá NO se muestra error.message:
// siempre el mismo cartel claro, y el mensaje real queda en los logs del
// servidor (Vercel) para cuando haya que investigar de verdad.
export default function AdminDashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="admin-card mx-auto mt-10 max-w-md p-6 text-center">
      <p className="text-[15px] font-semibold text-foreground">No se pudo cargar esta página</p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/60">
        Puede ser un pico de tráfico momentáneo. Probá de nuevo en unos segundos.
      </p>
      <button onClick={() => reset()} className="admin-btn admin-btn-primary mt-4">
        Reintentar
      </button>
    </div>
  );
}
