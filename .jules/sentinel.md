# Sentinel Journal

## 2026-11-09 - Missing HTTP Security Headers and Unbounded Endpoint Inputs
**Vulnerability:** Next.js application served routes without essential security response headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), exposing users to clickjacking and MIME-type confusion risks. Additionally, API routes (`/api/copilot` and `/api/belo/execute`) lacked input length and upper boundary validation, risking unbounded upstream LLM prompt token consumption or excessive memory usage.
**Learning:** Default Next.js configuration does not automatically attach defensive HTTP headers or enforce input length constraints on POST endpoints.
**Prevention:** Always define centralized HTTP security headers in `next.config.ts` and validate input lengths and numeric ranges at the entry point of API handlers.
