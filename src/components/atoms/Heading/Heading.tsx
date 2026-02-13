import React from 'react';
import cn from 'classnames';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'display' | 'h1' | 'h2' | 'h3' | 'h4';
export type HeadingColor = 'primary' | 'secondary' | 'tertiary' | 'inverted';

export interface HeadingProps {
  /** Content to render */
  children: React.ReactNode;
  /** Semantic heading level (h1-h6) */
  level?: HeadingLevel;
  /** Visual size (defaults to match level) */
  size?: HeadingSize;
  /** Text color */
  color?: HeadingColor;
  /** Optional className for additional styling */
  className?: string;
}

const sizeClasses: Record<HeadingSize, string> = {
  display: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tighter leading-[0.9]',
  h1: 'text-[length:var(--font-size-h1)] leading-[1.1]',
  h2: 'text-[length:var(--font-size-h2)] leading-[1.15]',
  h3: 'text-[length:var(--font-size-h3)] leading-[1.2]',
  h4: 'text-[length:var(--font-size-h4)] leading-[1.25]',
};

const colorClasses: Record<HeadingColor, string> = {
  primary: 'text-[color:var(--font-color-primary)]',
  secondary: 'text-[color:var(--font-color-secondary)]',
  tertiary: 'text-[color:var(--font-color-tertiary)]',
  inverted: 'text-[color:var(--font-color-inverted)]',
};

const levelToSize: Record<HeadingLevel, HeadingSize> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h4',
  6: 'h4',
};

const Heading = ({
  children,
  level = 2,
  size,
  color = 'primary',
  className,
}: HeadingProps) => {
  const Component = `h${level}` as const;
  const visualSize = size ?? levelToSize[level];

  return (
    <Component
      className={cn(
        sizeClasses[visualSize],
        colorClasses[color],
        'font-bold',
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Heading;
