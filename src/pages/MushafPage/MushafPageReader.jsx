import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Bookmark, ChevronsLeftRight, ListFilter, Search, X, BookOpen, Layers } from 'lucide-react';
import { useSEO } from '../../utils/seo';
import ReaderSettings from './components/ReaderSettings';
import { saveFeatureState, loadFeatureState } from '../../lib/syncService';
import { useAuth } from '../../context/AuthContext';
import { getMushafPage, toArabicNumber, getVersePageNumber } from '../../lib/quranPageApi';
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
  const [indexModalOpen, setIndexModalOpen] = useState(false);
  const [chaptersList, setChaptersList] = useState([]);
  const [indexSearch, setIndexSearch] = useState('');
  const [selectedSurahForAyah, setSelectedSurahForAyah] = useState(null);
  const [selectedAyahInput, setSelectedAyahInput] = useState('1');
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
        setChaptersList(data.chapters || []);
        const map = {};
        (data.chapters || []).forEach(c => map[c.id] = c);
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

    getMushafPage(id)
      .then(data => {
        setAyahs(data);
        setLoading(false);

        // Save detailed last read page state
        const firstAyah = data[0];
        const sId = firstAyah?.surah_id;
        const jNum = firstAyah?.juz_number;
        const sName = surahNames[sId]?.name_simple || (sId ? `Surah ${sId}` : '');
        const stateData = {
          last_page: id,
          surah_id: sId,
          surah_name: sName,
          juz: jNum,
          timestamp: Date.now()
        };
        localStorage.setItem('islamediaku_quran_page_state', JSON.stringify(stateData));
        if (user) saveFeatureState(user.id, 'quran_page', stateData);
      })
      .catch(err => {
        console.error(err);
        setError("Data halaman mushaf belum tersedia. Coba lagi nanti.");
        setLoading(false);
      });
  }, [id, navigate, user, surahNames]);

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
            onClick={() => {
              if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
              } else {
                navigate('/mushaf');
              }
            }}
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

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="mushaf-reader-header__btn"
              onClick={() => setIndexModalOpen(true)}
              aria-label="Indeks Surah & Ayat"
              title="Indeks Surah & Ayat"
            >
              <ListFilter size={20} />
            </button>
            <button
              className={`mushaf-reader-header__btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={toggleBookmark}
              aria-label={isBookmarked ? 'Hapus Bookmark' : 'Tambah Bookmark'}
            >
              <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </header>

        {/* ─── Index Modal (Surah & Ayah Selector) ─── */}
        {indexModalOpen && (
          <div className="mushaf-index-modal-overlay" onClick={() => setIndexModalOpen(false)}>
            <div className="mushaf-index-modal" onClick={e => e.stopPropagation()}>
              <div className="mushaf-index-modal__header">
                <div className="mushaf-index-modal__title">
                  <ListFilter size={20} />
                  <span>Indeks Surah & Ayat</span>
                </div>
                <button className="mushaf-index-modal__close" onClick={() => setIndexModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="mushaf-index-modal__search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Cari surah (nama atau nomor)..."
                  value={indexSearch}
                  onChange={e => setIndexSearch(e.target.value)}
                />
              </div>

              <div className="mushaf-index-modal__list">
                {chaptersList
                  .filter(c => 
                    c.name_simple.toLowerCase().includes(indexSearch.toLowerCase()) ||
                    c.translated_name?.name.toLowerCase().includes(indexSearch.toLowerCase()) ||
                    c.id.toString() === indexSearch.trim()
                  )
                  .map(surah => {
                    const startPage = surah.pages ? surah.pages[0] : 1;
                    const isSelected = selectedSurahForAyah?.id === surah.id;

                    return (
                      <div key={surah.id} className={`mushaf-index-item ${isSelected ? 'active' : ''}`}>
                        <div className="mushaf-index-item__main" onClick={() => {
                          setSelectedSurahForAyah(isSelected ? null : surah);
                          setSelectedAyahInput('1');
                        }}>
                          <span className="mushaf-index-item__num">{surah.id}</span>
                          <div className="mushaf-index-item__info">
                            <strong className="mushaf-index-item__name">{surah.name_simple}</strong>
                            <span className="mushaf-index-item__sub">{surah.translated_name?.name} • {surah.verses_count} Ayat</span>
                          </div>
                          <span className="mushaf-index-item__page">Hal. {startPage}</span>
                        </div>

                        {isSelected && (
                          <div className="mushaf-index-item__ayah-picker">
                            <button
                              className="btn btn--primary btn--sm"
                              onClick={() => {
                                setIndexModalOpen(false);
                                navigate(`/mushaf/page/${startPage}`);
                              }}
                            >
                              Mulai Halaman {startPage}
                            </button>
                            <div className="mushaf-index-item__jump-group">
                              <span>Ayat:</span>
                              <input
                                type="number"
                                min="1"
                                max={surah.verses_count}
                                value={selectedAyahInput}
                                onChange={e => setSelectedAyahInput(e.target.value)}
                                className="mushaf-index-item__ayah-input"
                              />
                              <button
                                className="btn btn--secondary btn--sm"
                                onClick={async () => {
                                  const aNum = parseInt(selectedAyahInput, 10) || 1;
                                  const pageNum = await getVersePageNumber(surah.id, aNum);
                                  setIndexModalOpen(false);
                                  navigate(`/mushaf/page/${pageNum || startPage}`);
                                }}
                              >
                                Lompat
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

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
