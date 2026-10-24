## 2026-10-24 - Static Set Lookup Optimization for Live API Rates
**Learning:** Performing linear array `.includes()` searches on dynamic response data (like currency rate pairs from external APIs) in hot request handlers creates unnecessary object allocations and O(N*M) lookup overhead per request.
**Action:** Lift static whitelist arrays into module-scoped `Set` instances to achieve O(1) membership checks and zero per-request allocation overhead.
