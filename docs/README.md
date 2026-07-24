# Technical documentation

This directory contains the detailed technical reference for the R1C Blog Admin Panel.

## Suggested reading order

1. [Getting started](getting-started.md)
2. [Architecture](architecture.md)
3. [Project structure](project-structure.md)
4. [Routing](routing.md)
5. [Authentication](authentication.md)
6. [Article management](article-management.md)
7. [API reference](api-reference.md)
8. [UI library](ui-library.md)
9. [Styling](styling.md)
10. [Development workflow](development-workflow.md)
11. [Deployment](deployment.md)
12. [Limitations](limitations.md)

## Documentation map

| File                      | Purpose                                                                      |
| ------------------------- | ---------------------------------------------------------------------------- |
| `getting-started.md`      | Prerequisites, installation, environment variables, and local execution      |
| `architecture.md`         | Workspace boundaries, rendering model, and request flows                     |
| `project-structure.md`    | Directory-by-directory ownership and naming conventions                      |
| `routing.md`              | App Router pages, route groups, dynamic segments, and navigation             |
| `authentication.md`       | Login translation, cookie lifecycle, session checks, and security notes      |
| `article-management.md`   | Listing, pagination, tags, create/edit/delete behavior, and UI state         |
| `api-reference.md`        | Internal route-handler contracts and DummyJSON endpoint mapping              |
| `ui-library.md`           | `@r1c/ui` exports, component contracts, styling, and extension process       |
| `styling.md`              | Plain CSS architecture, design tokens, responsive rules, and Tailwind status |
| `development-workflow.md` | Commands, Turborepo tasks, type checks, linting, and manual QA               |
| `deployment.md`           | Production runtime, environment, cookies, and operational checklist          |
| `limitations.md`          | Non-persistent API behavior, missing tests, and recommended improvements     |

## Keeping documentation current

Update the relevant document whenever a change affects:

- A public or internal route
- An environment variable
- A workspace script
- A shared UI export or component prop
- Authentication or cookie behavior
- DummyJSON request or response mapping
- A known limitation or operational assumption

The root [README](../README.md) should remain a short entry point. Detailed implementation notes belong here.
