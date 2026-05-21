import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, X } from 'lucide-react';
import { useSEO } from '../../utils/seo';
import ReadingModeView from './ReadingModeView';
import PageModeView from './PageModeView';
import './RuangSayaMushaf.css';

function safeJsonParse(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export default function RuangSayaMushaf() {
  useSEO({
    title: 'Mushaf Per Halaman | Islamediaku',
    description: 'Baca Al-Qur\'an dengan mode fokus seperti mushaf cetak.',
    path: '/ruang-saya/mushaf',
    robots: 'noindex, follow',
  });

  const navigate = useNavigate();

  // Settings State
  const [mode, setMode] = useState(() => localStorage.getItem('islamediaku_user_mushaf_mode') || 'reading');
  const [theme, setTheme] = useState(() => localStorage.getItem('islamediaku_user_mushaf_theme') || 'light');
  const [arabicFontSize, setArabicFontSize] = useState(() => {
    const val = parseInt(localStorage.getItem('islamediaku_user_mushaf_arabic_size'), 10);
    return isNaN(val) ? 32 : val;
  });
  const [translationFontSize, setTranslationFontSize] = useState(() => {
    const val = parseInt(localStorage.getItem('islamediaku_user_mushaf_trans_size'), 10);
    return isNaN(val) ? 15 : val;
  });
  const [showTranslation, setShowTranslation] = useState(() => localStorage.getItem('islamediaku_user_mushaf_show_trans') !== 'false');

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => safeJsonParse('islamediaku_user_mushaf_bookmarks', []));
  const [lastRead, setLastRead] = useState(() => safeJsonParse('islamediaku_user_mushaf_last_read', { surahId: 1 }));

  // Save Settings
  useEffect(() => {
    localStorage.setItem('islamediaku_user_mushaf_mode', mode);
    localStorage.setItem('islamediaku_user_mushaf_theme', theme);
    localStorage.setItem('islamediaku_user_mushaf_arabic_size', arabicFontSize);
    localStorage.setItem('islamediaku_user_mushaf_trans_size', translationFontSize);
    localStorage.setItem('islamediaku_user_mushaf_show_trans', showTranslation);
    localStorage.setItem('islamediaku_user_mushaf_last_read', JSON.stringify(lastRead));
  }, [mode, theme, arabicFontSize, translationFontSize, showTranslation, lastRead]);

  const toggleBookmark = (verseKey) => {
    setBookmarks(prev => {
      const newB = prev.includes(verseKey) ? prev.filter(k => k !== verseKey) : [...prev, verseKey];
      localStorage.setItem('islamediaku_user_mushaf_bookmarks', JSON.stringify(newB));
      return newB;
    });
  };

  const settingsObj = {
    arabicFontSize,
    translationFontSize,
    showTranslation,
    theme
  };

  return (
    <div className={`rsm-page theme-${theme}`}>
      <header className="rsm-header">
        <div className="rsm-header__left">
          <button className="rsm-header__btn" onClick={() => navigate('/ruang-saya')}>
            <ArrowLeft size={24} />
          </button>
          <div className="rsm-header__title">
            <h1>Mushaf</h1>
            <span>Mode Fokus</span>
          </div>
        </div>

        <div className="rsm-tabs">
          <button 
            className={`rsm-tab ${mode === 'reading' ? 'active' : ''}`}
            onClick={() => setMode('reading')}
          >
            Reading Mode
          </button>
          <button 
            className={`rsm-tab ${mode === 'page' ? 'active' : ''}`}
            onClick={() => setMode('page')}
          >
            Page Mode
          </button>
        </div>

        <div className="rsm-header__right">
          <button className="rsm-header__btn" onClick={() => setSettingsOpen(true)}>
            <Settings size={22} />
          </button>
        </div>
      </header>

      <main className="rsm-main">
        {mode === 'reading' ? (
          <ReadingModeView 
            settings={settingsObj}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            lastRead={lastRead}
            setLastRead={setLastRead}
          />
        ) : (
          <PageModeView />
        )}
      </main>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="rsm-settings-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="rsm-settings-modal" onClick={e => e.stopPropagation()}>
            <div className="rsm-settings-header">
              <h2>Pengaturan Bacaan</h2>
              <button className="rsm-settings-close" onClick={() => setSettingsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="rsm-settings-group">
              <label>Tema</label>
              <div className="rsm-theme-selector">
                <button 
                  className={`rsm-theme-btn rsm-theme-btn--light ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  Terang
                </button>
                <button 
                  className={`rsm-theme-btn rsm-theme-btn--sepia ${theme === 'sepia' ? 'active' : ''}`}
                  onClick={() => setTheme('sepia')}
                >
                  Sepia
                </button>
                <button 
                  className={`rsm-theme-btn rsm-theme-btn--night ${theme === 'night' ? 'active' : ''}`}
                  onClick={() => setTheme('night')}
                >
                  Gelap
                </button>
              </div>
            </div>

            <div className="rsm-settings-group">
              <label>Ukuran Teks Arab: {arabicFontSize}px</label>
              <div className="rsm-range-wrap">
                <span style={{ fontSize: '14px' }}>A</span>
                <input 
                  type="range" min="20" max="60" step="2"
                  value={arabicFontSize}
                  onChange={(e) => setArabicFontSize(Number(e.target.value))}
                />
                <span style={{ fontSize: '24px' }}>A</span>
              </div>
            </div>

            <div className="rsm-settings-group">
              <div className="rsm-toggle-wrap">
                <label style={{ margin: 0 }}>Tampilkan Terjemahan</label>
                <input 
                  type="checkbox"
                  checked={showTranslation}
                  onChange={(e) => setShowTranslation(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>
            </div>

            {showTranslation && (
              <div className="rsm-settings-group">
                <label>Ukuran Terjemahan: {translationFontSize}px</label>
                <div className="rsm-range-wrap">
                  <span style={{ fontSize: '12px' }}>A</span>
                  <input 
                    type="range" min="12" max="24" step="1"
                    value={translationFontSize}
                    onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                  />
                  <span style={{ fontSize: '18px' }}>A</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
