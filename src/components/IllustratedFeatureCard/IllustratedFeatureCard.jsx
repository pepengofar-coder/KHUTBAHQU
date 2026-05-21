import { Link } from 'react-router-dom';
import './IllustratedFeatureCard.css';

export default function IllustratedFeatureCard({
  title,
  subtitle,
  to,
  href,
  visual: Icon,
  colorVariant = 'blue',
  featured = false,
  onClick,
  isExternal = false,
  ariaLabel
}) {
  const cls = [
    'ifc-card',
    `ifc-card--${colorVariant}`,
    featured ? 'ifc-card--featured' : 'ifc-card--normal'
  ].filter(Boolean).join(' ');

  const inner = (
    <>
      <div className="ifc-card__text">
        <h3 className="ifc-card__title">{title}</h3>
        {subtitle && <p className="ifc-card__subtitle">{subtitle}</p>}
      </div>

      <div className="ifc-card__visual" aria-hidden="true">
        <div className="ifc-card__visual-bg" />
        {Icon ? (
          typeof Icon === 'string' ? (
            <span className="ifc-card__emoji">{Icon}</span>
          ) : (
            <Icon className="ifc-card__visual-icon" />
          )
        ) : (
          <div className="ifc-card__placeholder" />
        )}
      </div>
    </>
  );

  if (isExternal && href) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} aria-label={ariaLabel || title}>
        {inner}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} aria-label={ariaLabel || title}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={cls} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} aria-label={ariaLabel || title}>
      {inner}
    </div>
  );
}
