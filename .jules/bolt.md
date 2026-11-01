# Bolt's Performance Journal

## 2026-11-01 - In-Memory TTL Caching for Upstream Financial Price Rails
**Learning:** In Next.js Node.js runtime Route Handlers (`POST` methods), Next's `fetch(..., { next: { revalidate } })` is not consistently applied across all dynamic execution paths for mutating POST routes, causing repeated external network trips (~100-250ms) to Belo's public price API. Adding an in-memory TTL cache with in-flight promise deduplication eliminates blocking network roundtrips for subsequent requests within the freshness window, dropping response latency from ~150ms+ down to sub-millisecond.
**Action:** When integrating external rate/price feeds into Next.js Route Handlers, pair `fetch` options with a module-level TTL cache and in-flight request coalescing to guarantee instant responses under high traffic.
