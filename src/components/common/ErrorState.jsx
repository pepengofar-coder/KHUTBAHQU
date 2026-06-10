import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

/**
 * Reusable ErrorState component
 * Displays a friendly user interface when a system error occurs.
 */
export default function ErrorState({
  title = 'Terjadi Kesalahan',
  message = 'Gagal memuat data. Silakan periksa koneksi internet Anda atau coba lagi nanti.',
  onRetry,
  height = '250px',
}) {
  return (
    <div 
      className="flex flex-col items-center justify-center text-center p-8 border border-[var(--color-error)]/20 rounded-2xl bg-[var(--color-error)]/5"
      style={{ minHeight: height }}
    >
      <div className="w-14 h-14 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center mb-4 text-[var(--color-error)] animate-pulse">
        <AlertCircle size={28} className="stroke-[1.5]" />
      </div>
      <h3 className="text-base font-bold text-[var(--color-error)] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[var(--color-text-muted)] max-w-sm mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn--outline text-xs py-2 px-4 rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          <RotateCcw size={14} />
          <span>Coba Lagi</span>
        </button>
      )}
    </div>
  );
}
