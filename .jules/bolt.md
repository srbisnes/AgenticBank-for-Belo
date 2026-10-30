## 2025-05-18 - Lift Static Definitions Outside Render Scope in Next.js App Router Components

**Learning:** Declaring static arrays or object literals inside React functional components causes fresh allocations on every re-render (e.g., every keystroke in chat/input components). Similarly, wrapping primitive values in `useMemo` adds hook overhead without providing value.

**Action:**
1. Extract static data (chips, options, mock metrics) outside component module scope or pre-compute static values at module level.
2. In API route handlers, use module-scoped `Set` data structures for lookup arrays instead of inline `.includes()` checks.
3. Remove redundant `useMemo` hooks on primitive state variables.
