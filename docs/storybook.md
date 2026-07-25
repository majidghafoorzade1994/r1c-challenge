# Component documentation with Storybook

Storybook is the live component catalog for `@r1c/ui`. It renders components
independently from the panel application and provides interactive controls,
generated API documentation, and accessibility checks.

## Start the documentation

From the repository root:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006).

The same command can be run directly against the workspace:

```bash
npm run storybook --workspace=@r1c/ui
```

## Build static documentation

```bash
npm run build-storybook
```

The generated static site is written to:

```text
packages/ui/storybook-static/
```

The directory is ignored by Git. Deploy its contents to any static hosting
service when a shared documentation URL is required.

## Configuration

Storybook configuration lives in:

```text
packages/ui/.storybook/
├── main.ts       # Story discovery, framework, and addons
├── preview.ts    # Global parameters, ordering, and theme import
└── preview.css   # Documentation-only canvas helpers
```

The integration uses the React Vite framework. It imports `src/theme.css`
globally, while each component continues to import its own plain CSS file.

Enabled addons:

- `@storybook/addon-docs` for generated documentation and MDX pages
- `@storybook/addon-a11y` for accessibility feedback in the Storybook panel

All component stories receive the `autodocs` tag. Storybook therefore creates
a Documentation page from the component metadata, props, and examples.

## Catalog organization

The sidebar is organized into:

- Introduction
- Foundations
- Components / Actions
- Components / Forms
- Components / Feedback
- Components / Navigation
- Components / Layout

Introductory MDX pages live in `packages/ui/src/stories`. Component stories are
co-located with their implementations:

```text
src/components/button/
├── button.css
├── button.stories.tsx
├── button.tsx
└── index.ts
```

Co-location makes documentation changes part of the component change itself.
Story files are excluded from the package declaration build.

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

For stateful behavior, create a small React wrapper in the story file. Keep
production components free of Storybook-specific logic.

A useful story set normally covers:

- The default state
- Every public visual variant
- Disabled, loading, empty, and error states where applicable
- Long or realistic content
- Important interactions

## Accessibility

Open the Accessibility panel while viewing a story to see automated findings.
The global configuration treats violations as errors in Storybook's test
integration. Automated checks help catch common problems but do not replace
keyboard and screen-reader testing.

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
