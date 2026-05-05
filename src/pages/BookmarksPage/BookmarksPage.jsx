import { useApp } from '../../context/AppContext';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';
import './BookmarksPage.css';

export default function BookmarksPage() {
  const { bookmarkedKhutbah } = useApp();

  return (
    <div className="bookmarks-page">
      <header className="bookmarks-header container">
        <h1 className="bookmarks-header__title">🔖 Tersimpan</h1>
        <p className="bookmarks-header__count">
          {bookmarkedKhutbah.length} khutbah disimpan
        </p>
      </header>
      <main className="bookmarks-body container">
        {bookmarkedKhutbah.length > 0 ? (
          <div className="bookmarks-list">
            {bookmarkedKhutbah.map(khutbah => (
              <KhutbahCard key={khutbah.id} khutbah={khutbah} />
            ))}
          </div>
        ) : (
          <div className="bookmarks-empty">
            <div className="bookmarks-empty__icon">🔖</div>
            <p className="bookmarks-empty__title">Belum ada khutbah tersimpan</p>
            <p className="bookmarks-empty__text">
              Tap ikon bookmark pada khutbah untuk menyimpannya.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
