# Repository Guidelines

## Project Structure & Module Organization
- `src/`: React + TypeScript app (Vite). Key folders: `components/`, `pages/`, `hooks/`, `services/`, `lib/`, `utils/`.
- `supabase/`: Edge functions and migrations; configure via `supabase/config.toml` and `supabase/migrations/`.
- `sql/`: SQL helpers and seeds used by scripts.
- `scripts/`: One-off utilities (e.g., seeding, verification).
- `docs/`: Architecture and integration notes.
- `index.html`, `vite.config.ts`, `tailwind.config.ts`: Frontend entry and build config.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server.
- `npm run build`: Production build to `dist/`.
- `npm run build:dev`: Development-mode build for faster iteration.
- `npm run preview`: Serve built app locally.
- `npm run lint`: ESLint over `**/*.{ts,tsx}`.
- `npm run type-check`: TypeScript checks without emitting.
- Examples: `node test-email.cjs`, `node test-mailtrap-inbox.js` (require proper env). 

## Coding Style & Naming Conventions
- TypeScript, React 18, Vite. ESLint config in `eslint.config.js` (hooks and refresh rules enabled).
- Components: PascalCase files (e.g., `GeneratedCopyPreview.tsx`). Hooks: `useX.ts(x)`.
- Services and utilities: camelCase (e.g., `realDataService.ts`).
- Keep components presentational; place data access in `services/`. Prefer `src/lib/supabase.ts` for client access.

## Testing Guidelines
- E2E: Playwright dependency present; add `playwright.config.ts` before running `npx playwright test`.
- Component tests: stubs exist under `src/components/*/__tests__/`. If expanding, add Vitest and configure with Vite.
- Scripts: Use root test scripts for integrations (email/Mailtrap) and ensure required env variables.
- Coverage: No enforced threshold; cover critical services and auth flows.

## Commit & Pull Request Guidelines
- Commits: Follow Conventional Commits (e.g., `feat: add waitlist signup flow`, `fix: debounce analytics updates`).
- PRs: Include purpose, scope, linked issues, and before/after screenshots for UI changes. Note any migrations in `supabase/migrations/` and SQL seeds impacted.
- Quality gate: Run `npm run lint` and `npm run type-check` and verify local build.

## Security & Configuration Tips
- Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. App throws if missing.
- Never commit secrets; prefer `.env.local` and Supabase project settings. 
- For seeding/migrations, review `scripts/` and `sql/` before execution.
