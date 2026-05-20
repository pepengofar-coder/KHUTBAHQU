import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Settings, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useSEO } from '../../utils/seo';
import AyahCard from './components/AyahCard';
import ReaderSettings from './components/ReaderSettings';
import './SurahPage.css';

const TRANSLATION_ID = 33; // Kemenag

export default function SurahPage() {
  const { surahId } = useParams();
  const navigate = useNavigate();
  const id = parseInt(surahId);
  
  const [surahInfo, setSurahInfo] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Settings State
  const [focusMode, setFocusMode] = useState(() => localStorage.getItem('islamediaku_quran_focus_mode') === 'true');
  const [arabicFontSize, setArabicFontSize] = useState(() => Number(localStorage.getItem('islamediaku_quran_arabic_font_size')) || 32);
  const [translationFontSize, setTranslationFontSize] = useState(() => Number(localStorage.getItem('islamediaku_quran_translation_font_size')) || 16);
  const [showTranslation, setShowTranslation] = useState(() => localStorage.getItem('islamediaku_quran_translation_visible') !== 'false');
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem('islamediaku_quran_reading_mode') || 'light');

  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('islamediaku_quran_bookmarks') || '[]'));
  const [lastRead, setLastRead] = useState(() => JSON.parse(localStorage.getItem('islamediaku_quran_last_read') || 'null'));

  useSEO({
    title: surahInfo ? `Surah ${surahInfo.name_simple} - Al-Qur'an | Islamediaku` : "Baca Al-Qur'an | Islamediaku",
    description: surahInfo ? `Baca Surah ${surahInfo.name_simple} beserta terjemahan bahasa Indonesia.` : "Baca Al-Qur'an digital.",
    path: `/mushaf/${id}`,
  });

  // Save Settings
  useEffect(() => {
    localStorage.setItem('islamediaku_quran_focus_mode', focusMode);
    localStorage.setItem('islamediaku_quran_arabic_font_size', arabicFontSize);
    localStorage.setItem('islamediaku_quran_translation_font_size', translationFontSize);
    localStorage.setItem('islamediaku_quran_translation_visible', showTranslation);
    localStorage.setItem('islamediaku_quran_reading_mode', readingMode);
  }, [focusMode, arabicFontSize, translationFontSize, showTranslation, readingMode]);

  // Fetch Data
  useEffect(() => {
    if (isNaN(id) || id < 1 || id > 114) {
      navigate('/mushaf');
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);
    window.scrollTo(0, 0);

    Promise.all([
      fetch(`https://api.quran.com/api/v4/chapters/${id}?language=id`).then(res => res.json()),
      fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${id}`).then(res => res.json()),
      fetch(`https://api.quran.com/api/v4/quran/translations/${TRANSLATION_ID}?chapter_number=${id}`).then(res => res.json())
    ])
    .then(([infoData, arabicData, translationData]) => {
      setSurahInfo(infoData.chapter);
      
      const mergedAyahs = arabicData.verses.map((verse, index) => {
        return {
          id: verse.id,
          verse_key: verse.verse_key,
          arabic: verse.text_uthmani,
          translation: translationData.translations[index]?.text?.replace(/<sup.*?<\/sup>/g, '') || ''
        };
      });
      setAyahs(mergedAyahs);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Gagal memuat surah. Periksa koneksi internet Anda.");
      setLoading(false);
    });
  }, [id, navigate]);

  // Auto-scroll to target Ayah
  useEffect(() => {
    if (!loading && ayahs.length > 0 && lastRead && lastRead.surah === id) {
      setTimeout(() => {
        const el = document.getElementById(`ayah-${lastRead.ayah}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [loading, ayahs.length, id, lastRead]);

  const handleBookmark = (verseKey) => {
    let newBookmarks = [...bookmarks];
    if (newBookmarks.includes(verseKey)) {
      newBookmarks = newBookmarks.filter(k => k !== verseKey);
    } else {
      newBookmarks.push(verseKey);
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('islamediaku_quran_bookmarks', JSON.stringify(newBookmarks));
  };

  const handleMarkLastRead = (verseKey) => {
    const [surahNum, ayahNum] = verseKey.split(':');
    const newLastRead = {
      surah: parseInt(surahNum),
      ayah: parseInt(ayahNum),
      surahName: surahInfo?.name_simple,
      timestamp: Date.now()
    };
    setLastRead(newLastRead);
    localStorage.setItem('islamediaku_quran_last_read', JSON.stringify(newLastRead));
  };

  if (loading) return <div className="surah-page__loading">Memuat surah...</div>;
  if (error) return <div className="surah-page__error">{error}</div>;
  if (!surahInfo) return null;

  return (
    <div className={`surah-page theme-${readingMode} ${focusMode ? 'focus-active' : ''}`}>
      {/* Sticky Header */}
      {!focusMode && (
        <header className="surah-page__header">
          <div className="surah-page__header-inner container">
            <button className="surah-page__back" onClick={() => navigate('/mushaf')}>
              <ArrowLeft size={24} />
            </button>
            <div className="surah-page__title-wrap">
              <h1 className="surah-page__title">{surahInfo.name_simple}</h1>
              <span className="surah-page__subtitle">Juz {surahInfo.pages[0]} • {surahInfo.verses_count} Ayat</span>
            </div>
            <button className="surah-page__settings-btn" onClick={() => setSettingsOpen(true)}>
              <Settings size={24} />
            </button>
          </div>
        </header>
      )}

      {focusMode && (
        <div className="surah-page__focus-exit">
          <button className="btn btn--outline" onClick={() => setFocusMode(false)}>
            Keluar dari Mode Fokus
          </button>
        </div>
      )}

      <main className="surah-page__content container">
        <div className="surah-page__bismillah-wrap">
          <h2 className="surah-page__arabic-title">{surahInfo.name_arabic}</h2>
          {surahInfo.bismillah_pre && id !== 1 && id !== 9 && (
            <div className="surah-page__bismillah" style={{ fontSize: `${arabicFontSize}px` }}>
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
          )}
        </div>

        <div className="surah-page__ayahs">
          {ayahs.map(ayah => (
            <AyahCard
              key={ayah.id}
              ayah={ayah}
              surahId={id}
              isTarget={lastRead?.surah === id && lastRead?.ayah === parseInt(ayah.verse_key.split(':')[1])}
              isBookmarked={bookmarks.includes(ayah.verse_key)}
              isLastRead={lastRead?.surah === id && lastRead?.ayah === parseInt(ayah.verse_key.split(':')[1])}
              focusMode={focusMode}
              arabicFontSize={arabicFontSize}
              translationFontSize={translationFontSize}
              showTranslation={showTranslation}
              onBookmark={handleBookmark}
              onMarkLastRead={handleMarkLastRead}
            />
          ))}
        </div>

        {!focusMode && (
          <div className="surah-page__footer">
            <Link 
              to={id > 1 ? `/mushaf/${id - 1}` : '#'} 
              className={`btn btn--outline ${id === 1 ? 'disabled' : ''}`}
            >
              <ChevronLeft size={20} /> Sebelumnya
            </Link>
            
            <Link to="/tilawah" className="btn btn--primary">
              <Play size={20} style={{marginRight: '8px'}} /> Buka Tilawah
            </Link>

            <Link 
              to={id < 114 ? `/mushaf/${id + 1}` : '#'} 
              className={`btn btn--outline ${id === 114 ? 'disabled' : ''}`}
            >
              Selanjutnya <ChevronRight size={20} />
            </Link>
          </div>
        )}
      </main>

      <ReaderSettings 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        arabicFontSize={arabicFontSize}
        setArabicFontSize={setArabicFontSize}
        translationFontSize={translationFontSize}
        setTranslationFontSize={setTranslationFontSize}
        showTranslation={showTranslation}
        setShowTranslation={setShowTranslation}
        readingMode={readingMode}
        setReadingMode={setReadingMode}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
      />
    </div>
  );
}
