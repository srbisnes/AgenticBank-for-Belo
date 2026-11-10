## 2026-04-18 - App Router POST route handler outbound fetch caching

**Learning:** Next.js App Router route handlers running on Node.js runtime do not share outbound fetch cache across POST requests when specifying `{ next: { revalidate: N } }`. Outbound fetch requests execute on every single POST handler invocation, introducing significant round-trip network latency (~150-300ms) and potential rate limit or throttling bottlenecks on external upstream APIs.
**Action:** In Node.js route handlers serving POST requests, use module-level in-memory cache variables with TTL tracking and in-flight promise deduplication to prevent redundant network fetches and dogpiling.
