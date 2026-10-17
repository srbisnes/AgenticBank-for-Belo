## 2025-02-18 - Avoid per-request Intl.NumberFormat and Array.includes in Next.js API Routes
**Learning:** Calling `Number.prototype.toLocaleString()` inside hot server/API route handlers constructs new `Intl.NumberFormat` instances per call in V8. Reusing module-scoped `Intl.NumberFormat` instances and `Set` collections drastically cuts object allocation churn and string parsing overhead.
**Action:** Always hoist static formatting objects (`Intl.NumberFormat`) and search sets (`Set`) to module scope in Next.js route handlers.
