## 2026-10-18 - Single-Pass Accumulation with Key Deduplication
**Learning:** Accumulating running totals in a single pass while mutating object keys requires handling key overrides when a key appears multiple times in the action list; otherwise `total` diverges from `Object.values(result)`.
**Action:** Check if key exists in result map before mutating, subtracting previous rail allocation value from total before adding updated value.
