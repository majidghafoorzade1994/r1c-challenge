import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "./spinner";

const meta = {
  title: "Components/Feedback/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnDarkSurface: Story = {
  decorators: [
    (Story) => (
      <div className="sb-story-surface">
        <Story />
      </div>
    ),
  ],
};
