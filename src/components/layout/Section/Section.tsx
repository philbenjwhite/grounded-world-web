import React from "react";
import cn from "classnames";

export interface SectionProps {
  /** Content to render inside the section */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
  /** HTML element to render as (default: section) */
  as?: "section" | "div" | "article" | "aside";
  /** Optional id for anchor linking */
  id?: string;
}

const Section = ({
  children,
  className,
  as: Component = "section",
  id,
}: SectionProps) => {
  return (
    <Component id={id} className={cn("py-[var(--layout-section-padding-y)] bg-(--background)", className)}>
      {children}
    </Component>
  );
};

export default Section;
