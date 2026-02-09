import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  children,
  disabled = false,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className="
        font-[Inter] font-medium text-[length:var(--size-16)]
        px-[var(--size-16)] py-[var(--size-8)]
        rounded-[var(--size-8)]
        border border-[var(--comp-button-primary-stroke-default)]
        bg-[var(--comp-button-primary-surface-default)]
        text-[color:var(--comp-button-primary-text)]
        hover:bg-[var(--comp-button-primary-surface-hover)]
        hover:border-[var(--comp-button-primary-stroke-hover)]
        active:bg-[var(--comp-button-primary-surface-pressed)]
        active:border-[var(--comp-button-primary-stroke-pressed)]
        disabled:bg-[var(--comp-button-primary-surface-disabled)]
        disabled:border-[var(--comp-button-primary-stroke-disabled)]
        disabled:text-[color:var(--comp-button-primary-text-disabled)]
        disabled:cursor-not-allowed
        transition-colors
      "
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
