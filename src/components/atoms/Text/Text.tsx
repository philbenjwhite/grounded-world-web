import React from 'react';
import cn from 'classnames';

export type TextSize = 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs' | 'caption';
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
  'body-xl': 'text-[length:var(--font-size-body-xl)]',
  'body-lg': 'text-[length:var(--font-size-body-lg)]',
  'body-md': 'text-[length:var(--font-size-body-md)]',
  'body-sm': 'text-[length:var(--font-size-body-sm)]',
  'body-xs': 'text-[length:var(--font-size-body-xs)]',
  caption: 'text-[length:var(--font-size-caption)]',
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
