"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-triggered reveal hook.
 *
 * Sets the `data-in-view` attribute on the referenced element when it
 * enters the viewport. Pair with the global `.reveal-card` or
 * `.reveal-fade` classes (defined in globals.css) for consistent
 * entrance animations across the site.
 *
 * Use `--reveal-delay` CSS variable on children for stagger.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-in-view", "");
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
