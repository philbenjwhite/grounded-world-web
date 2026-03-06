import type { Meta, StoryObj } from "@storybook/react";
import ExpandingCardPanel from "./ExpandingCardPanel";
import type { ExpandingCardItem } from "./ExpandingCardPanel";

const cardData: ExpandingCardItem[] = [
  {
    name: "Discover",
    color: "#00AEEF",
    icon: "MagnifyingGlass",
    tagline:
      "Assessing culture and the competitive landscape to find the intention-action gaps.",
    bullets: [
      "Culture, category, competitor and consumer landscape assessments",
      "Intent-to-action gap research and analysis",
      "Ecosystem mapping, need states, category growth drivers & go to market strategy",
    ],
    ctaHref: "/services/discover",
  },
  {
    name: "Articulate",
    color: "#FFA603",
    icon: "Compass",
    tagline:
      "Connecting the \u2018why\u2019 of purpose to the \u2018way\u2019 of profit to tell your sustainability story and drive innovation.",
    bullets: [
      "Corporate, brand and social purpose articulation",
      "Sustainability strategy, marketing, corporate narrative, storytelling and innovation sprints",
      "Brand positioning architecture & archetyping",
    ],
    ctaHref: "/services/articulate",
  },
  {
    name: "Accelerate",
    color: "#1CC35B",
    icon: "ChartLineUp",
    tagline:
      "Measuring impact, reporting on progress sparking engagement and facilitating collaboration and partnerships at scale.",
    bullets: [
      "Sustainability & impact reporting",
      "Commercial, non-profit and pre-competitive partnerships",
      "Collaboration training, action labs, design sprints, speaking engagements and thought leadership",
    ],
    ctaHref: "/services/accelerate",
  },
  {
    name: "Activate",
    color: "#FF08CC",
    icon: "Lightning",
    tagline:
      "Driving behavior change and intent at the moments that matter for colleagues, customers and consumers.",
    bullets: [
      "Brand identity, packaging, websites & design",
      "Content, video, advertising, campaigns, events and experiences",
      "Commerce (customer journeys, selling stories, brand and retail activation and tactical toolkits)",
    ],
    ctaHref: "/services/activate",
  },
];

const meta = {
  title: "Components/ExpandingCardPanel",
  component: ExpandingCardPanel,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    sectionTitle: { control: "text" },
    sectionSubtitle: { control: "text" },
    defaultActiveIndex: {
      control: { type: "number", min: 0, max: 3 },
    },
  },
} satisfies Meta<typeof ExpandingCardPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — no card expanded initially */
export const Default: Story = {
  args: {
    items: cardData,
  },
};

/** One card pre-expanded on load */
export const PreExpanded: Story = {
  args: {
    items: cardData,
    defaultActiveIndex: 0,
  },
};

/** With section heading and subtitle */
export const WithSectionTitle: Story = {
  args: {
    sectionTitle: "What We Do",
    sectionSubtitle: "Explore our services to see how we can help.",
    items: cardData,
  },
};

/** Edge case — only two items */
export const TwoItems: Story = {
  args: {
    items: cardData.slice(0, 2),
  },
};

/** Edge case — three items */
export const ThreeItems: Story = {
  args: {
    items: cardData.slice(0, 3),
  },
};
