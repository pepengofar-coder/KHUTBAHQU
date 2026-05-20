import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, History, BookMarked, BookOpen } from 'lucide-react';
import { useSEO } from '../../utils/seo';
import SurahCard from './components/SurahCard';
import './MushafPage.css';

export default function MushafPage() {
  useSEO({
    title: "Al-Qur'an Digital | Islamediaku",
    description: "Baca, dengarkan, cari, dan renungkan ayat Al-Qur'an. Mushaf Madinah online gratis dengan terjemahan Indonesia.",
    path: '/mushaf',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('surah'); // 'surah', 'favorit', 'terakhir'

  const [bookmarks, setBookmarks] = useState([]);
  const [lastRead, setLastRead] = useState(null);

  // Load from local storage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    try {
      const storedBookmarks = JSON.parse(localStorage.getItem('islamediaku_quran_bookmarks') || '[]');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookmarks(storedBookmarks);
      const storedLastRead = JSON.parse(localStorage.getItem('islamediaku_quran_last_read') || 'null');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastRead(storedLastRead);
    } catch (err) {
      console.error("Local storage error", err);
    }
  }, []);

  // Backward compatibility for ?surah=X
  useEffect(() => {
    const s = searchParams.get('surah');
    if (s && !isNaN(parseInt(s))) {
      navigate(`/mushaf/${s}`, { replace: true });
    }
  }, [searchParams, navigate]);

  // Fetch list of Surahs
  useEffect(() => {
    fetch('https://api.quran.com/api/v4/chapters?language=id')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.chapters);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load surahs", err);
        setError("Gagal memuat daftar surah.");
        setLoading(false);
      });
  }, []);

  const filteredSurahs = useMemo(() => {
    let result = surahs;
    
    // Tab Filter
    if (activeTab === 'favorit') {
      // Find surahs that have bookmarked ayahs
      const bookmarkedSurahIds = [...new Set(bookmarks.map(b => parseInt(b.split(':')[0])))];
      result = result.filter(s => bookmarkedSurahIds.includes(s.id));
    } else if (activeTab === 'terakhir') {
      if (lastRead) {
        result = result.filter(s => s.id === lastRead.surah);
      } else {
        result = [];
      }
    }

    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name_simple.toLowerCase().includes(q) ||
        s.translated_name.name.toLowerCase().includes(q) ||
        s.id.toString() === q
      );
    }
    
    return result;
  }, [surahs, activeTab, searchQuery, bookmarks, lastRead]);

  return (
    <div className="mushaf-home container">
      <header className="mushaf-home__header">
        <h1 className="mushaf-home__title">Al-Qur'an</h1>
        <p className="mushaf-home__subtitle">Baca, dengarkan, cari, dan renungkan ayat Al-Qur'an.</p>
      </header>

      {lastRead && !searchQuery && activeTab === 'surah' && (
        <div className="mushaf-home__last-read">
          <div className="mushaf-home__last-read-content">
            <span className="mushaf-home__last-read-label">
              <History size={16} /> Terakhir Dibaca
            </span>
            <h3>{lastRead.surahName}</h3>
            <p>Ayat {lastRead.ayah}</p>
          </div>
          <Link to={`/mushaf/${lastRead.surah}`} className="btn btn--primary">
            Lanjut Baca
          </Link>
        </div>
      )}

      <div className="mushaf-home__search-bar">
        <Search className="mushaf-home__search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Cari surah (misal: Baqarah, Sapi, 2)"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mushaf-home__tabs">
        <button 
          className={`mushaf-home__tab ${activeTab === 'surah' ? 'active' : ''}`}
          onClick={() => setActiveTab('surah')}
        >
          <BookOpen size={18} /> Surah
        </button>
        <button 
          className={`mushaf-home__tab ${activeTab === 'favorit' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorit')}
        >
          <BookMarked size={18} /> Favorit
        </button>
        <button 
          className={`mushaf-home__tab ${activeTab === 'terakhir' ? 'active' : ''}`}
          onClick={() => setActiveTab('terakhir')}
        >
          <History size={18} /> Terakhir Dibaca
        </button>
      </div>

      <main className="mushaf-home__content">
        {loading && <div className="mushaf-home__loading">Memuat daftar surah...</div>}
        {error && <div className="mushaf-home__error">{error}</div>}
        
        {!loading && !error && filteredSurahs.length === 0 && (
          <div className="mushaf-home__empty">
            <p>Tidak ada surah yang ditemukan.</p>
          </div>
        )}

        {!loading && !error && filteredSurahs.length > 0 && (
          <div className="mushaf-home__grid">
            {filteredSurahs.map(surah => (
              <SurahCard 
                key={surah.id} 
                surah={surah} 
                isFavorite={bookmarks.some(b => b.startsWith(`${surah.id}:`))}
                lastReadAyah={lastRead && lastRead.surah === surah.id ? lastRead.ayah : null}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
