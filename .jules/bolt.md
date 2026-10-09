# Bolt's Journal - Critical Learnings

## 2025-05-18 - Module-Scope In-Memory Caching for Route Handlers
**Learning:** In Next.js App Router Route Handlers (`route.ts`), dynamic POST requests making external API calls (e.g. fetching live rates from `api.belo.app`) block every response by 100ms-500ms+. Standard `fetch` options like `{ next: { revalidate: 30 } }` do not prevent external network round-trips in dynamic POST handlers.
**Action:** Use module-scope in-memory caching (`cachedData`, `lastFetchedTimestamp`) with TTL for external API calls in Route Handlers to eliminate network latency on frequent requests.
