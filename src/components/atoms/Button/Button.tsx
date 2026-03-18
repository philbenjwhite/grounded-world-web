import React, { useCallback } from "react";
import Link from "next/link";
import cn from "classnames";
import styles from "./Button.module.css";

type CalendlyApi = { initPopupWidget: (opts: { url: string }) => void };
type CalendlyWindow = { Calendly?: CalendlyApi };

function isCalendlyUrl(url?: string): boolean {
  return !!url && url.includes("calendly.com");
}

function openCalendlyPopup(url: string) {
  const calendly = (window as unknown as CalendlyWindow).Calendly;
  if (!calendly) {
    window.open(url, "_blank");
    return;
  }
  const separator = url.includes("?") ? "&" : "?";
  const fullUrl = url.includes("hide_gdpr_banner") ? url : `${url}${separator}hide_gdpr_banner=1`;
  calendly.initPopupWidget({ url: fullUrl });
}

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

const baseStyles =
  "inline-flex items-center justify-center gap-2 no-underline cursor-pointer rounded-full text-sm font-semibold transition-colors overflow-hidden";

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    px-6 py-3
    border border-(--comp-button-primary-stroke-default)
    bg-(--comp-button-primary-surface-hover)
    text-[color:var(--comp-button-primary-text)]
    hover:bg-(--comp-button-primary-surface-default)
    hover:border-(--comp-button-primary-stroke-hover)
    active:bg-(--comp-button-primary-surface-pressed)
    active:border-(--comp-button-primary-stroke-pressed)
  `,
  secondary: `
    px-6 py-3
    border border-(--comp-button-primary-stroke-default)
    bg-(--comp-button-primary-surface-default)
    text-[color:var(--comp-button-primary-text)]
    hover:bg-(--comp-button-primary-surface-hover)
    hover:border-(--comp-button-primary-stroke-hover)
    active:bg-(--comp-button-primary-surface-pressed)
    active:border-(--comp-button-primary-stroke-pressed)
  `,
  outline: `
    px-6 py-3
    border bg-transparent
    hover:bg-white/[0.06]
  `,
};

const disabledStyles = `
  bg-(--comp-button-primary-surface-disabled)
  border-(--comp-button-primary-stroke-disabled)
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
  const calendly = isCalendlyUrl(href);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (calendly && href) {
        e.preventDefault();
        openCalendlyPopup(href);
        return;
      }
      onClick?.(e);
    },
    [calendly, href, onClick],
  );

  const combinedClassName = cn(
    styles.button,
    baseStyles,
    variantStyles[variant],
    disabled && disabledStyles,
    className
  );

  // Calendly links render as a button (no navigation)
  if (calendly) {
    return (
      <button
        type="button"
        className={combinedClassName}
        onClick={disabled ? undefined : handleClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

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
