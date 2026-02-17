import type { Meta, StoryObj } from "@storybook/react";
import CTABanner from "./CTABanner";

const meta = {
  title: "Components/CTABanner",
  component: CTABanner,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0a0a0a" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    backgroundSrc: { control: "text" },
    backgroundAlt: { control: "text" },
    heading: { control: "text" },
    primaryLabel: { control: "text" },
    primaryHref: { control: "text" },
    secondaryLabel: { control: "text" },
    secondaryHref: { control: "text" },
    overlayOpacity: {
      control: "select",
      options: ["light", "medium", "heavy"],
    },
  },
} satisfies Meta<typeof CTABanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    backgroundSrc:
      "/images/stockholm-metro-station-escalators-dark-underground.jpg",
    backgroundAlt: "Stockholm metro station escalators",
    heading: "It\u2019s time to get grounded",
    primaryLabel: "Ask Gaia for help",
    primaryHref: "/gaia",
    secondaryLabel: "Contact Us",
    secondaryHref: "/contact",
    overlayOpacity: "medium",
  },
};

export const SingleButton: Story = {
  args: {
    backgroundSrc:
      "/images/stockholm-metro-station-escalators-dark-underground.jpg",
    backgroundAlt: "Stockholm metro station escalators",
    heading: "Ready to make an impact?",
    primaryLabel: "Get Started",
    primaryHref: "/contact",
    overlayOpacity: "heavy",
  },
};

export const LightOverlay: Story = {
  args: {
    backgroundSrc:
      "/images/stockholm-metro-station-escalators-dark-underground.jpg",
    backgroundAlt: "Stockholm metro station escalators",
    heading: "Let\u2019s build something together",
    primaryLabel: "Start a Project",
    primaryHref: "/contact",
    secondaryLabel: "Our Work",
    secondaryHref: "/our-work",
    overlayOpacity: "light",
  },
};
