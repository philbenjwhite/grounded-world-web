"use client";

import React from "react";
import cn from "classnames";
import Image from "next/image";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface CTABannerProps {
  /** Background image URL/path */
  backgroundSrc: string;
  /** Alt text for background image */
  backgroundAlt?: string;
  /** Main headline */
  heading: string;
  /** Optional supporting text shown below the heading */
  subtext?: string;
  /** Primary CTA button text */
  primaryLabel: string;
  /** Primary CTA link destination */
  primaryHref: string;
  /** Open primary link in a new tab */
  primaryExternal?: boolean;
  /** Secondary CTA button text (omit to show only one button) */
  secondaryLabel?: string;
  /** Secondary CTA link destination */
  secondaryHref?: string;
  /** Open secondary link in a new tab */
  secondaryExternal?: boolean;
  /** Dark overlay intensity */
  overlayOpacity?: "light" | "medium" | "heavy";
  /** Optional className */
  className?: string;
}

const overlayClasses: Record<string, string> = {
  light: "bg-black/40",
  medium: "bg-black/55",
  heavy: "bg-black/70",
};

const CTABanner: React.FC<CTABannerProps> = ({
  backgroundSrc,
  backgroundAlt = "",
  heading,
  subtext,
  primaryLabel,
  primaryHref,
  primaryExternal = false,
  secondaryLabel,
  secondaryHref,
  secondaryExternal = false,
  overlayOpacity = "medium",
  className,
}) => {
  const ref = useScrollReveal<HTMLElement>(0.15);
  const hasSecondary = !!(secondaryLabel && secondaryHref);

  return (
    <section
      ref={ref}
      className={cn("reveal-fade px-4 md:px-6 lg:px-8 pb-16 md:pb-24", className)}
    >
      <div className="relative overflow-hidden rounded-3xl min-h-[40vh] md:min-h-[50vh]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundSrc}
            alt={backgroundAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
        </div>

        {/* Dark overlay */}
        <div
          className={cn(
            "absolute inset-0 z-10",
            overlayClasses[overlayOpacity]
          )}
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 lg:py-32 min-h-[40vh] md:min-h-[50vh]">
          <Heading level={2} size="h2" color="primary">
            {heading}
          </Heading>

          {subtext && (
            <Text
              size="body-lg"
              color="secondary"
              className="mt-4 max-w-xl leading-relaxed"
            >
              {subtext}
            </Text>
          )}

          <div className="mt-8 md:mt-10 flex flex-wrap gap-4 justify-center">
            <Button
              href={primaryHref}
              variant="primary"
              target={primaryExternal ? "_blank" : undefined}
            >
              {primaryLabel}
            </Button>
            {hasSecondary && (
              <Button
                href={secondaryHref}
                variant="secondary"
                target={secondaryExternal ? "_blank" : undefined}
              >
                {secondaryLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
