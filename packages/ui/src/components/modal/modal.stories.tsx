import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "../button/button";
import { Modal, type ModalProps } from "./modal";

function ModalDemo({
  variant = "default",
  title = "Publish article?",
  description = "This action will make the article visible to your readers.",
}: Partial<Pick<ModalProps, "description" | "title" | "variant">>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        description={description}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        title={title}
        variant={variant}
      >
        Review the article details before confirming this action.
      </Modal>
    </>
  );
}

const meta = {
  title: "Components/Feedback/Modal",
  component: Modal,
  args: {
    open: false,
    title: "Modal title",
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ModalDemo />,
};

export const Success: Story = {
  render: () => (
    <ModalDemo
      description="The article is ready to be published."
      title="Article ready"
      variant="success"
    />
  ),
};

export const Danger: Story = {
  render: () => (
    <ModalDemo
      description="This action cannot be undone."
      title="Delete article?"
      variant="danger"
    />
  ),
};
