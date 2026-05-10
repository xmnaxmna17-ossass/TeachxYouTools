# أدواتي — Arabic AI Tools Platform

An Arabic-first platform containing AI-powered and utility tools for Arabic-speaking users. Optimized for SEO, Google AdSense, and organic traffic growth.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/arabic-tools run dev` — run the frontend (port 25328)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY` — Replit AI integrations (auto-provisioned)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS v4 + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (conversations, messages tables)
- AI: OpenAI via Replit AI Integrations (gpt-5.2)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Font: Cairo (Google Fonts, Arabic RTL)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — Drizzle schema (conversations, messages)
- `artifacts/arabic-tools/src/pages/` — All tool pages
- `artifacts/arabic-tools/src/components/` — Shared components
- `artifacts/api-server/src/routes/tools.ts` — AI tool endpoints
- `artifacts/api-server/src/routes/openai.ts` — Chat conversation endpoints

## Tool Pages

| Route | Tool | Type |
|-------|------|------|
| `/` | Homepage with all tools | - |
| `/summarize` | AI Text Summarizer | AI |
| `/generate-prompt` | AI Prompt Generator | AI |
| `/generate-caption` | AI Caption Generator | AI |
| `/homework-help` | AI Homework Helper | AI |
| `/text-to-emoji` | Text to Emoji | AI |
| `/generate-resume` | CV/Resume Generator | AI |
| `/qr-generator` | QR Code Generator | Client-side |
| `/password-generator` | Password Generator | Client-side |
| `/free-fire-names` | Free Fire Name Styles | Client-side |
| `/image-to-pdf` | Image to PDF | Client-side (jsPDF) |

## Architecture decisions

- All AI tools go through the Express API server, never directly from the frontend
- Tool usage is tracked in-memory in `routes/tools.ts` (can be moved to DB later)
- RTL direction set globally on `<html dir="rtl" lang="ar">`
- Dark mode is always-on (no toggle), using deep indigo/violet on near-black
- Cairo font used for all Arabic typography
- Each tool has a unique SEO-friendly URL for Google ranking

## Product

Arabic-first AI tools platform at adawati.com targeting Arabic-speaking users who need:
AI summarization, prompt generation, social media captions, homework help, text-to-emoji, CV generation, QR codes, passwords, Free Fire name styles, image-to-PDF conversion.

## User preferences

- Website must be in Arabic (RTL) throughout
- Dark modern UI with glassmorphism and violet/indigo gradients
- Premium SaaS feel (Notion/Vercel/ChatGPT aesthetic)
- SEO-optimized with Arabic content for Google ranking
- AdSense-ready ad placement areas

## Gotchas

- After OpenAPI spec changes, always run `pnpm --filter @workspace/api-spec run codegen` before using updated types
- Google Fonts `@import url(...)` must be the FIRST line in index.css (before all other imports)
- Schema names in openapi.yaml must NOT match `<OperationIdPascal>Body` pattern (causes TS2308 collision)
- The `pRetry.AbortError` must be imported as a named export (`import pRetry, { AbortError } from "p-retry"`)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `lib/api-spec/openapi.yaml` for all API endpoints
