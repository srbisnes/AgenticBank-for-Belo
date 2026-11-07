## 2026-03-31 - HTTP Security Headers Baseline in Next.js

**Vulnerability:** The Next.js application served all frontend routes and API endpoints (`/api/belo/execute`, `/api/copilot`) without baseline security headers, leaving pages vulnerable to clickjacking (`X-Frame-Options`), MIME-confusion attacks (`X-Content-Type-Options`), and unconstrained feature access.
**Learning:** In Next.js (App Router), `next.config.ts` allows centralized declaration of async `headers()` matching `/:path*` to enforce defense-in-depth headers across static and dynamic routes alike without modifying application route handlers or middleware.
**Prevention:** Always define a secure headers baseline (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`) at the framework router config level.
