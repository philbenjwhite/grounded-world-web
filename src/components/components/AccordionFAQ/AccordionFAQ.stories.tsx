import type { Meta, StoryObj } from "@storybook/react";
import AccordionFAQ from "./AccordionFAQ";

const faqData = [
  {
    question:
      "How do you tailor your approach for different types of organizations (startups, corporates, nonprofits)?",
    answer:
      "Every engagement starts with understanding your unique context — your culture, category, stakeholders and ambition. We then build a bespoke team, toolkit and timeline that fits whether you're a startup finding product-market fit, a corporate embedding purpose across a portfolio, or a nonprofit scaling impact.",
  },
  {
    question:
      "What does a typical engagement with Grounded look like from start to finish?",
    answer:
      "It usually starts with a discovery session to understand your goals and intention-action gaps. From there we scope a phased plan — typically covering research, strategy, activation and measurement — with clear milestones and deliverables along the way.",
  },
  {
    question:
      "How do you measure the impact of your work beyond traditional marketing metrics?",
    answer:
      "We look at commercial, cultural and societal impact together. Alongside traditional KPIs, we measure behaviour change, stakeholder engagement, partnership value and progress against sustainability targets using tools like our Flywheel of Impact.",
  },
  {
    question: "How long does it usually take to see tangible results?",
    answer:
      "Some clients see early wins within weeks (e.g. campaign engagement), while deeper, systemic, cultural or commercial partnership based innovations and impact tend to build over months. Our phased approach stays fully transparent and accountable to whatever goals are set.",
  },
  {
    question:
      "Do you offer one-off projects or only longer-term partnerships?",
    answer:
      "Both. We can pop up for a one-day design sprint, plug in as an extension of your team for a quarter, or play through as your full-service agency partner. Flexibility is core to how we work.",
  },
  {
    question:
      "How do you integrate with our internal team and existing partners?",
    answer:
      "We can happily embed ourselves to work alongside your team, partner agencies, and key stakeholders. Collaboration and co-creation is core to how we like to work.",
  },
  {
    question:
      "What makes Grounded different from other brand and sustainability agencies?",
    answer:
      "We don't just do creative, tell stories or produce content. Everything we do starts with understanding the biggest intention-action gaps and then figuring how we can close those gaps to better connect purpose to profit. Our proprietary tools like the BPP, Sustain-Agility, and Flywheel of Impact ensure sustainability drives commercial value and triple bottom line impact.",
  },
  {
    question:
      "How flexible are your services if our priorities change during a project?",
    answer:
      "Very. We build agility into every engagement. If your priorities shift mid-project, we adapt the scope, team and timeline to match — without losing momentum or strategic coherence.",
  },
  {
    question:
      "Do you work with international teams and global campaigns?",
    answer:
      "Absolutely. We've worked with brands, retailers, startups and nonprofits across multiple markets and continents. Our model is built to flex across geographies, cultures and time zones.",
  },
  {
    question:
      "Can you scope projects in phases to match different budgets and timelines?",
    answer:
      "Yes — phased scoping is one of our specialities. We can start small and scale up, letting early results build the case for continued investment and broader rollout.",
  },
];

const meta: Meta<typeof AccordionFAQ> = {
  title: "Components/AccordionFAQ",
  component: AccordionFAQ,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;
type Story = StoryObj<typeof AccordionFAQ>;

export const Default: Story = {
  args: {
    sectionTitle: "Services Overview",
    sectionSubtitle: "Frequently asked questions about how we work.",
    items: faqData,
  },
};

export const AllowMultiple: Story = {
  args: {
    sectionTitle: "Services Overview",
    items: faqData,
    allowMultiple: true,
  },
};

export const FewItems: Story = {
  args: {
    sectionTitle: "Quick Questions",
    items: faqData.slice(0, 4),
  },
};
