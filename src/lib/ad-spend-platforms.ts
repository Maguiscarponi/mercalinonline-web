// Separado de ad-spend.ts a propósito: este archivo no importa nada de
// servidor (getDb/postgres), así un Client Component (el formulario de
// carga) puede importar PLATFORMS sin arrastrar el driver de Postgres al
// bundle del navegador.

export type Platform = "facebook" | "instagram" | "google" | "otro";

export const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "google", label: "Google" },
  { id: "otro", label: "Otro" },
];
