"use client";

import React from "react";
import cn from "classnames";
import styles from "./FilterPills.module.css";

export interface FilterPillsProps {
  /** Labels to display as pills */
  items: string[];
  /** Currently active label */
  active: string;
  /** Called when a pill is clicked */
  onChange: (label: string) => void;
  /** Alignment — default "center" */
  align?: "start" | "center";
  /** Additional className on the wrapper */
  className?: string;
}

const FilterPills: React.FC<FilterPillsProps> = ({
  items,
  active,
  onChange,
  align = "center",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-3",
        align === "center" ? "justify-center" : "justify-start",
        className
      )}
      role="tablist"
    >
      {items.map((label) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={active === label}
          onClick={() => onChange(label)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium",
            styles.pill,
            active === label && styles.pillActive
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FilterPills;
