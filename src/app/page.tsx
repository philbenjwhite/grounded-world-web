import VideoHero from "@/components/components/VideoHero";
import LogoCarousel from "@/components/components/LogoCarousel";
import type { LogoItem } from "@/components/components/LogoCarousel";
import IntroSection from "@/components/components/IntroSection";
import ExpandingCardPanel from "@/components/components/ExpandingCardPanel";
import type { ExpandingCardItem } from "@/components/components/ExpandingCardPanel";
import homeData from "../../content/pages/home.json";

const services: ExpandingCardItem[] = [
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

/* Extract logo carousel data from TinaCMS home.json */
const logoSection = homeData.sections.find(
  (s) => s._template === "logoCarousel",
);
const logos: LogoItem[] | undefined = logoSection?.logos?.filter(
  (l): l is LogoItem => Boolean(l?.src && l?.alt),
);
const logoSpeed = logoSection?.speed ?? undefined;

export default function Home() {
  return (
    <>
      <div className="h-[calc(100dvh-56px)]">
        <VideoHero />
      </div>

      <LogoCarousel logos={logos} speed={logoSpeed} />

      <IntroSection
        heading="Get Grounded"
        paragraphs={[
          "Grounded is a multi-award-winning, B Corp certified brand activation agency \u2014 thriving at the intersection of brand experience, commercial innovation, sustainability and social impact.",
          "We work with brands, retailers, startups and nonprofits all over the world \u2014 helping them transform purpose into profit, commercialize sustainability and drive behavior change at scale.",
          "No hushing. No Washing. No tweaking around the edges.",
        ]}
      />

      <ExpandingCardPanel items={services} />
    </>
  );
}
