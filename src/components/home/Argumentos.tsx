import { CalendarX, ScanBarcode, TrendingUp, WifiOff } from "lucide-react";

const ARGUMENTOS = [
  {
    icon: ScanBarcode,
    title: "No cargás el catálogo",
    body: "Más de 7.500 productos ya vienen con nombre, marca y código de barras. Escaneás, ponés el precio y ya está en tu sistema.",
  },
  {
    icon: TrendingUp,
    title: "Te avisa qué pedir, antes",
    body: "Calcula la velocidad real de venta de cada producto: «Fernet se agota en 0,3 días — pedí hoy». No es un gráfico, es una orden de compra.",
  },
  {
    icon: CalendarX,
    title: "Control de vencimientos por lote",
    body: "Cada lote con su fecha. Te marca lo vencido y lo que está por vencer, y te arma la orden de compra para reponerlo.",
  },
  {
    icon: WifiOff,
    title: "Lo pagás una vez y anda sin internet",
    body: "Sin cuotas mensuales. Y si se cae la conexión seguís vendiendo igual: los datos están en tu propia máquina.",
  },
];

export default function Argumentos() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <p className="tag-numbered text-xs text-brand">Por qué Mercalin</p>
      <h2 className="font-condensed mt-3 max-w-2xl text-[34px] font-extrabold leading-[1.06] tracking-tight sm:text-[42px]">
        Cuatro cosas que el resto no hace
      </h2>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {ARGUMENTOS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-black/[0.08] bg-white p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
              <Icon className="h-6 w-6 text-brand" strokeWidth={2} />
            </span>
            <h3 className="font-condensed mt-5 text-[26px] font-bold leading-tight">{title}</h3>
            <p className="mt-2 text-[16px] leading-relaxed text-foreground/55">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
