import HeroBanner from "@/components/components/HeroBanner";
import ServicesBento from "@/components/components/ServicesBento";

export const metadata = {
  title: "Our Services | Grounded World",
  description:
    "Everything we do is designed to move the needle culturally, socially, environmentally and behaviorally — inside and out.",
};

const services = [
  {
    name: "Research",
    color: "#00AEEF",
    icon: "MagnifyingGlass",
    tagline:
      "Assessing culture and the competitive landscape to find the intention-action gaps.",
    bullets: [
      "Culture, category, competitor and consumer landscape assessments",
      "Intent-to-action gap research and analysis",
      "Ecosystem mapping, need states, category growth drivers & go to market strategy",
    ],
    ctaHref: "/services/research",
    imageSrc: "/images/services/intention-action-gap.png",
    imageAlt: "Intention Action Gap",
  },
  {
    name: "Strategy",
    color: "#FFA603",
    icon: "Compass",
    tagline:
      "Connecting the \u2018why\u2019 of purpose to the \u2018way\u2019 of profit to tell your sustainability story and drive innovation.",
    bullets: [
      "Corporate, brand and social purpose articulation",
      "Sustainability strategy, marketing, corporate narrative, storytelling and innovation sprints",
      "Brand positioning architecture & archetyping",
    ],
    ctaHref: "/services/strategy",
    imageSrc: "/images/services/sustain-agility.png",
    imageAlt: "Sustain-Agility",
  },
  {
    name: "Activation",
    color: "#FF08CC",
    icon: "Lightning",
    tagline:
      "Driving behavior change and intent at the moments that matter for colleagues, customers and consumers.",
    bullets: [
      "Brand identity, packaging, websites & design",
      "Content, video, advertising, campaigns, events and experiences",
      "Commerce (customer journeys, selling stories, brand and retail activation and tactical toolkits)",
    ],
    ctaHref: "/services/activation",
    imageSrc: "/images/services/brand-activation-for-good.png",
    imageAlt: "Brand Activation For Good",
  },
  {
    name: "Impact",
    color: "#1CC35B",
    icon: "ChartLineUp",
    tagline:
      "Measuring impact, reporting on progress sparking engagement and facilitating collaboration and partnerships at scale.",
    bullets: [
      "Sustainability & impact reporting",
      "Commercial, non-profit and pre-competitive partnerships",
      "Collaboration training, action labs, design sprints, speaking engagements and thought leadership",
    ],
    ctaHref: "/services/impact",
    imageSrc: "/images/services/flywheel-of-impact.png",
    imageAlt: "Flywheel of Impact",
  },
];

export default function ServicesPage() {
  return (
    <>
      <HeroBanner
        backgroundType="vimeo"
        vimeoUrl="https://vimeo.com/1001182645/7bc8093073"
        title="Our Services"
        subtitle="Everything we do is designed to move the needle culturally, socially, environmentally and behaviorally — inside and out. So whether you need to find your biggest intention-action gaps, foster multi-stakeholder collaboration and partnerships, tell your story or commercialize sustainability to generate an ROI — we can help you articulate purpose, activate your brands and accelerate your impact."
        ctaLabel="Discovery Call"
        ctaHref="/contact"
        ctaVariant="solid"
        overlayOpacity="medium"
        contentAlign="center"
        minHeight="full"
      />
      <ServicesBento services={services} />
    </>
  );
}
