import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppHeader } from "./app-header";

const meta = {
  title: "Components/Layout/AppHeader",
  component: AppHeader,
  decorators: [
    (Story) => (
      <div className="sb-story-header">
        <Story />
      </div>
    ),
  ],
  args: {
    brand: "R1C",
    user: "Majid",
    onLogout: () => undefined,
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomBrand: Story = {
  args: {
    brand: "Blog Admin",
    user: "Alex Morgan",
  },
};
