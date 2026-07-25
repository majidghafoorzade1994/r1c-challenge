# UI library

## Package identity

```text
Name: @r1c/ui
Path: packages/ui
Visibility: private workspace package
Module type: ESM
React peer: ^19.0.0
```

The panel declares `@r1c/ui: "*"` and resolves it through npm workspaces.

## Live component catalog

Start Storybook from the repository root:

```bash
npm run storybook
```

Browse the interactive component documentation at
[http://localhost:6006](http://localhost:6006). It includes component variants,
prop controls, generated API documentation, and accessibility feedback. See the
[Storybook guide](storybook.md) for configuration and authoring conventions.

## Distribution model

The package exports source TypeScript:

```json
{
  ".": "./src/index.ts",
  "./components": "./src/components/index.ts",
  "./icons": "./src/icons/index.ts",
  "./theme.css": "./src/theme.css",
  "./*": "./src/components/*/index.ts"
}
```

Next.js transpiles the source because `apps/panel/next.config.ts` includes:

```ts
transpilePackages: ["@r1c/ui"];
```

The package `build` script emits TypeScript declarations to `dist`. It does not emit runtime JavaScript or copy CSS.

## Import patterns

Root import:

```tsx
import { Button, Field, Input, Toast } from "@r1c/ui";
```

Component subpath:

```tsx
import { Button } from "@r1c/ui/button";
```

Icons:

```tsx
import { Ellipsis } from "@r1c/ui/icons";
```

Theme tokens:

```css
@import "@r1c/ui/theme.css";
```

Component modules import their own CSS as side effects. The package marks `**/*.css` as side-effectful so bundlers do not remove those imports.

## Components

| Component     | Main purpose               | Notable props                                           |
| ------------- | -------------------------- | ------------------------------------------------------- |
| `AppHeader`   | Dashboard header           | `user`, `brand`, `onLogout`                             |
| `Button`      | Primary action control     | `variant`, `loading`, `icon`, `iconOnly`                |
| `Checkbox`    | Styled checkbox            | Native input props, `indeterminate`                     |
| `Field`       | Label/error wrapper        | `label`, `htmlFor`, `error`, `required`                 |
| `Input`       | Styled text input          | Native input props, `invalid`                           |
| `LinkButton`  | Anchor styled as an action | Native anchor props, `disabled`                         |
| `Menu`        | Menu container             | Native div props                                        |
| `MenuItem`    | Menu action                | Native button props, `active`                           |
| `MenuLoading` | Menu loading row           | Native div props                                        |
| `Modal`       | Dialog and status dialog   | `open`, `title`, `variant`, `size`, callbacks           |
| `Pagination`  | Page controls              | `currentPage`, `totalPages`, `onPageChange`, `disabled` |
| `Placeholder` | Empty/demo surface         | Native div props                                        |
| `Section`     | Titled content section     | `title`, `description`                                  |
| `Sidebar`     | Navigation container       | Native aside props                                      |
| `SidebarItem` | Styled anchor item         | Native anchor props, `active`, `icon`                   |
| `Spinner`     | Inline loading indicator   | Native span props                                       |
| `Textarea`    | Styled multiline input     | Native textarea props, `invalid`                        |
| `Toast`       | Success/error feedback     | `title`, `description`, `variant`                       |

## Button

Variants:

```ts
type ButtonVariant = "primary" | "secondary" | "danger";
```

Behavior:

- Defaults to `type="button"` to avoid accidental form submission.
- `loading` disables the button and replaces content with `Spinner`.
- `iconOnly` applies the compact square layout.
- Native button props remain available.

Example:

```tsx
<Button loading={saving} type="submit">
  Save
</Button>
```

## Form controls

`Input` and `Textarea` use `forwardRef` and expose native control props.

`invalid` controls:

- `aria-invalid`
- Error border/ring styles

`Field` owns label and error markup:

```tsx
<Field error={errors.title} htmlFor="title" label="Title">
  <Input id="title" invalid={Boolean(errors.title)} name="title" />
</Field>
```

`Checkbox` uses a visually hidden native checkbox, so keyboard and form behavior remain native. Its `indeterminate` DOM property is synchronized through a ref and effect.

## Modal

Variants:

```ts
type ModalVariant = "default" | "success" | "danger";
type ModalSize = "medium" | "large";
```

The component:

- Returns `null` while closed.
- Uses `role="dialog"` and `aria-modal`.
- Closes when the backdrop itself receives a mouse down.
- Provides close, cancel, and confirm actions.
- Uses the shared button variants.

The component does not currently implement focus trapping, Escape handling, or portal rendering.

## Pagination

The pagination component is URL-agnostic. It emits a page number through `onPageChange`.

For more than seven pages, it calculates:

- First and last page
- Current page and immediate neighbors
- Extra leading/trailing pages near the boundaries
- Ellipses where gaps remain

The panel turns emitted page numbers into App Router URLs.

## Icons

`@r1c/ui/icons` re-exports selected Lucide icons:

- `ChevronDown`
- `ChevronLeft`
- `ChevronRight`
- `ChevronUp`
- `CircleCheck`
- `CircleHelp`
- `Ellipsis`
- `Info`
- `TriangleAlert`

Components may also import other Lucide icons directly inside the package.

## Utilities

`cx()` joins truthy class-name values:

```ts
cx("base", active && "is-active", className);
```

It is an internal utility and is not exported from the package root.

## Adding a component

1. Create `src/components/component-name/`.
2. Add:
   - `component-name.tsx`
   - `component-name.css`
   - `component-name.stories.tsx`
   - `index.ts`
3. Import the local stylesheet from the component.
4. Use `r1c-` prefixed CSS classes.
5. Reuse variables from `src/theme.css`.
6. Export the component and types from its local `index.ts`.
7. Export it from `src/components/index.ts`.
8. Document its default state and relevant variants in Storybook.
9. Run:

```bash
npm run lint --workspace=@r1c/ui
npm run check-types --workspace=@r1c/ui
npm run build --workspace=@r1c/ui
npm run build-storybook
```

The package wildcard export makes `@r1c/ui/component-name` available when a local index exists.

## Client-component considerations

Only components requiring client behavior include `"use client"`, such as:

- `Button`
- `Checkbox`
- `Modal`
- `Pagination`
- `AppHeader`

Keep purely presentational components server-compatible when possible.
