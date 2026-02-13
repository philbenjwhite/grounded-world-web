"use client";

import cn from "classnames";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  /** Intersection threshold (0–1). Default: 0.2 */
  threshold?: number;
}

export default function FadeIn({
  children,
  className,
  threshold = 0.2,
}: FadeInProps) {
  const ref = useScrollReveal(threshold);

  return (
    <div ref={ref} className={cn("reveal-fade", className)}>
      {children}
    </div>
  );
}
