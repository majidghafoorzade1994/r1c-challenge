# Getting started

## Prerequisites

The root package declares:

- Node.js `>=20.9.0`
- npm `10.9.7` as the intended package manager

The repository uses npm workspaces. Do not install dependencies separately inside each workspace.

## Installation

From the repository root:

```bash
npm install
```

This installs dependencies for:

- The root Turborepo
- `apps/panel`
- `packages/ui`

The lockfile at `package-lock.json` is the authoritative dependency lock.

## Environment variables

The application works without custom environment configuration and defaults to DummyJSON.

To override the upstream API base URL, create:

```dotenv
# apps/panel/.env.local
DUMMYJSON_API_URL=https://dummyjson.com
```

| Variable            | Required | Default                 | Used by                           |
| ------------------- | -------- | ----------------------- | --------------------------------- |
| `DUMMYJSON_API_URL` | No       | `https://dummyjson.com` | `apps/panel/src/lib/dummyjson.ts` |

Do not add tokens or user credentials to environment files. Authentication tokens are obtained at runtime.

## Start development

Start all persistent development tasks:

```bash
npm run dev
```

Or start only the panel:

```bash
npm run dev --workspace=panel
```

By default, Next.js serves the app at:

```text
http://localhost:3000
```

The root `/` route redirects to `/articles`. Without a valid session, the protected dashboard layout redirects again to `/login`.

## Start component documentation

Run Storybook independently from the panel:

```bash
npm run storybook
```

The component catalog is available at
[http://localhost:6006](http://localhost:6006). It does not require the panel
server or DummyJSON. See the [Storybook guide](storybook.md) for its
architecture, authoring conventions, static build, and troubleshooting.

## Test login

Use an existing user from DummyJSON. A known sample account is:

```text
Email: emily.johnson@x.dummyjson.com
Password: emilyspass
```

The login screen intentionally asks for email, although DummyJSON authentication expects a username. The server performs the email-to-username lookup.

## Production build

Build all workspaces:

```bash
npm run build
```

Run the built panel:

```bash
npm run start --workspace=panel
```

The panel requires a server runtime. It is not a static-only application because it uses:

- Route handlers
- HTTP-only cookies
- Server-side session validation
- Dynamic dashboard pages

## Validation commands

Before opening a pull request or handing off a change:

```bash
npm run lint
npm run check-types
npm run build
npm run build-storybook
```

There is currently no automated test command. See [Development workflow](development-workflow.md) for the manual verification checklist.

## Common setup problems

### Node version is rejected

Verify:

```bash
node --version
npm --version
```

Use Node.js 20.9 or newer.

### Workspace package cannot be resolved

Run `npm install` from the repository root and confirm `@r1c/ui` appears in the npm workspace graph.

### Storybook reports incompatible React versions

React and React DOM are intentionally pinned to `19.2.4`. Stop Storybook, run
`npm install` from the repository root, and confirm the installed graph:

```bash
npm ls react react-dom --all
```

Restart Storybook after reinstalling because Vite caches pre-bundled
dependencies for the lifetime of the development process.

### DummyJSON cannot be reached

Check network access and `DUMMYJSON_API_URL`. Both login and protected dashboard rendering depend on the upstream service.

### Dashboard redirects to login

This is expected when:

- No `access_token` cookie exists
- The token expired
- `/auth/me` rejects the token
- DummyJSON is unavailable during the session check

Sign in again with a current DummyJSON account.
