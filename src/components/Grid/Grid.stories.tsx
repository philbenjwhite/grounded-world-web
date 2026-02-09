import type { Meta, StoryObj } from "@storybook/react";
import Grid from "./Grid";
import Container from "../Container";

const meta = {
  title: "Layout/Grid",
  component: Grid,
  parameters: {
    layout: "fullscreen",
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
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const GridItem = ({ label }: { label: string }) => (
  <div className="bg-gray-800 p-6 rounded text-center">
    <p className="text-gray-300 font-medium">{label}</p>
  </div>
);

export const TwoColumns: Story = {
  render: () => (
    <div className="bg-black p-8">
      <Container>
        <Grid cols={2} gap="md">
          <GridItem label="Item 1" />
          <GridItem label="Item 2" />
          <GridItem label="Item 3" />
          <GridItem label="Item 4" />
        </Grid>
      </Container>
    </div>
  ),
};

export const ThreeColumns: Story = {
  render: () => (
    <div className="bg-black p-8">
      <Container>
        <Grid cols={3} gap="md">
          <GridItem label="Item 1" />
          <GridItem label="Item 2" />
          <GridItem label="Item 3" />
          <GridItem label="Item 4" />
          <GridItem label="Item 5" />
          <GridItem label="Item 6" />
        </Grid>
      </Container>
    </div>
  ),
};

export const FourColumns: Story = {
  render: () => (
    <div className="bg-black p-8">
      <Container>
        <Grid cols={4} gap="md">
          {Array.from({ length: 8 }, (_, i) => (
            <GridItem key={i} label={`Item ${i + 1}`} />
          ))}
        </Grid>
      </Container>
    </div>
  ),
};

export const ResponsiveGrid: Story = {
  render: () => (
    <div className="bg-black p-8">
      <Container>
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">
            1 col on mobile → 2 cols on tablet → 4 cols on desktop
          </p>
        </div>
        <Grid cols={4} colsMobile={1} colsTablet={2} gap="lg">
          {Array.from({ length: 8 }, (_, i) => (
            <GridItem key={i} label={`Item ${i + 1}`} />
          ))}
        </Grid>
      </Container>
    </div>
  ),
};

export const CardGrid: Story = {
  render: () => (
    <div className="bg-black p-8">
      <Container>
        <Grid cols={3} colsTablet={2} gap="lg">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-700" />
              <div className="p-4">
                <h3 className="text-white font-bold mb-2">Card Title {i + 1}</h3>
                <p className="text-gray-400 text-sm">
                  Card description goes here with some sample text.
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Container>
    </div>
  ),
};

export const TwoColumnMobile: Story = {
  render: () => (
    <div className="bg-black p-8">
      <Container>
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">
            2 cols on mobile → 3 cols on tablet → 6 cols on desktop
          </p>
        </div>
        <Grid cols={6} colsMobile={2} colsTablet={3} gap="sm">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="bg-gray-800 aspect-square rounded flex items-center justify-center"
            >
              <span className="text-gray-400 text-sm">{i + 1}</span>
            </div>
          ))}
        </Grid>
      </Container>
    </div>
  ),
};
