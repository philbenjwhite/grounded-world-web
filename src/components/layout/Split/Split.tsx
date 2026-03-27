import React from "react";
import cn from "classnames";

export interface SplitProps {
  /** Content for the left/first column */
  left: React.ReactNode;
  /** Content for the right/second column */
  right: React.ReactNode;
  /** Column ratio - first number is left column proportion */
  ratio?: "50/50" | "40/60" | "60/40" | "30/70" | "70/30";
  /** Gap between columns */
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  /** Reverse order on mobile (right content appears first) */
  reverseOnMobile?: boolean;
  /** Vertical alignment of columns */
  align?: "start" | "center" | "end" | "stretch";
  /** Optional className for the left column wrapper */
  leftClassName?: string;
  /** Optional className for the right column wrapper */
  rightClassName?: string;
  /** Optional className for additional styling */
  className?: string;
}

// Tailwind arbitrary grid-template-columns applied at lg breakpoint (stacks on mobile)
const ratioClasses: Record<string, string> = {
  "50/50": "lg:grid-cols-[1fr_1fr]",
  "40/60": "lg:grid-cols-[2fr_3fr]",
  "60/40": "lg:grid-cols-[3fr_2fr]",
  "30/70": "lg:grid-cols-[3fr_7fr]",
  "70/30": "lg:grid-cols-[7fr_3fr]",
};

// Tailwind gap utilities — values match the spacing scale exactly
const gapClasses: Record<string, string> = {
  none: "gap-0",
  sm:   "gap-6",   // 1.5rem
  md:   "gap-10",  // 2.5rem
  lg:   "gap-16",  // 4rem
  xl:   "gap-24",  // 6rem
};

const alignClasses: Record<string, string> = {
  start:   "items-start",
  center:  "items-center",
  end:     "items-end",
  stretch: "items-stretch",
};

const Split = ({
  left,
  right,
  ratio = "50/50",
  gap = "md",
  reverseOnMobile = false,
  align = "start",
  leftClassName,
  rightClassName,
  className,
}: SplitProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1",
        ratioClasses[ratio],
        gapClasses[gap],
        alignClasses[align],
        className,
      )}
    >
      <div className={cn({ "order-2 lg:order-1": reverseOnMobile }, leftClassName)}>
        {left}
      </div>
      <div className={cn({ "order-1 lg:order-2": reverseOnMobile }, rightClassName)}>
        {right}
      </div>
    </div>
  );
};

export default Split;
