"use client";

import React from "react";
import cn from "classnames";
import Image from "next/image";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import Grid from "../../layout/Grid";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./EngagementModels.module.css";

/* ─── Types ──────────────────────────────────────────── */

export interface EngagementModel {
  /** Card title (e.g., "Pop Up") */
  title: string;
  /** Descriptive paragraph */
  description: string;
  /** Path/URL to the tile image */
  imageSrc: string;
  /** Alt text for the image */
  imageAlt: string;
  /** Hex color for the hover glow (e.g., "#00AEEF") */
  glowColor?: string;
  /** Optional link destination */
  href?: string;
}

export interface EngagementModelsProps {
  /** Section title — default: "Flexible, Fluid & Fearless." */
  sectionTitle?: string;
  /** Section subtitle — default: "Choose how we work together." */
  sectionSubtitle?: string;
  /** Array of engagement models */
  models: EngagementModel[];
}

/* ─── Component ──────────────────────────────────────── */

const EngagementModels: React.FC<EngagementModelsProps> = ({
  sectionTitle = "Flexible, Fluid & Fearless.",
  sectionSubtitle = "Choose how we work together.",
  models,
}) => {
  const gridRef = useScrollReveal();

  return (
    <Section className="py-16 md:py-24 lg:py-32">
      <Container className="px-[var(--layout-section-padding-x)]">
        {/* Section header */}
        <div className="mb-10 md:mb-14 text-center">
          <Heading level={2} size="h2" color="primary">
            {sectionTitle}
          </Heading>
          {sectionSubtitle && (
            <Text size="body-lg" color="secondary" className="mt-3">
              {sectionSubtitle}
            </Text>
          )}
        </div>

        {/* Ambient glow behind cards */}
        <div className="relative">
          <div
            className={cn(
              "absolute inset-0 -inset-x-8 -inset-y-12 pointer-events-none",
              styles.ambientGlow
            )}
          />

          {/* Card grid */}
          <div ref={gridRef}>
            <Grid cols={3} colsTablet={2} gap="lg" className="relative z-10">
              {models.map((model, index) => (
                <div
                  key={model.title}
                  className={cn(
                    "reveal-card",
                    styles.card,
                    "group relative rounded-3xl border border-white/[0.06]",
                    "overflow-hidden",
                    "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    "hover:-translate-y-1 hover:border-white/[0.15]"
                  )}
                  style={
                    {
                      "--model-color": model.glowColor ?? "#ffffff",
                      "--reveal-delay": `${0.1 + index * 0.15}s`,
                    } as React.CSSProperties
                  }
                >
                  {/* Full-bleed image */}
                  <div className="relative aspect-[4/5] md:aspect-[3/4]">
                    <Image
                      src={model.imageSrc}
                      alt={model.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Bottom gradient scrim — colored glow fade */}
                    <div
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-3/4 pointer-events-none",
                        styles.scrim
                      )}
                    />

                    {/* Hover glow overlay */}
                    <div
                      className={cn(
                        styles.cardGlow,
                        "absolute inset-0 pointer-events-none"
                      )}
                    />
                  </div>

                  {/* Content overlay — pinned to bottom */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-6 xl:p-8">
                    <h3
                      className={cn(
                        styles.cardTitle,
                        "text-2xl xl:text-3xl font-bold mb-2"
                      )}
                    >
                      {model.title}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {model.description}
                    </p>
                    {model.href && (
                      <a
                        href={model.href}
                        className={cn(
                          styles.cardLink,
                          "mt-4 text-sm font-medium inline-flex items-center gap-1",
                          "transition-opacity duration-300 opacity-60 hover:opacity-100"
                        )}
                      >
                        Learn more
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </Grid>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default EngagementModels;
