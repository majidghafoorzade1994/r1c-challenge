import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/button";
import { Section } from "./section";

const meta = {
  title: "Components/Layout/Section",
  component: Section,
  decorators: [
    (Story) => (
      <div className="sb-story-section">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Section content",
    description: "Manage the content displayed on your blog.",
    title: "Articles",
  },
};

export const WithActions: Story = {
  args: {
    children: (
      <div className="sb-story-row">
        <Button>New article</Button>
        <Button variant="secondary">Import</Button>
      </div>
    ),
    description: "Create, edit, and publish your articles.",
    title: "Article management",
  },
};
