/**
 * Demo — cobro de USD 2.500 con regla 20/20/60, auditoría y ADF.
 * Salida esperada:
 *   BELO_VAULT_SWEEP 500
 *   BELO_TAX_ISOLATION_ESCROW 500
 *   AVAILABLE_BALANCE 1500
 *   audit chain valid: true
 */

import { evaluate, applyAllocations, type Event } from "./rules-engine";
import { AuditTrail } from "./audit-receipt";
import { adf, targets } from "./adf";

const event: Event = {
  type: "income_received",
  amount: 2500,
  currency: "USD",
  timestamp: new Date().toISOString(),
};

console.log("=== AgenticBank for Belo — Demo (prototipo simulado) ===\n");
console.log("Evento: cobro de USD 2.500 (income_received)\n");

const actions = evaluate(event);
const allocations = applyAllocations(2500, actions);

console.log("Reparto según regla income-20-20-60:");
for (const [rail, amount] of Object.entries(allocations)) {
  console.log(`  ${rail} ${amount}`);
}

const trail = new AuditTrail();
trail.record("RulesEngine", "Evaluó income-20-20-60 sobre USD 2500");
trail.record("RiskEngine", "Riesgo simulado 98/100 — dentro de umbral");
trail.record("ExecutionLayer", "Asignaciones aplicadas a rieles simulados Belo");
trail.record("AuditTrail", "Recibo SHA-256 generado");

const valid = trail.verify();
console.log(`\naudit chain valid: ${valid}`);

const aiExecuted = 1;
const totalDecisions = 1;
const currentAdf = adf(aiExecuted, totalDecisions);
console.log(`\nADF actual: ${currentAdf}% (hipótesis targets: Y1 ${targets.year1}% / Y2 ${targets.year2}% / Y3 ${targets.year3}%)`);
console.log("\n=== Fin demo ===");
