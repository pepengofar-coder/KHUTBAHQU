/**
 * getDailyAyah — Returns a deterministic ayah based on the current date.
 * Uses the quran.com API (same as MushafPage) for real Arabic text + translation.
 * The ayah changes daily but stays consistent throughout the day.
 */

// Curated list of short, impactful ayahs with their surah:ayah references
// These are real Qur'an verses — we only store references, text comes from API
const AYAH_POOL = [
  { surah: 94, ayah: 6, surahName: 'Al-Insyirah' },     // Fa inna ma'al 'usri yusra
  { surah: 94, ayah: 5, surahName: 'Al-Insyirah' },     // Fa inna ma'al 'usri yusra
  { surah: 2, ayah: 286, surahName: 'Al-Baqarah' },     // La yukallifullahu nafsan illa wus'aha
  { surah: 2, ayah: 152, surahName: 'Al-Baqarah' },     // Fadzkuruni adzkurkum
  { surah: 2, ayah: 186, surahName: 'Al-Baqarah' },     // Wa idza sa'alaka 'ibadi 'anni
  { surah: 3, ayah: 139, surahName: 'Ali Imran' },      // Wa la tahinu wa la tahzanu
  { surah: 13, ayah: 28, surahName: 'Ar-Ra\'d' },       // Ala bidzikrillahi tathma'innul qulub
  { surah: 65, ayah: 2, surahName: 'Ath-Thalaq' },      // Wa man yattaqillaha yaj'al lahu makhraja
  { surah: 65, ayah: 3, surahName: 'Ath-Thalaq' },      // Wa man yatawakkal 'alallah
  { surah: 2, ayah: 153, surahName: 'Al-Baqarah' },     // Yaa ayyuhalladziina aamanu-sta'iinuu bis-shabri
  { surah: 3, ayah: 159, surahName: 'Ali Imran' },      // Fa tawakkal 'alallah
  { surah: 8, ayah: 46, surahName: 'Al-Anfal' },        // Washbiru innallaha ma'as-shabirin
  { surah: 16, ayah: 97, surahName: 'An-Nahl' },        // Man 'amila shalihan
  { surah: 29, ayah: 69, surahName: 'Al-Ankabut' },     // Walladziina jaahadu fiinaa
  { surah: 39, ayah: 53, surahName: 'Az-Zumar' },       // La taqnatu min rahmatillah
  { surah: 40, ayah: 60, surahName: 'Ghafir' },         // Ud'uuni astajib lakum
  { surah: 49, ayah: 13, surahName: 'Al-Hujurat' },     // Inna akramakum 'indallahi atqakum
  { surah: 55, ayah: 13, surahName: 'Ar-Rahman' },      // Fabi ayyi ala'i rabbikuma tukadzdziban
  { surah: 73, ayah: 8, surahName: 'Al-Muzzammil' },    // Wadzkurisma rabbika wa tabattal ilaihi
  { surah: 93, ayah: 5, surahName: 'Adh-Dhuha' },       // Wa lasaufa yu'thiika rabbuka fatardha
  { surah: 112, ayah: 1, surahName: 'Al-Ikhlas' },      // Qul huwallahu ahad
  { surah: 1, ayah: 5, surahName: 'Al-Fatihah' },       // Iyyaka na'budu wa iyyaka nasta'in
  { surah: 103, ayah: 1, surahName: 'Al-Asr' },         // Wal 'ashr
  { surah: 110, ayah: 1, surahName: 'An-Nasr' },        // Idza jaa'a nashrullahi wal fath
  { surah: 2, ayah: 45, surahName: 'Al-Baqarah' },      // Wasta'inu bis-shabri was-shalah
  { surah: 20, ayah: 114, surahName: 'Thaha' },         // Rabbi zidni 'ilma
  { surah: 25, ayah: 74, surahName: 'Al-Furqan' },      // Rabbana hab lana min azwajina
  { surah: 21, ayah: 87, surahName: 'Al-Anbiya' },      // La ilaha illa anta subhanaka
  { surah: 23, ayah: 118, surahName: 'Al-Mu\'minun' },  // Rabbi-ghfir warham wa anta khairur rahimin
  { surah: 14, ayah: 7, surahName: 'Ibrahim' },         // La in syakartum la aziidannakum
];

/**
 * Get a deterministic index based on today's date
 * Same result all day, changes at midnight
 */
function getTodayIndex() {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  // Use year + dayOfYear for variety across years
  const seed = now.getFullYear() * 1000 + dayOfYear;
  return seed % AYAH_POOL.length;
}

/**
 * Fetch the daily ayah text from quran.com API
 * Returns { arabic, translation, reference, surah, ayah, surahName } or null on failure
 */
export async function getDailyAyah() {
  const index = getTodayIndex();
  const selected = AYAH_POOL[index];

  try {
    const [arabicRes, translationRes] = await Promise.all([
      fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${selected.surah}`),
      fetch(`https://api.quran.com/api/v4/quran/translations/33?chapter_number=${selected.surah}`)
    ]);

    if (!arabicRes.ok || !translationRes.ok) {
      throw new Error('API response not ok');
    }

    const arabicData = await arabicRes.json();
    const translationData = await translationRes.json();

    // Find the specific ayah (ayah index is 0-based in the array)
    const ayahIndex = selected.ayah - 1;
    const arabicVerse = arabicData.verses[ayahIndex];
    const translationVerse = translationData.translations[ayahIndex];

    if (!arabicVerse || !translationVerse) {
      throw new Error('Ayah not found in API response');
    }

    // Clean translation text (remove HTML tags)
    const cleanTranslation = translationVerse.text
      .replace(/<sup.*?<\/sup>/g, '')
      .replace(/<[^>]*>/g, '')
      .trim();

    return {
      arabic: arabicVerse.text_uthmani,
      translation: cleanTranslation,
      reference: `QS. ${selected.surahName}: ${selected.ayah}`,
      surah: selected.surah,
      ayah: selected.ayah,
      surahName: selected.surahName,
    };
  } catch (err) {
    console.warn('getDailyAyah failed:', err);
    return null;
  }
}

/**
 * Get today's ayah reference without fetching API (for quick access)
 */
export function getDailyAyahRef() {
  const index = getTodayIndex();
  return AYAH_POOL[index];
}
