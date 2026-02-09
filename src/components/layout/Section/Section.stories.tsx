import type { Meta, StoryObj } from "@storybook/react";
import Section from "./Section";
import Container from "../Container";

const meta = {
  title: "Layout/Section",
  component: Section,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["section", "div", "article", "aside"],
    },
    className: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="bg-black">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    as: "section",
    children: (
      <Container>
        <div className="bg-gray-800 p-8 text-center">
          <p className="text-gray-300 font-medium">
            Section with vertical padding
          </p>
        </div>
      </Container>
    ),
  },
};

export const WithContainer: Story = {
  args: {
    as: "section",
    children: (
      <Container>
        <div className="bg-gray-800 p-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Section + Container
          </h2>
          <p className="text-gray-400">
            Section provides vertical padding, Container constrains width.
          </p>
        </div>
      </Container>
    ),
  },
};

export const MultipleSections: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div className="bg-black">
      <Section className="bg-gray-900">
        <Container>
          <div className="bg-gray-800 p-8 text-center">
            <h2 className="text-xl font-bold text-white">Section 1</h2>
            <p className="text-gray-400">First section content</p>
          </div>
        </Container>
      </Section>
      <Section className="bg-gray-950">
        <Container>
          <div className="bg-gray-800 p-8 text-center">
            <h2 className="text-xl font-bold text-white">Section 2</h2>
            <p className="text-gray-400">Second section content</p>
          </div>
        </Container>
      </Section>
      <Section className="bg-gray-900">
        <Container>
          <div className="bg-gray-800 p-8 text-center">
            <h2 className="text-xl font-bold text-white">Section 3</h2>
            <p className="text-gray-400">Third section content</p>
          </div>
        </Container>
      </Section>
    </div>
  ),
};

export const AsDiv: Story = {
  args: {
    as: "div",
    children: (
      <Container>
        <div className="bg-gray-800 p-8 text-center">
          <p className="text-gray-300 font-medium mb-2">
            Rendered as a div element
          </p>
          <p className="text-gray-500 text-sm">
            Use as=&quot;div&quot; when nesting inside another section or when
            semantic section markup isn&apos;t appropriate.
          </p>
        </div>
      </Container>
    ),
  },
};
