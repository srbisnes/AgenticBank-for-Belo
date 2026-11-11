# Sentinel's Security Journal

## 2025-05-18 - Missing HTTP Security Headers in Next.js App
**Vulnerability:** Default Next.js configuration omitted critical defense-in-depth HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-XSS-Protection`), leaving the app vulnerable to clickjacking and MIME-type sniffing across embedded frames.
**Learning:** In Next.js App Router applications, unless security headers are explicitly declared via `headers()` in `next.config.ts` or in middleware, responses default to standard Next.js headers without clickjacking or MIME-sniffing mitigations.
**Prevention:** Always declare base security headers (`DENY` frame-ancestors / `X-Frame-Options`, `nosniff`, strict referrer policy) in `next.config.ts` for all route paths `/(.*)`.
