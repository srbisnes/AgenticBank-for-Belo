## 2026-10-16 - Module-scope hoisting for static sets and Intl formatters

**Learning:** Re-instantiating `Intl.NumberFormat` and array filters on every request in Next.js route handlers creates unnecessary heap allocation and overhead under load. Hoisting static formatters and `Set` collections to module scope eliminates per-request instantiation cost.
**Action:** Always check API route handlers for static configuration objects, lookup arrays, and `Intl` formatters and move them to module scope.
