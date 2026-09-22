import Link from "next/link";
import { getOverview, parseCanal, parsePeriodo, PERIODOS } from "@/lib/admin-stats";
import { listClientes, countBy } from "@/lib/clientes";
import { fmtArs, fmtDate, fmtPct } from "@/lib/format";
import { Alerta, Aviso, BarRow, Columnas, PageHeader, SectionTitle, Tile } from "@/components/admin/stats";

export const dynamic = "force-dynamic";

function canalLabel(s: string): string {
  if (s === "sin dato") return "Sin dato (antes de medir)";
  if (s === "directo") return "Directo";
  return s;
}

export default async function AdminResumen({
  searchParams,
}: {
  searchParams: Promise<{ dias?: string; canal?: string }>;
}) {
  const { dias: diasParam, canal: canalParam } = await searchParams;
  const dias = parsePeriodo(diasParam);

  // El filtro de canal solo puede ser uno de los que existan en los datos —
  // se valida contra o.sources después de traerlo, no antes.
  const oSinFiltro = await getOverview(dias);
  const canalesDisponibles = oSinFiltro.sources.map((s) => s.source);
  const canalPedido = parseCanal(canalParam);
  const canal = canalPedido === "todos" || canalesDisponibles.includes(canalPedido) ? canalPedido : "todos";
  const o = canal === "todos" ? oSinFiltro : await getOverview(dias, canal);

  const [clientes] = await Promise.all([listClientes()]);
  const now = new Date();
  const seg = countBy(clientes, now);

  const sinMedicion = o.analyticsSince === null;
  const porVencer = clientes.filter((c) => c.estado === "por_vencer");
  const vencieronSemana = clientes.filter(
    (c) =>
      c.estado === "vencida" &&
      c.trialExpiresAt &&
      now.getTime() - new Date(c.trialExpiresAt).getTime() <= 7 * 86400000
  ).length;
  const enPrueba = clientes.filter((c) => c.estado === "activa" || c.estado === "por_vencer").length;
  const sinComprar = clientes.filter((c) => c.estado === "vencida").length;
  const pagaron = clientes.filter((c) => c.estado === "comprado").length;

  const f = o.funnel;
  const pasos = [
    { label: "Visitantes", n: f.visitors },
    { label: "Hicieron clic en probar o comprar", n: f.cta },
    { label: "Empezaron un formulario", n: f.form },
    { label: "Pidieron la prueba", n: f.trials },
    { label: "Compraron", n: f.purchases },
  ];
  const maxPaso = Math.max(...pasos.map((p) => p.n), 1);
  const totalDevices = o.devices.reduce((a, d) => a + d.visitors, 0);
  const ganancia = o.revenueArs - o.adSpendArs;
  const hayAtencion =
    porVencer.length > 0 ||
    o.paymentsFailed > 0 ||
    o.cartsAbandoned.length > 0 ||
    o.bouncedLicenses.length > 0 ||
    seg.sinmail > 0 ||
    vencieronSemana > 0;

  const linkPeriodo = (p: number) => `/admin?dias=${p}${canal !== "todos" ? `&canal=${encodeURIComponent(canal)}` : ""}`;
  const linkCanal = (c: string) => `/admin?dias=${dias}${c !== "todos" ? `&canal=${encodeURIComponent(c)}` : ""}`;

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Resumen"
        subtitle="Un vistazo rápido a cómo viene Mercalin."
        action={
          <div className="flex" role="group" aria-label="Período">
            {PERIODOS.map((p) => (
              <Link
                key={p}
                href={linkPeriodo(p)}
                className={`admin-btn -ml-px border border-foreground px-4 py-2.5 ${
                  p === dias ? "bg-foreground text-white" : "bg-white text-foreground hover:bg-foreground/5"
                }`}
              >
                {p} días
              </Link>
            ))}
          </div>
        }
      />

      {/* Filtro por canal: mismo lenguaje que el de período (links, sin
          JavaScript), pero en su propia fila porque puede haber varios. */}
      {canalesDisponibles.length > 1 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
          <span className="tag-numbered text-[12px] text-foreground/45">Canal:</span>
          <Link
            href={linkCanal("todos")}
            className={`admin-btn border border-foreground/25 px-3.5 py-2 text-[12px] ${
              canal === "todos" ? "bg-foreground text-white" : "bg-white text-foreground hover:bg-foreground/5"
            }`}
          >
            Todos
          </Link>
          {canalesDisponibles.map((c) => (
            <Link
              key={c}
              href={linkCanal(c)}
              className={`admin-btn border border-foreground/25 px-3.5 py-2 text-[12px] ${
                canal === c ? "bg-foreground text-white" : "bg-white text-foreground hover:bg-foreground/5"
              }`}
            >
              {canalLabel(c)}
            </Link>
          ))}
        </div>
      )}

      {/* Lo que pide acción hoy */}
      <div className="mt-6 space-y-3">
        {porVencer.length > 0 && (
          <Alerta
            kicker="Pruebas"
            title={`${porVencer.length} ${porVencer.length === 1 ? "prueba vence" : "pruebas vencen"} en 48 hs`}
            href="/admin/clientes?segmento=vencen48"
            cta="Ver cuáles son"
          >
            {porVencer
              .slice(0, 4)
              .map((c) => c.businessName ?? c.email)
              .join(", ")}
            {porVencer.length > 4 ? ` y ${porVencer.length - 4} más` : ""}. Es el mejor momento para escribirles.
          </Alerta>
        )}
        {o.cartsAbandoned.length > 0 && (
          <Aviso kicker="Compras sin cerrar" tone="amber">
            {o.cartsAbandoned.length} {o.cartsAbandoned.length === 1 ? "persona fue" : "personas fueron"} a pagar en los
            últimos 7 días y no compró: {o.cartsAbandoned.map((c) => c.email).join(", ")}.
          </Aviso>
        )}
        {o.paymentsFailed > 0 && (
          <Aviso kicker="Pagos" tone="red" href="/admin/actividad?tipo=payment_failed" cta="Ver actividad">
            {o.paymentsFailed} {o.paymentsFailed === 1 ? "pago rechazado o cancelado" : "pagos rechazados o cancelados"} esta
            semana.
          </Aviso>
        )}
        {vencieronSemana > 0 && (
          <Aviso kicker="Vencieron" tone="ink" href="/admin/clientes?segmento=vencidas" cta="Ver quiénes">
            {vencieronSemana} {vencieronSemana === 1 ? "prueba venció" : "pruebas vencieron"} esta semana sin compra.
          </Aviso>
        )}
        {o.bouncedLicenses.length > 0 && (
          <Aviso kicker="Mail rebotado" tone="red" href="/admin/clientes?segmento=sinmail" cta="Ver quiénes">
            {o.bouncedLicenses.length === 1 ? "Una persona no recibió" : `${o.bouncedLicenses.length} personas no recibieron`}{" "}
            su clave porque el mail rebotó: {o.bouncedLicenses.map((b) => b.email).join(", ")}. Desde su ficha podés
            reenviarle la clave.
          </Aviso>
        )}
        {seg.sinmail > 0 && o.bouncedLicenses.length === 0 && (
          <Aviso kicker="Mails" tone="red" href="/admin/clientes?segmento=sinmail" cta="Ver quiénes">
            {seg.sinmail} {seg.sinmail === 1 ? "persona no recibió" : "personas no recibieron"} el mail con su clave.
          </Aviso>
        )}
        {!hayAtencion && (
          <Aviso kicker="Todo en orden" tone="green">
            Nada requiere tu atención hoy.
          </Aviso>
        )}
      </div>

      {/* Números del período */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile
          label={`Visitantes · ${dias} días`}
          value={sinMedicion ? "—" : o.visitors.toLocaleString("es-AR")}
          hint={sinMedicion ? "Se empiezan a medir al publicar" : `${o.pageViews.toLocaleString("es-AR")} páginas vistas`}
        />
        <Tile label="Pruebas pedidas" value={f.trials} hint="Personas distintas" />
        <Tile label="Compras" value={f.purchases} tone={f.purchases > 0 ? "green" : "ink"} />
        <Tile label="Ingresos" value={fmtArs(o.revenueArs)} tone={o.revenueArs > 0 ? "green" : "ink"} hint="Cobrado en el período" />
        <Tile
          label="Gastado en publicidad"
          value={fmtArs(o.adSpendArs)}
          hint={o.adSpendArs > 0 ? "Cargado a mano en Marketing" : "Todavía no cargaste gastos"}
          href="/admin/marketing"
        />
        <Tile
          label="Ganancia"
          value={fmtArs(ganancia)}
          tone={ganancia > 0 ? "green" : ganancia < 0 ? "red" : "ink"}
          hint="Ingresos menos publicidad, en el período"
        />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile
          label="De visita a prueba"
          value={sinMedicion ? "—" : fmtPct(f.trials, f.visitors)}
          hint={
            sinMedicion
              ? undefined
              : f.trials > f.visitors
                ? "Hay más pruebas que visitas medidas: la medición es reciente"
                : `${f.trials} de ${f.visitors} visitantes`
          }
        />
        <Tile
          label="De prueba a compra"
          value={fmtPct(o.trialToPurchase.converted, o.trialToPurchase.trials)}
          hint={`${o.trialToPurchase.converted} de ${o.trialToPurchase.trials} compraron hasta hoy`}
        />
        <Tile
          label="Costo por prueba"
          value={o.adSpendArs > 0 && f.trials > 0 ? fmtArs(Math.round(o.adSpendArs / f.trials)) : "—"}
          hint="Gasto en publicidad ÷ pruebas pedidas"
          href="/admin/marketing"
        />
      </div>

      {/* Estado de las pruebas */}
      <SectionTitle note="Todas las personas, sin importar el período ni el canal">Cómo están las pruebas</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="En prueba" value={enPrueba} href="/admin/clientes?segmento=activas" />
        <Tile
          label="Vencen en 48 hs"
          value={seg.vencen48}
          tone={seg.vencen48 > 0 ? "amber" : "ink"}
          href="/admin/clientes?segmento=vencen48"
        />
        <Tile
          label="Sin comprar"
          value={sinComprar}
          hint="Su prueba ya venció"
          tone={sinComprar > 0 ? "red" : "ink"}
          href="/admin/clientes?segmento=vencidas"
        />
        <Tile label="Compraron" value={pagaron} tone="green" href="/admin/clientes?segmento=pagos" />
      </div>
      <div className="mt-4">
        <Aviso kicker="Uso de la app">
          Mercalin funciona sin internet, así que el sitio no puede saber si alguien la está usando ni cuándo fue su última
          actividad. Se puede agregar (la app avisaría cada vez que se abre), pero hay que modificar la app de escritorio.
        </Aviso>
      </div>

      {/* Visitas por día */}
      <SectionTitle note={sinMedicion ? undefined : `Personas distintas por día · desde el ${fmtDate(o.analyticsSince)}`}>
        Visitantes por día
      </SectionTitle>
      {sinMedicion ? (
        <p className="text-[14.5px] text-foreground/60">
          Todavía no hay visitas registradas. La medición empieza cuando se publique esta versión del sitio.
        </p>
      ) : (
        <>
          <div className="admin-card p-5">
            <Columnas data={o.daily} />
          </div>
          {totalDevices > 0 && (
            <p className="mt-3 text-[13.5px] text-foreground/55">
              Desde:{" "}
              {o.devices
                .map((d) => `${d.device === "mobile" ? "celular" : d.device === "desktop" ? "computadora" : d.device} ${fmtPct(d.visitors, totalDevices)}`)
                .join(" · ")}
            </p>
          )}
        </>
      )}

      {/* Embudo */}
      <SectionTitle note="Del primer clic a la compra">Cuántos avanzan en cada paso</SectionTitle>
      <div className="admin-card px-5 py-3">
        {pasos.map((p, i) => (
          <BarRow
            key={p.label}
            label={p.label}
            value={p.n}
            max={maxPaso}
            right={i === 0 ? String(p.n) : `${p.n} · ${fmtPct(p.n, pasos[i - 1].n)}`}
          />
        ))}
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/55">
        {sinMedicion
          ? "Las visitas todavía no se miden; las pruebas y las compras sí."
          : `Los porcentajes son contra el paso anterior. Las visitas se miden desde el ${fmtDate(o.analyticsSince)}; las pruebas y compras se cuentan siempre.`}
        {!sinMedicion && f.visitors > 0 && ` Llegaron a ver la demo ${f.demo} de ${f.visitors} visitantes (${fmtPct(f.demo, f.visitors)}).`}
      </p>

      <p className="mt-8 border-t border-foreground/15 pt-6 text-[14.5px] text-foreground/60">
        Los canales, los botones, qué miran de la demo, los mails y el gasto en publicidad se movieron a{" "}
        <Link href="/admin/marketing" className="font-medium text-foreground underline underline-offset-2 hover:text-brand">
          Marketing
        </Link>
        . La actividad reciente, completa y con filtro, está en{" "}
        <Link href="/admin/actividad" className="font-medium text-foreground underline underline-offset-2 hover:text-brand">
          Actividad
        </Link>
        .
      </p>
    </div>
  );
}
