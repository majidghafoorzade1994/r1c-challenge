# R1C Blog Admin Panel

A Turborepo monorepo containing a Next.js blog administration panel and a shared React component library.

The application includes:

- Email-based sign-in backed by DummyJSON authentication
- Simulated user registration
- Protected dashboard routes
- Paginated article listing
- Article creation, editing, and deletion flows
- API proxy routes that keep authentication tokens out of client-side JavaScript
- A reusable, typed UI package with co-located plain CSS

## Repository layout

```text
r1c/
├── apps/
│   └── panel/       # Next.js application
├── packages/
│   └── ui/          # Shared @r1c/ui component package
├── docs/            # Detailed technical documentation
├── package.json     # npm workspaces and root scripts
└── turbo.json       # Turborepo task configuration
```

## Quick start

Requirements:

- Node.js 20.9 or newer
- npm 10

```bash
npm install
npm run dev
```

The panel is available at [http://localhost:3000](http://localhost:3000).

Run the live UI component documentation separately:

```bash
npm run storybook
```

Storybook is available at [http://localhost:6006](http://localhost:6006).

DummyJSON sample credentials:

```text
Email: emily.johnson@x.dummyjson.com
Password: emilyspass
```

The UI asks for an email address. The server resolves that email to the username required by DummyJSON before submitting the login request.

## Common commands

```bash
npm run dev          # Start workspace development tasks
npm run build        # Build every workspace
npm run lint         # Lint every workspace
npm run check-types  # Type-check every workspace
npm run format       # Format TypeScript and Markdown files
npm run storybook    # Start live UI component documentation
npm run build-storybook # Build static component documentation
```

Run a command for one workspace:

```bash
npm run dev --workspace=panel
npm run lint --workspace=@r1c/ui
npm run check-types --workspace=panel
```

## Configuration

The panel uses `https://dummyjson.com` by default. Override it with:

```dotenv
# apps/panel/.env.local
DUMMYJSON_API_URL=https://dummyjson.com
```

No database or additional service is required.

## Documentation

Start with the [documentation index](docs/README.md).

| Topic                                    | Document                                             |
| ---------------------------------------- | ---------------------------------------------------- |
| Installation and local setup             | [Getting started](docs/getting-started.md)           |
| System design and data flow              | [Architecture](docs/architecture.md)                 |
| Directory ownership                      | [Project structure](docs/project-structure.md)       |
| Pages, layouts, and route groups         | [Routing](docs/routing.md)                           |
| Sessions, cookies, and route protection  | [Authentication](docs/authentication.md)             |
| Article list and mutation flows          | [Article management](docs/article-management.md)     |
| Internal and upstream endpoints          | [API reference](docs/api-reference.md)               |
| Shared components and exports            | [UI library](docs/ui-library.md)                     |
| Live component catalog and stories       | [Storybook](docs/storybook.md)                       |
| CSS organization and design tokens       | [Styling](docs/styling.md)                           |
| Scripts and contribution workflow        | [Development workflow](docs/development-workflow.md) |
| Runtime and release requirements         | [Deployment](docs/deployment.md)                     |
| Dummy API constraints and technical debt | [Limitations](docs/limitations.md)                   |

## Important DummyJSON behavior

DummyJSON article and user mutations are simulations. Create, update, and delete requests return successful representations, but they do not permanently change the upstream dataset. See [Limitations](docs/limitations.md) before using this project as the basis for a persistent application.

## License

No license file is currently defined in this repository.
