import type { Meta, StoryObj } from "@storybook/react";
import Grid from "./Grid";
import Container from "../Container";

const meta = {
  title: "Layout/Grid",
  component: Grid,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    cols: {
      control: "select",
      options: [1, 2, 3, 4, 5, 6],
    },
    colsMobile: {
      control: "select",
      options: [1, 2],
    },
    colsTablet: {
      control: "select",
      options: [1, 2, 3, 4],
    },
    gap: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
    },
    className: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-8">
        <Container>
          <Story />
        </Container>
      </div>
    ),
  ],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const GridItem = ({ label }: { label: string }) => (
  <div className="bg-gray-800 p-6 rounded text-center">
    <p className="text-gray-300 font-medium">{label}</p>
  </div>
);

const createGridItems = (count: number) =>
  Array.from({ length: count }, (_, i) => <GridItem key={i} label={`Item ${i + 1}`} />);

export const Playground: Story = {
  args: {
    cols: 3,
    colsMobile: 1,
    colsTablet: 2,
    gap: "md",
    children: createGridItems(9),
  },
};

export const TwoColumns: Story = {
  args: {
    cols: 2,
    gap: "md",
    children: createGridItems(4),
  },
};

export const ThreeColumns: Story = {
  args: {
    cols: 3,
    gap: "md",
    children: createGridItems(6),
  },
};

export const FourColumns: Story = {
  args: {
    cols: 4,
    gap: "md",
    children: createGridItems(8),
  },
};

export const ResponsiveGrid: Story = {
  args: {
    cols: 4,
    colsMobile: 1,
    colsTablet: 2,
    gap: "lg",
    children: createGridItems(8),
  },
};

export const CardGrid: Story = {
  args: {
    cols: 3,
    colsTablet: 2,
    gap: "lg",
    children: Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="aspect-video bg-gray-700" />
        <div className="p-4">
          <h3 className="text-white font-bold mb-2">Card Title {i + 1}</h3>
          <p className="text-gray-400 text-sm">
            Card description goes here with some sample text.
          </p>
        </div>
      </div>
    )),
  },
};

export const TwoColumnMobile: Story = {
  args: {
    cols: 6,
    colsMobile: 2,
    colsTablet: 3,
    gap: "sm",
    children: Array.from({ length: 12 }, (_, i) => (
      <div
        key={i}
        className="bg-gray-800 aspect-square rounded flex items-center justify-center"
      >
        <span className="text-gray-400 text-sm">{i + 1}</span>
      </div>
    )),
  },
};
