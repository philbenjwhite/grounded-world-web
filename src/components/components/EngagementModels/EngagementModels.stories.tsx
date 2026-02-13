import type { Meta, StoryObj } from "@storybook/react";
import EngagementModels from "./EngagementModels";
import type { EngagementModel } from "./EngagementModels";

const engagementModelsData: EngagementModel[] = [
  {
    title: "Pop Up",
    description:
      "We do speaking engagements, present thought leadership at conferences and events and get the ball rolling by facilitating one day design sprints, immersions, brainstorms and workshops.",
    imageSrc: "/images/services/toast-popping-out-of-toaster.png",
    imageAlt: "Toast popping out of a toaster",
    glowColor: "#00AEEF",
  },
  {
    title: "Plug-in",
    description:
      "We can operate as part of your team or lead an IAT. We can even help you build and augment your in-house capabilities — without the need for big agency fees or expenses.",
    imageSrc: "/images/services/European-style-type-f-socket-in-wall.png",
    imageAlt: "Plug plugged into a wall socket",
    glowColor: "#FFA603",
  },
  {
    title: "Play Thru",
    description:
      "We can also make it totally turnkey and provide a full service agency solution — from strategy, creative, tactical planning, and toolkits to strategic partnerships, PR and impact reporting.",
    imageSrc: "/images/services/pov-white-shoes-walking-on-arrow-pavement.png",
    imageAlt: "White shoes walking forward on a yellow arrow",
    glowColor: "#FF08CC",
  },
];

const meta = {
  title: "Components/EngagementModels",
  component: EngagementModels,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0a0a0a" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    sectionTitle: { control: "text" },
    sectionSubtitle: { control: "text" },
  },
} satisfies Meta<typeof EngagementModels>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — all three engagement models */
export const Default: Story = {
  args: {
    models: engagementModelsData,
  },
};

/** Custom section title and subtitle */
export const WithCustomTitle: Story = {
  args: {
    sectionTitle: "How We Work",
    sectionSubtitle: "Choose the engagement model that fits your needs.",
    models: engagementModelsData,
  },
};

/** Two models only (edge case) */
export const TwoModels: Story = {
  args: {
    models: engagementModelsData.slice(0, 2),
  },
};

/** Placeholder images for dev without real assets */
export const WithPlaceholders: Story = {
  args: {
    models: engagementModelsData.map((m, i) => ({
      ...m,
      imageSrc: `https://picsum.photos/600/400?random=${i}`,
    })),
  },
};
