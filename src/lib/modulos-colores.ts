// Color de cada grupo de módulos: los mismos que tiene el menú del sistema y
// que usan los videos de cada módulo (rojo, verde, naranja, violeta y gris).
// Vive aparte de modulos-data.ts (que lee archivos) para poder usarlo también
// desde componentes del navegador.
export const COLOR_GRUPO: Record<string, string> = {
  Operación: "#e1251b",
  Catálogo: "#0a7d3e",
  Gestión: "#d97706",
  Análisis: "#7c3aed",
  Sistema: "#57534e",
};
