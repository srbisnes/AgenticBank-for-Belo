import { createHash } from "crypto";
import type { AuditRecord } from "./types";

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

  lastHash(): string {
    return this.prevHash === "GENESIS" ? "" : this.prevHash;
  }
}

export function sha256Sync(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}
