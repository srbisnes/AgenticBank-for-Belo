## 2025-05-20 - In-Memory TTL Cache vs Next.js fetch revalidation

**Learning:** `fetch` with Next.js `{ next: { revalidate: 30 } }` caches the raw HTTP response, but calling `await res.json()`, filtering, and formatting string templates (`toLocaleString`) on every request still incurs CPU and object allocation overhead. In-memory TTL caching of the processed string avoids redundant JSON deserialization and string formatting for concurrent/subsequent requests.
**Action:** When endpoint responses require string formatting or processing on raw fetch payloads, cache the final computed string result in module scope with TTL alongside Next.js fetch revalidation.
