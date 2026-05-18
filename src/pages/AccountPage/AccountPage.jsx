import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePremium } from '../../context/PremiumContext';
import { useSEO } from '../../utils/seo';
import { PLANS } from '../../config/premium';
import './AccountPage.css';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { subscription, isPremiumUser, toggleMockPremium } = usePremium();
  const navigate = useNavigate();

  useSEO({
    title: 'Akun Saya | Islamediaku',
    description: 'Kelola akun dan langganan Premium Anda.',
    path: '/account'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const planName = subscription ? (PLANS[subscription.plan === 'plan_yearly' ? 'YEARLY' : 'MONTHLY']?.name || 'Premium') : 'Free';
  const isActive = isPremiumUser();

  return (
    <div className="account-page container">
      <div className="section__header">
        <h1 className="section__title">Akun Saya</h1>
        <p className="section__subtitle">Kelola profil dan langganan Anda.</p>
      </div>

      <div className="account-grid">
        <div className="account-card profile-card">
          <div className="profile-avatar">
            {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
          </div>
          <div className="profile-info">
            <h3>{user.user_metadata?.full_name || 'Pengguna'}</h3>
            <p>{user.email}</p>
          </div>
          <button className="btn btn--outline logout-btn" onClick={handleLogout}>Keluar</button>
        </div>

        <div className="account-card subscription-card">
          <div className="subscription-header">
            <h3>Status Langganan</h3>
            <span className={`status-badge ${isActive ? 'active' : 'free'}`}>
              {isActive ? 'PREMIUM' : 'FREE'}
            </span>
          </div>
          
          <div className="subscription-details">
            <p><strong>Paket Saat Ini:</strong> {isActive ? planName : 'Free'}</p>
            {isActive && subscription?.current_period_end && (
              <p><strong>Aktif Sampai:</strong> {new Date(subscription.current_period_end).toLocaleDateString('id-ID')}</p>
            )}
            {!isActive && (
              <p className="text-muted">Upgrade ke Premium untuk membuka fitur eksklusif seperti Dzikir Lengkap, Tema Premium, dan Sinkronisasi Cloud.</p>
            )}
          </div>

          <div className="subscription-actions">
            {!isActive ? (
              <button className="btn btn--primary" onClick={() => navigate('/premium')}>Upgrade Sekarang</button>
            ) : (
              <button className="btn btn--secondary" onClick={() => navigate('/premium')}>Lihat Paket Lain</button>
            )}
          </div>

          {/* Fitur Rahasia untuk Testing Developer */}
          {import.meta.env.DEV && (
            <div className="dev-tools">
              <p className="text-muted" style={{fontSize: '0.75rem', marginTop: '20px'}}>Developer Tools:</p>
              <button className="btn btn--ghost" style={{fontSize: '0.8rem'}} onClick={toggleMockPremium}>
                Toggle Mock Premium ({isActive ? 'ON' : 'OFF'})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
