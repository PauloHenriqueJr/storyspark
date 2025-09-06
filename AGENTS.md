# Repository Guidelines

## Project Structure & Module Organization
- `src/`: React + TypeScript app (Vite).
  - `components/`, `pages/`, `hooks/`, `services/`, `lib/`, `utils/`.
- `supabase/`: Edge functions and migrations (`supabase/config.toml`, `supabase/migrations/`).
- `sql/`: SQL helpers and seeds used by scripts.
- `scripts/`: One‑off utilities (e.g., seeding, verification).
- `docs/`: Architecture and integration notes.
- Root: `index.html`, `vite.config.ts`, `tailwind.config.ts`.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server.
- `npm run build`: Production build to `dist/`.
- `npm run build:dev`: Development‑mode build for faster iteration.
- `npm run preview`: Serve the built app locally.
- `npm run lint`: Run ESLint over `**/*.{ts,tsx}`.
- `npm run type-check`: TypeScript checks without emit.
- Examples (require env): `node test-email.cjs`, `node test-mailtrap-inbox.js`.

## Coding Style & Naming Conventions
- Language: TypeScript, React 18, Vite.
- Linting: `eslint.config.js` (hooks and refresh rules enabled). Fix issues before PRs.
- Naming: Components in PascalCase (e.g., `GeneratedCopyPreview.tsx`); hooks `useX.ts(x)`; services/utilities camelCase (e.g., `realDataService.ts`).
- Structure: Keep components presentational; put data access in `src/services/`. Prefer `src/lib/supabase.ts` for client access.

## Testing Guidelines
- E2E: Playwright available; add `playwright.config.ts` then run `npx playwright test`.
- Components: Stubs under `src/components/*/__tests__/`. If expanding, add Vitest and configure with Vite.
- Scripts: Use root Node scripts for integrations; ensure required env variables.
- Coverage: No enforced threshold; prioritize auth flows and critical services.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits (e.g., `feat: add waitlist signup flow`, `fix: debounce analytics updates`).
- PRs: Include purpose, scope, linked issues, and before/after screenshots for UI. Note any `supabase/migrations/` and impacted `sql/` seeds.
- Quality gate: Run `npm run lint`, `npm run type-check`, and verify a local build (`npm run build`).

## Security & Configuration Tips
- Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The app errors if missing.
- Never commit secrets; prefer `.env.local` and Supabase project settings.
- For seeding/migrations, review `scripts/` and `sql/` before execution.

