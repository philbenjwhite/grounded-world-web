import type { Meta, StoryObj } from "@storybook/react";
import Container from "./Container";

const meta = {
  title: "Layout/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="bg-[var(--color-cyan)] p-8 text-center">
        <p className="text-[var(--color-black)] font-medium">
          Container content (max-width: 1440px, centered)
        </p>
      </div>
    ),
  },
};

export const WithBackground: Story = {
  render: () => (
    <div className="bg-[var(--color-gray-1)]">
      <Container>
        <div className="bg-[var(--color-magenta)] p-8 text-center">
          <p className="text-white font-medium">
            Container inside a full-width background
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const NestedContent: Story = {
  args: {
    children: (
      <div className="grid grid-cols-3 gap-4 p-8">
        <div className="bg-[var(--color-cyan)] p-4 rounded text-center">
          Column 1
        </div>
        <div className="bg-[var(--color-orange)] p-4 rounded text-center">
          Column 2
        </div>
        <div className="bg-[var(--color-green)] p-4 rounded text-center">
          Column 3
        </div>
      </div>
    ),
  },
};

export const WithCustomClass: Story = {
  args: {
    className: "py-16",
    children: (
      <div className="bg-[var(--color-gray-2)] p-8 text-center">
        <p className="text-white font-medium">
          Container with custom padding (py-16)
        </p>
      </div>
    ),
  },
};
