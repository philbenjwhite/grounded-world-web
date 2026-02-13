import type { Meta, StoryObj } from "@storybook/react";
import VideoHero from "./VideoHero";

const meta: Meta<typeof VideoHero> = {
  title: "Components/VideoHero",
  component: VideoHero,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-width video hero with top-aligned heading, B Corp badge, awards marquee, and a primary CTA that opens a Vimeo player modal.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof VideoHero>;

export const Default: Story = {
  name: "Default",
  decorators: [
    (Story) => (
      <div style={{ height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};

export const Mobile: Story = {
  name: "Mobile",
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};
