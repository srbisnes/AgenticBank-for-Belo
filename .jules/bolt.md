# Bolt's Journal - Critical Learnings

## 2025-05-18 - Micro-optimizations in prototype route handlers vs real bottlenecks
**Learning:** Extracting small sets/arrays or pre-compiling regexes in lightweight fallback handlers for network-bound API routes provides no measurable end-to-end performance benefit and constitutes premature optimization when there is no actual bottleneck.
**Action:** Always profile for true bottlenecks (e.g., heavy computations, unnecessary re-renders of large lists, or DB/N+1 queries) before making changes. If no significant performance win is found in small prototypes, stop rather than applying micro-optimizations.
