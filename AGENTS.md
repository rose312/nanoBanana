# Repository Guidelines

## Project Structure

- `app/`: Next.js App Router routes (`layout.tsx`, `page.tsx`) and global styles (`app/globals.css`). Components here are Server Components by default; add `"use client"` only when needed.
- `components/`: Page/section components (for example `components/hero.tsx`) and shared UI primitives in `components/ui/` (shadcn/ui).
- `hooks/`: Reusable React hooks (for example `hooks/use-toast.ts`).
- `lib/`: Shared utilities (for example `lib/utils.ts`) and non-UI helpers.
- `public/`: Static assets served as-is (images, icons).
- `styles/`: Additional CSS (use sparingly; prefer Tailwind + component-scoped styles).

## Build, Test, and Development Commands

This repo uses `pnpm` (see `pnpm-lock.yaml`).

- `pnpm install`: Install dependencies.
- `pnpm dev`: Start the local dev server (typically `http://localhost:3000`).
- `pnpm build`: Create a production build.
- `pnpm start`: Run the production server (requires a prior build).
- `pnpm lint`: Run ESLint across the repo.
- `pnpm exec tsc --noEmit`: Run a strict typecheck (recommended; `next.config.mjs` currently ignores TypeScript build errors).

## Coding Style & Naming Conventions

- TypeScript is configured with `strict: true` in `tsconfig.json`; fix type issues instead of silencing them.
- Use 2-space indentation and prefer functional components + hooks.
- Naming: kebab-case filenames in `components/` (for example `theme-provider.tsx`), PascalCase React components/exports (for example `ThemeProvider`).
- Imports: prefer aliases like `@/components/...` and `@/lib/...` over relative deep paths.

## Testing Guidelines

No automated test runner is configured yet (no `test` script in `package.json`). If you add tests, use `*.test.ts` / `*.test.tsx` (for example `components/hero.test.tsx`) and add a `pnpm test` script that runs them.

## Commit & Pull Request Guidelines

- This checkout does not include Git history (`.git` is not present). Use clear, imperative commit subjects; Conventional Commits are recommended (for example `feat: add generator form`, `fix: handle empty input`).
- PRs: include a short description, link any issues, attach screenshots/GIFs for UI changes, and note verification steps (for example `pnpm dev` and `pnpm lint`).

## Security & Configuration

- Put secrets in `.env.local` (ignored by `.gitignore`). Never commit `.env*` files or production credentials.

