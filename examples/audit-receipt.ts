/**
 * Audit Trail — recibos criptográficos SHA-256 encadenados.
 * Prototipo. No usa fondos reales.
 */

import { createHash } from "node:crypto";

export interface AuditRecord {
  index: number;
  agent: string;
  decision: string;
  timestamp: string;
  prevHash: string;
  hash: string;
}

function sanitizeAuditField(val: unknown): string {
  if (typeof val !== "string") return "";
  // Sanitize control characters/newlines and escape pipe '|' delimiter to prevent audit payload injection
  return val.replace(/[\r\n\x00-\x1f]/g, " ").replace(/\|/g, "\\|").trim();
}

export class AuditTrail {
  private records: AuditRecord[] = [];
  private prevHash = "GENESIS";

  record(agent: string, decision: string): AuditRecord {
    const cleanAgent = sanitizeAuditField(agent);
    const cleanDecision = sanitizeAuditField(decision);
    const timestamp = new Date().toISOString();
    const payload = `${this.records.length}|${cleanAgent}|${cleanDecision}|${timestamp}|${this.prevHash}`;
    const hash = createHash("sha256").update(payload).digest("hex");
    const entry: AuditRecord = {
      index: this.records.length,
      agent: cleanAgent,
      decision: cleanDecision,
      timestamp,
      prevHash: this.prevHash,
      hash,
    };
    this.records.push(entry);
    this.prevHash = hash;
    return entry;
  }

  verify(): boolean {
    let expectedPrev = "GENESIS";
    for (const r of this.records) {
      if (r.prevHash !== expectedPrev) return false;
      const payload = `${r.index}|${r.agent}|${r.decision}|${r.timestamp}|${r.prevHash}`;
      const computed = createHash("sha256").update(payload).digest("hex");
      if (computed !== r.hash) return false;
      expectedPrev = r.hash;
    }
    return true;
  }

  all(): AuditRecord[] {
    return [...this.records];
  }
}
