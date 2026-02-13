"use client";

import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import styles from "./FadeIn.module.css";

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
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(styles.fadeIn, visible && styles.visible, className)}
    >
      {children}
    </div>
  );
}
