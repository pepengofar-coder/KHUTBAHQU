import { useApp } from '../../context/AppContext';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryTags from '../../components/CategoryTags/CategoryTags';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';
import './HomePage.css';

export default function HomePage() {
  const { filteredKhutbah, searchQuery, activeCategory } = useApp();

  const showingFiltered = searchQuery || activeCategory;

  return (
    <div className="home-page">
      {/* Sticky Header */}
      <header className="home-header container">
        <div className="home-header__bar">
          <div className="home-header__logo">
            <span className="home-header__icon" aria-hidden="true">📖</span>
            <h1 className="home-header__title">KhutbahQu</h1>
          </div>
        </div>

        {/* Search */}
        <SearchBar />
      </header>

      <main className="container">
        {/* Bismillah Banner */}
        {!showingFiltered && (
          <div className="bismillah-banner">
            <p className="bismillah-banner__arabic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
            <p className="bismillah-banner__text">Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang</p>
          </div>
        )}

        {/* Categories */}
        <section className="home-section">
          <CategoryTags />
        </section>

        {/* Khutbah List */}
        <section className="home-section">
          <h2 className="home-section__title">
            {showingFiltered
              ? `Hasil Pencarian (${filteredKhutbah.length})`
              : 'Terbaru Minggu Ini:'
            }
          </h2>

          {filteredKhutbah.length > 0 ? (
            <div className="khutbah-list">
              {filteredKhutbah.map(khutbah => (
                <KhutbahCard key={khutbah.id} khutbah={khutbah} />
              ))}
            </div>
          ) : (
            <div className="khutbah-list__empty">
              <div className="khutbah-list__empty-icon">🔍</div>
              <p className="khutbah-list__empty-text">Khutbah tidak ditemukan</p>
              <p className="khutbah-list__empty-subtext">Coba kata kunci lain atau ubah filter kategori</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
