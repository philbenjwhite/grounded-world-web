"use client";

import React, { useState } from "react";
import cn from "classnames";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./AccordionFAQ.module.css";

/* ─── Types ──────────────────────────────────────────── */

export interface FAQItem {
  /** The question */
  question: string;
  /** The answer (plain text or simple HTML) */
  answer: string;
}

export interface AccordionFAQProps {
  /** Section heading */
  sectionTitle?: string;
  /** Optional subtitle below heading */
  sectionSubtitle?: string;
  /** Array of FAQ items */
  items: FAQItem[];
  /** Allow multiple items open at once (default: false) */
  allowMultiple?: boolean;
}

/* ─── Component ──────────────────────────────────────── */

const AccordionFAQ: React.FC<AccordionFAQProps> = ({
  sectionTitle,
  sectionSubtitle,
  items,
  allowMultiple = false,
}) => {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());
  const headingRef = useScrollReveal(0.3);
  const gridRef = useScrollReveal(0.1);

  const handleToggle = (index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const renderItem = (item: FAQItem, index: number) => {
    const isOpen = openIndexes.has(index);
    return (
      <div
        key={index}
        className={cn(
          "reveal-card",
          styles.item,
          "rounded-2xl border border-white/[0.06]"
        )}
        style={{ "--reveal-delay": `${0.1 + index * 0.08}s` } as React.CSSProperties}
        data-open={isOpen}
      >
        <button
          className="w-full text-left px-5 py-4 md:px-6 md:py-5 flex items-start justify-between gap-4 cursor-pointer"
          onClick={() => handleToggle(index)}
          aria-expanded={isOpen}
        >
          <span className="text-sm md:text-base font-semibold text-white leading-snug pr-2">
            {item.question}
          </span>
          <span
            className={cn(
              styles.toggleIcon,
              "shrink-0 mt-0.5 text-[var(--color-magenta)]"
            )}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 3v12M3 9h12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>

        <div className={styles.accordionBody}>
          <div>
            <div className={cn(styles.answerInner, "px-5 pb-5 md:px-6 md:pb-6")}>
              <p className="text-sm text-white/60 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Section className="py-12 md:py-16 lg:py-20">
      <Container className="px-[var(--layout-section-padding-x)]">
        {/* Section heading */}
        {(sectionTitle || sectionSubtitle) && (
          <div ref={headingRef} className="reveal-fade mb-10 md:mb-14 text-center">
            {sectionTitle && (
              <Heading level={2} size="h2" color="primary">
                {sectionTitle}
              </Heading>
            )}
            {sectionSubtitle && (
              <Text size="body-lg" color="secondary" className="mt-3 max-w-3xl mx-auto">
                {sectionSubtitle}
              </Text>
            )}
          </div>
        )}

        {/* Two-column grid on desktop, single column on mobile */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3"
        >
          {items.map((item, i) => renderItem(item, i))}
        </div>
      </Container>
    </Section>
  );
};

export default AccordionFAQ;
