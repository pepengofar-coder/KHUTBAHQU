import { useNavigate } from 'react-router-dom';
import './PaywallCard.css';

export default function PaywallCard({ featureName, description }) {
  const navigate = useNavigate();

  return (
    <div className="paywall-card">
      <div className="paywall-icon">🔒</div>
      <h3 className="paywall-title">{featureName} Eksklusif Premium</h3>
      <p className="paywall-desc">
        {description || `Tingkatkan akun Anda ke Premium untuk membuka fitur ${featureName} dan pengalaman tanpa batas.`}
      </p>
      <div className="paywall-actions">
        <button className="btn btn--primary" onClick={() => navigate('/premium')}>Upgrade ke Premium</button>
      </div>
    </div>
  );
}
