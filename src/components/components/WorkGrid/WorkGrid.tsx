"use client";

import React, { useState, useMemo, useRef } from "react";
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

/* ─── WorkCard ───────────────────────────────────────── */

interface WorkCardProps {
  item: WorkItem;
  index: number;
  tabletOrder: number;
}

const WorkCard: React.FC<WorkCardProps> = ({ item, index, tabletOrder }) => {
  const isWide = BENTO_PATTERN[index % BENTO_PATTERN.length];
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => setCursor(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLAnchorElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    setCursor({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
  };

  const handleTouchEnd = () => setCursor(null);

  return (
    <Link
      ref={cardRef}
      href={`/our-work/${item.slug}`}
      className={cn(styles.card, styles.cardReveal, isWide && styles.spanTwo)}
      style={{
        "--reveal-delay": `${0.05 + index * 0.08}s`,
        "--tablet-order": tabletOrder,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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

      {/* Arrow — follows cursor on hover */}
      <span
        className={cn(styles.cardArrow, cursor && styles.cardArrowVisible)}
        style={cursor ? { left: cursor.x, top: cursor.y } : undefined}
      >
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
};

/* ─── WorkGrid ───────────────────────────────────────── */

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

  /**
   * Compute CSS order values for the 2-col (tablet + mobile) breakpoint
   * across the ENTIRE filtered list so:
   * - Small cards are always paired side-by-side
   * - One wide card follows each pair  (F F W  F F W …)
   * - Any lone small (odd total) is pushed to the very end
   */
  const tabletOrders = useMemo(() => {
    const smalls: number[] = [];
    const wides: number[] = [];
    filteredItems.forEach((_, i) => {
      if (BENTO_PATTERN[i % BENTO_PATTERN.length]) wides.push(i);
      else smalls.push(i);
    });

    const sequence: number[] = [];
    let si = 0;
    let wi = 0;
    while (si + 1 < smalls.length) {
      sequence.push(smalls[si], smalls[si + 1]);
      si += 2;
      if (wi < wides.length) sequence.push(wides[wi++]);
    }
    while (wi < wides.length) sequence.push(wides[wi++]);
    if (si < smalls.length) sequence.push(smalls[si]); // lone small → last

    const orders = new Array(filteredItems.length).fill(0);
    sequence.forEach((originalIdx, visualPos) => {
      orders[originalIdx] = visualPos + 1;
    });
    return orders;
  }, [filteredItems]);

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
          {filteredItems.map((item, index) => (
            <WorkCard key={item.slug} item={item} index={index} tabletOrder={tabletOrders[index]} />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default WorkGrid;
