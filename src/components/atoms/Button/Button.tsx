import React from "react";
import Link from "next/link";
import cn from "classnames";

export type ButtonVariant = "primary" | "secondary" | "outline";

export interface ButtonProps {
  /** Content to render inside the button */
  children: React.ReactNode;
  /** URL to navigate to (renders as Link/anchor when provided) */
  href?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Button type attribute (only applies when rendering as button) */
  type?: "button" | "submit" | "reset";
  /** Link target attribute (only applies when rendering as anchor) */
  target?: "_blank" | "_self" | "_parent" | "_top";
  /** Link rel attribute (automatically set for target="_blank") */
  rel?: string;
  /** Optional className for additional styling */
  className?: string;
  /** Visual variant */
  variant?: ButtonVariant;
}

const baseStyles = "text-center no-underline cursor-pointer transition-colors";

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    inline-block font-medium text-[length:var(--size-16)]
    px-[var(--size-16)] py-[var(--size-8)]
    rounded-[var(--size-8)]
    border border-[var(--comp-button-primary-stroke-default)]
    bg-[var(--comp-button-primary-surface-hover)]
    text-[color:var(--comp-button-primary-text)]
    hover:bg-[var(--comp-button-primary-surface-default)]
    hover:border-[var(--comp-button-primary-stroke-hover)]
    active:bg-[var(--comp-button-primary-surface-pressed)]
    active:border-[var(--comp-button-primary-stroke-pressed)]
  `,
  secondary: `
    inline-block font-medium text-[length:var(--size-16)]
    px-[var(--size-16)] py-[var(--size-8)]
    rounded-[var(--size-8)]
    border border-[var(--comp-button-primary-stroke-default)]
    bg-[var(--comp-button-primary-surface-default)]
    text-[color:var(--comp-button-primary-text)]
    hover:bg-[var(--comp-button-primary-surface-hover)]
    hover:border-[var(--comp-button-primary-stroke-hover)]
    active:bg-[var(--comp-button-primary-surface-pressed)]
    active:border-[var(--comp-button-primary-stroke-pressed)]
  `,
  outline: `
    inline-flex items-center gap-2
    rounded-lg border bg-transparent
    px-5 py-2.5
    text-sm font-semibold uppercase tracking-wider
    duration-300
    hover:bg-white/[0.06]
  `,
};

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
  type = "button",
  target,
  rel,
  className,
  variant = "primary",
}: ButtonProps) => {
  const combinedClassName = cn(
    baseStyles,
    variantStyles[variant],
    disabled && disabledStyles,
    className
  );

  if (href) {
    const isExternal = target === "_blank" || href.startsWith("http");
    const linkRel = rel ?? (isExternal ? "noopener noreferrer" : undefined);

    if (isExternal || disabled) {
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

    return (
      <Link
        href={href}
        className={combinedClassName}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

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
