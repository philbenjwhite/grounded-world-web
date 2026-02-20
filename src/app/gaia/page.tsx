import type { Metadata } from "next";
import HeroBanner from "@/components/components/HeroBanner";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";

export const metadata: Metadata = {
  title: "Ask Gaia | Grounded World",
  description:
    "Meet Gaia, Grounded's AI-powered sustainability expert. Ask questions about brand purpose, sustainability strategy, marketing, and more.",
};

export default function GaiaPage() {
  return (
    <>
      <HeroBanner
        backgroundType="canvas"
        title="Ask Gaia"
        subtitle="Your AI-powered sustainability and purpose-driven marketing expert. Ask anything about brand purpose, sustainability strategy, impact reporting, and more."
        overlayOpacity="heavy"
        contentAlign="center"
        minHeight="condensed"
      />

      <Section className="py-16 md:py-24">
        <Container className="px-[var(--layout-section-padding-x)]">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Heading level={2} size="h3" color="primary">
              How can Gaia help you?
            </Heading>
            <Text size="body-lg" color="secondary" className="mt-4">
              Gaia is trained on Grounded&apos;s expertise in sustainability
              marketing, brand purpose activation, and social impact strategy.
              Whether you&apos;re exploring circular economy principles,
              crafting a sustainability narrative, or looking for insights on
              purpose-driven marketing &mdash; Gaia is here to help.
            </Text>
          </div>

          {/* Chatbot embed placeholder */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] min-h-[600px] flex items-center justify-center">
              <div className="text-center px-6 py-12">
                <div className="w-16 h-16 rounded-full bg-[var(--color-cyan)]/20 flex items-center justify-center mx-auto mb-6">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-cyan)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <Heading level={3} size="h4" color="primary">
                  Gaia Chatbot
                </Heading>
                <Text size="body-sm" color="tertiary" className="mt-2 max-w-md mx-auto">
                  The Gaia AI assistant will be embedded here. Replace this
                  placeholder with the chatbot iframe or widget script.
                </Text>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
