# Styling

## Current approach

The project primarily uses plain CSS with semantic class names.

Styles are divided into:

- Global panel reset and font rules
- Authentication page CSS
- Dashboard shell CSS
- Article page CSS
- One stylesheet per UI component
- Shared UI design tokens

This is the intentional current architecture after reverting the attempted utility-class migration.

## CSS locations

| Path                                 | Scope                                                       |
| ------------------------------------ | ----------------------------------------------------------- |
| `apps/panel/src/app/globals.css`     | Global reset, box sizing, base font                         |
| `(auth)/auth.css`                    | Login and registration layout                               |
| `(dashboard)/dashboard.css`          | Header/sidebar/main dashboard shell                         |
| `(dashboard)/articles/articles.css`  | Tables, forms, tag list, actions, responsive article layout |
| `packages/ui/src/theme.css`          | Shared design tokens                                        |
| `packages/ui/src/components/*/*.css` | Component-local styles                                      |

## UI design tokens

`packages/ui/src/theme.css` defines custom properties on `:root`.

### Colors

| Token                          | Value     | Purpose                            |
| ------------------------------ | --------- | ---------------------------------- |
| `--r1c-color-primary`          | `#079c9c` | Main actions and selected controls |
| `--r1c-color-primary-hover`    | `#087572` | Primary hover                      |
| `--r1c-color-primary-active`   | `#045654` | Primary active                     |
| `--r1c-color-primary-soft`     | `#d9f3f3` | Selected navigation/background     |
| `--r1c-color-primary-disabled` | `#94dddd` | Disabled primary                   |
| `--r1c-color-danger`           | `#e31b23` | Errors and destructive actions     |
| `--r1c-color-danger-soft`      | `#fde2e3` | Error surfaces                     |
| `--r1c-color-success`          | `#12ad50` | Success text                       |
| `--r1c-color-success-soft`     | `#e2f8e9` | Success surfaces                   |
| `--r1c-color-text`             | `#303030` | Main text                          |
| `--r1c-color-muted`            | `#858585` | Secondary text                     |
| `--r1c-color-border`           | `#cfcfcf` | Inputs and controls                |
| `--r1c-color-surface-muted`    | `#f0f0f0` | Muted backgrounds                  |

### Shape and typography

| Token               | Value                          |
| ------------------- | ------------------------------ |
| `--r1c-radius-sm`   | `8px`                          |
| `--r1c-radius-md`   | `12px`                         |
| `--r1c-shadow-menu` | `0 10px 28px rgb(0 0 0 / 12%)` |
| `--r1c-font-family` | `Arial, Helvetica, sans-serif` |

## Component CSS

Every UI component imports its own stylesheet:

```tsx
import "./button.css";
```

Each stylesheet imports the theme:

```css
@import "../../theme.css";
```

This gives component imports automatic styling while keeping component rules isolated by their `r1c-` class prefixes.

## Application CSS naming

Panel styles use semantic prefixes:

- `auth-`
- `dashboard-`
- `articles-`
- `article-`

The app occasionally applies UI package class names to Next.js `Link` components, for example `r1c-sidebar__item`, to retain the shared navigation styling while still using App Router SPA navigation.

## Responsive behavior

Current breakpoints are CSS-local rather than centralized.

Important breakpoints:

- `640px` in shared components
- `520px` in auth pages
- `760px` in dashboard and article pages

Behavior includes:

- Auth card padding adjustments
- Mobile modal bottom-sheet layout
- Hidden header brand on small screens
- Dashboard sidebar becoming horizontal navigation
- Article editor changing from two columns to one
- Horizontal scrolling for the article table and pagination

## Tailwind status

Tailwind CSS 4 and `@tailwindcss/postcss` remain installed in `apps/panel`, and `globals.css` currently contains:

```css
@import "tailwindcss";
```

However, the implemented application and UI library use semantic plain CSS classes as their primary styling method. Tailwind is not required for the component-library CSS architecture itself.

If the team decides to remove Tailwind completely, that should be a separate change that removes:

- The global Tailwind import
- `tailwindcss`
- `@tailwindcss/postcss`
- The PostCSS plugin configuration

Do not mix a partial utility migration into unrelated feature work.

## Side-effect handling

The UI package declares:

```json
{
  "sideEffects": ["**/*.css"]
}
```

This prevents bundlers from tree-shaking imported stylesheets.

`src/types/styles.d.ts` declares CSS modules for TypeScript side-effect imports:

```ts
declare module "*.css";
```

## Styling guidelines

- Prefer existing tokens over new hardcoded values in the UI package.
- Keep app-domain styles outside `@r1c/ui`.
- Keep one stylesheet per shared component.
- Preserve visible focus styles.
- Include disabled, hover, active, invalid, and loading states.
- Test responsive behavior at the breakpoints used by the relevant stylesheet.
- Avoid global element rules beyond the minimal reset in `globals.css`.
