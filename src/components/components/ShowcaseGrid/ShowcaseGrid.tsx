"use client";

import React from "react";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import Grid from "../../layout/Grid";
import GaiaTypingBubble from "../GaiaTypingBubble";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./ShowcaseGrid.module.css";

/* ─── Types ──────────────────────────────────────────── */

export interface ShowcaseGridItem {
  /** Card title (e.g., "Pop Up") */
  title: string;
  /** Descriptive paragraph */
  description: string;
  /** Path/URL to the tile image (optional for text-only cards) */
  imageSrc?: string;
  /** Alt text for the image */
  imageAlt?: string;
  /** Hex color for the hover glow (e.g., "#00AEEF") */
  glowColor?: string;
  /** Optional link destination */
  href?: string;
}

export interface ShowcaseGridProps {
  /** Section title — default: "Flexible, Fluid & Fearless." */
  sectionTitle?: string;
  /** Section subtitle — default: "Choose how we work together." */
  sectionSubtitle?: string;
  /** Array of showcase items */
  items: ShowcaseGridItem[];
  /** Number of columns (2, 3, or 4). Default 3 */
  columns?: 2 | 3 | 4;
  /** Card layout variant — "overlay" pins text over the image, "stacked" puts text below */
  variant?: "overlay" | "stacked";
  /** Section background variant */
  sectionVariant?: "default" | "alt" | "dark";
}

/* ─── Component ──────────────────────────────────────── */

const ShowcaseGrid: React.FC<ShowcaseGridProps> = ({
  sectionTitle = "Flexible, Fluid & Fearless.",
  sectionSubtitle = "Choose how we work together.",
  items,
  columns = 3,
  variant = "overlay",
  sectionVariant = "default",
}) => {
  const gridRef = useScrollReveal();

  return (
    <Section className="py-12 md:py-16 lg:py-20" variant={sectionVariant}>
      <Container className="px-[var(--layout-section-padding-x)]">
        {/* Section header */}
        {(sectionTitle || sectionSubtitle) && (
          <div className="mb-10 md:mb-14 text-center">
            {sectionTitle && (
              <Heading level={2} size="h2" color="primary">
                {sectionTitle}
              </Heading>
            )}
            {sectionSubtitle && (
              <Text size="body-lg" color="secondary" className="mt-3">
                {sectionSubtitle}
              </Text>
            )}
          </div>
        )}

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
            <Grid cols={columns} colsTablet={2} gap="lg" className="relative z-10">
              {items.map((item, index) => {
                const cardStyle = {
                  "--item-color": item.glowColor ?? "#ffffff",
                  "--reveal-delay": `${0.1 + index * 0.15}s`,
                } as React.CSSProperties;

                if (variant === "stacked") {
                  /* Plain text block — no card chrome */
                  if (!item.imageSrc && !item.href) {
                    return (
                      <div key={item.title || index} className="reveal-card flex flex-col h-full" style={cardStyle}>
                        {item.title && (
                          <Heading level={3} size="h4" color="primary" className="mb-3">
                            {item.title}
                          </Heading>
                        )}
                        {item.description && item.glowColor !== "gaia" && (
                          <Text size="body-md" color="secondary" className="leading-relaxed whitespace-pre-line">
                            {item.description}
                          </Text>
                        )}
                        {item.glowColor === "gaia" && item.description && (
                          <div className="mt-4">
                            <GaiaTypingBubble text={item.description} />
                          </div>
                        )}
                      </div>
                    );
                  }

                  /* Image + Gaia typing bubble — no card chrome */
                  if (item.imageSrc && item.glowColor === "gaia") {
                    return (
                      <div key={item.imageAlt || index} className="reveal-card flex flex-col gap-4 h-full items-center lg:items-stretch" style={cardStyle}>
                        <div className="relative w-1/2 lg:w-full aspect-[3/4] overflow-hidden rounded-2xl">
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt ?? ""}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        {item.description && (
                          <GaiaTypingBubble text={item.description} />
                        )}
                      </div>
                    );
                  }

                  /* Image-only block — no card chrome */
                  if (item.imageSrc && !item.title && !item.description) {
                    return (
                      <div key={item.imageAlt || index} className="reveal-card flex items-start justify-center lg:justify-stretch h-full" style={cardStyle}>
                        <div className="relative w-1/2 lg:w-full aspect-[3/4] overflow-hidden rounded-2xl">
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt ?? ""}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                      </div>
                    );
                  }

                  const card = (
                    <div
                      className={cn(
                        "reveal-card",
                        styles.card,
                        "group relative rounded-3xl border border-white/[0.06]",
                        "overflow-hidden flex flex-col h-full",
                        "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                        "hover:-translate-y-1 hover:border-white/[0.15]"
                      )}
                      style={cardStyle}
                    >
                      {item.imageSrc ? (
                        <div className="relative aspect-[16/9] overflow-hidden bg-black flex items-center justify-center">
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt ?? ""}
                            fill
                            className="object-contain p-8 md:p-10 transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        </div>
                      ) : null}
                      <div className={cn("p-6 xl:p-8 flex flex-col flex-1", !item.imageSrc && "justify-center")}>
                        <Heading level={3} size="h4" color="primary" className={cn("mb-2", !item.imageSrc && "!text-[color:var(--color-cyan)]")}>
                          {item.title}
                        </Heading>
                        <Text size="body-md" color="secondary" className="mb-6 leading-relaxed flex-1">
                          {item.description}
                        </Text>
                        {item.href && (
                          <div>
                            <Button variant={item.imageSrc ? "secondary" : "outline"} className="pointer-events-none">
                              {item.imageSrc ? "Learn More" : "GET STARTED"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <Link key={item.title} href={item.href} className="no-underline block h-full">
                      {card}
                    </Link>
                  ) : (
                    <div key={item.title}>{card}</div>
                  );
                }

                return (
                  <div
                    key={item.title}
                    className={cn(
                      "reveal-card",
                      styles.card,
                      "group relative rounded-3xl border border-white/[0.06]",
                      "overflow-hidden",
                      "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      "hover:-translate-y-1 hover:border-white/[0.15]"
                    )}
                    style={cardStyle}
                  >
                    <div className="relative aspect-[4/3] md:aspect-[5/4]">
                      <Image
                        src={item.imageSrc!}
                        alt={item.imageAlt ?? ""}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div
                        className={cn(
                          "absolute inset-x-0 bottom-0 h-3/4 pointer-events-none",
                          styles.scrim
                        )}
                      />
                      <div
                        className={cn(
                          styles.cardGlow,
                          "absolute inset-0 pointer-events-none"
                        )}
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-10 p-6 xl:p-8">
                      <h3
                        className={cn(
                          styles.cardTitle,
                          "text-2xl xl:text-3xl font-bold mb-2"
                        )}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {item.description}
                      </p>
                      {item.href && (
                        <a
                          href={item.href}
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
                );
              })}
            </Grid>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ShowcaseGrid;
