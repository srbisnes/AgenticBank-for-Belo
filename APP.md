# AgenticBank for Belo — App (prototipo)

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · API Pública Belo + Groq Llama 3.3

## Correr local

```bash
npm install
npm run dev
```

Abrí http://localhost:3000

## Deploy Vercel

Importá el repo, framework **Next.js**. Build: `next build`.

## Módulos

- `/` Dashboard + demo cobro 20/20/60
- `/copilot` Financial Copilot (simulado)
- `/goals` Goal Engine
- `/agents` Multi-agent + Rules Engine
- `/audit` Audit trail SHA-256
- `POST /api/belo/execute` capa Belo simulada

**Aviso:** prototipo independiente. No es producto oficial de Belo. No mueve dinero real.
