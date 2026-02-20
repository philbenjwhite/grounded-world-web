"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TocHeading } from "@/lib/extract-headings";

interface ArticleTableOfContentsProps {
  headings: TocHeading[];
}

export default function ArticleTableOfContents({
  headings,
}: ArticleTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const headingElementsRef = useRef<Map<string, IntersectionObserverEntry>>(
    new Map()
  );

  const getActiveHeading = useCallback(() => {
    // Find the heading closest to the top of the viewport
    const entries = Array.from(headingElementsRef.current.values());
    const visible = entries.filter((e) => e.isIntersecting);

    if (visible.length > 0) {
      // Pick the one closest to the top
      visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      return visible[0].target.id;
    }

    // If none visible, find the last one that scrolled past the viewport top
    const sorted = entries
      .filter((e) => e.boundingClientRect.top < 100)
      .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);

    return sorted[0]?.target.id ?? "";
  }, []);

  useEffect(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          headingElementsRef.current.set(entry.target.id, entry);
        });
        const active = getActiveHeading();
        if (active) setActiveId(active);
      },
      {
        rootMargin: "-80px 0px -40% 0px",
        threshold: 0,
      }
    );

    headingElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
      headingElementsRef.current.clear();
    };
  }, [headings, getActiveHeading]);

  if (headings.length === 0) return null;

  const tocLinks = (
    <ul className="space-y-1">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById(heading.id)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`block text-sm leading-snug py-1.5 border-l-2 pl-3 transition-colors duration-200 ${
              activeId === heading.id
                ? "border-[var(--color-cyan)] text-[color:var(--color-cyan)] font-medium"
                : "border-white/[0.08] text-[color:var(--font-color-tertiary)] hover:text-[color:var(--font-color-secondary)] hover:border-white/[0.16]"
            }`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav aria-label="Table of contents">
      {/* Desktop: sticky sidebar that stays fixed while scrolling */}
      <div className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--font-color-tertiary)] mb-4">
          Contents
        </p>
        {tocLinks}
      </div>

      {/* Mobile: collapsible */}
      <details className="lg:hidden border border-white/[0.08] rounded-xl p-4 mb-8">
        <summary className="cursor-pointer text-sm font-semibold text-[color:var(--font-color-secondary)] select-none">
          Table of Contents
        </summary>
        <div className="mt-4">{tocLinks}</div>
      </details>
    </nav>
  );
}
