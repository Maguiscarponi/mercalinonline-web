import Link from "next/link";
import { getOverview, parsePeriodo, PERIODOS } from "@/lib/admin-stats";
import { listClientes, countBy } from "@/lib/clientes";
import { eventDetail, eventLabel, locationLabel, mailTypeLabel } from "@/lib/event-labels";
import { fmtArs, fmtDate, fmtDateTime, fmtPct, timeAgo } from "@/lib/format";
import { Alerta, Aviso, BarRow, Columnas, PageHeader, SectionTitle, Tile } from "@/components/admin/stats";

export const dynamic = "force-dynamic";

const BOTONES: Record<string, string> = {
  cta_trial_clicked: "Probar gratis",
  cta_buy_clicked: "Comprar",
  cta_detail_clicked: "Ver detalle",
  whatsapp_clicked: "WhatsApp",
};

function canalLabel(s: string): string {
  if (s === "sin dato") return "Sin dato (antes de medir)";
  if (s === "directo") return "Directo";
  return s;
}

export default async function AdminResumen({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  const { dias: diasParam } = await searchParams;
  const dias = parsePeriodo(diasParam);

  const [o, clientes] = await Promise.all([getOverview(dias), listClientes()]);
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
  const maxModulo = Math.max(...o.modules.map((m) => m.visitors), 1);
  const totalDevices = o.devices.reduce((a, d) => a + d.visitors, 0);
  const hayAtencion =
    porVencer.length > 0 ||
    o.paymentsFailed > 0 ||
    o.cartsAbandoned.length > 0 ||
    o.bouncedLicenses.length > 0 ||
    seg.sinmail > 0 ||
    vencieronSemana > 0;

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
                href={`/admin?dias=${p}`}
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
          <Aviso kicker="Pagos" tone="red" href="#actividad" cta="Ver actividad">
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
            su clave porque el mail rebotó: {o.bouncedLicenses.map((b) => b.email).join(", ")}. Escribiles por WhatsApp para
            pasársela.
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
        <Tile
          label="Ingresos"
          value={fmtArs(o.revenueArs)}
          tone={o.revenueArs > 0 ? "green" : "ink"}
          hint="Cobrado en el período"
        />
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
      </div>

      {/* Estado de las pruebas */}
      <SectionTitle note="Todas las personas, sin importar el período">Cómo están las pruebas</SectionTitle>
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

      {/* Canales */}
      <SectionTitle note="Cómo llegó cada persona la primera vez">De dónde vienen</SectionTitle>
      {o.sources.length === 0 ? (
        <p className="text-[14.5px] text-foreground/60">Todavía no hay datos de canales.</p>
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead>
              <tr className="tag-numbered border-b border-foreground/15 text-[12px] text-foreground/55">
                <th className="px-5 py-3">Canal</th>
                <th className="py-3 pr-4 text-right">Visitantes</th>
                <th className="py-3 pr-4 text-right">Pruebas</th>
                <th className="py-3 pr-4 text-right">Compras</th>
                <th className="py-3 pr-4 text-right">Ingresos</th>
                <th className="py-3 pr-5 text-right">Visita → prueba</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.07]">
              {o.sources.map((s) => (
                <tr key={s.source}>
                  <td className="px-5 py-3 font-medium">{canalLabel(s.source)}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{s.visitors}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{s.trials}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{s.purchases}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{s.revenue ? fmtArs(s.revenue) : "—"}</td>
                  <td className="py-3 pr-5 text-right tabular-nums">{fmtPct(s.trials, s.visitors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/55">
        Para distinguir una campaña, usá links con etiqueta, por ejemplo:{" "}
        <span className="font-mono text-[12.5px]">mercalinonline.com/?utm_source=instagram&amp;utm_campaign=lanzamiento</span>
      </p>

      {/* Demo */}
      <SectionTitle note="Personas distintas que miraron o abrieron cada módulo">Qué miran de la demo</SectionTitle>
      {o.modules.length === 0 ? (
        <p className="text-[14.5px] text-foreground/60">Todavía no hay datos.</p>
      ) : (
        <div className="admin-card px-5 py-3">
          {o.modules.map((m) => (
            <BarRow key={m.module} label={m.module} sub={m.group || undefined} value={m.visitors} max={maxModulo} />
          ))}
        </div>
      )}

      {/* Botones */}
      <SectionTitle note="Cuántas veces se tocó cada uno">Botones y WhatsApp</SectionTitle>
      {o.buttons.length === 0 ? (
        <p className="text-[14.5px] text-foreground/60">Todavía no hay datos.</p>
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[14px]">
            <thead>
              <tr className="tag-numbered border-b border-foreground/15 text-[12px] text-foreground/55">
                <th className="px-5 py-3">Botón</th>
                <th className="py-3 pr-4">Dónde está</th>
                <th className="py-3 pr-4 text-right">Clics</th>
                <th className="py-3 pr-5 text-right">Personas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.07]">
              {o.buttons.map((b) => (
                <tr key={b.name + b.location}>
                  <td className="px-5 py-3 font-medium">{BOTONES[b.name] ?? b.name}</td>
                  <td className="py-3 pr-4 text-foreground/65">{locationLabel(b.location)}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{b.clicks}</td>
                  <td className="py-3 pr-5 text-right tabular-nums">{b.visitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mails */}
      <SectionTitle note="Lo informa Resend, el servicio que envía los mails">Qué pasó con los mails</SectionTitle>
      {o.mails.length === 0 ? (
        <p className="text-[14.5px] leading-relaxed text-foreground/60">
          Todavía no hay datos de entrega. Aparecen cuando se conecta Resend con el sitio (un paso de una sola vez) y sale el
          próximo mail.
        </p>
      ) : (
        <>
          <div className="admin-card overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[14px]">
              <thead>
                <tr className="tag-numbered border-b border-foreground/15 text-[12px] text-foreground/55">
                  <th className="px-5 py-3">Mail</th>
                  <th className="py-3 pr-4 text-right">Entregados</th>
                  <th className="py-3 pr-4 text-right">Rebotados</th>
                  <th className="py-3 pr-4 text-right">Abiertos</th>
                  <th className="py-3 pr-5 text-right">Con clic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.07]">
                {o.mails.map((m) => (
                  <tr key={m.type}>
                    <td className="px-5 py-3 font-medium">{mailTypeLabel(m.type)}</td>
                    <td className="py-3 pr-4 text-right tabular-nums">{m.delivered}</td>
                    <td className={`py-3 pr-4 text-right tabular-nums ${m.bounced > 0 ? "font-semibold text-brand" : ""}`}>
                      {m.bounced}
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">{m.opened}</td>
                    <td className="py-3 pr-5 text-right tabular-nums">{m.clicked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/55">
            Las aperturas son aproximadas: Apple Mail y algunos programas las esconden o las cuentan de más. Los rebotes y
            las entregas sí son confiables.
          </p>
        </>
      )}

      {/* Actividad */}
      <div id="actividad" />
      <SectionTitle note="Lo último que pasó">Actividad reciente</SectionTitle>
      {o.recent.length === 0 ? (
        <p className="text-[14.5px] text-foreground/60">Todavía no hay actividad registrada.</p>
      ) : (
        <div className="admin-card divide-y divide-black/[0.07]">
          {o.recent.map((r, i) => (
            <div key={i} className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5 px-5 py-3">
              <p className="w-36 shrink-0 text-[13px] tabular-nums text-foreground/50" title={fmtDateTime(r.at)}>
                {timeAgo(r.at, now)}
              </p>
              <p className="text-[14.5px] font-medium">{eventLabel(r.name)}</p>
              <p className="min-w-0 flex-1 truncate text-[14px] text-foreground/60">
                {r.email ?? `visitante anónimo${r.source ? ` · ${r.source}` : ""}`}
                {eventDetail(r.name, r.props, r.path) ? ` · ${eventDetail(r.name, r.props, r.path)}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
