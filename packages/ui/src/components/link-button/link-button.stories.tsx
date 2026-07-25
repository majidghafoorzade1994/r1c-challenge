import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinkButton } from "./link-button";

const meta = {
  args: {
    children: "Learn more",
    href: "#",
  },
  component: LinkButton,
  parameters: {
    docs: {
      description: {
        component:
          "Anchor styled as an action link. The disabled state prevents navigation and removes the element from the tab order.",
      },
    },
  },
  title: "Components/Actions/LinkButton",
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
