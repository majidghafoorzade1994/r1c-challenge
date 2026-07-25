import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta = {
  args: {
    placeholder: "Enter a value",
  },
  component: Input,
  decorators: [
    (Story) => (
      <div className="sb-story-form">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Ref-forwarding native input with shared hover, focus, disabled, placeholder, and invalid styles.",
      },
    },
  },
  title: "Components/Forms/Input",
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "Current value" },
};

export const Invalid: Story = {
  args: { defaultValue: "Invalid value", invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Unavailable" },
};

export const Password: Story = {
  args: { defaultValue: "password", type: "password" },
};
