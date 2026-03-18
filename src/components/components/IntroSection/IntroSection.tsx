"use client";

import React from "react";
import Image from "next/image";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import Split from "../../layout/Split";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface IntroSectionProps {
  heading: string;
  paragraphs: string[];
  /** Optional image shown on the right (switches to Split layout, left-justified text) */
  imageSrc?: string;
  imageAlt?: string;
}

const IntroSection: React.FC<IntroSectionProps> = ({
  heading,
  paragraphs,
  imageSrc,
  imageAlt = "",
}) => {
  const ref = useScrollReveal();

  if (imageSrc) {
    return (
      <Section>
        <Container className="px-[var(--layout-section-padding-x)]">
          <div ref={ref} className="reveal-fade">
            <Split
              ratio="60/40"
              gap="xl"
              align="center"
              left={
                <div>
                  <Heading level={2} size="h2" color="primary">
                    {heading}
                  </Heading>
                  <div className="mt-8 flex flex-col gap-6">
                    {paragraphs.map((text, i) => (
                      <Text key={i} size="body-lg" color="secondary">
                        {text}
                      </Text>
                    ))}
                  </div>
                </div>
              }
              right={
                <div className="relative aspect-square w-full max-w-[400px] mx-auto rounded-2xl overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              }
            />
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="px-[var(--layout-section-padding-x)]">
        <div ref={ref} className="reveal-fade max-w-3xl mx-auto text-center">
          {heading && (
            <Heading level={2} size="h2" color="primary">
              {heading}
            </Heading>
          )}
          <div className={`flex flex-col gap-6 ${heading ? "mt-8" : ""}`}>
            {paragraphs.map((text, i) => (
              <Text key={i} size="body-lg" color="secondary">
                {text}
              </Text>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default IntroSection;
