## 2026-10-25 - Audit Trail Delimiter and Control Character Injection
**Vulnerability:** Unsanitized string fields (`agent`, `decision`, user parameters) passed into delimiter-separated cryptographic audit payload strings allowed delimiter (`|`) or control character (`\r`, `\n`) injection.
**Learning:** Concatenating raw text fields with fixed pipe delimiters (`|`) into hash payloads creates a ambiguity/injection risk if any user input contains delimiters or newlines, potentially corrupting or spoofing audit trail records.
**Prevention:** Always sanitize control characters and escape or strip structural delimiters from string fields prior to assembling cryptographically hashed audit entries.
