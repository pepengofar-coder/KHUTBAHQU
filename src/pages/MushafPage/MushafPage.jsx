import { useState, useEffect } from 'react';
import { useSEO } from '../../utils/seo';
import './MushafPage.css';

// Translation ID for Indonesian (Kemenag) is 33 or 134 in quran.com API v4. We use 33 (Tafsir Jalalayn / Kemenag)
// For simple Indonesian translation, we use resource_id 33.
const TRANSLATION_ID = 33;

export default function MushafPage() {
  useSEO({
    title: "Mushaf Al-Qur'an Digital dengan Terjemahan Indonesia | Islamediaku",
    description: "Baca Al-Qur'an digital lengkap dengan terjemahan Bahasa Indonesia. Mushaf Madinah online untuk khatib, dai, dan umat muslim.",
    path: '/mushaf',
  });
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch list of Surahs on mount
  useEffect(() => {
    fetch('https://api.quran.com/api/v4/chapters?language=id')
      .then(res => res.json())
      .then(data => setSurahs(data.chapters))
      .catch(err => console.error("Failed to load surahs", err));
  }, []);

  // Fetch Ayahs when selectedSurah changes
  useEffect(() => {
    if (!selectedSurah) return;
    setLoading(true);
    setError(null);
    
    // We need both Arabic text (Uthmani) and translation
    Promise.all([
      fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${selectedSurah}`).then(res => res.json()),
      fetch(`https://api.quran.com/api/v4/quran/translations/${TRANSLATION_ID}?chapter_number=${selectedSurah}`).then(res => res.json())
    ])
    .then(([arabicData, translationData]) => {
      // Merge arabic text and translation based on verse_key
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
      console.error("Failed to fetch ayahs", err);
      setError("Gagal memuat ayat Al-Qur'an. Silakan periksa koneksi internet Anda.");
      setLoading(false);
    });
  }, [selectedSurah]);

  const currentSurah = surahs.find(s => s.id === parseInt(selectedSurah));

  return (
    <div className="mushaf container">
      <header className="mushaf__header">
        <h1 className="mushaf__title">القرآن الكريم</h1>
        <p className="mushaf__desc">Mushaf Madinah dengan Terjemahan Indonesia</p>
      </header>

      <div className="mushaf__controls">
        <select 
          className="mushaf__select"
          value={selectedSurah}
          onChange={(e) => setSelectedSurah(parseInt(e.target.value))}
        >
          {surahs.map(s => (
            <option key={s.id} value={s.id}>
              {s.id}. {s.name_simple} ({s.translated_name.name})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="mushaf__loading">Memuat surah...</div>
      ) : error ? (
        <div className="mushaf__loading" style={{color: 'red'}}>{error}</div>
      ) : (
        <>
          {currentSurah && (
            <div className="mushaf__surah-info">
              <h2 className="mushaf__surah-name">{currentSurah.name_arabic}</h2>
              <p className="mushaf__surah-meta">
                {currentSurah.name_simple} • {currentSurah.verses_count} Ayat • {currentSurah.revelation_place === 'makkah' ? 'Makkiyah' : 'Madaniyah'}
              </p>
            </div>
          )}

          {currentSurah && currentSurah.bismillah_pre && currentSurah.id !== 1 && currentSurah.id !== 9 && (
            <div className="mushaf__bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
          )}

          <div className="mushaf__list">
            {ayahs.map(ayah => {
              const ayahNum = ayah.verse_key.split(':')[1];
              return (
                <div key={ayah.id} className="ayah-card">
                  <div className="ayah-card__header">
                    <div className="ayah-card__number">{ayahNum}</div>
                  </div>
                  <div className="ayah-card__arabic">{ayah.arabic}</div>
                  <div 
                    className="ayah-card__translation" 
                    dangerouslySetInnerHTML={{ __html: ayah.translation }}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
