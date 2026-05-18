import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePremium } from '../../context/PremiumContext';
import { useSEO } from '../../utils/seo';
import { PLANS } from '../../config/premium';
import './PremiumPage.css';

export default function PremiumPage() {
  const { user } = useAuth();
  const { isPremiumUser, subscription } = usePremium();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  useSEO({ title: 'Islamediaku Premium — Fitur Eksklusif | Islamediaku', description: 'Tingkatkan pengalaman Islami Anda dengan Islamediaku Premium: tanpa iklan, sinkronisasi cloud, tema eksklusif, dan banyak lagi.', path: '/premium' });

  const handleCheckout = async (planKey) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/premium' } } });
      return;
    }

    setLoadingPlan(planKey);
    try {
      // Panggil endpoint /api/checkout yang ada di Vercel Serverless
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Supabase token (if needed by backend, though we'll use server-side session reading or token passing)
          // Actually, passing the token explicitly is safer if cookies aren't setup correctly
          'Authorization': `Bearer ${user?.access_token || ''}`
        },
        body: JSON.stringify({ plan_id: PLANS[planKey].id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error('URL Checkout tidak ditemukan');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  const isActive = isPremiumUser();

  return (
    <div className="premium-page container">
      <div className="premium-hero">
        <span className="premium-hero__badge">👑 Premium</span>
        <h1 className="premium-hero__title">Islamediaku Premium</h1>
        <p className="premium-hero__sub">Tingkatkan pengalaman Islami Anda dengan fitur eksklusif</p>
      </div>

      <div className="premium-features">
        <h2 style={{textAlign: 'center', marginBottom: '20px', fontSize: 'var(--fs-xl)', color: 'var(--color-text)'}}>Fitur Eksklusif</h2>
        {PLANS.MONTHLY.features.map((feat, i) => (
          <div key={i} className="premium-feat" style={{ animationDelay: `${i * 30}ms` }}>
            <span className="premium-feat__icon">⭐</span>
            <div>
              <h3 className="premium-feat__title">{feat}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="premium-plans">
        {Object.entries(PLANS).map(([key, plan]) => {
          if (plan.id === 'plan_free') return null; // We might want to show it, or just premium plans
          
          const isCurrentPlan = subscription?.plan === plan.id;

          return (
            <div key={plan.id} className={`premium-plan ${plan.bestValue ? 'premium-plan--best' : ''}`}>
              {plan.bestValue && <div className="premium-plan__badge">Terbaik</div>}
              <div className="premium-plan__name">{plan.name}</div>
              <div className="premium-plan__price">{plan.priceLabel}<span>{plan.interval}</span></div>
              {plan.bestValue && <div className="premium-plan__save">Hemat 21%</div>}
              
              <ul className="premium-plan__list">
                {plan.features.slice(0, 3).map((f, idx) => (
                  <li key={idx}>✅ {f}</li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <button className="btn btn--outline btn--lg premium-plan__btn" onClick={() => navigate('/account')}>Paket Aktif (Kelola)</button>
              ) : (
                <button 
                  className={`btn ${plan.bestValue ? 'btn--primary' : 'btn--outline'} btn--lg premium-plan__btn`}
                  onClick={() => handleCheckout(key)}
                  disabled={loadingPlan === key || isActive}
                >
                  {loadingPlan === key ? 'Memproses...' : (isActive ? 'Paket Aktif' : 'Pilih Paket')}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isActive && (
        <p className="premium-note" style={{color: 'var(--color-primary)'}}>✅ Anda adalah member Premium. <span onClick={() => navigate('/account')} style={{textDecoration: 'underline', cursor: 'pointer'}}>Kelola Akun</span></p>
      )}
      {!isActive && (
        <p className="premium-note">💡 Sistem checkout masih dalam mode Mock Payment untuk tahap pengembangan.</p>
      )}
    </div>
  );
}
