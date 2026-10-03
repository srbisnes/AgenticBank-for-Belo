export const targets = {
  year1: 20,
  year2: 40,
  year3: 60,
} as const;

export function adf(aiExecuted: number, totalDecisions: number): number {
  if (totalDecisions <= 0) return 0;
  const pct = (aiExecuted / totalDecisions) * 100;
  return Math.round(pct * 10) / 10;
}
