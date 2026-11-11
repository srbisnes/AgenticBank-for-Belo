## 2026-11-11 - Shared Intl.NumberFormat instance for number formatting

**Learning:** Calling `Number.prototype.toLocaleString('es-AR')` repeatedly across React renders and API endpoints creates a new `Intl.NumberFormat` instance each time. In V8/Node.js/browser engines, instantiating `Intl.NumberFormat` is relatively expensive because it resolves locales, options, and initializes internal collations/data structures (~4x slower compared to reusing an instance).
**Action:** Use a centralized `formatNumber` utility in `@/lib/format` that reuses a module-level `Intl.NumberFormat('es-AR')` instance.
