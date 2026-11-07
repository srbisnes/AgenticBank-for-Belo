# Bolt's Journal - Critical Performance Learnings

## 2026-11-07 - Next.js Route Handler Fetch Caching on POST Endpoints
**Learning:** In Next.js App Router route handlers triggered via `POST`, `fetch(..., { next: { revalidate } })` does not share or reuse cached outbound responses across sequential mutation/query POST requests in Node.js runtime like it does on static or cached GET pages. This causes repeated high-latency network round-trips to third-party APIs (e.g. Belo's public price API taking 150-300ms each roundtrip) on every single user prompt or message submission.
**Action:** Use a module-level in-memory cache with an explicit timestamp TTL and in-flight promise deduplication for external API calls within route handlers. This delivers ~0ms cached responses and prevents concurrent redundant outbound requests.
