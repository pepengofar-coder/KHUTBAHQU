const TRANSLATION_ID = 33;

export async function getMushafPage(pageNumber) {
  try {
    const [arabicRes, translationRes] = await Promise.all([
      fetch(`https://api.quran.com/api/v4/verses/by_page/${pageNumber}?fields=text_uthmani,page_number,juz_number&words=false&per_page=300`),
      fetch(`https://api.quran.com/api/v4/quran/translations/${TRANSLATION_ID}?page_number=${pageNumber}&per_page=300`)
    ]);

    if (!arabicRes.ok || !translationRes.ok) {
      throw new Error('Gagal mengambil data halaman dari server.');
    }

    const arabicData = await arabicRes.json();
    const translationData = await translationRes.json();

    return normalizePageAyahs(arabicData.verses, translationData.translations);
  } catch (error) {
    console.error("Quran API Error:", error);
    throw error;
  }
}

function normalizePageAyahs(verses, translations) {
  return verses.map((verse, index) => {
    const [surahNum, ayahNum] = verse.verse_key.split(':');
    return {
      id: verse.id,
      verse_key: verse.verse_key,
      surah_id: parseInt(surahNum, 10),
      ayah_number: parseInt(ayahNum, 10),
      arabic: verse.text_uthmani,
      translation: translations[index]?.text?.replace(/<sup.*?<\/sup>/g, '') || '',
      page_number: verse.page_number,
      juz_number: verse.juz_number
    };
  });
}

// Map of common Arabic numbers for Ayah markers
const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicNumber(num) {
  return num
    .toString()
    .split('')
    .map(digit => arabicNumbers[parseInt(digit, 10)])
    .join('');
}

export async function getVersePageNumber(surahId, ayahNum = 1) {
  try {
    const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surahId}:${ayahNum}?fields=page_number`);
    if (!res.ok) throw new Error('Failed to resolve verse page');
    const data = await res.json();
    return data.verse.page_number;
  } catch (err) {
    console.error("Verse Page Lookup Error:", err);
    return null;
  }
}
