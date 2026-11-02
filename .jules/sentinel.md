# Sentinel's Journal - Critical Security Learnings

## 2026-11-02 - Next.js Missing HTTP Security Headers
**Vulnerability:** Next.js application served routes without baseline HTTP defense-in-depth security headers (missing `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`, and `X-DNS-Prefetch-Control`), exposing pages to clickjacking and MIME-type sniffing risks.
**Learning:** Default Next.js starter templates leave `next.config.ts` empty without setting security response headers. In banking/financial prototypes where interfaces display sensitive financial summaries and audit trails, omitting frame protection creates UI redressing / clickjacking exposure.
**Prevention:** Always configure `headers()` in `next.config.ts` with restrictive headers applied globally to `/:path*`.
