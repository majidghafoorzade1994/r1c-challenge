# Project structure

## Root

```text
.
├── apps/
├── packages/
├── docs/
├── package.json
├── package-lock.json
└── turbo.json
```

| Path                | Responsibility                                                      |
| ------------------- | ------------------------------------------------------------------- |
| `package.json`      | Workspaces, root scripts, engine requirements, shared tooling       |
| `package-lock.json` | Locked dependency graph                                             |
| `turbo.json`        | Task dependencies, caching, and build outputs                       |
| `.gitignore`        | Dependencies, environment files, build outputs, and local artifacts |
| `docs/`             | Technical documentation                                             |

## Panel application

```text
apps/panel/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── api/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       ├── dummyjson.ts
│       └── server-auth.ts
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

### `src/app/(auth)`

Public authentication pages. Parentheses create a route group and do not appear in URLs.

```text
(auth)/
├── _components/auth-form.tsx
├── auth.css
├── layout.tsx
├── login/page.tsx
└── register/page.tsx
```

The underscore-prefixed `_components` directory is private organization and does not create a route.

### `src/app/(dashboard)`

Authenticated administration routes and shared dashboard chrome.

```text
(dashboard)/
├── _components/dashboard-shell.tsx
├── articles/
├── dashboard.css
└── layout.tsx
```

The server layout protects every descendant route.

### `src/app/(dashboard)/articles`

```text
articles/
├── _components/
│   ├── article-form.tsx
│   ├── articles-page.tsx
│   └── articles-table.tsx
├── create/page.tsx
├── edit/[id]/page.tsx
├── page/[page]/page.tsx
├── articles.css
├── layout.tsx
└── page.tsx
```

Responsibilities are separated as follows:

- `articles-page.tsx`: server data composition
- `articles-table.tsx`: table interactions, menus, deletion, and pagination
- `article-form.tsx`: shared create/edit client form
- Route pages: parameter parsing, metadata, server data loading

### `src/app/api`

Internal server endpoints:

```text
api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   └── register/route.ts
└── posts/
    ├── [id]/route.ts
    ├── tags/route.ts
    └── route.ts
```

### `src/lib`

- `dummyjson.ts`: typed upstream client and domain functions
- `server-auth.ts`: server-only cookie lookup and authenticated-user resolution

## UI package

```text
packages/ui/
├── src/
│   ├── components/
│   │   ├── button/
│   │   ├── checkbox/
│   │   ├── input/
│   │   └── ...
│   ├── icons/
│   ├── types/
│   ├── utils/
│   ├── index.ts
│   └── theme.css
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

Each component directory normally contains:

```text
component-name/
├── component-name.tsx
├── component-name.css
└── index.ts
```

## Storybook documentation structure

```text
packages/ui/
|-- .storybook/
|   |-- main.ts
|   |-- preview.ts
|   `-- preview.css
`-- src/
    |-- stories/
    |   |-- introduction.mdx
    |   `-- design-tokens.mdx
    `-- components/
        `-- component-name/
            `-- component-name.stories.tsx
```

Stories are co-located with components. The `src/stories` directory is reserved
for package-level and foundation documentation that is not owned by one
component. Static Storybook output is generated in
`packages/ui/storybook-static` and ignored by Git.

## Naming conventions

- Route folders use lowercase URL-oriented names.
- Shared component folders use kebab-case.
- React component names use PascalCase.
- Private route helpers live in `_components`.
- Dynamic route parameters use bracket syntax such as `[id]` and `[page]`.
- CSS classes use the `r1c-` prefix in the UI package and semantic page-specific prefixes in the panel.
- Component story files use the `component-name.stories.tsx` suffix.
