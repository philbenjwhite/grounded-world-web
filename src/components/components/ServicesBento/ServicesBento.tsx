"use client";

import React, { useState, useRef, useEffect } from "react";
import cn from "classnames";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  CompassIcon,
  ChartLineUpIcon,
  LightningIcon,
  GlobeIcon,
  UsersIcon,
  MegaphoneIcon,
  TargetIcon,
  LightbulbIcon,
  RocketIcon,
  type IconProps,
} from "@phosphor-icons/react";
import Button from "../../atoms/Button";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import styles from "./ServicesBento.module.css";

const iconMap: Record<string, React.ComponentType<IconProps>> = {
  MagnifyingGlass: MagnifyingGlassIcon,
  Compass: CompassIcon,
  ChartLineUp: ChartLineUpIcon,
  Lightning: LightningIcon,
  Globe: GlobeIcon,
  Users: UsersIcon,
  Megaphone: MegaphoneIcon,
  Target: TargetIcon,
  Lightbulb: LightbulbIcon,
  Rocket: RocketIcon,
};

/* ─── Types ──────────────────────────────────────────── */

export interface ServiceBentoItem {
  /** Service name (e.g., "Research") */
  name: string;
  /** Brand color as hex (e.g., "#00AEEF") */
  color: string;
  /** Phosphor icon name (e.g. "MagnifyingGlass", "Compass") */
  icon?: string;
  /** Bold one-liner description */
  tagline: string;
  /** Service bullet points */
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

export interface ServicesBentoProps {
  /** Optional heading above the grid */
  sectionTitle?: string;
  /** Optional intro text */
  sectionSubtitle?: string;
  /** Array of service items */
  services: ServiceBentoItem[];
  /** Which service is expanded on load */
  defaultActiveIndex?: number;
}

/* ─── Component ──────────────────────────────────────── */

const ServicesBento: React.FC<ServicesBentoProps> = ({
  sectionTitle,
  sectionSubtitle,
  services,
  defaultActiveIndex,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    defaultActiveIndex ?? 0
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  /* Trigger entrance animation when section scrolls into view */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-in-view", "");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (gridRef.current) observer.observe(gridRef.current);
    if (mobileRef.current) observer.observe(mobileRef.current);
    return () => observer.disconnect();
  }, []);

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle(index);
    }
  };

  /* Build grid-template-columns: active card gets 2.5fr, others 1fr */
  const gridCols = services
    .map((_, i) => (i === activeIndex ? "2.5fr" : "1fr"))
    .join(" ");

  /* CSS variable bag — only dynamic custom props, no visual inline styles */
  const cardVars = (color: string, index: number) =>
    ({
      "--service-color": color,
      "--delay": `${0.1 + index * 0.12}s`,
    }) as React.CSSProperties;

  const mobileCardVars = (color: string, index: number) =>
    ({
      "--service-color": color,
      "--delay": `${0.1 + index * 0.1}s`,
    }) as React.CSSProperties;

  return (
    <Section className="py-16 md:py-24 lg:py-32">
      <Container className="px-[var(--layout-section-padding-x)]">
        {/* Section heading */}
        {(sectionTitle || sectionSubtitle) && (
          <div className="mb-8 md:mb-12">
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

        {/* ── Desktop expanding cards (lg+) ──────────── */}
        <div
          ref={gridRef}
          className={cn(styles.grid, "hidden lg:grid gap-3")}
          style={{ "--grid-cols": gridCols } as React.CSSProperties}
        >
          {services.map((service, index) => {
            const isActive = activeIndex === index;
            const IconComponent = service.icon
              ? iconMap[service.icon]
              : undefined;
            return (
              <div
                key={service.name}
                className={cn(
                  styles.card,
                  "relative rounded-3xl border border-white/[0.06] bg-white/[0.025] backdrop-blur-xl",
                  "overflow-hidden cursor-pointer flex flex-col p-6 xl:p-8",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                )}
                style={cardVars(service.color, index)}
                data-active={isActive}
                role="button"
                tabIndex={0}
                onClick={() => handleToggle(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-expanded={isActive}
              >
                {/* Glow overlay */}
                <div
                  className={cn(
                    styles.cardGlow,
                    "absolute inset-0 rounded-3xl pointer-events-none"
                  )}
                />

                {/* Always visible: icon + name */}
                <div className="relative z-10 flex items-center gap-3">
                  {IconComponent && (
                    <IconComponent
                      size={28}
                      weight="duotone"
                      className={cn(styles.serviceText, "shrink-0")}
                    />
                  )}
                  <h3
                    className={cn(
                      styles.serviceText,
                      "text-xl xl:text-2xl font-bold"
                    )}
                  >
                    {service.name}
                  </h3>
                </div>

                {/* Expanded: tagline + bullets + image + CTA */}
                <div
                  className={cn(
                    styles.expandedDetails,
                    "relative z-10 flex flex-col flex-1 mt-4"
                  )}
                >
                  <p className="text-sm text-white/70 leading-relaxed mb-4">
                    {service.tagline}
                  </p>
                  <ul className="space-y-2.5">
                    {service.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="text-sm text-white/70 leading-relaxed flex gap-2"
                      >
                        <span
                          className={cn(
                            styles.serviceBullet,
                            "shrink-0 mt-1.5 w-1 h-1 rounded-full opacity-50"
                          )}
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6 flex items-end justify-between gap-4">
                    {service.imageSrc && (
                      <div className="relative h-14 w-32 shrink-0">
                        <Image
                          src={service.imageSrc}
                          alt={service.imageAlt || service.name}
                          fill
                          className="object-contain object-left"
                        />
                      </div>
                    )}
                    <Button
                      href={service.ctaHref}
                      variant="outline"
                      onClick={(e) => e.stopPropagation()}
                      className={cn(styles.ctaLink, "shrink-0 ml-auto")}
                    >
                      {service.ctaLabel || "Find Out More"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Mobile/Tablet accordion (below lg) ────── */}
        <div
          ref={mobileRef}
          className={cn(styles.mobileList, "lg:hidden flex flex-col gap-3")}
        >
          {services.map((service, index) => {
            const isActive = activeIndex === index;
            const IconComponent = service.icon
              ? iconMap[service.icon]
              : undefined;
            return (
              <div
                key={service.name}
                className={cn(
                  styles.mobileCard,
                  "relative rounded-2xl border border-white/[0.06] bg-white/[0.025] overflow-hidden"
                )}
                style={mobileCardVars(service.color, index)}
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
                          className={cn(styles.serviceText, "shrink-0")}
                        />
                      )}
                      <h3
                        className={cn(
                          styles.serviceText,
                          "text-xl font-bold"
                        )}
                      >
                        {service.name}
                      </h3>
                    </div>
                    {!isActive && (
                      <p className="text-sm text-white/60 mt-1 line-clamp-1">
                        {service.tagline}
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
                        {service.tagline}
                      </p>

                      <ul className="mt-4 space-y-2">
                        {service.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="text-sm text-white/70 leading-relaxed flex gap-2"
                          >
                            <span
                              className={cn(
                                styles.serviceBullet,
                                "shrink-0 mt-1.5 w-1 h-1 rounded-full opacity-50"
                              )}
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 flex items-center gap-4">
                        {service.imageSrc && (
                          <div className="relative h-10 w-24 shrink-0">
                            <Image
                              src={service.imageSrc}
                              alt={service.imageAlt || service.name}
                              fill
                              className="object-contain object-left"
                            />
                          </div>
                        )}
                        <Button
                          href={service.ctaHref}
                          variant="outline"
                          className={styles.ctaLink}
                        >
                          {service.ctaLabel || "Find Out More"}
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

export default ServicesBento;
