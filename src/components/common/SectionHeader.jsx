import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Section Header component
 * Displays section titles with optional icons, subtitles, and actions.
 */
export default function SectionHeader({
  title,
  subtitle,
  icon: IconComponent,
  actionLink,
  actionLabel,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-2 ${className}`}>
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--color-text-primary)]">
          {IconComponent && <IconComponent className="text-[var(--color-primary)] shrink-0" size={22} />}
          <span>{title}</span>
        </h2>
        {subtitle && (
          <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {actionLink && actionLabel && (
        <Link
          to={actionLink}
          className="text-sm font-semibold text-[var(--color-primary)] hover:underline shrink-0 self-start sm:self-center"
        >
          {actionLabel} &rarr;
        </Link>
      )}
    </div>
  );
}
