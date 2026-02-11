import React from 'react';
import cn from 'classnames';

export interface SectionLabelProps {
  /** Label text */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
}

const SectionLabel = ({ children, className }: SectionLabelProps) => {
  return (
    <p
      className={cn(
        'text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[color:var(--color-gray-4)]',
        className,
      )}
    >
      {children}
    </p>
  );
};

export default SectionLabel;
