import React from 'react';

export interface ButtonProps {
  /**
   * Button content
   */
  children: React.ReactNode;
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Disabled state
   */
  disabled?: boolean;
}

/**
 * Primary UI component for user interaction
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  ...props
}: ButtonProps) => {
  const baseClasses = 'font-medium rounded transition-colors';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    tertiary: 'bg-transparent text-primary hover:bg-gray-100',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
