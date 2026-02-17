"use client";

import React from "react";
import cn from "classnames";
import Image from "next/image";
import Heading from "../../atoms/Heading";
import Button from "../../atoms/Button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface CTABannerProps {
  /** Background image URL/path */
  backgroundSrc: string;
  /** Alt text for background image */
  backgroundAlt?: string;
  /** Main headline */
  heading: string;
  /** Primary CTA button text */
  primaryLabel: string;
  /** Primary CTA link destination */
  primaryHref: string;
  /** Secondary CTA button text */
  secondaryLabel?: string;
  /** Secondary CTA link destination */
  secondaryHref?: string;
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
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  overlayOpacity = "medium",
  className,
}) => {
  const ref = useScrollReveal<HTMLElement>(0.15);

  return (
    <section
      ref={ref}
      className={cn("reveal-fade", className)}
    >
      <div className="relative overflow-hidden rounded-3xl min-h-[40vh] md:min-h-[50vh]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundSrc}
            alt={backgroundAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1440px"
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

          <div className="mt-8 md:mt-10 flex flex-wrap gap-4 justify-center">
            <Button
              href={primaryHref}
              variant="primary"
            >
              {primaryLabel}
            </Button>
            {secondaryLabel && secondaryHref && (
              <Button
                href={secondaryHref}
                variant="secondary"
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
