import type { Meta, StoryObj } from "@storybook/react-vite";

import { Menu, MenuItem, MenuLoading } from "./menu";

const meta = {
  title: "Components/Navigation/Menu",
  component: Menu,
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menu>
      <MenuItem active>Articles</MenuItem>
      <MenuItem>Drafts</MenuItem>
      <MenuItem>Settings</MenuItem>
    </Menu>
  ),
};

export const Loading: Story = {
  render: () => (
    <Menu>
      <MenuLoading />
      <MenuLoading />
      <MenuLoading />
    </Menu>
  ),
};
