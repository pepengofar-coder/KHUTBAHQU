import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../../lib/supabaseClient';
import { useSEO } from '../../utils/seo';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import './AuthCallbackPage.css';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useSEO({
    title: 'Konfirmasi Email | Islamediaku',
    description: 'Mengkonfirmasi email akun Islamediaku.',
    path: '/auth/callback',
    robots: 'noindex'
  });

  useEffect(() => {
    const handleCallback = async () => {
      if (!supabaseClient) {
        setStatus('error');
        setMessage('Supabase belum dikonfigurasi.');
        return;
      }

      try {
        // Supabase handles the token exchange automatically via the URL hash
        const { data: { session }, error } = await supabaseClient.auth.getSession();

        if (error) {
          setStatus('error');
          setMessage(error.message || 'Terjadi kesalahan saat konfirmasi.');
          return;
        }

        if (session) {
          setStatus('success');
          setMessage('Email berhasil dikonfirmasi! Mengalihkan...');

          // Redirect to Ruang User after 2 seconds
          setTimeout(() => {
            navigate('/ruang-user', { replace: true });
          }, 2000);
        } else {
          // No session yet — might be a password reset or delayed confirmation
          setStatus('success');
          setMessage('Proses berhasil. Silakan masuk ke akun Anda.');

          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2500);
        }
      } catch {
        setStatus('error');
        setMessage('Terjadi kesalahan. Silakan coba lagi.');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="auth-callback container">
      <div className="auth-callback__card">
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="auth-callback__spinner" />
            <h2>Memproses...</h2>
            <p>Sedang mengkonfirmasi email Anda.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 size={48} className="auth-callback__success" />
            <h2>Berhasil!</h2>
            <p>{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle size={48} className="auth-callback__error" />
            <h2>Gagal</h2>
            <p>{message}</p>
            <button className="btn btn--primary" onClick={() => navigate('/login', { replace: true })}>
              Ke Halaman Masuk
            </button>
          </>
        )}
      </div>
    </div>
  );
}
