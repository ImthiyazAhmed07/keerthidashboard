import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-sunflower-500 to-sunflower-600 hover:from-sunflower-600 hover:to-sunflower-700 text-white shadow-warm-sm hover:shadow-warm-md focus:ring-sunflower-400',
    amber:
      'bg-amber-500 hover:bg-amber-600 text-white shadow-warm-sm hover:shadow-warm-md focus:ring-amber-400',
    secondary:
      'bg-white dark:bg-darkbg-card border border-warm-200 dark:border-darkbg-border text-warm-800 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover focus:ring-warm-400 shadow-sm',
    ghost:
      'bg-transparent hover:bg-warm-100 dark:hover:bg-darkbg-cardHover text-warm-700 dark:text-warm-300 focus:ring-warm-400',
    danger:
      'bg-rose-500 hover:bg-rose-600 text-white shadow-sm focus:ring-rose-400',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
