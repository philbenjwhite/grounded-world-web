"use client";

import React from "react";
import cn from "classnames";
import NextImage from "next/image";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import Text from "../../atoms/Text";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface TestimonialSectionProps {
  quote: string;
  author?: string;
  role?: string;
  company?: string;
  rating?: number;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className={cn(
            "stroke-[1.5]",
            i < count
              ? "fill-[var(--color-gold)] stroke-[var(--color-gold)]"
              : "fill-none stroke-[var(--color-gray-4)]",
          )}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26 5.06 16.7l.94-5.49-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  quote,
  author,
  role,
  company,
  rating,
  imageSrc,
  imageAlt,
  className,
}) => {
  const ref = useScrollReveal();

  return (
    <Section className={className}>
      <Container className="px-[var(--layout-section-padding-x)]">
        <div
          ref={ref}
          className="reveal-fade grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center"
        >
          {/* Quote content */}
          <div className="flex flex-col gap-6">
            {rating != null && <StarRating count={rating} />}

            <blockquote>
              <p className="text-[length:var(--font-size-h3)] leading-[1.25] text-[color:var(--font-color-primary)] font-normal">
                &ldquo;{quote}&rdquo;
              </p>
            </blockquote>

            {(author || role || company) && (
              <footer className="flex flex-col gap-1">
                {author && (
                  <Text size="body-lg" color="primary" as="span" className="font-semibold">
                    {author}
                  </Text>
                )}
                {(role || company) && (
                  <Text size="body-md" color="secondary" as="span">
                    {[role, company].filter(Boolean).join(", ")}
                  </Text>
                )}
              </footer>
            )}
          </div>

          {/* Optional image */}
          {imageSrc && (
            <div className="relative w-full lg:w-70 aspect-square rounded-2xl overflow-hidden shrink-0">
              <NextImage
                src={imageSrc}
                alt={imageAlt ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 280px"
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

export default TestimonialSection;
