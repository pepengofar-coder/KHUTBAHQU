import { Link } from 'react-router-dom';
import './VariedFeatureCard.css';

export default function VariedFeatureCard({
  title,
  subtitle,
  countLabel,
  icon: Icon,
  to,
  href,
  colorVariant = 'blue',
  badge,
  disabled = false,
  onClick,
  isExternal = false,
  layoutVariant = 'grid-card',
  active = false,
  ariaLabel
}) {
  const cardClass = [
    'varied-card',
    `varied-card--${colorVariant}`,
    `varied-card--${layoutVariant}`,
    active ? 'varied-card--active' : '',
    disabled ? 'varied-card--disabled' : '',
  ].filter(Boolean).join(' ');

  const content = (
    <>
      <div className="varied-card__content">
        {badge && <span className="varied-card__badge">{badge}</span>}
        <h3 className="varied-card__title">{title}</h3>
        {(subtitle || countLabel) && (
          <p className="varied-card__subtitle">{subtitle || countLabel}</p>
        )}
      </div>
      {Icon && (
        <div className="varied-card__icon-wrapper">
          {typeof Icon === 'string' ? (
            <span className="varied-card__emoji" style={{ fontSize: '22px', lineHeight: 1 }}>{Icon}</span>
          ) : (
            <Icon className="varied-card__icon" strokeWidth={2.2} />
          )}
        </div>
      )}
    </>
  );

  // If disabled, render as div
  if (disabled) {
    return (
      <div className={cardClass} aria-disabled="true" aria-label={ariaLabel || title}>
        {content}
      </div>
    );
  }

  // Handle click only
  if (onClick && !to && !href) {
    return (
      <button
        type="button"
        className={cardClass}
        onClick={onClick}
        aria-label={ariaLabel || title}
      >
        {content}
      </button>
    );
  }

  // External link
  if (isExternal && href) {
    return (
      <a
        href={href}
        className={cardClass}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        aria-label={ariaLabel || title}
      >
        {content}
      </a>
    );
  }

  // Internal routing
  if (to) {
    return (
      <Link
        to={to}
        className={cardClass}
        onClick={onClick}
        aria-label={ariaLabel || title}
      >
        {content}
      </Link>
    );
  }

  // Fallback as div
  return (
    <div className={cardClass} onClick={onClick} role="button" tabIndex={0} aria-label={ariaLabel || title}>
      {content}
    </div>
  );
}
