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
        border border-[var(--stroke-magenta)]
        bg-transparent
        text-[color:var(--text-white)]
        hover:bg-[var(--surface-magenta)]
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
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
