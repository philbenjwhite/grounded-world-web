import HeroBanner from "@/components/components/HeroBanner";
import Heading from "@/components/atoms/Heading";
import FadeIn from "@/components/utils/FadeIn";
import ServicesBento from "@/components/components/ServicesBento";
import EngagementModels from "@/components/components/EngagementModels";

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
        backgroundType="canvas"
        title="Our Services"
        subtitle="Everything we do is designed to move the needle culturally, socially, environmentally and behaviorally — inside and out. So whether you need to find your biggest intention-action gaps, foster multi-stakeholder collaboration and partnerships, tell your story or commercialize sustainability to generate an ROI — we can help you articulate purpose, activate your brands and accelerate your impact."
        ctaLabel="Discovery Call"
        ctaHref="/contact"
        ctaVariant="solid"
        overlayOpacity="light"
        contentAlign="center"
        minHeight="full"
      />

      {/* Section heading — pulled up into the hero fade zone */}
      <FadeIn className="relative z-10 -mt-16 md:-mt-20 text-center">
        <Heading level={2} size="h3" className="text-white">
          How We Move the Needle
        </Heading>
      </FadeIn>

      <ServicesBento services={services} />

      <EngagementModels
        models={[
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
        ]}
      />
    </>
  );
}
