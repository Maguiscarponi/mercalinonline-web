// Plan en cuotas fijas de un producto. Vive aparte de products.ts (que trae
// Postgres) para poder usarlo también desde componentes del navegador.
//
// El total en cuotas es lo que paga el cliente (cantidad × valor de cada
// cuota) y es más alto que el precio en un pago: cubre lo que Mercado Pago le
// cobra al vendedor por ofrecer cuotas sin interés. Por eso en el sitio se
// anuncian como "cuotas fijas" y siempre con el total a la vista.

export interface PlanCuotas {
  cuotas: number;
  montoCuota: number;
  total: number;
}

export type PlanPago = "contado" | "cuotas";

export function planCuotas(p: { installmentsCount: number; installmentArs: number }): PlanCuotas | null {
  if (!(p.installmentsCount >= 2) || !(p.installmentArs > 0)) return null;
  return { cuotas: p.installmentsCount, montoCuota: p.installmentArs, total: p.installmentsCount * p.installmentArs };
}

export function pesos(n: number): string {
  return `$${n.toLocaleString("es-AR")}`;
}
