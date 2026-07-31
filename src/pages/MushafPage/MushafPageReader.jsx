import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Bookmark, ChevronsLeftRight } from 'lucide-react';
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
  const [surahNames, setSurahNames] = useState({});

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [jumpInput, setJumpInput] = useState('');
  
  // Settings State
  const [arabicFontSize, setArabicFontSize] = useState(() => Number(localStorage.getItem('islamediaku_quran_arabic_font_size')) || 32);
  const [translationFontSize, setTranslationFontSize] = useState(() => Number(localStorage.getItem('islamediaku_quran_translation_font_size')) || 16);
  const [showTranslation, setShowTranslation] = useState(() => localStorage.getItem('islamediaku_quran_translation_visible') !== 'false');
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem('islamediaku_quran_reading_mode') || 'light');

  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('islamediaku_quran_page_bookmarks') || '[]'));

  // Swipe navigation state
  const touchRef = useRef({ startX: 0, startY: 0 });
  const [slideDirection, setSlideDirection] = useState(null);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  // Show swipe hint on first visit
  useEffect(() => {
    const hintShown = localStorage.getItem('islamediaku_mushaf_swipe_hint');
    if (!hintShown) {
      setShowSwipeHint(true);
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
        localStorage.setItem('islamediaku_mushaf_swipe_hint', 'true');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Swipe handlers
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchRef.current = { startX: touch.clientX, startY: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchRef.current.startX;
    const deltaY = touch.clientY - touchRef.current.startY;

    // Only trigger on predominantly horizontal swipes (>50px) with less vertical movement
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0 && id < 604) {
        // Swipe left → next page
        setSlideDirection('left');
        setTimeout(() => navigate(`/mushaf/page/${id + 1}`), 150);
      } else if (deltaX > 0 && id > 1) {
        // Swipe right → previous page
        setSlideDirection('right');
        setTimeout(() => navigate(`/mushaf/page/${id - 1}`), 150);
      }
    }
  }, [id, navigate]);

  // Reset slide animation when page changes
  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => setSlideDirection(null), 400);
      return () => clearTimeout(timer);
    }
  }, [id, slideDirection]);

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

  // Group ayahs by surah
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

  // Derive Juz for header
  const pageJuz = useMemo(() => {
    if (!ayahs.length) return null;
    return ayahs[0].juz_number;
  }, [ayahs]);

  // Derive surah names on this page
  const pageSurahNames = useMemo(() => {
    if (!groupedAyahs.length || Object.keys(surahNames).length === 0) return '';
    return groupedAyahs.map(g => surahNames[g.surah_id]?.name_simple).filter(Boolean).join(' - ');
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

        {/* ─── Header ─── */}
        <header className="mushaf-reader-header">
          <button
            className="mushaf-reader-header__btn"
            onClick={() => navigate('/mushaf')}
            aria-label="Kembali"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="mushaf-reader-header__center">
            <div className="mushaf-reader-header__page">
              {toArabicNumber(id)}
            </div>
            <div className="mushaf-reader-header__info">
              {pageSurahNames}{pageJuz ? ` • Juz ${pageJuz}` : ''}
            </div>
          </div>

          <button
            className={`mushaf-reader-header__btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={toggleBookmark}
            aria-label={isBookmarked ? 'Hapus Bookmark' : 'Tambah Bookmark'}
          >
            <Bookmark size={22} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </header>

        {/* ─── Paper Container ─── */}
        <div
          className={`mushaf-paper ${slideDirection ? `mushaf-paper--slide-${slideDirection}` : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe Hint */}
          {showSwipeHint && (
            <div className="mushaf-swipe-hint">
              <ChevronsLeftRight size={16} />
              <span>Geser untuk berpindah halaman</span>
            </div>
          )}
          {loading && (
            <div className="mushaf-status">Memuat halaman mushaf...</div>
          )}

          {error && (
            <div className="mushaf-status mushaf-status--error">{error}</div>
          )}

          {!loading && !error && (
            <>
              {/* Arabic Quran Text */}
              <div className="mushaf-arabic-text" style={{ fontSize: `${arabicFontSize}px` }}>
                {groupedAyahs.map((group, groupIndex) => {
                  const surahInfo = surahNames[group.surah_id];
                  const showHeader = (groupIndex > 0 || group.ayahs[0].ayah_number === 1) && surahInfo;

                  return (
                    <span key={group.surah_id}>
                      {/* Surah Banner */}
                      {showHeader && (
                        <div className={`surah-banner ${groupIndex > 0 ? 'surah-banner--spaced' : ''}`}>
                          <div className="surah-banner__frame">
                            <span className="corner corner--tl"></span>
                            <span className="corner corner--tr"></span>
                            <span className="corner corner--bl"></span>
                            <span className="corner corner--br"></span>
                            <div className="surah-banner__name">{surahInfo.name_arabic}</div>
                          </div>
                          {group.surah_id !== 1 && group.surah_id !== 9 && group.ayahs[0].ayah_number === 1 && (
                            <div className="surah-banner__bismillah">
                              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                            </div>
                          )}
                        </div>
                      )}

                      {/* Verses inline */}
                      {group.ayahs.map((ayah) => {
                        let arabicText = ayah.arabic;
                        // Remove bismillah from ayah 1 text if it's not Al-Fatihah, as we render it in the header
                        if (group.surah_id !== 1 && ayah.ayah_number === 1) {
                          arabicText = arabicText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ', '');
                        }

                        return (
                          <span key={ayah.id} className="mushaf-ayah">
                            {arabicText}
                            <span className="ayah-marker">
                              <span className="ayah-marker__num">
                                {toArabicNumber(ayah.ayah_number)}
                              </span>
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  );
                })}
              </div>

              {/* Page Number Footer (inside paper) */}
              <div className="mushaf-page-number">
                <div className="mushaf-page-number__divider">
                  <span className="mushaf-page-number__line"></span>
                  <span className="mushaf-page-number__diamond"></span>
                  <span className="mushaf-page-number__line"></span>
                </div>
                {toArabicNumber(id)}
              </div>
            </>
          )}
        </div>

        {/* ─── Translation Section ─── */}
        {!loading && !error && showTranslation && (
          <div className="mushaf-translations">
            <div className="mushaf-translations__header">
              <span className="mushaf-translations__line"></span>
              <span className="mushaf-translations__label">Terjemahan</span>
              <span className="mushaf-translations__line"></span>
            </div>

            {ayahs.map(ayah => (
              <div key={`trans-${ayah.id}`} className="trans-item">
                <span className="trans-item__ref">
                  {surahNames[ayah.surah_id]?.name_simple} {ayah.surah_id}:{ayah.ayah_number}
                </span>
                <div
                  className="trans-item__text"
                  style={{ fontSize: `${translationFontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: ayah.translation }}
                />
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ─── Sticky Bottom Navigation ─── */}
      <div className="mushaf-nav">
        <div className="mushaf-nav__inner">
          <Link
            to={`/mushaf/page/${id - 1}`}
            className={`mushaf-nav__btn ${id <= 1 ? 'disabled' : ''}`}
            onClick={(e) => { if (id <= 1) e.preventDefault(); }}
          >
            <ChevronLeft size={18} />
            <span>Sebelumnya</span>
          </Link>

          <form className="mushaf-nav__center" onSubmit={handleJump}>
            <span>Hal.</span>
            <input
              type="number"
              className="mushaf-nav__input"
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              onBlur={handleJump}
              min="1"
              max="604"
            />
          </form>

          <Link
            to={`/mushaf/page/${id + 1}`}
            className={`mushaf-nav__btn ${id >= 604 ? 'disabled' : ''}`}
            onClick={(e) => { if (id >= 604) e.preventDefault(); }}
          >
            <span>Berikutnya</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

    </div>
  );
}
