import { useState, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSEO } from '../../utils/seo';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import './AuthPage.css';

export default function AuthPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isRegisterRoute = location.pathname === '/register';

  const [mode, setMode] = useState(isRegisterRoute ? 'register' : 'login');
  // mode: 'login' | 'register' | 'forgot'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const { login, register, resetPassword, isSupabaseReady } = useAuth();
  const navigate = useNavigate();

  // URL-based status messages from /auth/callback redirect
  const confirmed = searchParams.get('confirmed') === 'true';
  const confirmationError = searchParams.get('confirmation_error') === 'true';

  // Dismiss URL banner by clearing search params
  const dismissUrlBanner = useMemo(() => {
    return () => {
      const url = new URL(window.location);
      url.searchParams.delete('confirmed');
      url.searchParams.delete('confirmation_error');
      window.history.replaceState(null, '', url.pathname);
    };
  }, []);

  useSEO({
    title: mode === 'register' ? 'Daftar | Islamediaku'
         : mode === 'forgot' ? 'Lupa Kata Sandi | Islamediaku'
         : 'Masuk | Islamediaku',
    description: 'Masuk atau daftar untuk mengakses Ruang User Islamediaku.',
    path: mode === 'register' ? '/register' : '/login'
  });

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
    dismissUrlBanner();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    dismissUrlBanner();
    setLoading(true);

    try {
      const { error: authError } = await login(email, password);
      if (authError) {
        const msg = authError.message;
        if (msg.includes('Invalid login credentials')) {
          setError('Email atau kata sandi salah.');
        } else if (msg.includes('konfirmasi email')) {
          setError(msg);
        } else {
          setError(msg || 'Terjadi kesalahan saat masuk.');
        }
        return;
      }
      const from = location.state?.from?.pathname || '/ruang-user';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat masuk.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await register(email, password, name.trim());
      if (authError) {
        const msg = authError.message;
        if (msg.includes('already registered')) {
          setError('Email sudah terdaftar. Silakan masuk.');
        } else {
          setError(msg || 'Terjadi kesalahan saat mendaftar.');
        }
        return;
      }
      setSuccessMessage('register');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Masukkan alamat email Anda.');
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await resetPassword(email.trim());
      if (resetError) {
        setError(resetError.message || 'Gagal mengirim link reset.');
        return;
      }
      setSuccessMessage('forgot');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  // ── Supabase not configured ──
  if (!isSupabaseReady) {
    return (
      <div className="auth-page container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-logo">🕌</span>
            <h2>Fitur Autentikasi</h2>
            <p>Fitur autentikasi belum tersedia. Hubungi administrator.</p>
          </div>
          {import.meta.env.DEV && (
            <div className="auth-dev-warning">
              <strong>⚠️ Development:</strong> Supabase env belum dikonfigurasi.
              Tambahkan <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> ke file <code>.env</code>
            </div>
          )}
          <div className="auth-footer">
            <Link to="/" className="auth-back-link">
              <ArrowLeft size={14} /> Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Email confirmed success (from /auth/callback redirect) ──
  if (confirmed) {
    return (
      <div className="auth-page container">
        <div className="auth-card">
          <div className="auth-success">
            <CheckCircle2 size={48} className="auth-success-icon" />
            <h2>Selamat, akun Anda berhasil dikonfirmasi!</h2>
            <p>
              Akun Anda sudah aktif. Selamat bergabung di Islamediaku, sahabat ibadah harian
              untuk sholat, Al-Qur'an, dzikir, tilawah, dan kebiasaan baik.
            </p>
          </div>
          <button
            className="btn btn--primary auth-submit"
            onClick={() => { dismissUrlBanner(); switchMode('login'); }}
          >
            Masuk ke Akun
          </button>
        </div>
      </div>
    );
  }

  // ── Email confirmation failed (from /auth/callback redirect) ──
  if (confirmationError) {
    return (
      <div className="auth-page container">
        <div className="auth-card">
          <div className="auth-success">
            <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: 'var(--sp-4)' }} />
            <h2>Konfirmasi Gagal</h2>
            <p>
              Konfirmasi email gagal atau link sudah kedaluwarsa.
              Silakan daftar ulang atau minta link konfirmasi baru.
            </p>
          </div>
          <div className="auth-footer" style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn--primary" onClick={() => { dismissUrlBanner(); switchMode('register'); }}>
              Daftar Ulang
            </button>
            <button className="text-btn" onClick={() => { dismissUrlBanner(); switchMode('login'); }}>
              Kembali ke Masuk
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration success — email pending ──
  if (successMessage === 'register') {
    return (
      <div className="auth-page container">
        <div className="auth-card">
          <div className="auth-success">
            <Mail size={48} className="auth-success-icon" />
            <h2>Pendaftaran Berhasil!</h2>
            <p>
              Pendaftaran berhasil. Silakan cek email <strong>{email}</strong> untuk konfirmasi akun.
              Periksa juga folder spam jika tidak ditemukan di inbox.
            </p>
            <p className="auth-success-note">
              Anda tidak dapat mengakses Ruang User sebelum email dikonfirmasi.
            </p>
          </div>
          <div className="auth-footer">
            <button className="text-btn" onClick={() => switchMode('login')}>
              Sudah konfirmasi? Masuk di sini
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Password reset email sent ──
  if (successMessage === 'forgot') {
    return (
      <div className="auth-page container">
        <div className="auth-card">
          <div className="auth-success">
            <Mail size={48} className="auth-success-icon" />
            <h2>Link Reset Terkirim</h2>
            <p>
              Silakan cek email <strong>{email}</strong> untuk link reset kata sandi Anda.
            </p>
          </div>
          <div className="auth-footer">
            <button className="text-btn" onClick={() => switchMode('login')}>
              Kembali ke Masuk
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main auth forms ──
  return (
    <div className="auth-page container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">🕌</span>
          <h2>
            {mode === 'register' ? 'Buat Akun Baru' :
             mode === 'forgot' ? 'Lupa Kata Sandi' :
             'Selamat Datang'}
          </h2>
          <p>
            {mode === 'register' ? 'Bergabunglah dengan komunitas Islamediaku.' :
             mode === 'forgot' ? 'Masukkan email untuk menerima link reset.' :
             'Masuk untuk mengakses Ruang User Anda.'}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="auth-email">Email</label>
              <div className="form-input-wrap">
                <Mail size={16} className="form-input-icon" />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="nama@email.com"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="auth-password">Kata Sandi</label>
              <div className="form-input-wrap">
                <Lock size={16} className="form-input-icon" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Masukkan kata sandi"
                  autoComplete="current-password"
                />
                <button type="button" className="form-input-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="button" className="auth-forgot-link" onClick={() => switchMode('forgot')}>
              Lupa kata sandi?
            </button>
            <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label htmlFor="auth-name">Nama Lengkap</label>
              <div className="form-input-wrap">
                <UserIcon size={16} className="form-input-icon" />
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Masukkan nama lengkap"
                  autoComplete="name"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="auth-reg-email">Email</label>
              <div className="form-input-wrap">
                <Mail size={16} className="form-input-icon" />
                <input
                  id="auth-reg-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="nama@email.com"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="auth-reg-password">Kata Sandi</label>
              <div className="form-input-wrap">
                <Lock size={16} className="form-input-icon" />
                <input
                  id="auth-reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  autoComplete="new-password"
                />
                <button type="button" className="form-input-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="auth-confirm-password">Konfirmasi Kata Sandi</label>
              <div className="form-input-wrap">
                <Lock size={16} className="form-input-icon" />
                <input
                  id="auth-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Ulangi kata sandi"
                  autoComplete="new-password"
                />
              </div>
            </div>
            <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="auth-forgot-email">Email</label>
              <div className="form-input-wrap">
                <Mail size={16} className="form-input-icon" />
                <input
                  id="auth-forgot-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="nama@email.com"
                  autoComplete="email"
                />
              </div>
            </div>
            <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          {mode === 'login' && (
            <p>
              Belum punya akun?{' '}
              <button className="text-btn" onClick={() => switchMode('register')}>Daftar sekarang</button>
            </p>
          )}
          {mode === 'register' && (
            <p>
              Sudah punya akun?{' '}
              <button className="text-btn" onClick={() => switchMode('login')}>Masuk di sini</button>
            </p>
          )}
          {mode === 'forgot' && (
            <p>
              <button className="text-btn" onClick={() => switchMode('login')}>
                <ArrowLeft size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Kembali ke Masuk
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
