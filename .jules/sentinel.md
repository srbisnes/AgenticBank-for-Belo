# Sentinel Security Journal

## 2026-10-17 - Copilot Prompt Injection & Unbounded Input Safeguard
**Vulnerability:** API route (`/api/copilot`) accepted untyped and arbitrarily large `message` payloads sent directly to LLM completion APIs.
**Learning:** Next.js route handlers passing user input to AI completion models must explicitly validate string types and enforce length limits to prevent payload abuse, token exhaustion, and DoS.
**Prevention:** Validate input string types (`typeof body.message === "string"`) and cap payload character count (`message.length <= 1000`) before forwarding requests upstream.
