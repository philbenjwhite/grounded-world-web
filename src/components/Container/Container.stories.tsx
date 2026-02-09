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
  render: () => (
    <div className="bg-black">
      <Container>
        <div className="bg-gray-800 p-8 text-center">
          <p className="text-gray-300 font-medium">
            Container content (max-width: 1440px, centered)
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <div className="bg-black">
      <Container>
        <div className="bg-gray-800 p-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Content inside Container
          </h2>
          <p className="text-gray-400">
            The black background extends full-width while the gray content area
            is constrained to 1440px max-width and centered.
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const NestedGrid: Story = {
  render: () => (
    <div className="bg-black">
      <Container>
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
      </Container>
    </div>
  ),
};
