# Sentinel's Journal

## 2026-11-08 - Unbounded User Input to LLM Copilot Endpoint
**Vulnerability:** The `/api/copilot` endpoint accepted arbitrarily long user input without type verification or length bounds and forwarded it directly into the prompt payload sent to external LLM provider APIs (Groq LPU).
**Learning:** In agentic banking architectures, copilot and autonomous agent query endpoints can be abused for prompt injection vector bloating, Denial-of-Service (DoS), and rapid token/credit exhaustion if message lengths and types are not strictly capped before invoking AI reasoning models or local fallbacks.
**Prevention:** Enforce strict type validation and length limits (e.g. 500 characters) on any user query directed to LLM-backed endpoints or financial natural language parsers, and return safe, uninformative error responses.
