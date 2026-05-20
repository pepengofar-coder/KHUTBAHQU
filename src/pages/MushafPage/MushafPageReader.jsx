import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { useSEO } from '../../utils/seo';
import AyahCard from './components/AyahCard';
import ReaderSettings from './components/ReaderSettings';
import { saveFeatureState, loadFeatureState } from '../../lib/syncService';
import { useAuth } from '../../context/AuthContext';
import './SurahPage.css'; // Reuse styles

const TRANSLATION_ID = 33; // Kemenag

export default function MushafPageReader() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // If no pageId in URL, we'll try to load last read or default to 1
  const id = pageId ? parseInt(pageId) : null;

  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Surah names map (fetched once)
  const [surahNames, setSurahNames] = useState({});

  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Settings State
  const [arabicFontSize, setArabicFontSize] = useState(() => Number(localStorage.getItem('islamediaku_quran_arabic_font_size')) || 32);
  const [translationFontSize, setTranslationFontSize] = useState(() => Number(localStorage.getItem('islamediaku_quran_translation_font_size')) || 16);
  const [showTranslation, setShowTranslation] = useState(() => localStorage.getItem('islamediaku_quran_translation_visible') !== 'false');
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem('islamediaku_quran_reading_mode') || 'light');

  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('islamediaku_quran_bookmarks') || '[]'));

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
    if (!id || isNaN(id) || id < 1 || id > 604) {
      if (id) navigate('/ruang-user'); // Invalid page, go back to dashboard
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);
    window.scrollTo(0, 0);

    // Save as last read
    const stateData = { last_page: id };
    localStorage.setItem('islamediaku_quran_page_state', JSON.stringify(stateData));
    if (user) saveFeatureState(user.id, 'quran_page', stateData);

    Promise.all([
      fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?page_number=${id}`).then(res => res.json()),
      fetch(`https://api.quran.com/api/v4/quran/translations/${TRANSLATION_ID}?page_number=${id}`).then(res => res.json())
    ])
    .then(([arabicData, translationData]) => {
      const mergedAyahs = arabicData.verses.map((verse, index) => {
        const [surahNum, ayahNum] = verse.verse_key.split(':');
        return {
          id: verse.id,
          verse_key: verse.verse_key,
          surah_id: parseInt(surahNum),
          ayah_number: parseInt(ayahNum),
          arabic: verse.text_uthmani,
          translation: translationData.translations[index]?.text?.replace(/<sup.*?<\/sup>/g, '') || ''
        };
      });
      setAyahs(mergedAyahs);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Gagal memuat halaman ini. Periksa koneksi internet Anda.");
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

  const toggleBookmark = (verseKey) => {
    setBookmarks(prev => {
      let newB = prev.includes(verseKey) ? prev.filter(k => k !== verseKey) : [...prev, verseKey];
      localStorage.setItem('islamediaku_quran_bookmarks', JSON.stringify(newB));
      return newB;
    });
  };

  if (!id) return null;

  return (
    <div className={`surah-page theme-${readingMode}`}>
      <header className="surah-page__header">
        <div className="container surah-page__header-inner">
          <button className="surah-page__back" onClick={() => navigate('/ruang-user')}>
            <ArrowLeft size={24} />
          </button>
          
          <div className="surah-page__title-wrap">
            <h1 className="surah-page__title">Halaman {id}</h1>
            <p className="surah-page__subtitle">Mushaf Madinah</p>
          </div>

          <button className="surah-page__settings-btn" onClick={() => setSettingsOpen(true)}>
            <Bookmark size={24} />
          </button>
        </div>
      </header>

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

      <main className="container surah-page__content">
        {loading && <div className="surah-page__loading">Memuat Halaman...</div>}
        {error && <div className="surah-page__error">{error}</div>}

        {!loading && !error && (
          <div className="surah-page__ayahs">
            {groupedAyahs.map((group, groupIndex) => {
              const surahInfo = surahNames[group.surah_id];
              return (
                <div key={group.surah_id} className="mushaf-page-group">
                  {/* Show Surah Header when surah changes on the page or it's the very first ayah of the surah */}
                  {(groupIndex > 0 || group.ayahs[0].ayah_number === 1) && surahInfo && (
                    <div className="surah-page__bismillah-wrap" style={{ marginTop: groupIndex > 0 ? '3rem' : 0 }}>
                      <h2 className="surah-page__arabic-title">{surahInfo.name_arabic}</h2>
                      <p className="surah-page__subtitle" style={{ marginBottom: '1rem' }}>{surahInfo.name_simple} • {surahInfo.translated_name.name}</p>
                      {group.surah_id !== 1 && group.surah_id !== 9 && group.ayahs[0].ayah_number === 1 && (
                        <div className="surah-page__bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>
                      )}
                    </div>
                  )}

                  {group.ayahs.map((ayah) => {
                    // Remove bismillah from ayah 1 text if it's not Al-Fatihah
                    let arabicText = ayah.arabic;
                    if (group.surah_id !== 1 && ayah.ayah_number === 1) {
                      arabicText = arabicText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ', '');
                    }

                    return (
                      <AyahCard 
                        key={ayah.id}
                        ayah={{...ayah, arabic: arabicText}}
                        isFavorite={bookmarks.includes(ayah.verse_key)}
                        onToggleFavorite={() => toggleBookmark(ayah.verse_key)}
                        onPlay={() => {}} // Could wire to audio later
                        isPlaying={false}
                        arabicFontSize={arabicFontSize}
                        translationFontSize={translationFontSize}
                        showTranslation={showTranslation}
                        surahName={surahInfo?.name_simple || ''}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        <div className="surah-page__footer">
          <Link 
            to={`/mushaf/page/${id - 1}`} 
            className={`btn btn--outline ${id <= 1 ? 'disabled' : ''}`}
            onClick={(e) => { if(id <= 1) e.preventDefault(); }}
          >
            <ChevronLeft size={20} /> Hal. Sebelumnya
          </Link>
          
          <div style={{ textAlign: 'center' }}>
            <strong>Halaman {id}</strong> / 604
          </div>

          <Link 
            to={`/mushaf/page/${id + 1}`} 
            className={`btn btn--primary ${id >= 604 ? 'disabled' : ''}`}
            onClick={(e) => { if(id >= 604) e.preventDefault(); }}
          >
            Hal. Berikutnya <ChevronRight size={20} />
          </Link>
        </div>
      </main>
    </div>
  );
}
