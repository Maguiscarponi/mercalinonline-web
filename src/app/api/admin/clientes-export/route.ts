import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { listClientes, filterClientes, isSegmento } from "@/lib/clientes";

// Exporta la lista de Clientes a CSV, respetando los mismos filtros que la
// pantalla (segmento, canal, búsqueda) -- así lo que se ve filtrado es
// exactamente lo que se descarga. Requiere sesión de admin, igual que la
// página; no hay otra puerta de entrada a estos datos.

function csvCell(v: string | number | null | undefined): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest) {
  await requireAdmin();

  const params = req.nextUrl.searchParams;
  const segmentoParam = params.get("segmento") ?? undefined;
  const segmento = isSegmento(segmentoParam) ? segmentoParam : "todos";
  const canal = params.get("canal") ?? "";
  const q = (params.get("q") ?? "").trim().toLowerCase();

  const now = new Date();
  const todos = await listClientes();
  const filtrados = filterClientes(todos, { segmento, canal, q }, now);

  const header = [
    "email", "negocio", "estado", "empezo_prueba", "vence", "pago_ars", "fecha_pago", "canal", "campana", "ultima_visita_web",
  ];
  const rows = filtrados.map((c) => [
    csvCell(c.email),
    csvCell(c.businessName),
    csvCell(c.estado),
    csvCell(c.trialStartedAt),
    csvCell(c.estado === "comprado" ? "" : c.trialExpiresAt),
    csvCell(c.estado === "comprado" ? c.amountArs : ""),
    csvCell(c.purchasedAt),
    csvCell(c.source),
    csvCell(c.campaign),
    csvCell(c.lastWebVisit),
  ].join(","));

  const csv = "﻿" + [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clientes-mercalin-${now.toISOString().slice(0, 10)}.csv"`,
    },
  });
}
