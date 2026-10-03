/**
 * ADF — Autonomous Decision Factor
 * ADF = Decisiones de IA ejecutadas / Decisiones financieras totales
 * Metas (hipótesis): Año 1 → 20%, Año 2 → 40%, Año 3 → 60%.
 */

export const targets = {
  year1: 20,
  year2: 40,
  year3: 60,
} as const;

/**
 * Calcula el ADF como porcentaje con 1 decimal.
 * Devuelve 0 si totalDecisions ≤ 0.
 */
export function adf(aiExecuted: number, totalDecisions: number): number {
  if (totalDecisions <= 0) return 0;
  const pct = (aiExecuted / totalDecisions) * 100;
  return Math.round(pct * 10) / 10;
}
