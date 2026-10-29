# Bolt's Journal - Critical Learnings

## 2025-02-28 - Elimination of intermediate array allocations in financial rules engine & API routes
**Learning:** In hot execution paths like financial allocation evaluation (`applyAllocations`) and API route handlers (`fallbackReply`), methods like `Object.values()`, `Object.keys()`, `Array.prototype.includes()`, and inline RegExp creation instantiate unnecessary short-lived objects. In Next.js App Router routes, hoisting static Sets and compiled Regexes to module scope drastically reduces garbage collection pressure on server requests.
**Action:** Always prefer single-pass accumulators over `Object.values().reduce()` when tracking values and keys, and hoist immutable lookup Sets and RegExp instances outside request handlers and React component render loops.
