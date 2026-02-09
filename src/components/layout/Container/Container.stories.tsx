import type { Meta, StoryObj } from "@storybook/react";
import Container from "./Container";

const meta = {
  title: "Layout/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="bg-black">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="bg-gray-800 p-8 text-center">
        <p className="text-gray-300 font-medium">
          Container content (max-width: 1440px, centered)
        </p>
      </div>
    ),
  },
};

export const WithContent: Story = {
  args: {
    children: (
      <div className="bg-gray-800 p-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Content inside Container
        </h2>
        <p className="text-gray-400">
          The black background extends full-width while the gray content area
          is constrained to 1440px max-width and centered.
        </p>
      </div>
    ),
  },
};

export const NestedGrid: Story = {
  args: {
    children: (
      <div className="grid grid-cols-3 gap-4 p-8">
        <div className="bg-gray-800 p-4 rounded text-center text-gray-300">
          Column 1
        </div>
        <div className="bg-gray-800 p-4 rounded text-center text-gray-300">
          Column 2
        </div>
        <div className="bg-gray-800 p-4 rounded text-center text-gray-300">
          Column 3
        </div>
      </div>
    ),
  },
};
