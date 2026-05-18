import './FeatureIcon.css';

export default function FeatureIcon({ icon: Icon, colorMode = 'blue', className = '' }) {
  if (!Icon) return null;
  
  return (
    <div className={`feature-icon feature-icon--${colorMode} ${className}`} aria-hidden="true">
      <Icon className="feature-icon__svg" strokeWidth={2.5} />
    </div>
  );
}
