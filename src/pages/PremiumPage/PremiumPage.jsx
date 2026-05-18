/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePremium } from '../../context/PremiumContext';
import { useSEO } from '../../utils/seo';
import { PLANS } from '../../config/premium';
import { Crown, Sparkles, Construction } from 'lucide-react';
import './PremiumPage.css';

export default function PremiumPage() {
  const { user } = useAuth();
  const { isPremiumUser } = usePremium();
  const navigate = useNavigate();

  useSEO({ title: 'Islamediaku Premium — Segera Hadir | Islamediaku', description: 'Fitur Premium Islamediaku sedang dalam tahap pengembangan. Nantikan pembaruannya!', path: '/premium' });

  const isActive = isPremiumUser();

  return (
    <div className="premium-page container">
      <div className="premium-hero">
        <span className="premium-hero__badge"><Crown size={14} style={{marginRight: 4}} /> Segera Hadir</span>
        <h1 className="premium-hero__title">Islamediaku Premium</h1>
        <p className="premium-hero__sub">Pengalaman Islami tanpa batas sedang kami siapkan untuk Anda.</p>
      </div>

      <div className="premium-coming-soon">
        <Construction size={48} color="var(--color-primary)" style={{marginBottom: '1rem'}} />
        <h2>Fitur Premium Sedang Ditahan</h2>
        <p>Terima kasih atas antusiasme Anda! Saat ini, kami sedang fokus meningkatkan fitur-fitur dasar dan antarmuka aplikasi. Sistem langganan Premium dan pembayaran ditahan sementara waktu dan belum tersedia.</p>
      </div>

      <div className="premium-features" style={{ opacity: 0.7, pointerEvents: 'none', filter: 'grayscale(0.5)' }}>
        <h2 style={{textAlign: 'center', marginBottom: '20px', fontSize: 'var(--fs-xl)', color: 'var(--color-text)'}}>Fitur Eksklusif (Mendatang)</h2>
        {PLANS.MONTHLY.features.map((feat, i) => (
          <div key={i} className="premium-feat">
            <span className="premium-feat__icon"><Sparkles size={16} /></span>
            <div>
              <h3 className="premium-feat__title">{feat}</h3>
            </div>
          </div>
        ))}
      </div>

      {isActive && (
        <p className="premium-note" style={{color: 'var(--color-primary)'}}>✅ Anda memiliki akses khusus. <span onClick={() => navigate('/account')} style={{textDecoration: 'underline', cursor: 'pointer'}}>Kelola Akun</span></p>
      )}
    </div>
  );
}
