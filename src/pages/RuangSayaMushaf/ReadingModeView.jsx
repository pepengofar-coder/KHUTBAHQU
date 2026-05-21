import { useState, useEffect, useRef } from 'react';
import { Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';

const TRANSLATION_ID = 33; // Kemenag

export default function ReadingModeView({
  settings,
  bookmarks,
  toggleBookmark,
  lastRead,
  setLastRead
}) {
  const [surahId, setSurahId] = useState(lastRead?.surahId || 1);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [surahNames, setSurahNames] = useState([]);
  
  // Ref for the container to maintain scroll or scroll to top on change
  const containerRef = useRef(null);

  // Fetch Surah list once
  useEffect(() => {
    fetch('https://api.quran.com/api/v4/chapters?language=id')
      .then(res => res.json())
      .then(data => {
        setSurahNames(data.chapters);
      })
      .catch(console.error);
  }, []);

  // Fetch Ayahs when surahId changes
  useEffect(() => {
    if (!surahId) return;
    setLoading(true);
    setError(null);
    
    // Attempt to save last read
    const sName = surahNames.find(s => s.id === parseInt(surahId))?.name_simple;
    if (sName) {
      setLastRead({ surahId: parseInt(surahId), surahName: sName });
    }

    Promise.all([
      fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahId}`).then(res => res.json()),
      fetch(`https://api.quran.com/api/v4/quran/translations/${TRANSLATION_ID}?chapter_number=${surahId}`).then(res => res.json())
    ])
    .then(([arabicData, translationData]) => {
      const merged = arabicData.verses.map((verse, index) => {
        const [sNum, aNum] = verse.verse_key.split(':');
        return {
          id: verse.id,
          verse_key: verse.verse_key,
          surah_id: parseInt(sNum),
          ayah_number: parseInt(aNum),
          arabic: verse.text_uthmani,
          translation: translationData.translations[index]?.text?.replace(/<sup.*?<\/sup>/g, '') || ''
        };
      });
      setAyahs(merged);
      setLoading(false);
      if (containerRef.current) {
        window.scrollTo(0, 0);
      }
    })
    .catch(err => {
      console.error(err);
      setError("Gagal memuat surah. Periksa koneksi internet Anda.");
      setLoading(false);
    });
  }, [surahId, surahNames, setLastRead]);

  const handleNext = () => {
    if (surahId < 114) setSurahId(prev => parseInt(prev) + 1);
  };

  const handlePrev = () => {
    if (surahId > 1) setSurahId(prev => parseInt(prev) - 1);
  };

  return (
    <div className="rsm-reading-mode" ref={containerRef}>
      
      {/* Surah Selector */}
      <div className="rsm-surah-selector">
        <select 
          className="rsm-select"
          value={surahId}
          onChange={(e) => setSurahId(e.target.value)}
        >
          {surahNames.map(s => (
            <option key={s.id} value={s.id}>
              {s.id}. Surah {s.name_simple} ({s.translated_name.name})
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="rsm-loading">Memuat Surah...</div>}
      {error && <div className="rsm-error">{error}</div>}

      {!loading && !error && ayahs.length > 0 && (
        <>
          {surahId !== 1 && surahId !== 9 && (
            <div className="rsm-bismillah">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </div>
          )}

          <div className="rsm-ayahs">
            {ayahs.map(ayah => {
              let arabicText = ayah.arabic;
              if (surahId !== 1 && ayah.ayah_number === 1) {
                arabicText = arabicText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ', '');
              }

              const isBookmarked = bookmarks.includes(ayah.verse_key);

              return (
                <div key={ayah.id} className="rsm-ayah">
                  <div className="rsm-ayah__arabic-wrap">
                    <div 
                      className="rsm-ayah__arabic" 
                      style={{ fontSize: `${settings.arabicFontSize}px` }}
                    >
                      {arabicText}
                    </div>
                    <span className="rsm-ayah__number">{ayah.ayah_number}</span>
                  </div>
                  
                  {settings.showTranslation && (
                    <div 
                      className="rsm-ayah__translation"
                      style={{ fontSize: `${settings.translationFontSize}px` }}
                      dangerouslySetInnerHTML={{ __html: ayah.translation }}
                    />
                  )}

                  <div className="rsm-ayah__actions">
                    <button 
                      className={`rsm-ayah__action-btn ${isBookmarked ? 'active' : ''}`}
                      onClick={() => toggleBookmark(ayah.verse_key)}
                      title="Bookmark Ayah"
                    >
                      <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                    {/* Add play button logic here if needed */}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rsm-nav-controls">
            <button 
              className="rsm-nav-btn" 
              onClick={handlePrev} 
              disabled={surahId <= 1}
            >
              <ChevronLeft size={20} /> Sebelumnya
            </button>
            <button 
              className="rsm-nav-btn" 
              onClick={handleNext} 
              disabled={surahId >= 114}
            >
              Berikutnya <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
