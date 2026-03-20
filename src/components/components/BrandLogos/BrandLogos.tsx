"use client";

import React from "react";
import Image from "next/image";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";

export interface BrandLogoItem {
  logoSrc: string;
  logoAlt: string;
  intro: string;
  quote: string;
}

export interface BrandLogosProps {
  heading?: string;
  subtitle?: string;
  items: BrandLogoItem[];
  callout?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const BrandLogos: React.FC<BrandLogosProps> = ({
  heading,
  subtitle,
  items,
  callout,
  ctaLabel,
  ctaHref,
}) => {
  return (
    <Section>
      <Container className="px-[var(--layout-section-padding-x)]">
        {heading && (
          <div className="mb-10 md:mb-14">
            <Heading level={2} size="h2" color="primary" className="mb-3">
              {heading}
            </Heading>
            {subtitle && (
              <Text size="body-lg" color="secondary" className="max-w-3xl leading-relaxed">
                {subtitle}
              </Text>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-10 lg:gap-8 items-center">
          {items.map((item) => (
            <div key={item.logoAlt} className="flex flex-col items-center text-center gap-5">
              <div className="h-24 flex items-center justify-center">
                <Image
                  src={item.logoSrc}
                  alt={item.logoAlt}
                  width={120}
                  height={96}
                  className="max-h-24 w-auto object-contain opacity-90"
                />
              </div>
              <div>
                <Text size="body-md" color="primary" className="font-medium mb-2">
                  {item.intro}
                </Text>
                <Text size="body-md" color="secondary" className="italic">
                  &ldquo;{item.quote}&rdquo;
                </Text>
              </div>
            </div>
          ))}

          {(callout || ctaLabel) && (
            <div className="flex flex-col items-center lg:items-start gap-5 sm:col-span-2 lg:col-span-1">
              {callout && (
                <Text size="body-lg" color="primary" className="font-bold text-center lg:text-left max-w-[240px]">
                  {callout}
                </Text>
              )}
              {ctaLabel && ctaHref && (
                <Button href={ctaHref} variant="secondary">
                  {ctaLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

export default BrandLogos;
