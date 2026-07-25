# Component documentation with Storybook

Storybook is the live component catalog for `@r1c/ui`. It renders the shared
components independently from the Next.js panel and provides interactive
examples, generated API documentation, controls, and accessibility feedback.

## Technology

| Package                 | Version  | Purpose                             |
| ----------------------- | -------- | ----------------------------------- |
| `storybook`             | `10.5.4` | Storybook CLI and core runtime      |
| `@storybook/react-vite` | `10.5.4` | React renderer and Vite builder     |
| `@storybook/addon-docs` | `10.5.4` | Autodocs and MDX documentation      |
| `@storybook/addon-a11y` | `10.5.4` | Accessibility analysis panel        |
| `vite`                  | `6.4.3`  | Development and production bundling |
| `react`                 | `19.2.4` | Component runtime                   |
| `react-dom`             | `19.2.4` | Browser renderer                    |

React and React DOM are pinned to the exact same version at the repository root
and in the relevant workspaces. React rejects a runtime where these packages
have different versions.

## Start the live catalog

From the repository root:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006).

The root command delegates to the UI workspace. The equivalent command is:

```bash
npm run storybook --workspace=@r1c/ui
```

Storybook runs separately from the panel. It does not require the Next.js
development server or access to DummyJSON.

## Build static documentation

```bash
npm run build-storybook
```

The generated static site is written to:

```text
packages/ui/storybook-static/
```

This directory is ignored by Git. Its contents can be deployed to a static
hosting service without a Node.js server.

## Configuration

Storybook configuration lives in `packages/ui/.storybook`:

```text
.storybook/
|-- main.ts       # Story discovery, framework, addons, and Vite configuration
|-- preview.ts    # Global parameters, ordering, theme import, and Autodocs
`-- preview.css   # Documentation-only canvas and layout helpers
```

### Main configuration

`main.ts`:

- Discovers co-located `*.stories.tsx` and documentation `*.mdx` files
- Uses `@storybook/react-vite`
- Enables the Docs and Accessibility addons
- Deduplicates `react` and `react-dom` during Vite resolution

React deduplication prevents a workspace dependency from loading a second React
runtime:

```ts
viteFinal(config) {
  config.resolve ??= {};
  config.resolve.dedupe = [
    ...(config.resolve.dedupe ?? []),
    "react",
    "react-dom",
  ];

  return config;
}
```

### Preview configuration

`preview.ts`:

- Imports `src/theme.css` globally
- Applies Storybook-only layout helpers from `preview.css`
- Enables generated Documentation pages with the `autodocs` tag
- Enables a table of contents for documentation pages
- Configures control matchers for colors and dates
- Treats accessibility violations as errors in Storybook test integration
- Defines the catalog sidebar order

Components continue to import their own plain CSS files. Storybook does not
introduce Tailwind or change the package styling model.

## Catalog organization

The sidebar is organized into:

- Introduction
- Foundations
- Components / Actions
- Components / Forms
- Components / Feedback
- Components / Navigation
- Components / Layout

The authored foundation pages are:

```text
packages/ui/src/stories/
|-- introduction.mdx
`-- design-tokens.mdx
```

Every public UI component has at least one story. Related exports such as
`MenuItem` and `MenuLoading` are documented with their parent component.

## Story location

Component stories are co-located with their implementation:

```text
src/components/button/
|-- button.css
|-- button.stories.tsx
|-- button.tsx
`-- index.ts
```

Co-location makes documentation part of the component change. Story files are
excluded from `tsconfig.build.json`, so they are type-checked during development
but are not included in the package declaration output.

## Add or update a story

Use Component Story Format with typed metadata:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";

const meta = {
  title: "Components/Actions/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Save article",
  },
};
```

For stateful behavior, create a small React wrapper inside the story file. The
modal and pagination stories use this approach. Keep Storybook-specific state
and helpers out of production components.

A useful story set normally covers:

- The default state
- Every public visual variant
- Disabled, loading, empty, and error states where applicable
- Long or realistic content
- Important interactions
- Layout-sensitive contexts

## Controls and generated documentation

Stories that use `args` expose editable values in the Controls panel. Autodocs
uses component type information and story metadata to generate:

- A component summary
- Prop tables
- Interactive examples
- Source snippets

Write realistic `args` because they become both the default example and part of
the generated documentation.

## Accessibility

Open the Accessibility panel while viewing a story to run automated checks.
These checks help identify common semantic, contrast, and ARIA problems.

Automated analysis does not replace:

- Keyboard-only navigation
- Screen-reader testing
- Focus-order review
- Testing at responsive sizes

## Verification

Run these checks after changing the library or its stories:

```bash
npm run lint --workspace=@r1c/ui
npm run check-types --workspace=@r1c/ui
npm run build --workspace=@r1c/ui
npm run build-storybook
```

The static build is the most complete Storybook smoke test because it validates
configuration, story discovery, MDX compilation, and production bundling.

Vite may report that Next.js `"use client"` directives are ignored. This is
expected in the browser-only Storybook bundle and does not indicate a failed
build.

## Troubleshooting

### React and React DOM versions are incompatible

Check the installed dependency graph:

```bash
npm ls react react-dom --all
```

Every active copy should resolve to:

```text
react@19.2.4
react-dom@19.2.4
```

If the versions differ:

1. Stop the running Storybook process.
2. Run `npm install` from the repository root.
3. Confirm the versions with `npm ls react react-dom --all`.
4. Start Storybook again with `npm run storybook`.
5. Refresh the browser.

Restarting matters because Vite pre-bundles dependencies when the Storybook
process starts.

### Port 6006 is already in use

Stop the previous Storybook process before starting another one. The configured
workspace script expects port `6006`.

### Styles are missing

Confirm that:

- The component imports its local CSS file
- `preview.ts` imports `../src/theme.css`
- The package retains `"sideEffects": ["**/*.css"]`

### A new story is not listed

Confirm that the filename ends in `.stories.tsx` and is located under
`packages/ui/src`. Restart Storybook if story discovery becomes stale.
