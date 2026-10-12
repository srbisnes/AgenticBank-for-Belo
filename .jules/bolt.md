## 2026-10-12 - Next.js 15 ESLint Flat Config and Generated `.next` Types
**Learning:** Running `next build` auto-updates `next-env.d.ts` with triple-slash references to `.next/types/routes.d.ts`. Under ESLint 9 flat config, running `eslint` after `next build` will throw errors unless `.next/*` and `next-env.d.ts` are explicitly ignored in `eslint.config.mjs`.
**Action:** Always ensure `eslint.config.mjs` ignores `.next/*` and `next-env.d.ts` when running lint verification alongside build scripts.
