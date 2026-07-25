import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../input";
import { Field } from "./field";

const meta = {
  args: {
    children: <Input id="example-field" placeholder="Enter a value" />,
    htmlFor: "example-field",
    label: "Field label",
  },
  component: Field,
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
          "Associates a label and optional required marker/error message with a form control.",
      },
    },
  },
  title: "Components/Forms/Field",
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithError: Story = {
  args: {
    children: (
      <Input id="error-field" invalid placeholder="Enter a valid value" />
    ),
    error: "Required field",
    htmlFor: "error-field",
  },
};
