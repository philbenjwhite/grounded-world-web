import type { Meta, StoryObj } from "@storybook/react";
import Section from "./Section";
import Container from "../Container";

const meta = {
  title: "Layout/Section",
  component: Section,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["section", "div", "article", "aside"],
    },
    className: { control: "text" },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="bg-[var(--color-cyan)] p-8 text-center">
        <p className="text-[var(--color-black)] font-medium">
          Section content with vertical padding
        </p>
      </div>
    ),
  },
};

export const WithContainer: Story = {
  render: () => (
    <Section className="bg-[var(--color-gray-1)]">
      <Container>
        <div className="bg-[var(--color-magenta)] p-8 text-center">
          <p className="text-white font-medium">
            Section with Container inside
          </p>
        </div>
      </Container>
    </Section>
  ),
};

export const MultipleSections: Story = {
  render: () => (
    <div>
      <Section className="bg-[var(--color-cyan)]">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[var(--color-black)]">
              Section 1
            </h2>
            <p className="text-[var(--color-black)]">First section content</p>
          </div>
        </Container>
      </Section>
      <Section className="bg-[var(--color-orange)]">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[var(--color-black)]">
              Section 2
            </h2>
            <p className="text-[var(--color-black)]">Second section content</p>
          </div>
        </Container>
      </Section>
      <Section className="bg-[var(--color-green)]">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[var(--color-black)]">
              Section 3
            </h2>
            <p className="text-[var(--color-black)]">Third section content</p>
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
      <div className="bg-[var(--color-gray-2)] p-8 text-center">
        <p className="text-white font-medium">Rendered as a div element</p>
      </div>
    ),
  },
};

export const WithCustomPadding: Story = {
  args: {
    className: "py-24 bg-[var(--color-gray-1)]",
    children: (
      <Container>
        <div className="bg-[var(--color-magenta)] p-8 text-center">
          <p className="text-white font-medium">
            Section with custom padding (py-24)
          </p>
        </div>
      </Container>
    ),
  },
};
