import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";

const meta = {
  args: {
    placeholder: "Write your content",
    rows: 5,
  },
  component: Textarea,
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
          "Ref-forwarding multiline control with vertical resizing and the same invalid and disabled conventions as Input.",
      },
    },
  },
  title: "Components/Forms/Textarea",
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue:
      "A longer article body can be edited in this resizable field.",
  },
};

export const Invalid: Story = {
  args: { invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Read-only content" },
};
