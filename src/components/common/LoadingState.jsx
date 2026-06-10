import React from 'react';

/**
 * Reusable LoadingState component
 * Displays a loading state with customizable message and layout styles.
 */
export default function LoadingState({
  message = 'Memuat data...',
  fullPage = false,
  height = '200px',
}) {
  const containerClasses = [
    'flex flex-col items-center justify-center text-center p-6',
    fullPage ? 'fixed inset-0 bg-[var(--color-bg-primary)] z-50' : ''
  ].filter(Boolean).join(' ');

  const style = fullPage ? {} : { minHeight: height };

  return (
    <div className={containerClasses} style={style}>
      <div className="relative flex items-center justify-center mb-4">
        {/* Animated outer ring */}
        <div className="w-12 h-12 rounded-full border-4 border-[var(--color-primary-light)] border-t-[var(--color-primary)] animate-spin"></div>
        {/* Decorative center dot */}
        <div className="absolute w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
      </div>
      <p className="text-sm font-medium text-[var(--color-text-muted)] animate-pulse">
        {message}
      </p>
    </div>
  );
}
