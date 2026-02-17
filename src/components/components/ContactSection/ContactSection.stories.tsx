import type { Meta, StoryObj } from "@storybook/react";
import ContactSection from "./ContactSection";

const meta: Meta<typeof ContactSection> = {
  title: "Components/ContactSection",
  component: ContactSection,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;
type Story = StoryObj<typeof ContactSection>;

export const Default: Story = {};

export const CustomContent: Story = {
  args: {
    heading: "Start a Project",
    description:
      "Have a challenge we can help with? Let\u2019s explore how we can work together.",
    bookingLabel: "Schedule a Call",
    bookingUrl: "https://calendly.com/example",
    email: "hello@example.com",
  },
};
