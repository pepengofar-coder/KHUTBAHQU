import { X } from 'lucide-react';
import './ReaderSettings.css';

export default function ReaderSettings({
  isOpen,
  onClose,
  arabicFontSize,
  setArabicFontSize,
  translationFontSize,
  setTranslationFontSize,
  showTranslation,
  setShowTranslation,
  readingMode,
  setReadingMode,
  focusMode,
  setFocusMode
}) {
  if (!isOpen) return null;

  return (
    <div className="reader-settings-overlay" onClick={onClose}>
      <div className="reader-settings-panel" onClick={e => e.stopPropagation()}>
        <div className="reader-settings__header">
          <h3>Pengaturan Bacaan</h3>
          <button className="reader-settings__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="reader-settings__content">
          
          <div className="settings-group">
            <div className="settings-group__header">
              <label>Mode Fokus (Bebas Iklan & Navigasi)</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="focus-toggle"
                  checked={focusMode}
                  onChange={(e) => setFocusMode(e.target.checked)}
                />
                <label htmlFor="focus-toggle"></label>
              </div>
            </div>
            <p className="settings-desc">Menyembunyikan terjemahan dan kontrol agar lebih khusyuk membaca.</p>
          </div>

          {!focusMode && (
            <div className="settings-group">
              <div className="settings-group__header">
                <label>Tampilkan Terjemahan</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    id="trans-toggle"
                    checked={showTranslation}
                    onChange={(e) => setShowTranslation(e.target.checked)}
                  />
                  <label htmlFor="trans-toggle"></label>
                </div>
              </div>
            </div>
          )}

          <div className="settings-group">
            <label>Ukuran Teks Arab</label>
            <input 
              type="range" 
              min="24" 
              max="64" 
              step="2"
              value={arabicFontSize}
              onChange={(e) => setArabicFontSize(Number(e.target.value))}
              className="range-slider"
            />
          </div>

          {!focusMode && showTranslation && (
            <div className="settings-group">
              <label>Ukuran Terjemahan</label>
              <input 
                type="range" 
                min="12" 
                max="24" 
                step="1"
                value={translationFontSize}
                onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                className="range-slider"
              />
            </div>
          )}

          <div className="settings-group">
            <label>Tema Bacaan</label>
            <div className="theme-options">
              <button 
                className={`theme-btn ${readingMode === 'light' ? 'active' : ''}`}
                onClick={() => setReadingMode('light')}
                style={{ background: '#ffffff', color: '#000' }}
              >
                Terang
              </button>
              <button 
                className={`theme-btn ${readingMode === 'sepia' ? 'active' : ''}`}
                onClick={() => setReadingMode('sepia')}
                style={{ background: '#f4ecd8', color: '#5b4636' }}
              >
                Sepia
              </button>
              <button 
                className={`theme-btn ${readingMode === 'night' ? 'active' : ''}`}
                onClick={() => setReadingMode('night')}
                style={{ background: '#121212', color: '#e0e0e0' }}
              >
                Gelap
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
