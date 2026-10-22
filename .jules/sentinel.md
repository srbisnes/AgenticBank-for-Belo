## 2025-05-10 - Input Validation and Sanitization in Belo Execution Layer
**Vulnerability:** Execution endpoint accepted unvalidated string parameters (`currency`, `agent`, `intent`) and lacked upper bounds on numerical transactions, risking parameter pollution, control-character injection, and DoS.
**Learning:** Even simulated banking endpoints in Next.js API routes must strictly validate string lengths, types, and control characters to enforce zero-trust inputs across agentic transaction layers.
**Prevention:** Always use centralized input sanitization/validation helpers on API endpoints handling financial execution requests.
