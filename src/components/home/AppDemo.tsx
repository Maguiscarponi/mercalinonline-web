"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Maqueta animada de Mercalin para el hero.

   Rota entre cuatro módulos (Caja, Consejos, Dashboard, Reportes) mientras
   el sidebar acompaña: se desplaza hasta el módulo activo y lo pinta con el
   color que ese módulo tiene en la app. El sidebar completo está a la vista
   justamente para que se entienda que hay muchos más módulos que los cuatro
   que rotan.

   Los estilos viven en globals.css bajo el prefijo .ha- (hero app).

   OJO: los números son de un comercio con movimiento, no de la instalación
   de prueba. Si algún día querés datos reales, están todos acá abajo.
   ───────────────────────────────────────────────────────────────────────── */

const ars = (n: number) => "$ " + n.toLocaleString("es-AR");

/* ── sidebar: los 19 módulos, agrupados como en la app ── */
const VIO = "var(--ha-vio)";
const GRN = "var(--ha-grn)";
const AMB = "var(--ha-amb)";

type NavItem = { label: string; id?: string; badge?: string };
type NavGrupo = { titulo?: string; color: string; items: NavItem[] };

const NAV: NavGrupo[] = [
  { color: "var(--brand)", items: [{ label: "Consejos", id: "consejos", badge: "12" }] },
  {
    titulo: "Operación",
    color: VIO,
    items: [{ label: "Caja", id: "caja" }, { label: "Gestión de caja" }, { label: "Clientes" }, { label: "Devoluciones" }],
  },
  {
    titulo: "Catálogo",
    color: GRN,
    items: [
      { label: "Productos" }, { label: "Proveedores" }, { label: "Categorías" }, { label: "Vencimientos" },
      { label: "Inventario" }, { label: "Etiquetas" }, { label: "Combos" },
    ],
  },
  {
    titulo: "Gestión",
    color: AMB,
    items: [{ label: "Presupuestos" }, { label: "Promociones" }, { label: "Usuarios" }],
  },
  {
    titulo: "Análisis",
    color: VIO,
    items: [{ label: "Dashboard", id: "dashboard" }, { label: "Reportes", id: "reportes" }],
  },
  {
    titulo: "Sistema",
    color: "#a5a5ae",
    items: [{ label: "Auditoría" }, { label: "Configuración" }],
  },
];

/* ── módulo 1 · Caja ── */
const CAJA_ITEMS: [string, number][] = [
  ["Agua Mineral Villa San Remo (1,5 L)", 1200],
  ["9 de oro Azucaradas", 1200],
  ["ALFAJOR DE DULCE DE LECHE", 2000],
  ["ARROZ CON REMOLACHA Molé", 1500],
  ["AZUCAR MASCABO Ledesma (800 g)", 2000],
];

function PanelCaja() {
  const [paso, setPaso] = useState(1);
  // En mobile entran tres renglones. Cortamos ahí para que el total y el
  // contador de artículos coincidan con lo que se ve en pantalla.
  const [tope, setTope] = useState(CAJA_ITEMS.length);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const aplicar = () => setTope(mq.matches ? 3 : CAJA_ITEMS.length);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  useEffect(() => {
    if (paso >= tope) return;
    const t = setTimeout(() => setPaso((p) => p + 1), 1100);
    return () => clearTimeout(t);
  }, [paso, tope]);

  const visibles = CAJA_ITEMS.slice(0, Math.min(paso, tope));
  const total = visibles.reduce((a, [, p]) => a + p, 0);
  const completa = visibles.length >= tope;

  return (
    <div className="ha-panel">
      <div className="ha-mhead">
        <h3>Caja</h3>
        <span className="ha-sm">Turno tarde · Caja 1</span>
        <span className="ha-pills">
          <span className="ha-pill">Lista</span>
          <span className="ha-pill" data-on="1">Minorista</span>
        </span>
      </div>

      <div className="ha-caja">
        <div className="ha-caja-left">
          <div className="ha-scan">
            Código de barras o nombre del producto…
            <span className="ha-caret" />
          </div>
          <div className="ha-list">
            {visibles.map(([nombre, precio], i) => (
              <div className={`ha-row ha-row-${i}`} key={nombre}>
                <span className="ha-row-name">
                  <b>{nombre}</b>
                  <span className="ha-num">{ars(precio)} c/u</span>
                </span>
                <span className="ha-step"><i>−</i><u>1</u><i>+</i></span>
                <span className="ha-row-price ha-num">{ars(precio)}</span>
                <span className="ha-row-x">×</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ha-caja-right">
          <div className="ha-total">
            <div className="ha-total-lb">Total a cobrar</div>
            <div className="ha-total-vl ha-num">{ars(total)}</div>
            <div className="ha-total-un ha-num">{visibles.length} art. · {visibles.length} unid.</div>
          </div>
          <div className="ha-cobrar" style={completa ? undefined : { animation: "none" }}>
            Cobrar <em>Enter · F2</em>
          </div>
          <div className="ha-dto">
            DTO.
            <span className="ha-dto-tg"><i data-on="1">$</i><i>%</i></span>
            <span className="ha-dto-in" />
          </div>
          <div className="ha-anular">Anular venta</div>
          <div className="ha-qbtns">
            <span className="ha-qb">Precio · F3</span>
            <span className="ha-qb">Presupuesto</span>
            <span className="ha-qb">Combos</span>
            <span className="ha-qb">Aparcar venta</span>
          </div>
          <div className="ha-qacc">
            <span>Acceso rápido</span>
            <b className="ha-num">Cigarrillo suelto $500</b>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── módulo 2 · Consejos ── */
const CONSEJOS: { nivel: "urg" | "imp"; texto: string; detalle: string; accion: string }[] = [
  {
    nivel: "urg",
    texto: "Fernet Branca (750 ml) se agota en ~0.3 días al ritmo actual",
    detalle: "3 unidades · velocidad: 10.3/día · pedí hoy",
    accion: "Ver Proveedores →",
  },
  {
    nivel: "urg",
    texto: "Alfajor Havanna (25 g) se agota en ~0.4 días al ritmo actual",
    detalle: "4 unidades · velocidad: 9.2/día · pedí hoy",
    accion: "Ver Proveedores →",
  },
  {
    nivel: "urg",
    texto: "1 cliente debe $8.500 total sin compras en 30+ días",
    detalle: "Último movimiento: 14/07 · saldo vencido",
    accion: "Ver Clientes →",
  },
  {
    nivel: "imp",
    texto: "$46.200 inmovilizados en productos sin vender en 30 días",
    detalle: "Arroz con Leche light Tregar (222 un.), Fideos Tallarín (22 un.) y 1 más",
    accion: "Ver Stock →",
  },
  {
    nivel: "imp",
    texto: "3 productos con stock mínimo por debajo de su velocidad real de venta",
    detalle: "Yerba Playadito (500 g): mínimo 8, sugerido 35",
    accion: "Ver Productos →",
  },
];

function PanelConsejos() {
  return (
    <div className="ha-panel">
      <div className="ha-mhead">
        <h3>Consejo del día <span className="ha-sm">(12)</span></h3>
        <span className="ha-pills">
          <span className="ha-pill">4 urgente</span>
          <span className="ha-pill">6 importante</span>
          <span className="ha-pill">2 info</span>
        </span>
      </div>
      <div className="ha-tips">
        {CONSEJOS.map((c, i) => (
          <div
            className={`ha-tip ha-tip-${i}`}
            data-lv={c.nivel}
            key={c.texto}
            style={{ animationDelay: `${300 + i * 800}ms` }}
          >
            <span className="ha-tip-lv"><i /><span>{c.nivel === "urg" ? "Urgente" : "Importante"}</span></span>
            <span className="ha-tip-tx">{c.texto}<span>{c.detalle}</span></span>
            <span className="ha-tip-go">{c.accion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── módulo 3 · Dashboard ── */
const TOP_HOY: [string, string, string][] = [
  ["1", "ARROZ CON REMOLACHA Molé", "34 un. · $51.000"],
  ["2", "Alfajor Havanna (25 g)", "28 un. · $42.000"],
  ["3", "Agua Mineral Villa San Remo", "25 un. · $30.000"],
];
const ALERTAS: [string, string][] = [
  ["Fernet Branca (750 ml)", "3 un. · 0.3 días restantes"],
  ["Alfajor Havanna (25 g)", "4 un. · 0.4 días restantes"],
  ["Dulce de Leche La Serenísima", "18 un. · 1.6 días restantes"],
];

function PanelDashboard() {
  return (
    <div className="ha-panel">
      <div className="ha-mhead">
        <h3>Buenas tardes · Martes, 18 de agosto</h3>
        <span className="ha-pills">
          <span className="ha-pill">9 alertas</span>
          <span className="ha-pill" data-on="1">Ir a Caja</span>
        </span>
      </div>

      <div className="ha-dtop">
        <div className="ha-card ha-pad">
          <div className="ha-ch"><span>Ventas hoy</span></div>
          <div className="ha-kbig ha-num">$ 184.300</div>
          <div className="ha-krow">
            <div>Transacciones<b className="ha-num">87</b></div>
            <div>Ticket promedio<b className="ha-num">$ 2.119</b></div>
            <div>Ganancia bruta<b className="ha-num" data-up="1">$ 61.400</b></div>
          </div>
        </div>

        <div className="ha-card ha-pad ha-top-card">
          <div className="ha-ch"><span>Top hoy</span></div>
          {TOP_HOY.map(([rk, nombre, dato]) => (
            <div className="ha-top" key={nombre}>
              <span className="ha-top-rk ha-num">{rk}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <b>{nombre}</b>
                <span className="ha-num">{dato}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="ha-dbot">
        <div className="ha-card ha-pad" style={{ display: "flex", flexDirection: "column" }}>
          <div className="ha-ch">
            <span>Tendencia últimos 7 días</span>
            <span style={{ color: "var(--ha-grn)" }}>▲ 9,4%</span>
          </div>
          <div className="ha-chart">
            <svg viewBox="0 0 300 74" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="haGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#6d28d9" stopOpacity=".22" />
                  <stop offset="1" stopColor="#6d28d9" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="ha-chart-area" d="M4,52 L52,44 L100,48 L148,34 L196,40 L244,18 L292,10 L292,74 L4,74 Z" />
              <polyline className="ha-chart-line" points="4,52 52,44 100,48 148,34 196,40 244,18 292,10" />
            </svg>
          </div>
          <div className="ha-xlab">
            {["Mié", "Jue", "Vie", "Sáb", "Dom", "Lun", "Hoy"].map((d) => <span key={d}>{d}</span>)}
          </div>
        </div>

        <div className="ha-card ha-pad ha-alerts-card" style={{ overflow: "hidden" }}>
          <div className="ha-ch"><span>Alertas</span><span>9</span></div>
          {ALERTAS.map(([nombre, dato], i) => (
            <div className="ha-alert" key={nombre} style={{ animationDelay: `${500 + i * 300}ms` }}>
              <span className="ha-alert-ico" />
              <span style={{ minWidth: 0 }}>
                <b>Stock crítico</b>
                <u>{nombre}</u>
                <span className="ha-num">{dato}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── módulo 4 · Reportes ── */
const KPIS: [string, string, string][] = [
  ["Ventas", "87", "▲ 6 vs. ayer"],
  ["Total facturado", "$ 184.300", "▲ 12,4%"],
  ["Promedio por venta", "$ 2.119", "▲ 4,1%"],
  ["Descuentos", "$ 4.200", "2,3%"],
];
const PAGOS: [string, string, string][] = [
  ["Efectivo", "$ 99.500", "54%"],
  ["Débito", "$ 47.900", "26%"],
  ["QR / Mercado Pago", "$ 27.600", "15%"],
];
const CATEGORIAS: [string, string, string][] = [
  ["Bebidas", "$ 74.100", "100%"],
  ["Almacén", "$ 58.300", "79%"],
  ["Golosinas", "$ 33.400", "45%"],
];
const MAS_VENDIDOS: [string, string, string, string, string][] = [
  ["01", "ARROZ CON REMOLACHA Molé", "34 un", "100%", "$ 51.000"],
  ["02", "Alfajor Havanna (25 g)", "28 un", "82%", "$ 42.000"],
  ["03", "Agua Mineral Villa San Remo (1,5 L)", "25 un", "59%", "$ 30.000"],
];

function Barras({ filas }: { filas: [string, string, string][] }) {
  return (
    <>
      {filas.map(([nombre, valor, ancho], i) => (
        <div key={nombre}>
          <div className="ha-lrow" style={{ animationDelay: `${600 + i * 150}ms` }}>
            <span>{nombre}</span>
            <b className="ha-num">{valor}</b>
          </div>
          <div className="ha-lbar"><i style={{ ["--w" as string]: ancho } as CSSProperties} /></div>
        </div>
      ))}
    </>
  );
}

function PanelReportes() {
  return (
    <div className="ha-panel">
      <div className="ha-mhead">
        <h3>Reportes</h3>
        <span className="ha-pills">
          {["Hoy", "Ayer", "7 días", "Este mes"].map((p, i) => (
            <span className="ha-pill" key={p} {...(i === 0 ? { "data-on": "1" } : {})}>{p}</span>
          ))}
        </span>
      </div>

      <div className="ha-tabsrow">
        {["Resumen", "Ventas (87)", "Márgenes", "Stock $", "Reposición", "Libro IVA", "Afinidad"].map((t, i) => (
          <span className="ha-tb" key={t} {...(i === 0 ? { "data-on": "1" } : {})}>{t}</span>
        ))}
        <span style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <span className="ha-tb">Exportar Excel</span>
          <span className="ha-tb">Imprimir / PDF</span>
        </span>
      </div>

      <div className="ha-kpi4">
        {KPIS.map(([lb, vl, dt], i) => (
          <div className="ha-kc" key={lb} style={{ animationDelay: `${200 + i * 150}ms` }}>
            <div className="ha-kc-lb">{lb}</div>
            <div className="ha-kc-vl ha-num">{vl}</div>
            <div className="ha-kc-dt">{dt}</div>
          </div>
        ))}
      </div>

      <div className="ha-r2">
        <div className="ha-card ha-pad">
          <div className="ha-ch"><span>Por medio de pago</span></div>
          <Barras filas={PAGOS} />
        </div>
        <div className="ha-card ha-pad ha-cat-card">
          <div className="ha-ch"><span>Por categoría</span></div>
          <Barras filas={CATEGORIAS} />
        </div>
      </div>

      <div className="ha-card ha-pad ha-r3">
        <div className="ha-ch"><span>Productos más vendidos</span><span>Por facturación</span></div>
        {MAS_VENDIDOS.map(([rk, nombre, un, ancho, monto], i) => (
          <div className="ha-prow" key={nombre} style={{ animationDelay: `${850 + i * 150}ms` }}>
            <span className="ha-prow-rk">{rk}</span>
            <span className="ha-prow-nm">{nombre}</span>
            <span className="ha-prow-un ha-num">{un}</span>
            <span className="ha-prow-mb"><i style={{ ["--w" as string]: ancho } as CSSProperties} /></span>
            <span className="ha-prow-mn ha-num">{monto}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── los cuatro módulos que rotan ── */
const MODULOS = [
  { id: "caja", titulo: "Caja", dur: 8200, Panel: PanelCaja },
  { id: "consejos", titulo: "Consejos", dur: 7000, Panel: PanelConsejos },
  { id: "dashboard", titulo: "Dashboard", dur: 6600, Panel: PanelDashboard },
  { id: "reportes", titulo: "Reportes", dur: 6600, Panel: PanelReportes },
];

export default function AppDemo({ className = "" }: { className?: string }) {
  const [activo, setActivo] = useState(0);
  const [auto, setAuto] = useState(true);
  const sideRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<Record<string, HTMLDivElement | null>>({});

  // Quien pidió menos movimiento no necesita una demo girando sola.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
  }, []);

  // Rotación automática. Se corta apenas alguien toca una pastilla.
  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setActivo((a) => (a + 1) % MODULOS.length), MODULOS[activo].dur);
    return () => clearTimeout(t);
  }, [activo, auto]);

  // El sidebar se desplaza hasta dejar visible el módulo activo.
  useEffect(() => {
    const side = sideRef.current;
    const inner = innerRef.current;
    const item = itemsRef.current[MODULOS[activo].id];
    if (!side || !inner || !item) return;

    if (!window.matchMedia("(min-width: 768px)").matches) {
      inner.style.transform = "";
      return;
    }
    const max = Math.max(0, inner.scrollHeight - side.clientHeight + 8);
    const off = Math.min(max, Math.max(0, item.offsetTop - side.clientHeight * 0.62));
    inner.style.transform = `translateY(${-off}px)`;
  }, [activo]);

  const Panel = MODULOS[activo].Panel;

  return (
    <div className={`ha-demo ${className}`}>
      <span className="ha-live tag-numbered"><i />Así funciona</span>

      <div className="ha">
        <div className="ha-tbar">
          <span className="ha-tbar-mark">M</span>
          Mercalin
          <span className="ha-tbar-win" aria-hidden><span>—</span><span>□</span><span>×</span></span>
        </div>

        <div className="ha-body">
          <aside className="ha-side" ref={sideRef} aria-label="Módulos del sistema">
            <div className="ha-side-in" ref={innerRef}>
              <div className="ha-store">
                <span className="ha-store-ico" />
                <span><b>Kiosco Don Jorge</b><span>Mercalin</span></span>
              </div>
              <div className="ha-search">Buscar… <em>Ctrl+K</em></div>

              {NAV.map((grupo, gi) => (
                <div key={grupo.titulo ?? `g${gi}`}>
                  {grupo.titulo && (
                    <div className="ha-group tag-numbered" style={{ ["--ha-c" as string]: grupo.color } as CSSProperties}>
                      <i />{grupo.titulo}
                    </div>
                  )}
                  {grupo.items.map((item) => (
                    <div
                      className="ha-item"
                      key={item.label}
                      ref={item.id ? (el) => { itemsRef.current[item.id!] = el; } : undefined}
                      style={{ ["--ha-c" as string]: grupo.color } as CSSProperties}
                      {...(item.id === MODULOS[activo].id ? { "data-on": "1" } : {})}
                    >
                      <span className="ha-item-ico" />
                      <span className="ha-item-label">{item.label}</span>
                      {item.badge && <span className="ha-item-badge">{item.badge}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </aside>

          <div className="ha-panels" role="tabpanel" id={`ha-panel-${MODULOS[activo].id}`}>
            <Panel key={activo} />
          </div>
        </div>
      </div>

      <div className="ha-tabs tag-numbered" role="tablist" aria-label="Módulos de la demo">
        {MODULOS.map((m, i) => (
          <button
            type="button"
            key={m.id}
            role="tab"
            aria-selected={i === activo}
            aria-controls={`ha-panel-${m.id}`}
            className="ha-tab"
            onClick={() => { setAuto(false); setActivo(i); }}
          >
            {m.titulo}
            <span className="ha-tab-prog" style={{ animationDuration: auto ? `${m.dur}ms` : "0ms" }} />
          </button>
        ))}
        <span className="ha-more">+ 15 módulos más</span>
      </div>
    </div>
  );
}
