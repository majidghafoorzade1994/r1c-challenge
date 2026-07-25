import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toast } from "./toast";

const meta = {
  title: "Components/Feedback/Toast",
  component: Toast,
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    description: "The article is now visible to your readers.",
    title: "Article published",
    variant: "success",
  },
};

export const Error: Story = {
  args: {
    description: "Check your connection and try again.",
    title: "The article could not be saved",
    variant: "error",
  },
};
