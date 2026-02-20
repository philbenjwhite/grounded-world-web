"use client";

import { useState, useEffect, useRef } from "react";
import type { TocHeading } from "@/lib/extract-headings";

interface ArticleTableOfContentsProps {
  headings: TocHeading[];
  /** "sidebar" = desktop sticky column (hidden <lg), "mobile" = sticky collapsible (hidden lg+) */
  variant?: "sidebar" | "mobile";
}

export default function ArticleTableOfContents({
  headings,
  variant = "sidebar",
}: ArticleTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const rafRef = useRef(0);

  useEffect(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    function updateActive() {
      // Walk headings in document order; the last one above the threshold wins
      let current = headings[0]?.id ?? "";
      for (const el of headingElements) {
        if (el.getBoundingClientRect().top <= 120) {
          current = el.id;
        }
      }
      setActiveId(current);
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateActive);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateActive();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [headings]);

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

  if (variant === "mobile") {
    return (
      <nav
        aria-label="Table of contents"
        className="lg:hidden sticky top-[96px] z-40 mb-6 px-1"
      >
        <details className="rounded-2xl border border-white/[0.12] bg-white/[0.05] backdrop-blur-md px-5 py-3.5">
          <summary className="cursor-pointer text-sm font-semibold text-[color:var(--font-color-primary)] select-none flex items-center gap-2.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-[var(--color-cyan)]"
            >
              <path
                d="M2 4h12M2 8h8M2 12h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Table of Contents
          </summary>
          <div className="mt-3 max-h-[50vh] overflow-y-auto">{tocLinks}</div>
        </details>
      </nav>
    );
  }

  return (
    <nav aria-label="Table of contents" className="hidden lg:block">
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--font-color-tertiary)] mb-4">
          Contents
        </p>
        {tocLinks}
      </div>
    </nav>
  );
}
