import type { Meta, StoryObj } from "@storybook/react";
import WorkGrid from "./WorkGrid";
import type { WorkItem } from "./WorkGrid";

const sampleItems: WorkItem[] = [
  {
    slug: "whistlepig-pit-viper",
    title: "Whistlepig + Pit Viper: The SummerStock Games",
    client: "Whistlepig + Pit Viper",
    description:
      "Celebrating a new solar powered whiskey that's so bright you'll need shades.",
    date: "2026-01-06T11:36:13.000Z",
    tag: "Brand Activation",
  },
  {
    slug: "lycra-qira-farm-to-fiber",
    title: "LYCRA + QIRA: Farm to Fiber",
    client: "LYCRA + QIRA",
    description:
      "Part of a video series to educate the apparel industry on the latest innovation.",
    date: "2026-01-06T10:38:03.000Z",
    tag: "Sustainability Storytelling",
  },
  {
    slug: "fresh-air-fund",
    title: "Fresh Air Fund: Because a Summer Can Last a Lifetime",
    client: "Fresh Air Fund",
    description:
      "Refresh a heritage New York City nonprofit and create a campaign to help get underserved children out of NYC.",
    date: "2020-01-10T16:37:18.000Z",
    tag: "Social Impact",
  },
  {
    slug: "interdesign",
    title: "InterDesign: Design That Moves",
    client: "InterDesign",
    description:
      "A brand purpose initiative to redefine the relationship between design and daily life.",
    date: "2021-06-15T10:00:00.000Z",
    tag: "Brand Purpose",
  },
  {
    slug: "whistlepig",
    title: "WhistlePig: Boss Hog Packaging",
    client: "WhistlePig",
    description:
      "Elevating WhistlePig's limited and luxury whiskey with innovative packaging design.",
    date: "2024-05-20T09:00:00.000Z",
    tag: "Brand Activation",
  },
  {
    slug: "lycra-qira-farmer-docuseries",
    title: "LYCRA + QIRA: The Farmer Docuseries",
    client: "LYCRA + QIRA",
    description:
      "A docuseries following the farmers behind the renewable fiber revolution.",
    date: "2025-08-12T10:00:00.000Z",
    tag: "Sustainability Storytelling",
  },
  {
    slug: "marys-center",
    title: "Mary's Center: Strengthening Communities",
    client: "Mary's Center",
    description:
      "Telling the story of a community health organization making a lasting impact.",
    date: "2022-03-01T10:00:00.000Z",
    tag: "Social Impact",
  },
  {
    slug: "onesight",
    title: "OneSight: Vision for All",
    client: "OneSight",
    description:
      "Bringing sustainable vision care to communities that need it most.",
    date: "2023-11-20T10:00:00.000Z",
    tag: "Brand Purpose",
  },
];

const meta: Meta<typeof WorkGrid> = {
  title: "Components/WorkGrid",
  component: WorkGrid,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof WorkGrid>;

export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

export const SingleCategory: Story = {
  args: {
    items: sampleItems.filter((item) => item.tag === "Brand Activation"),
  },
};
