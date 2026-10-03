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

export class AuditTrail {
  private records: AuditRecord[] = [];
  private prevHash = "GENESIS";

  record(agent: string, decision: string): AuditRecord {
    const timestamp = new Date().toISOString();
    const payload = `${this.records.length}|${agent}|${decision}|${timestamp}|${this.prevHash}`;
    const hash = createHash("sha256").update(payload).digest("hex");
    const entry: AuditRecord = {
      index: this.records.length,
      agent,
      decision,
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
