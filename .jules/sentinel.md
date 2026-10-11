## 2025-05-20 - Input length validation on Next.js API Routes
**Vulnerability:** DoS and resource exhaustion through unbounded input string payload lengths in API endpoints (`POST /api/copilot` and `POST /api/belo/execute`).
**Learning:** Untyped API body payloads could cause unexpected runtime errors (e.g., `TypeError` when checking `.length` on `undefined` strings) or allow oversized prompts to crash/exhaust external LLM services.
**Prevention:** Always convert optional request string parameters using `String(val || fallback)` before performing length checks or sending to downstream services.
