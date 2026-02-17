import type { Meta, StoryObj } from "@storybook/react";
import ContentTabs from "./ContentTabs";

const meta = {
  title: "Components/ContentTabs",
  component: ContentTabs,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
} satisfies Meta<typeof ContentTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems = [
  {
    title: "The BPP",
    icon: "Compass",
    color: "#4DD9FF",
    subtitle: "Belief. Purpose. Pursuits.",
    body: "The BPP is a framework designed to help organisations and brands connect the WHY of purpose to the WAY of revenue. It's a business strategy canvas on a page — helping your company articulate its **massive transformative purpose**.\n\nPublished by the ANA Center for Brand Purpose as a best-in-class approach, the BPP distils your corporate, brand, and social purpose into a clear, actionable blueprint that links directly to commercial outcomes.",
    buttonLabel: "Download the Framework",
    buttonHref: "#",
    buttonExternal: true,
    subsections: [
      {
        heading: "An Example: OneSight",
        body: "**Belief**\n\nEveryone should have access to affordable eye care — because when the world sees better, the world is better.\n\n**Purpose**\n\nFuel people's potential by helping them see more clearly.\n\n**Pursuits**\n\n1. Provide funding and programming for pop-up clinics in underserved communities\n2. Engage employees with volunteer opportunities across 16+ partner organisations\n3. Be a positive force for social change through the power of sight",
      },
    ],
  },
  {
    title: "Brand Archetyping",
    icon: "Lightbulb",
    color: "#FF08CC",
    subtitle: "Find Your Brand's Character",
    body: "Archetypes provide the narrative structure for activating the BPP and delivering your desired brand experience. They transcend time, space, and culture — helping to **position who you are, what you stand for, and how people feel** when they engage with you.\n\nWith 52 archetypes to draw from, we'll find the one that authentically represents your brand's character and values.",
  },
  {
    title: "The 5Rs",
    icon: "Leaf",
    color: "#FFA603",
    subtitle: "Deconstruct. Differentiate. Deliver.",
    body: "The 5Rs is run as a team workshop to deconstruct your product or brand proposition and decide what elements or assets to **re-use, reimagine, reduce, remove, or reinforce**.\n\nIt's a structured, collaborative approach that turns sustainability from a cost centre into a genuine competitive advantage.",
    buttonLabel: "Try the Workshop",
    buttonHref: "#",
  },
  {
    title: "Validation",
    icon: "ChartLineUp",
    color: "#10B981",
    subtitle: "Test Before You Launch",
    body: "Using our fully licensed white-label testing platform, we quickly and efficiently validate which design elements, identities, positioning statements, concepts, or creative will resonate best.\n\nTests can be programmed in less than a day with results in 48 hours — streaming in real-time to an online dashboard.",
  },
];

export const Default: Story = {
  args: {
    sectionTitle: "Our Approach in Detail",
    sectionSubtitle:
      "Four proven frameworks that connect purpose to profit.",
    items: sampleItems,
  },
};

export const WithoutHeading: Story = {
  args: {
    items: sampleItems,
  },
};

export const TwoTabs: Story = {
  args: {
    sectionTitle: "Our Frameworks",
    items: sampleItems.slice(0, 2),
    defaultActiveIndex: 1,
  },
};
