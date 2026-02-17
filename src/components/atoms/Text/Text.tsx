import React from 'react';
import cn from 'classnames';

export type TextSize = 'subtitle' | 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs' | 'caption';
export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverted' | 'link';
export type TextElement = 'p' | 'span' | 'div';

export interface TextProps {
  /** Content to render */
  children: React.ReactNode;
  /** Text size */
  size?: TextSize;
  /** Text color */
  color?: TextColor;
  /** HTML element to render as */
  as?: TextElement;
  /** Optional className for additional styling */
  className?: string;
}

const sizeClasses: Record<TextSize, string> = {
  subtitle: 'text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light tracking-tight leading-[1.4]',
  'body-xl': 'text-[length:var(--font-size-body-xl)] leading-[1.5]',
  'body-lg': 'text-[length:var(--font-size-body-lg)] leading-[1.6]',
  'body-md': 'text-[length:var(--font-size-body-md)] leading-[1.6]',
  'body-sm': 'text-[length:var(--font-size-body-sm)] leading-[1.5]',
  'body-xs': 'text-[length:var(--font-size-body-xs)] leading-[1.5]',
  caption: 'text-[length:var(--font-size-caption)] leading-[1.5]',
};

const colorClasses: Record<TextColor, string> = {
  primary: 'text-[color:var(--font-color-primary)]',
  secondary: 'text-[color:var(--font-color-secondary)]',
  tertiary: 'text-[color:var(--font-color-tertiary)]',
  inverted: 'text-[color:var(--font-color-inverted)]',
  link: 'text-[color:var(--font-color-link)]',
};

const Text = ({
  children,
  size = 'body-md',
  color = 'primary',
  as: Component = 'p',
  className,
}: TextProps) => {
  return (
    <Component
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Text;
