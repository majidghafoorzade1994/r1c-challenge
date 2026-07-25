import { Info } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  args: {
    children: "Button",
    variant: "primary",
  },
  argTypes: {
    icon: { control: false },
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
    },
  },
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Primary action control with secondary, danger, icon, disabled, and loading states.",
      },
    },
  },
  title: "Components/Actions/Button",
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Danger: Story = {
  args: { variant: "danger" },
};

export const WithIcon: Story = {
  args: { icon: <Info aria-hidden="true" size={20} /> },
};

export const IconOnly: Story = {
  args: {
    "aria-label": "Information",
    icon: <Info aria-hidden="true" size={20} />,
    iconOnly: true,
  },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-row">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};
