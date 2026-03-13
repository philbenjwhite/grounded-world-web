"use client";

import React, { useState } from "react";
import cn from "classnames";
import Image from "next/image";
import { iconMap } from "@/lib/iconMap";
import Button from "../../atoms/Button";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./ExpandingCardPanel.module.css";

/* ─── Types ──────────────────────────────────────────── */

export interface ExpandingCardItem {
  /** Card name (e.g., "Research") */
  name: string;
  /** Brand color as hex (e.g., "#00AEEF") */
  color: string;
  /** Phosphor icon name (e.g. "MagnifyingGlass", "Compass") */
  icon?: string;
  /** Bold one-liner description */
  tagline: string;
  /** Bullet points */
  bullets: string[];
  /** CTA link destination */
  ctaHref: string;
  /** CTA text override (default: "Find Out More") */
  ctaLabel?: string;
  /** Optional image src shown in expanded view */
  imageSrc?: string;
  /** Alt text for the image */
  imageAlt?: string;
}

export interface ExpandingCardPanelProps {
  /** Optional heading above the grid */
  sectionTitle?: string;
  /** Optional intro text */
  sectionSubtitle?: string;
  /** Array of card items */
  items: ExpandingCardItem[];
  /** Which card is expanded on load */
  defaultActiveIndex?: number;
  /**
   * "full" (default) — renders Section/Container + desktop expanding grid + mobile accordion.
   * "accordion-only" — renders just the accordion list with no wrapper, for embedding in custom layouts.
   */
  renderMode?: "full" | "accordion-only";
}

/* ─── Component ──────────────────────────────────────── */

const ExpandingCardPanel: React.FC<ExpandingCardPanelProps> = ({
  sectionTitle,
  sectionSubtitle,
  items,
  defaultActiveIndex,
  renderMode = "full",
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    defaultActiveIndex ?? (renderMode === "accordion-only" ? null : 0)
  );
  const gridRef = useScrollReveal();
  const mobileRef = useScrollReveal();
  const headingRef = useScrollReveal(0.3);

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  /* CSS variable bag — only dynamic custom props, no visual inline styles */
  const cardVars = (color: string, index: number) =>
    ({
      "--item-color": color,
      "--reveal-delay": `${0.1 + index * 0.12}s`,
    }) as React.CSSProperties;

  const mobileCardVars = (color: string, index: number) =>
    ({
      "--item-color": color,
      "--reveal-delay": `${0.1 + index * 0.1}s`,
    }) as React.CSSProperties;

  /* ── Accordion-only mode: just the list, no wrapper ── */
  if (renderMode === "accordion-only") {
    return (
      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const IconComponent = item.icon ? iconMap[item.icon] : undefined;
          return (
            <div
              key={item.name}
              className={cn(
                styles.mobileCard,
                "relative rounded-2xl border border-white/[0.06] bg-white/[0.025] overflow-hidden"
              )}
              style={mobileCardVars(item.color, index)}
              data-active={isActive}
            >
              <div
                className={cn(
                  styles.mobileGlow,
                  "absolute inset-0 rounded-2xl pointer-events-none"
                )}
              />
              <button
                className="relative z-10 w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                onClick={() => handleToggle(index)}
                aria-expanded={isActive}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    {IconComponent && (
                      <IconComponent
                        size={24}
                        weight="duotone"
                        className={cn(styles.itemText, "shrink-0")}
                      />
                    )}
                    <h3 className={cn(styles.itemText, "text-xl font-bold")}>
                      {item.name}
                    </h3>
                  </div>
                  {!isActive && (
                    <p className="text-sm text-white/60 mt-1 line-clamp-1">
                      {item.tagline}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "shrink-0 text-white/40 transition-transform duration-300",
                    isActive && "rotate-45"
                  )}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div className={cn(styles.accordionContent, isActive && styles.accordionOpen)}>
                <div>
                  <div className={cn(styles.accordionInner, "px-5 pb-5")}>
                    <p className="font-semibold text-white text-sm leading-snug">
                      {item.tagline}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="text-sm text-white/70 leading-relaxed flex gap-2">
                          <span className={cn(styles.itemBullet, "shrink-0 mt-1.5 w-1 h-1 rounded-full opacity-50")} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center gap-4">
                      {item.imageSrc && (
                        <div className="relative h-10 w-24 shrink-0">
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt || item.name}
                            fill
                            className="object-contain object-left"
                          />
                        </div>
                      )}
                      <Button href={item.ctaHref} variant="outline" className={styles.ctaLink}>
                        {item.ctaLabel || "Find Out More"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Section className="relative z-20 py-12 md:py-16 lg:py-20">
      <Container className="px-[var(--layout-section-padding-x)]">
        {/* Section heading — fades in when scrolled into view */}
        {(sectionTitle || sectionSubtitle) && (
          <div ref={headingRef} className="reveal-fade mb-10 md:mb-14 text-center">
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

        {/* ── Desktop vertical accordion (lg+) ──────────── */}
        <div
          ref={gridRef}
          className="hidden lg:flex gap-10 relative"
        >
          {/* Left: minimal text nav */}
          <div className="flex flex-col gap-1 w-[220px] shrink-0 pt-2">
            {items.map((item, index) => {
              const isActive = activeIndex === index;
              const IconComponent = item.icon
                ? iconMap[item.icon]
                : undefined;
              return (
                <button
                  key={item.name}
                  className={cn(
                    "reveal-card relative cursor-pointer text-left px-4 py-3 rounded-xl",
                    "transition-all duration-300",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
                    isActive
                      ? "bg-white/[0.06]"
                      : "hover:bg-white/[0.03]"
                  )}
                  style={cardVars(item.color, index)}
                  data-active={isActive}
                  onClick={() => setActiveIndex(index)}
                  aria-expanded={isActive}
                >
                  <div className="flex items-center gap-3">
                    {IconComponent && (
                      <IconComponent
                        size={20}
                        weight="duotone"
                        className={cn(
                          "shrink-0 transition-colors duration-300",
                          isActive ? styles.itemText : "text-white/40"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "text-base font-semibold transition-colors duration-300",
                        isActive ? "text-white" : "text-white/50"
                      )}
                    >
                      {item.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: content panel */}
          {activeIndex !== null && (() => {
            const item = items[activeIndex];
            return (
              <div
                key={item.name}
                className={cn(
                  styles.contentPanel,
                  styles.contentPanelActive,
                  "flex-1 min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl",
                  "overflow-hidden relative flex flex-col p-8 xl:p-10 min-h-[340px]"
                )}
                style={cardVars(item.color, activeIndex)}
                data-active="true"
              >
                <div
                  className={cn(
                    styles.cardGlow,
                    "work-card-glow absolute inset-0 rounded-2xl pointer-events-none"
                  )}
                />

                <div className="relative z-10 flex flex-col flex-1">
                  <h3 className={cn(styles.itemText, "text-xl font-bold mb-1")}>
                    {item.name}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-5">
                    {item.tagline}
                  </p>
                  <ul className="space-y-2">
                    {item.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="text-sm text-white/60 leading-relaxed flex gap-2"
                      >
                        <span
                          className={cn(
                            styles.itemBullet,
                            "shrink-0 mt-1.5 w-1 h-1 rounded-full opacity-50"
                          )}
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6 flex items-end justify-between gap-4">
                    {item.imageSrc && (
                      <div className="relative h-14 w-32 shrink-0">
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt || item.name}
                          fill
                          className="object-contain object-left"
                        />
                      </div>
                    )}
                    <Button
                      href={item.ctaHref}
                      variant="outline"
                      className={cn(styles.ctaLink, "shrink-0 ml-auto")}
                    >
                      {item.ctaLabel || "Find Out More"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── Mobile/Tablet accordion (below lg) ────── */}
        <div
          ref={mobileRef}
          className="lg:hidden flex flex-col gap-3"
        >
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            const IconComponent = item.icon
              ? iconMap[item.icon]
              : undefined;
            return (
              <div
                key={item.name}
                className={cn(
                  "reveal-card",
                  styles.mobileCard,
                  "relative rounded-2xl border border-white/[0.06] bg-white/[0.025] overflow-hidden"
                )}
                style={mobileCardVars(item.color, index)}
                data-active={isActive}
              >
                {/* Glow overlay */}
                <div
                  className={cn(
                    styles.mobileGlow,
                    "absolute inset-0 rounded-2xl pointer-events-none"
                  )}
                />

                {/* Accordion header */}
                <button
                  className="relative z-10 w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isActive}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      {IconComponent && (
                        <IconComponent
                          size={24}
                          weight="duotone"
                          className={cn(styles.itemText, "shrink-0")}
                        />
                      )}
                      <h3
                        className={cn(
                          styles.itemText,
                          "text-xl font-bold"
                        )}
                      >
                        {item.name}
                      </h3>
                    </div>
                    {!isActive && (
                      <p className="text-sm text-white/60 mt-1 line-clamp-1">
                        {item.tagline}
                      </p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-white/40 transition-transform duration-300",
                      isActive && "rotate-45"
                    )}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M10 4v12M4 10h12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                {/* Accordion content */}
                <div
                  className={cn(
                    styles.accordionContent,
                    isActive && styles.accordionOpen
                  )}
                >
                  <div>
                    <div className={cn(styles.accordionInner, "px-5 pb-5")}>
                      <p className="font-semibold text-white text-sm leading-snug">
                        {item.tagline}
                      </p>

                      <ul className="mt-4 space-y-2">
                        {item.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="text-sm text-white/70 leading-relaxed flex gap-2"
                          >
                            <span
                              className={cn(
                                styles.itemBullet,
                                "shrink-0 mt-1.5 w-1 h-1 rounded-full opacity-50"
                              )}
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 flex items-center gap-4">
                        {item.imageSrc && (
                          <div className="relative h-10 w-24 shrink-0">
                            <Image
                              src={item.imageSrc}
                              alt={item.imageAlt || item.name}
                              fill
                              className="object-contain object-left"
                            />
                          </div>
                        )}
                        <Button
                          href={item.ctaHref}
                          variant="outline"
                          className={styles.ctaLink}
                        >
                          {item.ctaLabel || "Find Out More"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default ExpandingCardPanel;
