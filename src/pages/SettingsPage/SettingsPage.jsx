import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useAdzanAlarm } from '../../hooks/useAdzanAlarm';
import { useSEO } from '../../utils/seo';
import { 
  Moon, MapPin, Type, BookOpen, Focus, 
  Trash2, Smartphone, Download, Info, ShieldAlert,
  ChevronRight, Volume2, CheckCircle2, User
} from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  useSEO({ 
    title: 'Pengaturan | Islamediaku', 
    description: 'Pusat kontrol aplikasi Islamediaku: atur tema, jadwal sholat, mushaf, dan data lokal.', 
    path: '/pengaturan', 
    robots: 'noindex, follow' 
  });

  const { darkMode, toggleDark, appTheme, setAppTheme, fontSize, setFontSize, fontSizeOptions } = useApp();
  const { user } = useAuth();
  
  const THEMES = [
    { id: 'default', name: 'Islamediaku', desc: 'Tema utama Islamediaku dengan biru royal dan aksen lime.', primary: '#0047FF', accent: '#C6FF00' },
    { id: 'sakura', name: 'Sakura', desc: 'Tema lembut, hangat, dan menenangkan.', primary: '#E85D9E', accent: '#FFE066' },
    { id: 'cold', name: 'Cold', desc: 'Tema dingin, bersih, dan nyaman untuk membaca lama.', primary: '#0EA5E9', accent: '#A7F3D0' },
    { id: 'midnight', name: 'Midnight', desc: 'Tema gelap, tegas, dan profesional.', primary: '#1E3A8A', accent: '#84CC16' },
    { id: 'sajadah', name: 'Sajadah', desc: 'Tema hangat bernuansa Islami klasik dan nyaman.', primary: '#166534', accent: '#FACC15' },
  ];
  const { adzanEnabled, toggleAdzan } = useAdzanAlarm();
  
  const [city, setCity] = useState(() => localStorage.getItem('kq_prayer_city') || 'Jakarta');
  const [showTranslation, setShowTranslation] = useState(() => localStorage.getItem('islamediaku_mushaf_trans') !== '0');
  const [focusMode, setFocusMode] = useState(() => localStorage.getItem('islamediaku_mushaf_focus_default') === '1');
  const [appVersion, setAppVersion] = useState({ version: '2.0.0', buildTime: '' });

  // Fetch version info
  useEffect(() => {
    fetch('/version.json')
      .then(res => res.json())
      .then(data => {
        if (data.version) setAppVersion(data);
      })
      .catch(e => console.log('No version.json found', e));
  }, []);

  const saveCity = (v) => { 
    setCity(v); 
    localStorage.setItem('kq_prayer_city', v); 
  };

  const toggleTrans = () => { 
    const next = !showTranslation; 
    setShowTranslation(next); 
    localStorage.setItem('islamediaku_mushaf_trans', next ? '1' : '0'); 
  };

  const toggleFocus = () => {
    const next = !focusMode;
    setFocusMode(next);
    localStorage.setItem('islamediaku_mushaf_focus_default', next ? '1' : '0');
  };

  // Reset Actions
  const resetMission = () => {
    if (window.confirm('Hapus progres Misi Harian hari ini?')) {
      localStorage.removeItem('islamediaku_daily_mission_progress');
      alert('Progres misi harian telah direset.');
    }
  };

  const resetTracker = () => {
    if (window.confirm('Hapus semua riwayat Tracker Ibadah dan Langkah Sehat? Data tidak dapat dikembalikan.')) {
      localStorage.removeItem('islamediaku_tracker_daily');
      localStorage.removeItem('islamediaku_steps_daily');
      localStorage.removeItem('islamediaku_steps_activity_log');
      localStorage.removeItem('islamediaku_steps_target');
      alert('Data Tracker berhasil dihapus.');
    }
  };

  const resetMushaf = () => {
    if (window.confirm('Hapus semua Bookmark dan riwayat bacaan terakhir (Lanjut Baca)?')) {
      localStorage.removeItem('islamediaku_quran_last_read');
      localStorage.removeItem('kq_mushaf_bookmarks');
      alert('Data riwayat Mushaf berhasil dihapus.');
    }
  };

  const resetAllData = () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh aplikasi? Semua data, pengaturan, tracker, dan bookmark akan dihapus secara permanen.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const apkUrl = import.meta.env.VITE_APK_URL || import.meta.env.NEXT_PUBLIC_APK_URL;

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div className="container">
          <h1 className="settings-header__title">Pengaturan</h1>
          <p className="settings-header__subtitle">Pusat kontrol aplikasi Islamediaku</p>
        </div>
      </header>

      <main className="container settings-main">
        
        {/* Tema Aplikasi */}
        <section className="settings-section">
          <div className="settings-section__header-text">
            <h2 className="settings-section__title" style={{ paddingLeft: 0 }}>Tema Aplikasi</h2>
            <p className="settings-section__subtitle">Pilih tampilan yang paling nyaman untukmu.</p>
          </div>
          <div className="theme-grid">
            {THEMES.map(t => (
              <button 
                key={t.id} 
                className={`theme-card ${appTheme === t.id ? 'active' : ''}`}
                onClick={() => setAppTheme(t.id)}
              >
                <div className="theme-card__header">
                  <div className="theme-card__colors">
                    <span className="theme-color-dot" style={{ background: t.primary }} />
                    <span className="theme-color-dot" style={{ background: t.accent }} />
                  </div>
                  {appTheme === t.id && <CheckCircle2 size={18} className="theme-card__check" />}
                </div>
                <div className="theme-card__body">
                  <strong>{t.name}</strong>
                  <p>{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
        
        {/* Tampilan */}
        <section className="settings-section">
          <h2 className="settings-section__title">Tampilan</h2>
          <div className="settings-group">
            <div className="settings-item">
              <div className="settings-item__icon-wrap bg-blue-light">
                <Moon size={20} className="text-primary" />
              </div>
              <div className="settings-item__content">
                <strong>Mode Gelap</strong>
                <p>Tampilan yang nyaman untuk mata</p>
              </div>
              <button className={`settings-toggle ${darkMode ? 'active' : ''}`} onClick={toggleDark}>
                <span className="settings-toggle__thumb" />
              </button>
            </div>
          </div>
        </section>

        {/* Sholat */}
        <section className="settings-section">
          <h2 className="settings-section__title">Sholat & Waktu</h2>
          <div className="settings-group">
            <div className="settings-item">
              <div className="settings-item__icon-wrap bg-lime-light">
                <MapPin size={20} className="text-accent-dark" />
              </div>
              <div className="settings-item__content">
                <strong>Lokasi Sholat</strong>
                <p>Pilih kota acuan jadwal sholat</p>
              </div>
              <select className="settings-select" value={city} onChange={e => saveCity(e.target.value)}>
                {['Jakarta','Surabaya','Bandung','Medan','Semarang','Makassar','Yogyakarta','Malang','Denpasar','Aceh','Padang','Pekanbaru','Palembang','Bogor','Bekasi','Tangerang','Depok','Banjarmasin','Balikpapan','Manado'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="settings-divider" />
            <div className="settings-item">
              <div className="settings-item__icon-wrap bg-lime-light">
                <Volume2 size={20} className="text-accent-dark" />
              </div>
              <div className="settings-item__content">
                <strong>Suara Adzan</strong>
                <p>Putar adzan saat aplikasi terbuka</p>
              </div>
              <button className={`settings-toggle ${adzanEnabled ? 'active' : ''}`} onClick={toggleAdzan}>
                <span className="settings-toggle__thumb" />
              </button>
            </div>
          </div>
        </section>

        {/* Mushaf */}
        <section className="settings-section">
          <h2 className="settings-section__title">Mushaf Al-Qur'an</h2>
          <div className="settings-group">
            <div className="settings-item">
              <div className="settings-item__icon-wrap bg-blue-light">
                <Type size={20} className="text-primary" />
              </div>
              <div className="settings-item__content">
                <strong>Ukuran Font Arab</strong>
                <p>Sesuaikan besar teks ayat</p>
              </div>
              <select className="settings-select" value={fontSize} onChange={e => setFontSize(parseFloat(e.target.value))}>
                {fontSizeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="settings-divider" />
            <div className="settings-item">
              <div className="settings-item__icon-wrap bg-blue-light">
                <BookOpen size={20} className="text-primary" />
              </div>
              <div className="settings-item__content">
                <strong>Tampilkan Terjemahan</strong>
                <p>Terjemahan Bahasa Indonesia</p>
              </div>
              <button className={`settings-toggle ${showTranslation ? 'active' : ''}`} onClick={toggleTrans}>
                <span className="settings-toggle__thumb" />
              </button>
            </div>
            <div className="settings-divider" />
            <div className="settings-item">
              <div className="settings-item__icon-wrap bg-blue-light">
                <Focus size={20} className="text-primary" />
              </div>
              <div className="settings-item__content">
                <strong>Mode Fokus Otomatis</strong>
                <p>Langsung masuk ke Mode Fokus</p>
              </div>
              <button className={`settings-toggle ${focusMode ? 'active' : ''}`} onClick={toggleFocus}>
                <span className="settings-toggle__thumb" />
              </button>
            </div>
          </div>
        </section>

        {/* Data Lokal */}
        <section className="settings-section">
          <h2 className="settings-section__title">Manajemen Data</h2>
          <div className="settings-group">
            <button className="settings-item settings-item--btn" onClick={resetMission}>
              <div className="settings-item__icon-wrap bg-gray-light">
                <Trash2 size={20} className="text-muted" />
              </div>
              <div className="settings-item__content">
                <strong>Reset Misi Harian</strong>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </button>
            <div className="settings-divider" />
            <button className="settings-item settings-item--btn" onClick={resetTracker}>
              <div className="settings-item__icon-wrap bg-gray-light">
                <Trash2 size={20} className="text-muted" />
              </div>
              <div className="settings-item__content">
                <strong>Reset Tracker Ibadah & Langkah</strong>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </button>
            <div className="settings-divider" />
            <button className="settings-item settings-item--btn" onClick={resetMushaf}>
              <div className="settings-item__icon-wrap bg-gray-light">
                <Trash2 size={20} className="text-muted" />
              </div>
              <div className="settings-item__content">
                <strong>Hapus Bookmark Mushaf</strong>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </button>
            <div className="settings-divider" />
            <button className="settings-item settings-item--danger" onClick={resetAllData}>
              <div className="settings-item__icon-wrap bg-red-light">
                <ShieldAlert size={20} className="text-error" />
              </div>
              <div className="settings-item__content">
                <strong>Reset Semua Pengaturan</strong>
                <p>Kembalikan aplikasi ke awal</p>
              </div>
            </button>
          </div>
        </section>

        {/* Aplikasi */}
        <section className="settings-section">
          <h2 className="settings-section__title">Tentang Aplikasi</h2>
          <div className="settings-group">
            <Link to={user ? '/ruang-user' : '/login'} className="settings-item settings-item--btn">
              <div className="settings-item__icon-wrap bg-blue-light">
                <User size={20} className="text-primary" />
              </div>
              <div className="settings-item__content">
                <strong>{user ? 'Ruang User' : 'Masuk / Daftar'}</strong>
                <p>{user ? 'Dashboard ibadah dan aktivitas' : 'Masuk atau buat akun baru'}</p>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </Link>
            <div className="settings-divider" />
            <Link to="/tentang" className="settings-item settings-item--btn">
              <div className="settings-item__icon-wrap bg-blue-light">
                <Info size={20} className="text-primary" />
              </div>
              <div className="settings-item__content">
                <strong>Tentang Islamediaku</strong>
                <p>Platform pendamping harian muslim</p>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </Link>
            <div className="settings-divider" />
            
            <div className="settings-item">
              <div className="settings-item__icon-wrap bg-lime-light">
                <Download size={20} className="text-accent-dark" />
              </div>
              <div className="settings-item__content">
                <strong>Aplikasi Android</strong>
                <p>Pasang APK untuk pengalaman terbaik</p>
              </div>
              {apkUrl ? (
                <button className="settings-btn-action" onClick={() => window.open(apkUrl, '_blank')}>
                  Download
                </button>
              ) : (
                <span className="settings-badge">Belum Tersedia</span>
              )}
            </div>
            <div className="settings-divider" />
            <div className="settings-item">
              <div className="settings-item__icon-wrap bg-gray-light">
                <Smartphone size={20} className="text-muted" />
              </div>
              <div className="settings-item__content">
                <strong>Versi Aplikasi</strong>
                <p>{appVersion.buildTime ? new Date(appVersion.buildTime).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Build terbaru'}</p>
              </div>
              <span className="settings-version-tag">v{appVersion.version}</span>
            </div>
          </div>
          
          <div className="settings-attribution">
            <p>Audio Tilawah Al-Qur'an didukung penuh oleh <strong>MP3Quran.net</strong></p>
          </div>
        </section>

        <div className="settings-footer">
          <p>© {new Date().getFullYear()} Islamediaku</p>
          <p>Dibuat untuk memudahkan ibadah harian.</p>
        </div>

      </main>
    </div>
  );
}
