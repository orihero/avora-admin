# Avora Admin

React admin app following **Clean Architecture** with **feature-first** organization (Vite, TypeScript, TailwindCSS, Iconify).

## Structure

- **core/** – Shared error types (Result, Failure), components (IconifyIcon, cn), network, types
- **features/** – Vertical slices (e.g. auth: domain, data, presentation)
- **di/** – TSyringe container; registrations run at app bootstrap

## Scripts

- `npm install` – Install dependencies
- `npm run dev` – Start dev server
- `npm run build` – TypeScript check + production build
- `npm run preview` – Preview production build
- `npm run test` – Run Vitest
- `npm run lint` – Run ESLint

## Conventions

- **Domain**: entities, repository interfaces, use cases (no framework deps)
- **Data**: repository implementations, DTOs, mappers (Zod for validation)
- **Presentation**: components, hooks (controllers), Zustand stores
- Server state: TanStack Query; client state: Zustand
- Absolute imports: `@/core/...`, `@/features/...`, `@/di/...`

See `.cursor/skills/react-clean-architecture/SKILL.md` for the full architecture guide.
