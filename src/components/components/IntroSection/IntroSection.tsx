"use client";

import React from "react";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface IntroSectionProps {
  heading: string;
  paragraphs: string[];
}

const IntroSection: React.FC<IntroSectionProps> = ({
  heading,
  paragraphs,
}) => {
  const ref = useScrollReveal();

  return (
    <Section>
      <Container className="px-[var(--layout-section-padding-x)]">
        <div ref={ref} className="reveal-fade max-w-3xl mx-auto text-center">
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
      </Container>
    </Section>
  );
};

export default IntroSection;
