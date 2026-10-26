# Bolt's Journal - Critical Learnings

## 2025-05-18 - Live Rate Fetching in Copilot Route
**Learning:** External API calls to public exchange rates (e.g. `api.belo.app/public/price`) in API routes can cause variable response latency or hangs if unthrottled or without timeouts.
**Action:** Always implement in-memory short TTL caching (30s) and strict timeout handling (`AbortController` signal) for external price/rate feeds.
