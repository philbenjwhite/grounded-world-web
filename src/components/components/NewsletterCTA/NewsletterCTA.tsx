"use client";

import React, { useState } from "react";
import cn from "classnames";
import Image from "next/image";
import { EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import NewsletterModal from "../NewsletterModal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface NewsletterCTAProps {
  /** Background image URL/path */
  backgroundSrc: string;
  /** Alt text for background image */
  backgroundAlt?: string;
  /** Main headline */
  heading?: string;
  /** Supporting text below the heading */
  subtext?: string;
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

const NewsletterCTA: React.FC<NewsletterCTAProps> = ({
  backgroundSrc,
  backgroundAlt = "",
  heading = "Stay Grounded",
  subtext = "Sign up to receive insights, updates, and stories from the front lines of purpose-driven brands.",
  overlayOpacity = "heavy",
  className,
}) => {
  const ref = useScrollReveal<HTMLElement>(0.15);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        ref={ref}
        className={cn(
          "reveal-fade px-4 md:px-6 lg:px-8 pb-16 md:pb-24",
          className,
        )}
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
              overlayClasses[overlayOpacity],
            )}
          />

          {/* Content */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 lg:py-32 min-h-[40vh] md:min-h-[50vh]">
            {/* Envelope icon */}
            <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/[0.12] backdrop-blur-sm">
              <EnvelopeSimple
                size={28}
                weight="duotone"
                className="text-[var(--color-cyan)]"
              />
            </div>

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

            {/* Email capture row */}
            <div className="mt-8 md:mt-10 w-full max-w-md">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="group w-full flex items-center gap-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.15] hover:border-white/[0.25] rounded-full pl-5 pr-2 py-2 transition-colors cursor-pointer"
              >
                <EnvelopeSimple
                  size={20}
                  weight="regular"
                  className="text-white/40 shrink-0"
                />
                <span className="flex-1 text-left text-sm text-white/40">
                  Enter your email
                </span>
                <span className="flex items-center gap-2 bg-[var(--color-magenta)] hover:bg-[color-mix(in_srgb,var(--color-magenta)_85%,white)] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                  Subscribe
                  <PaperPlaneTilt
                    size={16}
                    weight="bold"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </button>

              <Text
                size="body-sm"
                color="tertiary"
                className="mt-3 opacity-60"
              >
                No spam, ever. Unsubscribe anytime.
              </Text>
            </div>
          </div>
        </div>
      </section>

      <NewsletterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default NewsletterCTA;
