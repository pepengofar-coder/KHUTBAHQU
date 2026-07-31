import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, History, BookMarked, BookOpen, BookCopy, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useSEO } from '../../utils/seo';
import SurahCard from './components/SurahCard';
import './MushafPage.css';

export default function MushafPage() {
  useSEO({
    title: "Mushaf Al-Qur’an Online - Islamediaku",
    description: "Baca Al-Qur’an online dengan tampilan nyaman, navigasi surah mudah, dan pengalaman membaca yang bersih di Islamediaku.",
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
  const [lastPageState, setLastPageState] = useState(null);

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
      const storedPage = JSON.parse(localStorage.getItem('islamediaku_quran_page_state') || '{}');
      if (storedPage?.last_page) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLastPageRead(storedPage.last_page);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLastPageState(storedPage);
      }
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

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="mushaf-home container">
      <header className="mushaf-home__header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="page-back-btn" onClick={handleBack} aria-label="Kembali">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="mushaf-home__title">Mushaf Al-Qur’an Online</h1>
          <p className="mushaf-home__subtitle">Baca Al-Qur’an online dengan tampilan nyaman, navigasi surah mudah, dan pengalaman membaca yang bersih.</p>
        </div>
      </header>

      {!searchQuery && activeTab === 'surah' && (lastRead || lastPageState) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {lastRead && (
            <div className="mushaf-home__last-read" style={{ margin: 0 }}>
              <div className="mushaf-home__last-read-content">
                <span className="mushaf-home__last-read-label">
                  <History size={16} /> Terakhir Dibaca (Per Ayah)
                </span>
                <h3>{lastRead.surahName}</h3>
                <p>Ayat {lastRead.ayah}</p>
              </div>
              <Link to={`/mushaf/${lastRead.surah}`} className="btn btn--primary">
                Lanjut
              </Link>
            </div>
          )}
          {lastPageState && (
            <div className="mushaf-home__last-read" style={{ margin: 0, background: 'linear-gradient(135deg, rgba(0, 71, 255, 0.08) 0%, rgba(198, 255, 0, 0.12) 100%)', borderColor: 'var(--color-primary)' }}>
              <div className="mushaf-home__last-read-content">
                <span className="mushaf-home__last-read-label" style={{ color: 'var(--color-primary)' }}>
                  <BookCopy size={16} /> Terakhir Dibaca (Per Page)
                </span>
                <h3>Halaman {lastPageState.last_page}</h3>
                <p>{lastPageState.surah_name ? `${lastPageState.surah_name}${lastPageState.juz ? ` • Juz ${lastPageState.juz}` : ''}` : 'Mushaf Madinah'}</p>
              </div>
              <Link to={`/mushaf/page/${lastPageState.last_page}`} className="btn btn--primary">
                Lanjut
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="mushaf-mode-selector">
        <div className="mushaf-mode-card mushaf-mode-card--active">
          <div className="mushaf-mode-card__badge"><Check size={12} /></div>
          <div className="mushaf-mode-card__icon mushaf-mode-card__icon--surah">
            <BookOpen size={28} />
          </div>
          <h3 className="mushaf-mode-card__title">Mushaf per Ayah</h3>
          <p className="mushaf-mode-card__desc">Baca Al-Qur'an per surah dengan terjemahan ayat demi ayat</p>
        </div>
        <Link to={`/mushaf/page/${lastPageRead || 1}`} className="mushaf-mode-card mushaf-mode-card--link">
          <div className="mushaf-mode-card__icon mushaf-mode-card__icon--page">
            <BookCopy size={28} />
          </div>
          <h3 className="mushaf-mode-card__title">Mushaf per Page</h3>
          <p className="mushaf-mode-card__desc">
            {lastPageState ? `Lanjut Halaman ${lastPageState.last_page} (${lastPageState.surah_name || 'Mushaf'})` : 'Mulai dari Halaman 1'}
          </p>
          <span className="mushaf-mode-card__arrow"><ChevronRight size={18} /></span>
        </Link>
      </div>

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

      {/* Detail Informasi Fitur (SEO & User Info) */}
      <section className="feature-info-section">
        <div className="feature-info-card">
          <h2>Membaca Al-Qur'an Online di Islamediaku</h2>
          <p>Nikmati pengalaman membaca Al-Qur'an digital terbaik yang dirancang untuk mendukung ibadah harian Anda secara optimal, kapan saja dan di mana saja.</p>
          <div className="feature-benefits-list">
            <div className="feature-benefit-item">
              <span className="benefit-icon">📖</span>
              <div>
                <h4>Navigasi Surah Mudah</h4>
                <p>Temukan surah, juz, dan halaman dengan pencarian cepat dan navigasi terstruktur.</p>
              </div>
            </div>
            <div className="feature-benefit-item">
              <span className="benefit-icon">📱</span>
              <div>
                <h4>Tampilan Nyaman di Mobile</h4>
                <p>Tampilan teks arab yang bersih dan responsif, sangat nyaman dibaca di layar smartphone Anda.</p>
              </div>
            </div>
            <div className="feature-benefit-item">
              <span className="benefit-icon">🎧</span>
              <div>
                <h4>Murottal & Audio Terintegrasi</h4>
                <p>Dengarkan lantunan ayat dari qari pilihan untuk membantu menyempurnakan bacaan dan hafalan.</p>
              </div>
            </div>
          </div>
          <div className="feature-info-ctas">
            <Link to="/tilawah" className="btn btn--primary">Dengarkan Radio Tilawah</Link>
            <Link to="/" className="btn btn--outline">Kembali ke Beranda</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
