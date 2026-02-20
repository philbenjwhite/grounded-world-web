"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";
import { ArrowUpRight } from "@phosphor-icons/react";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import Heading from "../../atoms/Heading";
import FilterPills from "../../atoms/FilterPills";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./WorkGrid.module.css";

/* ─── Types ──────────────────────────────────────────── */

export interface WorkItem {
  /** URL slug (filename) */
  slug: string;
  /** Project title */
  title: string;
  /** Client name */
  client: string;
  /** Short description */
  description?: string;
  /** ISO date string */
  date?: string;
  /** Category tag (e.g., "Brand Activation") */
  tag?: string;
  /** Featured image path */
  featuredImage?: string;
}

export interface WorkGridProps {
  /** Array of work items — already sorted */
  items: WorkItem[];
  /** Optional section title rendered as h2 above the grid */
  sectionTitle?: string;
}

/* ─── Constants ──────────────────────────────────────── */

const ALL_FILTER = "All";

/**
 * Bento pattern that repeats every 6 items.
 * true = card spans 2 columns on desktop.
 */
const BENTO_PATTERN = [false, true, true, false, false, true];

/* ─── Component ──────────────────────────────────────── */

const WorkGrid: React.FC<WorkGridProps> = ({ items, sectionTitle }) => {
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const gridRef = useScrollReveal(0.01);

  /* Derive unique tags from items */
  const tags = useMemo(() => {
    const unique = Array.from(
      new Set(items.map((item) => item.tag).filter(Boolean))
    ) as string[];
    return [ALL_FILTER, ...unique];
  }, [items]);

  /* Filtered items */
  const filteredItems = useMemo(() => {
    if (activeFilter === ALL_FILTER) return items;
    return items.filter((item) => item.tag === activeFilter);
  }, [items, activeFilter]);

  return (
    <Section className="py-16 md:py-24">
      <Container className="px-[var(--layout-section-padding-x)]">
        {sectionTitle && (
          <Heading level={2} size="h2" color="primary" className="text-center mb-8 md:mb-12">
            {sectionTitle}
          </Heading>
        )}

        {/* Filter pills */}
        <FilterPills
          items={tags}
          active={activeFilter}
          onChange={setActiveFilter}
          className="mb-10"
        />

        {/* Bento grid */}
        <div ref={gridRef} className={styles.bentoGrid}>
          {filteredItems.map((item, index) => {
            const isWide = BENTO_PATTERN[index % BENTO_PATTERN.length];

            return (
              <Link
                key={item.slug}
                href={`/our-work/${item.slug}`}
                className={cn(
                  styles.card,
                  styles.cardReveal,
                  isWide && styles.spanTwo
                )}
                style={
                  {
                    "--reveal-delay": `${0.05 + index * 0.08}s`,
                  } as React.CSSProperties
                }
              >
                {/* Background image */}
                {item.featuredImage && (
                  <Image
                    src={item.featuredImage}
                    alt={item.title}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-700 ease-out",
                      styles.cardImage
                    )}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}

                {/* Gradient scrim over image */}
                <div className={styles.cardScrim} />

                {/* Amber glow overlay */}
                <div className="work-card-glow" />

                {/* Arrow */}
                <span className={styles.cardArrow}>
                  <ArrowUpRight size={18} weight="bold" />
                </span>

                {/* Content pinned to bottom — visible on hover */}
                <div className={cn("relative z-10", styles.cardContent)}>
                  <h3 className="text-xl font-bold leading-snug text-[var(--font-color-primary)] md:text-2xl">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--font-color-secondary)]">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default WorkGrid;
