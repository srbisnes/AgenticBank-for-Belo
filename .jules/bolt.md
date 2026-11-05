# Bolt's Performance Journal

## 2026-11-05 - Avoid Multi-Pass Object Inspections in Rules Engine Allocations
**Learning:** In banking transaction engines like `rules-engine`, computing allocation round-offs using `Object.values().reduce()` and `Object.keys().pop()` creates transient array allocations on every transaction event. In high-frequency or batch scenarios, accumulating the total and tracking `lastKey` directly in the single allocation pass reduces execution time by ~50% and eliminates intermediate heap allocations.
**Action:** Prefer single-pass aggregation during object mapping over chained `Object.keys()`/`Object.values()` reductions whenever processing events, transactions, or balance ledgers.
