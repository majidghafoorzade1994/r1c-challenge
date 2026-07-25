import type { Meta, StoryObj } from "@storybook/react-vite";

import { Placeholder } from "./placeholder";

const meta = {
  title: "Components/Feedback/Placeholder",
  component: Placeholder,
} satisfies Meta<typeof Placeholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "No articles found.",
  },
};

export const InASection: Story = {
  decorators: [
    (Story) => (
      <div className="sb-story-section">
        <Story />
      </div>
    ),
  ],
  args: {
    children: "Create your first article to see it here.",
  },
};
