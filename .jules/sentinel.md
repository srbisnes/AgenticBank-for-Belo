# Sentinel Security Journal

## 2025-03-29 - Security Response Headers Configuration
**Vulnerability:** Missing default HTTP security headers in Next.js response output, leaving web clients vulnerable to clickjacking, MIME-type sniffing, and unencrypted HTTP downgrades.
**Learning:** Next.js application routes do not automatically apply security headers like `X-Frame-Options` or `Strict-Transport-Security` unless explicitly declared in `next.config.ts`.
**Prevention:** Configure global HTTP security headers in `next.config.ts` for all application routes (`/(.*)`).
