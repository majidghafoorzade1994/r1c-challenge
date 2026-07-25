import type { Meta, StoryObj } from "@storybook/react-vite";

import { Sidebar, SidebarItem } from "./sidebar";

const meta = {
  title: "Components/Navigation/Sidebar",
  component: Sidebar,
  decorators: [
    (Story) => (
      <div className="sb-story-sidebar">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sidebar>
      <SidebarItem active href="#articles">
        Articles
      </SidebarItem>
      <SidebarItem href="#drafts">Drafts</SidebarItem>
      <SidebarItem href="#settings">Settings</SidebarItem>
    </Sidebar>
  ),
};
