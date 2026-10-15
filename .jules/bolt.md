# Bolt's Journal - Critical Learnings

## 2025-05-18 - Avoid Recompiling Regexes inside Hot Functions
**Learning:** Re-instantiating RegExp objects (and unicode normalization strip regexes) inside request handler fallback functions causes unnecessary memory allocations and compile overhead per API invocation.
**Action:** Lift regex compilation to module scope so patterns are compiled once when module loads.
