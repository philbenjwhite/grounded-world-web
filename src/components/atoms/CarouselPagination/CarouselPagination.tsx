"use client";

import React from "react";
import cn from "classnames";
import styles from "./CarouselPagination.module.css";

export interface CarouselPaginationProps {
  /** Total number of items */
  total: number;
  /** Currently active index */
  activeIndex: number;
  /** Callback when a dot is clicked */
  onSelect?: (index: number) => void;
  /** Optional className for the root container */
  className?: string;
}

const CarouselPagination = ({
  total,
  activeIndex,
  onSelect,
  className,
}: CarouselPaginationProps) => {
  if (total <= 1) return null;

  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      role="tablist"
      aria-label="Carousel pagination"
    >
      {Array.from({ length: total }, (_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              styles.dot,
              "h-2 cursor-pointer border-0 p-0",
              isActive ? "w-6" : "w-2 bg-[var(--color-gray-4)] hover:bg-[var(--color-gray-3)]",
            )}
            data-active={isActive ? "" : undefined}
            onClick={() => onSelect?.(index)}
          />
        );
      })}
    </div>
  );
};

export default CarouselPagination;
