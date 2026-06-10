import React from 'react';

/**
 * Reusable Card component for Islamediaku
 * Supports glassmorphism, outline, solid variants, and micro-interactions.
 */
export default function Card({
  children,
  className = '',
  variant = 'default', // 'default' | 'glass' | 'outline' | 'solid'
  hoverable = false,
  onClick,
  style = {},
  ...props
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'glass':
        return 'glass-card';
      case 'outline':
        return 'border border-[var(--color-border)] bg-transparent';
      case 'solid':
        return 'bg-[var(--color-bg-secondary)] border border-transparent';
      case 'default':
      default:
        return 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm';
    }
  };

  const isClickable = !!onClick;
  const cardClasses = [
    'rounded-2xl p-5 transition-all duration-300',
    getVariantClass(),
    hoverable || isClickable ? 'hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md cursor-pointer' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      style={style}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
