import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function PageModeView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasValidPageData, setHasValidPageData] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    // Simulate safe data fetching timeout
    const timeout = setTimeout(() => {
      if (isMounted) {
        setHasValidPageData(false);
        setLoading(false);
        setError("Data halaman tidak ditemukan");
      }
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="rsm-loading" style={{ minHeight: '300px' }}>
        Memuat Halaman...
      </div>
    );
  }

  if (!hasValidPageData || error) {
    return (
      <div className="rsm-page-mode">
        <div className="rsm-page-container" style={{ textAlign: 'center', padding: '32px' }}>
          <BookOpen size={48} className="rsm-page-placeholder-icon" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h2 className="rsm-page-placeholder-title" style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
            Mushaf Per Halaman
          </h2>
          <p className="rsm-page-placeholder-text" style={{ fontSize: '15px', lineHeight: 1.6, marginBottom: '24px', color: 'var(--rsm-text-muted)' }}>
            Mode mushaf per halaman sedang disiapkan. Untuk menjaga keakuratan teks Al-Qur'an, halaman ini hanya akan aktif setelah terhubung ke sumber mushaf yang valid.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <Link 
              to="/mushaf" 
              className="rsm-page-placeholder-btn" 
              style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', width: '100%', maxWidth: '280px' }}
            >
              Buka Mushaf Biasa
            </Link>
            <Link 
              to="/ruang-saya" 
              className="rsm-page-placeholder-btn" 
              style={{ backgroundColor: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', width: '100%', maxWidth: '280px' }}
            >
              Kembali ke Ruang Saya
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
