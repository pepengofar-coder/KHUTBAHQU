import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSEO } from '../../utils/seo';
import './AuthPage.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useSEO({
    title: `${isLogin ? 'Masuk' : 'Daftar'} | Islamediaku`,
    description: 'Masuk atau daftar untuk menikmati fitur premium Islamediaku.',
    path: isLogin ? '/login' : '/register'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error: authError } = await login(email, password);
        if (authError) throw authError;
      } else {
        const { error: authError } = await register(email, password, name);
        if (authError) throw authError;
        // Opsional: tampilkan toast sukses mendaftar
      }
      
      const from = location.state?.from?.pathname || '/account';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}</h2>
          <p>{isLogin ? 'Masuk untuk mengakses layanan Premium Anda.' : 'Bergabunglah untuk menikmati fitur eksklusif Islamediaku.'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="Masukkan nama lengkap"
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="nama@email.com"
            />
          </div>
          <div className="form-group">
            <label>Kata Sandi</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
            {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
            <button className="text-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
