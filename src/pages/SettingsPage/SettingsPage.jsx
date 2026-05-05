import { useApp } from '../../context/AppContext';
import './SettingsPage.css';

export default function SettingsPage() {
  const { fontSize, setFontSize, fontSizeOptions, bookmarks } = useApp();

  return (
    <div className="settings-page">
      <header className="settings-header container">
        <h1 className="settings-header__title">⚙️ Pengaturan</h1>
      </header>
      <main className="settings-body container">
        <section>
          <h2 className="settings-section__title">Tampilan</h2>
          <div className="settings-item">
            <span className="settings-item__label">Ukuran Font</span>
            <div className="settings-font-options">
              {fontSizeOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`settings-font-btn${fontSize === opt.value ? ' active' : ''}`}
                  onClick={() => setFontSize(opt.value)}
                  id={`font-${opt.label.toLowerCase()}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section>
          <h2 className="settings-section__title">Data</h2>
          <div className="settings-item">
            <span className="settings-item__label">Khutbah Tersimpan</span>
            <span className="settings-item__value">{bookmarks.length} item</span>
          </div>
        </section>
        <div className="settings-about">
          <p>KhutbahQu — Materi Khutbah Islam</p>
          <p>Dibuat untuk memudahkan para khatib dan pendakwah.</p>
          <p className="settings-about__version">Versi 1.0.0</p>
        </div>
      </main>
    </div>
  );
}
