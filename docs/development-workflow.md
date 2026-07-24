# Development workflow

## Root scripts

| Command               | Turborepo task          | Purpose                                   |
| --------------------- | ----------------------- | ----------------------------------------- |
| `npm run dev`         | `turbo run dev`         | Start persistent development servers      |
| `npm run build`       | `turbo run build`       | Build every workspace in dependency order |
| `npm run lint`        | `turbo run lint`        | Run workspace linters                     |
| `npm run check-types` | `turbo run check-types` | Run TypeScript checks                     |
| `npm run format`      | Prettier                | Format `ts`, `tsx`, and `md` files        |

## Workspace scripts

### Panel

```bash
npm run dev --workspace=panel
npm run build --workspace=panel
npm run start --workspace=panel
npm run lint --workspace=panel
npm run check-types --workspace=panel
```

### UI package

```bash
npm run build --workspace=@r1c/ui
npm run lint --workspace=@r1c/ui
npm run check-types --workspace=@r1c/ui
```

## Turborepo behavior

### Build

Build tasks depend on dependency builds:

```text
build -> ^build
```

Cached outputs include:

- `.next/**`, excluding caches and dev output
- `dist/**`

Environment files are included in task inputs.

### Lint and type-check

Both tasks depend on the corresponding dependency tasks. This ensures the UI package is validated alongside the panel.

### Development

Development tasks:

- Are persistent
- Are not cached

## TypeScript

Both workspaces use strict mode and bundler module resolution.

The panel defines:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

Use the alias for panel-internal absolute imports:

```ts
import { getPost } from "@/lib/dummyjson";
```

The UI build configuration emits declarations only:

```text
packages/ui/dist/**/*.d.ts
```

## Linting

The panel uses Next.js ESLint configuration. The UI package uses TypeScript ESLint.

Lint before type-checking when iterating, because it catches framework-specific issues such as constructing JSX inside a `try/catch`.

## Formatting

Run:

```bash
npm run format
```

The current root format script includes:

- TypeScript
- TSX
- Markdown

It does not format CSS or JSON.

## Recommended change workflow

1. Pull/install from the repository root.
2. Start only the required workspace during implementation.
3. Keep domain behavior in `apps/panel`.
4. Move only reusable presentation primitives into `packages/ui`.
5. Add or update documentation with route, API, environment, or public UI changes.
6. Run workspace-level checks while iterating.
7. Run all root checks before handoff.

## Manual QA checklist

There is no automated test suite, so perform at least:

### Authentication

- Login errors appear only after submission.
- Invalid email is rejected client-side.
- Valid DummyJSON credentials reach `/articles`.
- Invalid credentials show an error toast.
- Logout returns to `/login`.
- Refreshing a protected route retains a valid session.

### Articles

- First and dynamic pagination routes load.
- Invalid page and article IDs return not found.
- Row action menus open and close.
- Create/edit validation blocks empty title/body.
- Added tags are selected and can be unchecked.
- Create/update success toasts appear.
- Delete confirmation can be canceled.
- Delete success and error feedback appear.

### Responsive layout

- Auth pages remain usable below 520px.
- Header/sidebar layout works below 760px.
- Article table scrolls horizontally.
- Article form becomes single-column.
- Modal remains usable below 640px.

## Final verification

```bash
npm run lint
npm run check-types
npm run build
git diff --check
```

The production build is especially important because it validates App Router route types and client/server boundaries.
