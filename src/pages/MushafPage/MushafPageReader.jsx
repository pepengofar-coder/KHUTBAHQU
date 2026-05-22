import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { useSEO } from '../../utils/seo';
import ReaderSettings from './components/ReaderSettings';
import { saveFeatureState, loadFeatureState } from '../../lib/syncService';
import { useAuth } from '../../context/AuthContext';
import { getMushafPage, toArabicNumber } from '../../lib/quranPageApi';
import './MushafPageReader.css';

export default function MushafPageReader() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const id = pageId ? parseInt(pageId, 10) : null;

  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Surah names map (fetched once)
  const [surahNames, setSurahNames] = useState({});

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [jumpInput, setJumpInput] = useState('');
  
  // Settings State
  const [arabicFontSize, setArabicFontSize] = useState(() => Number(localStorage.getItem('islamediaku_quran_arabic_font_size')) || 32);
  const [translationFontSize, setTranslationFontSize] = useState(() => Number(localStorage.getItem('islamediaku_quran_translation_font_size')) || 16);
  const [showTranslation, setShowTranslation] = useState(() => localStorage.getItem('islamediaku_quran_translation_visible') !== 'false');
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem('islamediaku_quran_reading_mode') || 'light');

  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('islamediaku_quran_page_bookmarks') || '[]'));

  useSEO({
    title: id ? `Mushaf Halaman ${id} | Islamediaku` : "Mushaf Per Halaman | Islamediaku",
    description: "Baca Al-Qur'an per halaman sesuai Mushaf Madinah.",
    path: `/mushaf/page/${id}`,
  });

  // Save Settings
  useEffect(() => {
    localStorage.setItem('islamediaku_quran_arabic_font_size', arabicFontSize);
    localStorage.setItem('islamediaku_quran_translation_font_size', translationFontSize);
    localStorage.setItem('islamediaku_quran_translation_visible', showTranslation);
    localStorage.setItem('islamediaku_quran_reading_mode', readingMode);
  }, [arabicFontSize, translationFontSize, showTranslation, readingMode]);

  // Load last page if not in URL
  useEffect(() => {
    if (!id) {
      const loadLastPage = async () => {
        let lastPage = 1;
        if (user) {
          const syncData = await loadFeatureState(user.id, 'quran_page');
          if (syncData?.last_page) lastPage = syncData.last_page;
        } else {
          const localData = JSON.parse(localStorage.getItem('islamediaku_quran_page_state') || '{}');
          if (localData?.last_page) lastPage = localData.last_page;
        }
        navigate(`/mushaf/page/${lastPage}`, { replace: true });
      };
      loadLastPage();
    } else {
      setJumpInput(id.toString());
    }
  }, [id, navigate, user]);

  // Fetch Surah Names once
  useEffect(() => {
    fetch('https://api.quran.com/api/v4/chapters?language=id')
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.chapters.forEach(c => map[c.id] = c);
        setSurahNames(map);
      })
      .catch(console.error);
  }, []);

  // Fetch Page Data
  useEffect(() => {
    if (!id) return;
    
    if (isNaN(id) || id < 1 || id > 604) {
      navigate('/mushaf/page/1', { replace: true });
      return;
    }

    setLoading(true);
    setError(null);
    window.scrollTo(0, 0);

    // Save as last read
    const stateData = { last_page: id };
    localStorage.setItem('islamediaku_quran_page_state', JSON.stringify(stateData));
    if (user) saveFeatureState(user.id, 'quran_page', stateData);

    getMushafPage(id)
      .then(data => {
        setAyahs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Data halaman mushaf belum tersedia. Coba lagi nanti.");
        setLoading(false);
      });
  }, [id, navigate, user]);

  // Group ayahs by surah to display surah headers
  const groupedAyahs = useMemo(() => {
    if (!ayahs.length) return [];
    const groups = [];
    let currentGroup = null;

    ayahs.forEach(ayah => {
      if (!currentGroup || currentGroup.surah_id !== ayah.surah_id) {
        currentGroup = {
          surah_id: ayah.surah_id,
          ayahs: []
        };
        groups.push(currentGroup);
      }
      currentGroup.ayahs.push(ayah);
    });
    return groups;
  }, [ayahs]);

  // Derive unique Juz for the header
  const pageJuz = useMemo(() => {
    if (!ayahs.length) return null;
    return ayahs[0].juz_number;
  }, [ayahs]);

  // Derive surah names on this page
  const pageSurahNames = useMemo(() => {
    if (!groupedAyahs.length || Object.keys(surahNames).length === 0) return '';
    return groupedAyahs.map(g => surahNames[g.surah_id]?.name_simple).filter(Boolean).join(', ');
  }, [groupedAyahs, surahNames]);

  const toggleBookmark = () => {
    setBookmarks(prev => {
      let newB = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      localStorage.setItem('islamediaku_quran_page_bookmarks', JSON.stringify(newB));
      return newB;
    });
  };

  const handleJump = (e) => {
    e.preventDefault();
    const target = parseInt(jumpInput, 10);
    if (!isNaN(target) && target >= 1 && target <= 604) {
      navigate(`/mushaf/page/${target}`);
    } else {
      setJumpInput(id.toString());
    }
  };

  if (!id) return null;

  const isBookmarked = bookmarks.includes(id);

  return (
    <div className={`mushaf-page-reader theme-${readingMode}`}>
      {settingsOpen && (
        <ReaderSettings 
          onClose={() => setSettingsOpen(false)}
          focusMode={false} setFocusMode={() => {}}
          arabicFontSize={arabicFontSize} setArabicFontSize={setArabicFontSize}
          translationFontSize={translationFontSize} setTranslationFontSize={setTranslationFontSize}
          showTranslation={showTranslation} setShowTranslation={setShowTranslation}
          readingMode={readingMode} setReadingMode={setReadingMode}
        />
      )}

      <div className="mushaf-page__container">
        
        {/* Top Header / Entry point to go back */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0'}}>
          <button className="btn btn--outline" onClick={() => navigate('/mushaf')} style={{border: 'none', padding: '8px', background: 'transparent'}}>
            <ArrowLeft size={24} />
          </button>
          <div style={{textAlign: 'center'}}>
            <h1 style={{fontSize: '18px', fontWeight: 800, margin: 0}}>Halaman {id}</h1>
            <p style={{fontSize: '12px', color: 'var(--color-text-muted)', margin: 0}}>
              {pageSurahNames} • Juz {pageJuz}
            </p>
          </div>
          <button 
            className="btn btn--outline" 
            onClick={toggleBookmark}
            style={{border: 'none', padding: '8px', background: 'transparent', color: isBookmarked ? 'var(--color-primary)' : 'inherit'}}
          >
            <Bookmark size={24} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Paper Container */}
        <div className="mushaf-page__paper">
          {loading && <div style={{textAlign:'center', padding: '40px', color: '#666'}}>Memuat halaman mushaf...</div>}
          {error && <div style={{textAlign:'center', padding: '40px', color: '#ef4444'}}>{error}</div>}

          {!loading && !error && (
            <div className="mushaf-page__inline-text" style={{ fontSize: `${arabicFontSize}px` }}>
              {groupedAyahs.map((group, groupIndex) => {
                const surahInfo = surahNames[group.surah_id];
                return (
                  <span key={group.surah_id}>
                    
                    {/* Surah Header inline block */}
                    {(groupIndex > 0 || group.ayahs[0].ayah_number === 1) && surahInfo && (
                      <div className="mushaf-page__surah-header" style={{ marginTop: groupIndex > 0 ? '2rem' : 0 }}>
                        <div className="mushaf-page__surah-arabic">{surahInfo.name_arabic}</div>
                        {group.surah_id !== 1 && group.surah_id !== 9 && group.ayahs[0].ayah_number === 1 && (
                          <div className="mushaf-page__surah-bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>
                        )}
                      </div>
                    )}

                    {/* Verses inline */}
                    {group.ayahs.map((ayah) => {
                      let arabicText = ayah.arabic;
                      // Remove bismillah from ayah 1 text if it's not Al-Fatihah, as we render it in the header
                      if (group.surah_id !== 1 && ayah.ayah_number === 1) {
                        arabicText = arabicText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ', '');
                      }

                      return (
                        <span key={ayah.id} className="mushaf-page__inline-ayah">
                          {arabicText}
                          <span className="mushaf-page__ayah-marker">
                            {toArabicNumber(ayah.ayah_number)}
                          </span>
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>
          )}

          {/* Optional Translations Block */}
          {!loading && !error && showTranslation && (
            <div className="mushaf-page__translations">
              <div className="mushaf-page__translations-title">Terjemahan Halaman {id}</div>
              {ayahs.map(ayah => (
                <div key={`trans-${ayah.id}`} className="mushaf-page__trans-item">
                  <span className="mushaf-page__trans-num">{surahNames[ayah.surah_id]?.name_simple} {ayah.surah_id}:{ayah.ayah_number}</span>
                  <div className="mushaf-page__trans-text" style={{ fontSize: `${translationFontSize}px` }} dangerouslySetInnerHTML={{ __html: ayah.translation }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Controls */}
      <div className="mushaf-page__footer-controls">
        <div className="mushaf-page__controls-inner">
          <Link 
            to={`/mushaf/page/${id + 1}`} 
            className={`mushaf-page__ctrl-btn ${id >= 604 ? 'disabled' : ''}`}
            onClick={(e) => { if(id >= 604) e.preventDefault(); }}
          >
            <ChevronRight size={20} /> Berikutnya
          </Link>
          
          <form className="mushaf-page__ctrl-center" onSubmit={handleJump}>
            <span>Hal.</span>
            <input 
              type="number" 
              className="mushaf-page__ctrl-input" 
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              onBlur={handleJump}
              min="1" max="604"
            />
          </form>

          <Link 
            to={`/mushaf/page/${id - 1}`} 
            className={`mushaf-page__ctrl-btn ${id <= 1 ? 'disabled' : ''}`}
            onClick={(e) => { if(id <= 1) e.preventDefault(); }}
          >
             Sebelumnya <ChevronLeft size={20} />
          </Link>
        </div>
      </div>

    </div>
  );
}
