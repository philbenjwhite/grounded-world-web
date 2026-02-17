"use client";

import React from "react";
import { iconMap } from "@/lib/iconMap";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import Grid from "../../layout/Grid";
import FadeIn from "../../utils/FadeIn";
import SectionLabel from "../../atoms/SectionLabel";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";

export interface FeatureCardItem {
  icon?: string;
  color: string;
  title: string;
  body: string;
}

export interface FeatureCardsProps {
  sectionLabel?: string;
  heading?: string;
  columns?: number;
  items: FeatureCardItem[];
}

const FeatureCards: React.FC<FeatureCardsProps> = ({
  sectionLabel,
  heading,
  columns = 3,
  items,
}) => {
  return (
    <Section className="!py-16 md:!py-24 lg:!py-32">
      <Container className="px-[var(--layout-section-padding-x)]">
        {(sectionLabel || heading) && (
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              {sectionLabel && (
                <SectionLabel className="mb-4">{sectionLabel}</SectionLabel>
              )}
              {heading && (
                <Heading level={2} size="h2" color="primary">
                  {heading}
                </Heading>
              )}
            </div>
          </FadeIn>
        )}

        <Grid cols={columns as 1 | 2 | 3 | 4} colsTablet={1} gap="lg">
          {items.map((item, i) => {
            const IconComponent = item.icon ? iconMap[item.icon] : undefined;
            return (
              <FadeIn key={item.title}>
                <div
                  className="work-card-hover rounded-3xl bg-white/[0.025] backdrop-blur-xl p-8 md:p-10 h-full overflow-hidden"
                  style={
                    {
                      "--item-color": item.color,
                      "--glow-color": item.color,
                      "--comp-work-card-stroke": `color-mix(in srgb, ${item.color} 25%, transparent)`,
                      "--reveal-delay": `${0.1 + i * 0.12}s`,
                      border: `1px solid color-mix(in srgb, ${item.color} 12%, transparent)`,
                    } as React.CSSProperties
                  }
                >
                  <div className="work-card-glow" />
                  {IconComponent && (
                    <IconComponent
                      size={28}
                      weight="duotone"
                      className="mb-5 text-[color:var(--item-color)]"
                    />
                  )}
                  <Heading
                    level={3}
                    size="h4"
                    color="primary"
                    className="mb-4"
                  >
                    {item.title}
                  </Heading>
                  <Text size="body-md" color="secondary">
                    {item.body}
                  </Text>
                </div>
              </FadeIn>
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
};

export default FeatureCards;
