import { useState, useEffect } from 'react';
import { useSEO } from '../../utils/seo';
import { defaultHomeBanners } from '../../data/homeBanners';
import { Upload, Trash2, Save, ArrowUp, ArrowDown } from 'lucide-react';
import './BannerAdminPage.css';

export default function BannerAdminPage() {
  useSEO({
    title: 'Dashboard Admin Banner | Islamediaku',
    description: 'Kelola Banner Homepage',
    path: '/admin/banners',
    robots: 'noindex, nofollow'
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [banners, setBanners] = useState([]);

  // Check auth or load data
  useEffect(() => {
    const envPasscode = import.meta.env.VITE_ADMIN_PASSCODE;
    
    // If no passcode is set in env, we allow access but show a warning
    if (!envPasscode) {
      setIsAuthenticated(true);
      loadBanners();
      return;
    }

    // Check session
    const authed = sessionStorage.getItem('islamediaku_admin_authed');
    if (authed === 'true') {
      setIsAuthenticated(true);
      loadBanners();
    }
  }, []);

  const loadBanners = () => {
    const localData = localStorage.getItem('islamediaku_admin_home_banners');
    if (localData) {
      try {
        setBanners(JSON.parse(localData));
      } catch (e) {
        setBanners(defaultHomeBanners);
      }
    } else {
      // Create deep copy of default
      setBanners(JSON.parse(JSON.stringify(defaultHomeBanners)));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const envPasscode = import.meta.env.VITE_ADMIN_PASSCODE;
    if (passcode === envPasscode) {
      sessionStorage.setItem('islamediaku_admin_authed', 'true');
      setIsAuthenticated(true);
      setError('');
      loadBanners();
    } else {
      setError('Passcode salah.');
    }
  };

  const handleSave = () => {
    localStorage.setItem('islamediaku_admin_home_banners', JSON.stringify(banners));
    alert('Banner berhasil disimpan ke local storage!');
  };

  const handleReset = () => {
    if (window.confirm('Reset semua banner ke bawaan?')) {
      const defaultData = JSON.parse(JSON.stringify(defaultHomeBanners));
      setBanners(defaultData);
      localStorage.setItem('islamediaku_admin_home_banners', JSON.stringify(defaultData));
    }
  };

  const handleChange = (id, field, value) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (e.g., max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange(id, 'imageUrl', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const moveBanner = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === banners.length - 1) return;

    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[index + direction];
    newBanners[index + direction] = temp;

    // Update sortOrder
    newBanners.forEach((b, i) => b.sortOrder = i + 1);
    setBanners(newBanners);
  };

  if (!isAuthenticated) {
    const hasEnvConfig = !!import.meta.env.VITE_ADMIN_PASSCODE;
    return (
      <div className="container banner-admin-page">
        <div className="banner-admin-auth">
          <h2>Akses Admin</h2>
          {hasEnvConfig ? (
            <form onSubmit={handleLogin}>
              <input 
                type="password" 
                placeholder="Masukkan Passcode" 
                value={passcode} 
                onChange={e => setPasscode(e.target.value)}
                autoFocus
              />
              <button type="submit">Masuk</button>
              {error && <p>{error}</p>}
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text)', marginBottom: 'var(--sp-4)' }}>Passcode admin (VITE_ADMIN_PASSCODE) belum dikonfigurasi di .env.</p>
              <button onClick={() => { setIsAuthenticated(true); loadBanners(); }}>Lanjutkan ke Dashboard Sementara</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container banner-admin-page">
      <div className="banner-admin-header">
        <h1 className="banner-admin-title">Dashboard Admin</h1>
        <p className="banner-admin-subtitle">Kelola Banner Homepage (Kajian Highlight)</p>
      </div>

      <div className="banner-admin-list">
        {banners.map((banner, index) => (
          <div key={banner.id} className="banner-admin-card">
            <div className="banner-admin-card__header">
              <div className="banner-admin-card__title-row">
                Banner {index + 1}
                <div 
                  className={`banner-admin-toggle ${banner.isActive ? 'active' : ''}`}
                  onClick={() => handleChange(banner.id, 'isActive', !banner.isActive)}
                >
                  <div className="banner-admin-toggle-track">
                    <div className="banner-admin-toggle-thumb" />
                  </div>
                </div>
              </div>
              <div className="banner-admin-card__actions">
                <button 
                  className="icon-btn" 
                  onClick={() => moveBanner(index, -1)} 
                  disabled={index === 0}
                  title="Geser ke atas"
                >
                  <ArrowUp size={18} />
                </button>
                <button 
                  className="icon-btn" 
                  onClick={() => moveBanner(index, 1)} 
                  disabled={index === banners.length - 1}
                  title="Geser ke bawah"
                >
                  <ArrowDown size={18} />
                </button>
              </div>
            </div>

            <div className="banner-admin-card__body">
              <div className="banner-admin-image-section">
                <div className="banner-admin-image-preview">
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt="Preview" />
                  ) : (
                    <span className="banner-admin-image-preview-placeholder">Fallback Gradient</span>
                  )}
                </div>
                <div className="banner-admin-image-actions">
                  <label className="banner-admin-image-upload">
                    <Upload size={16} /> Upload Gambar
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(banner.id, e)} />
                  </label>
                  {banner.imageUrl && (
                    <button className="banner-admin-image-remove" onClick={() => handleChange(banner.id, 'imageUrl', '')} title="Hapus Gambar">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="banner-admin-fields">
                <div className="banner-admin-field">
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={banner.title} 
                    onChange={e => handleChange(banner.id, 'title', e.target.value)} 
                  />
                </div>
                <div className="banner-admin-field">
                  <label>Subtitle</label>
                  <input 
                    type="text" 
                    value={banner.subtitle} 
                    onChange={e => handleChange(banner.id, 'subtitle', e.target.value)} 
                  />
                </div>
                <div className="banner-admin-field">
                  <label>CTA Label</label>
                  <input 
                    type="text" 
                    value={banner.ctaLabel} 
                    onChange={e => handleChange(banner.id, 'ctaLabel', e.target.value)} 
                  />
                </div>
                <div className="banner-admin-field">
                  <label>CTA Target URL</label>
                  <input 
                    type="text" 
                    value={banner.ctaHref} 
                    onChange={e => handleChange(banner.id, 'ctaHref', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="banner-admin-save-bar">
        <button className="btn btn--outline" onClick={handleReset}>Reset Data</button>
        <button className="btn-save-banners" onClick={handleSave}>
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
