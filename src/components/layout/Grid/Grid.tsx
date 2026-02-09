import React from "react";
import cn from "classnames";

export interface GridProps {
  /** Content to render in the grid */
  children: React.ReactNode;
  /** Number of columns at different breakpoints */
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Number of columns on mobile (default: 1) */
  colsMobile?: 1 | 2;
  /** Number of columns on tablet (default: same as cols or 2) */
  colsTablet?: 1 | 2 | 3 | 4;
  /** Gap between grid items */
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  /** Optional className for additional styling */
  className?: string;
}

const gapClasses: Record<string, string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const colsClasses: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

const colsMobileClasses: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
};

const colsTabletClasses: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

const Grid = ({
  children,
  cols = 3,
  colsMobile = 1,
  colsTablet,
  gap = "md",
  className,
}: GridProps) => {
  const tabletCols = colsTablet ?? Math.min(cols, 2);

  return (
    <div
      className={cn(
        "grid",
        colsMobileClasses[colsMobile],
        colsTabletClasses[tabletCols],
        colsClasses[cols],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Grid;
