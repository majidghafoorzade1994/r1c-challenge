import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Pagination, type PaginationProps } from "./pagination";

function PaginationDemo(
  props: Omit<PaginationProps, "currentPage" | "onPageChange">,
) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Pagination
      {...props}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
}

const meta = {
  title: "Components/Navigation/Pagination",
  component: Pagination,
  args: {
    currentPage: 1,
    onPageChange: () => undefined,
    totalPages: 8,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <PaginationDemo totalPages={8} />,
};

export const FewPages: Story = {
  render: () => <PaginationDemo totalPages={3} />,
};

export const ManyPages: Story = {
  render: () => <PaginationDemo totalPages={24} />,
};
