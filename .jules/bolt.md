## 2026-03-31 - Single-Pass Object Accumulation with Overwritten Keys

**Learning:** When refactoring object building from multi-pass `Object.values().reduce()` to single-pass accumulation in loops, key collisions (overwriting an existing property) will corrupt the running total unless the previous value is subtracted (`if (prev !== undefined) total -= prev`).
**Action:** Always check if a map/object key might be updated or overwritten when accumulating totals in a single pass.
