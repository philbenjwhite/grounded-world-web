import React from 'react';
import cn from 'classnames';

export interface ButtonProps {
  /** Content to render inside the button */
  children: React.ReactNode;
  /** URL to navigate to (renders as anchor tag when provided) */
  href?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Button type attribute (only applies when rendering as button) */
  type?: 'button' | 'submit' | 'reset';
  /** Link target attribute (only applies when rendering as anchor) */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** Link rel attribute (automatically set for target="_blank") */
  rel?: string;
  /** Optional className for additional styling */
  className?: string;
}

const buttonStyles = `
  inline-block
  font-medium text-[length:var(--size-16)]
  px-[var(--size-16)] py-[var(--size-8)]
  rounded-[var(--size-8)]
  border border-[var(--comp-button-primary-stroke-default)]
  bg-[var(--comp-button-primary-surface-default)]
  text-[color:var(--comp-button-primary-text)]
  hover:bg-[var(--comp-button-primary-surface-hover)]
  hover:border-[var(--comp-button-primary-stroke-hover)]
  active:bg-[var(--comp-button-primary-surface-pressed)]
  active:border-[var(--comp-button-primary-stroke-pressed)]
  transition-colors
  text-center
  no-underline
  cursor-pointer
`;

const disabledStyles = `
  bg-[var(--comp-button-primary-surface-disabled)]
  border-[var(--comp-button-primary-stroke-disabled)]
  text-[color:var(--comp-button-primary-text-disabled)]
  cursor-not-allowed
  pointer-events-none
`;

const Button = ({
  children,
  href,
  disabled = false,
  onClick,
  type = 'button',
  target,
  rel,
  className,
}: ButtonProps) => {
  const combinedClassName = cn(
    buttonStyles,
    disabled && disabledStyles,
    className
  );

  // Render as anchor if href is provided
  if (href) {
    // Automatically add security attributes for external links
    const isExternal = target === '_blank';
    const linkRel = rel ?? (isExternal ? 'noopener noreferrer' : undefined);

    return (
      <a
        href={disabled ? undefined : href}
        className={combinedClassName}
        target={target}
        rel={linkRel}
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled || undefined}
      >
        {children}
      </a>
    );
  }

  // Render as button
  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
