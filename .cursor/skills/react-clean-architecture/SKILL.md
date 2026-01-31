---
name: react-clean-architecture
description: Expert React developer specializing in Clean Architecture with Feature-first organization, TypeScript, Vite, TailwindCSS, and Iconify icons. Use when developing React apps, implementing features, refactoring code, or when the user asks about React architecture, Clean Architecture, SOLID principles, advanced TypeScript patterns, or icon integration.
---

# React Clean Architecture (Vite + TypeScript + TailwindCSS + Iconify)

Expert React development following **Clean Architecture** with **Feature-first** organization, strict TypeScript, Iconify icons, and clear separation of concerns.

## Core Principles

### Clean Architecture Layers

Three layers; dependencies point **inward** (toward domain).

| Layer | Contents | Allowed dependencies |
|-------|----------|------------------------|
| **Domain** | Entities (types/interfaces), repository contracts (interfaces), use cases (pure business logic) | None |
| **Data** | Repository implementations, data sources (API clients), DTOs, mappers | Domain only |
| **Presentation** | React components, custom hooks (controllers), Zustand stores, UI logic | Domain + Data via abstractions |

Use interfaces/abstract classes for all dependencies (testability, swappable implementations).

### Feature-First Organization

Organize by **vertical slices** (features), not technical layers. Each feature owns its domain, data, and presentation.

```
src/
├── core/
│   ├── error/
│   ├── network/
│   ├── types/
│   └── components/
├── features/
│   ├── auth/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── usecases/
│   │   ├── data/
│   │   │   ├── dto/
│   │   │   ├── mappers/
│   │   │   ├── datasources/
│   │   │   └── repositories/
│   │   └── presentation/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── stores/
│   └── todos/
├── di/
└── main.tsx
```

No cross-imports between features except via `core/` or explicit DI. Shared code lives in `core/`.

## State Management

| Purpose | Tool |
|---------|------|
| Server state | TanStack Query (React Query) |
| Client/UI state | Zustand |

Rules: do not store server data in Zustand unless necessary; use `select` for derived data; keep stores small and immutable; state types are plain TypeScript interfaces.

## Dependency Injection

Use **TSyringe** (or InversifyJS) for Dependency Inversion.

```ts
// di/container.ts
import 'reflect-metadata';
import { container } from 'tsyringe';
import { AuthRepository } from '@/features/auth/domain/repositories';
import { AuthRepositoryImpl } from '@/features/auth/data/repositories';

container.register<AuthRepository>('AuthRepository', {
  useClass: AuthRepositoryImpl,
});

export { container };
```

## Type Safety & Validation

- **Zod** for DTO validation.
- Validate all external data before it reaches Domain.
- Use strict TypeScript.

```ts
export const UserDTOSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string(),
});
```

## Iconify Integration

Use `@iconify/react` only; style with Tailwind.

```tsx
<Icon icon="material-symbols:home" className="w-6 h-6 text-blue-600" />
```

Wrapper:

```tsx
export const IconifyIcon = ({ icon, className, width = 24, height = 24 }) => (
  <Icon icon={icon} width={width} height={height} className={cn('inline-block', className)} />
);
```

## Error Handling (Result / Either)

```ts
export type Result<T, E = Failure> =
  | { success: true; data: T }
  | { success: false; error: E };
```

Use `ServerFailure`, `NetworkFailure`, `ValidationFailure`. Repositories return `Promise<Result<...>>`.

## Repository Pattern

- **Interfaces** in Domain.
- **Implementations** in Data.
- Single source of truth; may aggregate multiple data sources.

## Use Case Pattern

Framework-agnostic business logic.

```ts
@injectable()
export class LoginUseCase {
  async execute(params: LoginParams): Promise<Result<AuthToken, Failure>> {
    if (!params.email.includes('@')) {
      return Result.fail(new ValidationFailure('Invalid email'));
    }
    return this.authRepo.login(params);
  }
}
```

## Presentation Layer

**Hooks** act as controllers.

```ts
export const useLogin = () => {
  const loginUseCase = container.resolve(LoginUseCase);
  return useMutation({ mutationFn: loginUseCase.execute });
};
```

**Components** are dumb and declarative.

## Styling (TailwindCSS)

- Utility-first.
- Minimal `@apply`.
- Use `cn()` for conditional classes.
- Follow accessible UI patterns.

## Testing

| Level | Tool |
|-------|------|
| Unit | Vitest |
| Integration | Testing Library + MSW |
| E2E | Playwright |

## Performance

- `React.memo` for expensive components.
- `useMemo` for heavy computations.
- Virtualize large lists.
- Code-split by feature.

## Absolute Imports

Configure in `vite.config.ts` and `tsconfig.json`. Avoid deep relative imports.

## Complete Feature Checklist

When implementing a feature, include:

- [ ] Entity (domain)
- [ ] Repository interface (domain)
- [ ] DTO + mapper (data)
- [ ] Repository implementation (data)
- [ ] Use case (domain)
- [ ] Hook (presentation)
- [ ] Component(s) (presentation)

Respect the **Dependency Rule** at all times. This setup keeps the app testable, maintainable, and scalable. Iconify is tree-shakable and works well with TailwindCSS.
