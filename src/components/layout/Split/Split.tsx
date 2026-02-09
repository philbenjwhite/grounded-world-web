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
  /** Optional className for additional styling */
  className?: string;
}

const ratioStyles: Record<string, string> = {
  "50/50": "1fr 1fr",
  "40/60": "2fr 3fr",
  "60/40": "3fr 2fr",
  "30/70": "3fr 7fr",
  "70/30": "7fr 3fr",
};

const gapValues: Record<string, string> = {
  none: "0",
  sm: "1rem",
  md: "2rem",
  lg: "3rem",
  xl: "4rem",
};

const alignClasses: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const Split = ({
  left,
  right,
  ratio = "50/50",
  gap = "md",
  reverseOnMobile = false,
  align = "start",
  className,
}: SplitProps) => {
  return (
    <div
      className={cn("split-layout", alignClasses[align], className)}
      style={
        {
          "--split-cols": ratioStyles[ratio],
          "--split-gap": gapValues[gap],
        } as React.CSSProperties
      }
    >
      <div className={cn({ "order-2 lg:order-1": reverseOnMobile })}>
        {left}
      </div>
      <div className={cn({ "order-1 lg:order-2": reverseOnMobile })}>
        {right}
      </div>
    </div>
  );
};

export default Split;
