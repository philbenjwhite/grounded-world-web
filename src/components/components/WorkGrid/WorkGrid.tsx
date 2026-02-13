"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";
import { ArrowUpRight } from "@phosphor-icons/react";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
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
}

/* ─── Constants ──────────────────────────────────────── */

const ALL_FILTER = "All";

/**
 * Bento pattern that repeats every 6 items.
 * true = card spans 2 columns on desktop.
 */
const BENTO_PATTERN = [false, true, true, false, false, true];

/* ─── Component ──────────────────────────────────────── */

const WorkGrid: React.FC<WorkGridProps> = ({ items }) => {
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const gridRef = useScrollReveal();

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
        {/* Filter pills */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveFilter(tag)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium",
                styles.filterPill,
                activeFilter === tag && styles.filterPillActive
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Bento grid */}
        <div ref={gridRef} className={styles.bentoGrid}>
          {filteredItems.map((item, index) => {
            const isWide = BENTO_PATTERN[index % BENTO_PATTERN.length];
            const formattedDate = item.date
              ? new Date(item.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : null;

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

                {/* Arrow */}
                <span className={styles.cardArrow}>
                  <ArrowUpRight size={18} weight="bold" />
                </span>

                {/* Content pinned to bottom */}
                <div className="relative z-10">
                  {formattedDate && (
                    <time className="mb-3 block text-xs font-medium tracking-wider text-[var(--color-gray-4)] uppercase">
                      {formattedDate}
                    </time>
                  )}
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
