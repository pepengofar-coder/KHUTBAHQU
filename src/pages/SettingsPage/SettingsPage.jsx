import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAdzanAlarm } from '../../hooks/useAdzanAlarm';
import { useSEO } from '../../utils/seo';
import './SettingsPage.css';

export default function SettingsPage() {
  useSEO({ title: 'Pengaturan | Islamediaku', description: 'Atur preferensi aplikasi Islamediaku: tema, lokasi sholat, ukuran font, dan lainnya.', path: '/pengaturan', robots: 'noindex, follow' });

  const { darkMode, toggleDark, fontSize, setFontSize, fontSizeOptions } = useApp();
  const { adzanEnabled, toggleAdzan } = useAdzanAlarm();
  
  const [city, setCity] = useState(() => localStorage.getItem('kq_prayer_city') || 'Jakarta');
  const [showTranslation, setShowTranslation] = useState(() => localStorage.getItem('kq_mushaf_trans') !== '0');

  const saveCity = (v) => { setCity(v); localStorage.setItem('kq_prayer_city', v); };
  const toggleTrans = () => { const next = !showTranslation; setShowTranslation(next); localStorage.setItem('kq_mushaf_trans', next ? '1' : '0'); };

  const resetData = () => {
    if (window.confirm('Hapus semua data lokal (bookmark, riwayat, tracker, tasbih)? Data tidak dapat dikembalikan.')) {
      const keys = ['kq_bm', 'kq_rv', 'kq_tracker', 'kq_tasbih_count', 'kq_tasbih_target', 'kq_dzikir_done', 'kq_mushaf_last', 'kq_mushaf_bookmarks'];
      keys.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  return (
    <div className="settings-page container">
      <div className="settings-page__header">
        <h1 className="settings-page__title">Pengaturan</h1>
      </div>

      <div className="settings-section">
        <h2 className="settings-section__title">🎨 Tampilan</h2>
        <div className="settings-item">
          <div>
            <strong>Mode Gelap</strong>
            <p>Aktifkan tampilan gelap untuk kenyamanan mata</p>
          </div>
          <button className={`settings-toggle${darkMode ? ' active' : ''}`} onClick={toggleDark}>
            <span className="settings-toggle__thumb" />
          </button>
        </div>
        <div className="settings-item">
          <div>
            <strong>Ukuran Font</strong>
            <p>Atur ukuran teks untuk kenyamanan membaca</p>
          </div>
          <select className="settings-select" value={fontSize} onChange={e => setFontSize(parseFloat(e.target.value))}>
            {fontSizeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-section__title">🕌 Sholat</h2>
        <div className="settings-item">
          <div>
            <strong>Kota Sholat</strong>
            <p>Pilih kota untuk jadwal sholat</p>
          </div>
          <select className="settings-select" value={city} onChange={e => saveCity(e.target.value)}>
            {['Jakarta','Surabaya','Bandung','Medan','Semarang','Makassar','Yogyakarta','Malang','Denpasar','Aceh','Padang','Pekanbaru','Palembang','Bogor','Bekasi','Tangerang','Depok','Banjarmasin','Balikpapan','Manado'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="settings-item">
          <div>
            <strong>Alarm Adzan</strong>
            <p>Putar suara adzan dan notifikasi saat waktu sholat</p>
          </div>
          <button className={`settings-toggle${adzanEnabled ? ' active' : ''}`} onClick={toggleAdzan}>
            <span className="settings-toggle__thumb" />
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-section__title">📖 Mushaf</h2>
        <div className="settings-item">
          <div>
            <strong>Terjemahan</strong>
            <p>Tampilkan terjemahan Indonesia di bawah ayat</p>
          </div>
          <button className={`settings-toggle${showTranslation ? ' active' : ''}`} onClick={toggleTrans}>
            <span className="settings-toggle__thumb" />
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-section__title">⚠️ Data</h2>
        <div className="settings-item settings-item--danger">
          <div>
            <strong>Reset Semua Data</strong>
            <p>Hapus bookmark, riwayat, tracker, dan tasbih</p>
          </div>
          <button className="settings-btn-danger" onClick={resetData}>Reset</button>
        </div>
      </div>

      <div className="settings-about">
        <p><strong>Islamediaku</strong> v2.0.0</p>
        <p>Platform Islamic Companion App</p>
        <p>© 2026 Islamediaku</p>
      </div>
    </div>
  );
}
