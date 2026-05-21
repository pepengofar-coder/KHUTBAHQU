import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSEO } from '../../utils/seo';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useSEO({
    title: 'Mengalihkan... | Islamediaku',
    description: 'Mengalihkan ke Ruang Saya.',
    path: location.pathname
  });

  useEffect(() => {
    navigate('/ruang-saya', { replace: true });
  }, [navigate]);

  return (
    <div className="auth-page container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Mengalihkan ke Ruang Saya...</p>
    </div>
  );
}
