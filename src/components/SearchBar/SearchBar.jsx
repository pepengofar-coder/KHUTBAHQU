import { useApp } from '../../context/AppContext';
import './SearchBar.css';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div className="search-bar" role="search">
      <div className="search-bar__input-wrapper">
        <span className="search-bar__icon" aria-hidden="true">🔍</span>
        <input
          id="search-input"
          type="search"
          className="search-bar__input"
          placeholder='Cari tema (contoh: Sabar, Riba, Lisan...)'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Cari khutbah"
          autoComplete="off"
        />
        <button
          className={`search-bar__clear${searchQuery ? ' visible' : ''}`}
          onClick={() => setSearchQuery('')}
          aria-label="Hapus pencarian"
          tabIndex={searchQuery ? 0 : -1}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
