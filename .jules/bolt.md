# Bolt's Journal - Critical Learnings

## 2025-05-10 - Module-level Set lookup & single-pass array processing for API data
**Learning:** Instantiating filter arrays inside hot API functions creates unnecessary allocation overhead and linear lookup cost per item. Moving lookups to module-level `Set` objects and combining filter/map operations into a single loop improves response generation throughput under load.
**Action:** Always hoist static lookup collections to module scope as `Set` instances and process item transformations in single pass when handling third-party payloads.
