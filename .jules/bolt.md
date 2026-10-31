# Bolt's Performance Journal

## 2026-03-31 - In-Memory Caching for Third-Party Upstream in Route Handlers
**Learning:** In Next.js App Router, using `{ next: { revalidate: 30 } }` in a `fetch()` inside a `POST` Route Handler does not cache the response between invocations because Next.js disables Data Cache for non-GET HTTP methods. Every Copilot request was making a synchronous network request to `api.belo.app/public/price`, blocking response time by ~200ms.
**Action:** Implement a module-level in-memory TTL cache (e.g. 30 seconds) for external pricing/read-only upstream data in POST route handlers to reliably bypass redundant network calls across client interactions.
