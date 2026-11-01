# Sentinel Security Journal

## 2026-11-01 - Missing Security Headers in Next.js Prototype
**Vulnerability:** The application was serving pages without HTTP security headers (no Content Security Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, or Strict-Transport-Security). This left the banking interface vulnerable to clickjacking, MIME-sniffing, cross-origin data leakage, and potential unauthorized embedding or execution.
**Learning:** Next.js by default does not inject defensive HTTP headers without explicit configuration in `next.config.ts`. In financial applications, clickjacking is particularly dangerous as an attacker could iframe the banking dashboard/demo buttons.
**Prevention:** Maintain strict security headers via Next.js headers config, restricting connect-src to known endpoints (`api.belo.app`, `api.groq.com`), forbidding object embeddings, and enforcing `frame-ancestors 'none'`.
