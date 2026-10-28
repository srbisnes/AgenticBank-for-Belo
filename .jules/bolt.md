# Bolt's Journal - Critical Performance Learnings

## 2025-03-08 - Single-Pass Rules Engine Allocations
**Learning:** In transaction allocation/rules evaluation loops, avoiding array allocations (`Object.values`, `Object.keys`) and object reflection inside hot execution paths eliminates unnecessary heap garbage collection overhead during transaction simulations.
**Action:** Always compute running totals and track state in a single pass during array iteration when transforming rule action records into balance mappings.
