import type { Meta, StoryObj } from "@storybook/react";
import Split from "./Split";
import Container from "../Container";

const meta = {
  title: "Layout/Split",
  component: Split,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    ratio: {
      control: "select",
      options: ["50/50", "40/60", "60/40", "30/70", "70/30"],
    },
    gap: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
    },
    reverseOnMobile: { control: "boolean" },
  },
} satisfies Meta<typeof Split>;

export default meta;
type Story = StoryObj<typeof meta>;

const LeftContent = () => (
  <div className="bg-gray-800 p-8 h-full">
    <h2 className="text-xl font-bold text-white mb-4">Left Column</h2>
    <p className="text-gray-400">
      Content for the left side of the split layout.
    </p>
  </div>
);

const RightContent = () => (
  <div className="bg-gray-700 p-8 h-full">
    <h2 className="text-xl font-bold text-white mb-4">Right Column</h2>
    <p className="text-gray-400">
      Content for the right side of the split layout.
    </p>
  </div>
);

export const Default: Story = {
  render: () => (
    <div className="bg-black p-8">
      <Container>
        <Split left={<LeftContent />} right={<RightContent />} />
      </Container>
    </div>
  ),
};

export const Ratio6040: Story = {
  render: () => (
    <div className="bg-black p-8">
      <Container>
        <Split
          ratio="60/40"
          left={
            <div className="bg-gray-800 p-8">
              <h2 className="text-xl font-bold text-white mb-4">
                60% Width Column
              </h2>
              <p className="text-gray-400">Larger content area on the left.</p>
            </div>
          }
          right={
            <div className="bg-gray-700 p-8">
              <h2 className="text-xl font-bold text-white mb-4">
                40% Width Column
              </h2>
              <p className="text-gray-400">Smaller content area on the right.</p>
            </div>
          }
        />
      </Container>
    </div>
  ),
};

export const Ratio3070: Story = {
  render: () => (
    <div className="bg-black p-8">
      <Container>
        <Split
          ratio="30/70"
          left={
            <div className="bg-gray-800 p-8">
              <h2 className="text-lg font-bold text-white mb-2">30%</h2>
              <p className="text-gray-400 text-sm">Narrow column</p>
            </div>
          }
          right={
            <div className="bg-gray-700 p-8">
              <h2 className="text-xl font-bold text-white mb-4">70%</h2>
              <p className="text-gray-400">
                Wide content area, useful for main content with a narrow sidebar
                or label column.
              </p>
            </div>
          }
        />
      </Container>
    </div>
  ),
};

export const ImageAndText: Story = {
  render: () => (
    <div className="bg-black p-8">
      <Container>
        <Split
          ratio="50/50"
          align="center"
          gap="lg"
          left={
            <div className="bg-gray-800 aspect-video rounded-lg" />
          }
          right={
            <div className="p-4">
              <h2 className="text-2xl font-bold text-white mb-4">
                Image + Text Layout
              </h2>
              <p className="text-gray-400 mb-4">
                A common pattern for featuring content alongside imagery.
                The align=&quot;center&quot; prop vertically centers both columns.
              </p>
              <button className="bg-white text-black px-4 py-2 rounded font-medium">
                Learn More
              </button>
            </div>
          }
        />
      </Container>
    </div>
  ),
};

export const ReverseOnMobile: Story = {
  render: () => (
    <div className="bg-black p-8">
      <Container>
        <Split
          ratio="50/50"
          reverseOnMobile
          left={
            <div className="bg-gray-800 p-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Appears Second on Mobile
              </h2>
              <p className="text-gray-400">
                This column appears first on desktop but second on mobile.
              </p>
            </div>
          }
          right={
            <div className="bg-gray-700 p-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Appears First on Mobile
              </h2>
              <p className="text-gray-400">
                Use reverseOnMobile when the right content should appear first
                on smaller screens (e.g., headline before image).
              </p>
            </div>
          }
        />
      </Container>
    </div>
  ),
};
