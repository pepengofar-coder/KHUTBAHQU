import React from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * Reusable EmptyState component
 * Displays a friendly empty state representation.
 */
export default function EmptyState({
  title = 'Data Tidak Tersedia',
  description = 'Belum ada data yang dapat ditampilkan saat ini.',
  icon: IconComponent = HelpCircle,
  action,
  height = '250px',
}) {
  return (
    <div 
      className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-secondary)]/30"
      style={{ minHeight: height }}
    >
      <div className="w-14 h-14 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center border border-[var(--color-border)] mb-4 text-[var(--color-text-muted)] shadow-sm">
        <IconComponent size={28} className="stroke-[1.5]" />
      </div>
      <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[var(--color-text-muted)] max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn btn--primary text-xs py-2 px-4 rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
