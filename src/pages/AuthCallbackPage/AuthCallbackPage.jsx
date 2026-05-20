import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabaseClient } from '../../lib/supabaseClient';
import { useSEO } from '../../utils/seo';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import './AuthCallbackPage.css';

/**
 * Handles Supabase auth callbacks:
 * - ?code=           → PKCE flow (email confirmation, magic link)
 * - #access_token=   → Implicit flow (legacy)
 * - ?error=          → Error from Supabase
 * - ?type=signup     → Email confirmation
 * - ?type=recovery   → Password reset
 *
 * Processes exactly once, then redirects.
 */
export default function AuthCallbackPage() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const processed = useRef(false);

  useSEO({
    title: 'Konfirmasi Email | Islamediaku',
    description: 'Mengkonfirmasi email akun Islamediaku.',
    path: '/auth/callback',
    robots: 'noindex'
  });

  useEffect(() => {
    // Guard: process only once (prevents React StrictMode double-fire & reload loops)
    if (processed.current) return;
    processed.current = true;

    const handleCallback = async () => {
      if (!supabaseClient) {
        setStatus('error');
        setMessage('Supabase belum dikonfigurasi.');
        return;
      }

      // 1. Check for error in URL query params
      const errorParam = searchParams.get('error');
      const errorDesc = searchParams.get('error_description');
      if (errorParam) {
        setStatus('error');
        setMessage(errorDesc || errorParam || 'Terjadi kesalahan saat konfirmasi.');
        autoRedirect('/login?confirmation_error=true', 3000);
        return;
      }

      // 2. Determine callback type
      const code = searchParams.get('code');
      const type = searchParams.get('type'); // 'signup' | 'recovery' | 'magiclink'
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      try {
        let session = null;

        // 2a. PKCE flow: exchange code for session
        if (code) {
          const { data, error } = await supabaseClient.auth.exchangeCodeForSession(code);
          if (error) {
            setStatus('error');
            setMessage(error.message || 'Gagal memverifikasi kode konfirmasi.');
            autoRedirect('/login?confirmation_error=true', 3000);
            return;
          }
          session = data?.session;
        }
        // 2b. Implicit / hash flow: set session from tokens
        else if (accessToken && refreshToken) {
          const { data, error } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            setStatus('error');
            setMessage(error.message || 'Gagal memverifikasi token.');
            autoRedirect('/login?confirmation_error=true', 3000);
            return;
          }
          session = data?.session;
          // Clean hash from URL
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        // 2c. No code or tokens — try getting existing session
        else {
          const { data } = await supabaseClient.auth.getSession();
          session = data?.session;
        }

        // 3. Handle result based on type
        if (session) {
          // Upsert profile for confirmed users
          try {
            const user = session.user;
            await supabaseClient.from('profiles').upsert({
              id: user.id,
              display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pengguna',
              email: user.email,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });
          } catch {
            // Profile upsert failure is non-critical
          }

          if (type === 'recovery') {
            setStatus('success');
            setMessage('Reset kata sandi berhasil. Silakan masuk dengan kata sandi baru.');
            autoRedirect('/login', 2500);
          } else {
            // signup or magiclink confirmation
            setStatus('success');
            setMessage('Email berhasil dikonfirmasi! Mengalihkan ke halaman masuk...');
            // Sign out so user logs in fresh with confirmed status
            await supabaseClient.auth.signOut();
            autoRedirect('/login?confirmed=true', 2000);
          }
        } else {
          // No session obtained
          setStatus('error');
          setMessage('Konfirmasi gagal atau link sudah kedaluwarsa. Silakan coba daftar ulang.');
          autoRedirect('/login?confirmation_error=true', 3000);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err?.message || 'Terjadi kesalahan. Silakan coba lagi.');
        autoRedirect('/login?confirmation_error=true', 3000);
      }
    };

    const autoRedirect = (path, delay) => {
      setTimeout(() => {
        navigate(path, { replace: true });
      }, delay);
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="auth-callback container">
      <div className="auth-callback__card">
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="auth-callback__spinner" />
            <h2>Memproses...</h2>
            <p>Sedang memverifikasi akun Anda.</p>
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
