import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";

const meta = {
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          "Native checkbox with a custom visual control and support for the DOM indeterminate state.",
      },
    },
  },
  title: "Components/Forms/Checkbox",
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const LabeledStates: Story = {
  render: () => (
    <div className="sb-story-stack">
      <label className="sb-story-row">
        <Checkbox />
        <span>Unchecked</span>
      </label>
      <label className="sb-story-row">
        <Checkbox defaultChecked />
        <span>Checked</span>
      </label>
      <label className="sb-story-row">
        <Checkbox indeterminate />
        <span>Indeterminate</span>
      </label>
    </div>
  ),
};
