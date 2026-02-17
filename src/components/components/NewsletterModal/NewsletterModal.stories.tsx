import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import NewsletterModal from "./NewsletterModal";

const meta = {
  title: "Components/NewsletterModal",
  component: NewsletterModal,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0a0a0a" }],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NewsletterModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
};

export const WithTrigger: Story = {
  args: {
    open: false,
    onClose: () => {},
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-3 rounded-lg bg-[var(--color-magenta)] text-white font-medium cursor-pointer"
        >
          Open Newsletter Modal
        </button>
        <NewsletterModal open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};
