import type { Metadata } from "next";
import Image from "next/image";
import HeroBanner from "@/components/components/HeroBanner";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import CTABanner from "@/components/components/CTABanner";

export const metadata: Metadata = {
  title: "It Shouldn't Be This Hard Podcast | Grounded World",
  description:
    "The podcast for people who know that responsible business is messy, meaningful, and probably much harder than it should be.",
};

const LISTEN_PLATFORMS = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/5BFuPMuBbLqKDmq3sGqU3p",
  },
  {
    label: "Apple Podcasts",
    href: "https://podcasts.apple.com/us/podcast/it-shouldnt-be-this-hard/id1711519345",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@groundedworld",
  },
];

const GUEST_SCENARIOS = [
  {
    title: "Built It",
    body: "You founded a purpose-driven business, scaled it through the messy middle, and have the scars (and wisdom) to prove it.",
  },
  {
    title: "Pushing for Change",
    body: "You're a corporate change-maker navigating legacy systems, internal politics, and the tension between profit and purpose.",
  },
  {
    title: "Lived It",
    body: "Your personal story demonstrates why this work matters — and the urgency of getting it right.",
  },
];

export default function ItShouldntBeThisHardPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroBanner
        backgroundType="canvas"
        title="It Shouldn't Be This Hard"
        subtitle="The podcast for people who know that responsible business is messy, meaningful, and probably much harder than it should be."
        minHeight="condensed"
        overlayOpacity="light"
        contentAlign="center"
      />

      {/* ── About the Podcast ────────────────────────────── */}
      <Section>
        <Container className="px-[var(--layout-section-padding-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Cover art */}
            <div className="relative rounded-3xl overflow-hidden aspect-square max-w-md mx-auto lg:mx-0">
              <Image
                src="/images/resources-podcast-cover.jpg"
                alt="It Shouldn't Be This Hard podcast cover"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-6">
              <Heading level={2} size="h2" color="primary">
                Honest conversations most people avoid
              </Heading>
              <Text size="body-lg" color="secondary" className="leading-relaxed">
                In each episode, Grounded co-founders Heidi Schoeneck and Phil
                White sit down with founders, corporate change-makers,
                sustainability leaders, social entrepreneurs, and thought
                leaders.
              </Text>
              <Text size="body-md" color="secondary" className="leading-relaxed">
                Together they explore impact, climate action, storytelling, and
                the systemic barriers that frustrate real progress — drawing on
                perspectives from behavioral science to spirituality.
              </Text>

              {/* Platform links */}
              <div className="flex flex-wrap gap-4 pt-2">
                {LISTEN_PLATFORMS.map((platform) => (
                  <Button
                    key={platform.label}
                    href={platform.href}
                    variant={platform.label === "Spotify" ? "primary" : "secondary"}
                    target="_blank"
                  >
                    {platform.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Apply to Be a Guest ──────────────────────────── */}
      <Section>
        <Container className="px-[var(--layout-section-padding-x)] max-w-[960px]">
          <div className="text-center mb-12 md:mb-16">
            <Heading level={2} size="h2" color="primary" className="mb-4">
              Apply to Be a Guest
            </Heading>
            <Text size="body-lg" color="secondary" className="max-w-2xl mx-auto leading-relaxed">
              Maybe you&apos;ve been there. You took the leap. You built the
              business. You challenged the status quo. And you&apos;ve got the
              scars — and wisdom — to prove it.
            </Text>
          </div>

          {/* Scenario cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:mb-16">
            {GUEST_SCENARIOS.map((scenario) => (
              <div
                key={scenario.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8"
              >
                <Heading level={3} size="h4" color="primary" className="mb-3">
                  {scenario.title}
                </Heading>
                <Text size="body-sm" color="secondary" className="leading-relaxed">
                  {scenario.body}
                </Text>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Text size="body-md" color="secondary" className="mb-6 leading-relaxed">
              We want your war stories, your wisdom, and your wipe-outs. If that
              sounds like you, we&apos;d love to hear from you.
            </Text>
            <Button
              href="mailto:podcast@grounded.world?subject=Guest Application — It Shouldn't Be This Hard"
              variant="primary"
            >
              Get in Touch
            </Button>
          </div>
        </Container>
      </Section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <CTABanner
        backgroundSrc="/images/services/banner-bg.jpg"
        heading="It's time to get grounded"
        subtext="Ready to activate your brand purpose and accelerate your impact? Let's talk."
        primaryLabel="Contact Us"
        primaryHref="/contact"
        overlayOpacity="heavy"
      />
    </>
  );
}
