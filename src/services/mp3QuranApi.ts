/**
 * MP3Quran.net API Service for Islamediaku
 * Fetches and filters reciters, moshafs, and audio files.
 * Supports Juz 30 (Juz Amma) mode and full 30 Juz mode.
 */

export const JUZ_30_SURAH_IDS = [
  78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97,
  98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114
];

// Map surah IDs to their names in Indonesian for the playlist
export const SURAH_NAMES: Record<number, string> = {
  78: 'An-Naba', 79: 'An-Nazi\'at', 80: '\'Abasa', 81: 'At-Takwir', 82: 'Al-Infitar',
  83: 'Al-Mutaffifin', 84: 'Al-Inshiqaq', 85: 'Al-Buruj', 86: 'At-Tariq', 87: 'Al-A\'la',
  88: 'Al-Ghashiyah', 89: 'Al-Fajr', 90: 'Al-Balad', 91: 'Ash-Shams', 92: 'Al-Lail',
  93: 'Ad-Duha', 94: 'Al-Inshirah', 95: 'At-Tin', 96: 'Al-\'Alaq', 97: 'Al-Qadr',
  98: 'Al-Bayyinah', 99: 'Az-Zalzalah', 100: 'Al-\'Adiyat', 101: 'Al-Qari\'ah',
  102: 'At-Takathur', 103: 'Al-\'Asr', 104: 'Al-Humazah', 105: 'Al-Fil', 106: 'Quraysh',
  107: 'Al-Ma\'un', 108: 'Al-Kautsar', 109: 'Al-Kafirun', 110: 'An-Nasr',
  111: 'Al-Lahab', 112: 'Al-Ikhlas', 113: 'Al-Falaq', 114: 'An-Nas'
};

// Complete map of all 114 surah names
export const ALL_SURAH_NAMES: Record<number, string> = {
  1: 'Al-Fatihah', 2: 'Al-Baqarah', 3: 'Ali \'Imran', 4: 'An-Nisa', 5: 'Al-Ma\'idah',
  6: 'Al-An\'am', 7: 'Al-A\'raf', 8: 'Al-Anfal', 9: 'At-Taubah', 10: 'Yunus',
  11: 'Hud', 12: 'Yusuf', 13: 'Ar-Ra\'d', 14: 'Ibrahim', 15: 'Al-Hijr',
  16: 'An-Nahl', 17: 'Al-Isra', 18: 'Al-Kahf', 19: 'Maryam', 20: 'Taha',
  21: 'Al-Anbiya', 22: 'Al-Hajj', 23: 'Al-Mu\'minun', 24: 'An-Nur', 25: 'Al-Furqan',
  26: 'Ash-Shu\'ara', 27: 'An-Naml', 28: 'Al-Qasas', 29: 'Al-Ankabut', 30: 'Ar-Rum',
  31: 'Luqman', 32: 'As-Sajdah', 33: 'Al-Ahzab', 34: 'Saba', 35: 'Fatir',
  36: 'Ya-Sin', 37: 'As-Saffat', 38: 'Sad', 39: 'Az-Zumar', 40: 'Ghafir',
  41: 'Fussilat', 42: 'Ash-Shura', 43: 'Az-Zukhruf', 44: 'Ad-Dukhan', 45: 'Al-Jathiyah',
  46: 'Al-Ahqaf', 47: 'Muhammad', 48: 'Al-Fath', 49: 'Al-Hujurat', 50: 'Qaf',
  51: 'Adh-Dhariyat', 52: 'At-Tur', 53: 'An-Najm', 54: 'Al-Qamar', 55: 'Ar-Rahman',
  56: 'Al-Waqi\'ah', 57: 'Al-Hadid', 58: 'Al-Mujadalah', 59: 'Al-Hashr', 60: 'Al-Mumtahanah',
  61: 'As-Saff', 62: 'Al-Jumu\'ah', 63: 'Al-Munafiqun', 64: 'At-Taghabun', 65: 'At-Talaq',
  66: 'At-Tahrim', 67: 'Al-Mulk', 68: 'Al-Qalam', 69: 'Al-Haqqah', 70: 'Al-Ma\'arij',
  71: 'Nuh', 72: 'Al-Jinn', 73: 'Al-Muzzammil', 74: 'Al-Muddathir', 75: 'Al-Qiyamah',
  76: 'Al-Insan', 77: 'Al-Mursalat',
  ...SURAH_NAMES
};

// Juz 1–30 mapping: each Juz with its starting surah/ayah, ending surah/ayah, and list of surah IDs
export interface JuzInfo {
  juz: number;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  surahIds: number[];
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export const JUZ_MAP: JuzInfo[] = [
  { juz: 1,  startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141, surahIds: [1, 2] },
  { juz: 2,  startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252, surahIds: [2] },
  { juz: 3,  startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92, surahIds: [2, 3] },
  { juz: 4,  startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23, surahIds: [3, 4] },
  { juz: 5,  startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147, surahIds: [4] },
  { juz: 6,  startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81, surahIds: [4, 5] },
  { juz: 7,  startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110, surahIds: [5, 6] },
  { juz: 8,  startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87, surahIds: [6, 7] },
  { juz: 9,  startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40, surahIds: [7, 8] },
  { juz: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92, surahIds: [8, 9] },
  { juz: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5, surahIds: [9, 10, 11] },
  { juz: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52, surahIds: [11, 12] },
  { juz: 13, startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52, surahIds: [12, 13, 14] },
  { juz: 14, startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128, surahIds: range(15, 16) },
  { juz: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74, surahIds: [17, 18] },
  { juz: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135, surahIds: [18, 19, 20] },
  { juz: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78, surahIds: [21, 22] },
  { juz: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20, surahIds: [23, 24, 25] },
  { juz: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55, surahIds: [25, 26, 27] },
  { juz: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45, surahIds: [27, 28, 29] },
  { juz: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30, surahIds: range(29, 33) },
  { juz: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27, surahIds: range(33, 36) },
  { juz: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31, surahIds: range(36, 39) },
  { juz: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46, surahIds: range(39, 41) },
  { juz: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37, surahIds: range(41, 45) },
  { juz: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30, surahIds: range(46, 51) },
  { juz: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29, surahIds: range(51, 57) },
  { juz: 28, startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12, surahIds: range(58, 66) },
  { juz: 29, startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50, surahIds: range(67, 77) },
  { juz: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6, surahIds: range(78, 114) },
];

export interface RawMoshaf {
  id: number;
  name: string;
  server: string;
  surah_list: string;
  rewaya: string;
}

export interface RawReciter {
  id: string;
  name: string;
  letter: string;
  date: string;
  moshaf: RawMoshaf[];
}

export interface NormalizedMoshaf {
  moshafId: number;
  moshafName: string;
  rewayaName: string;
  server: string;
  availableSurahIds: number[];
}

export interface NormalizedReciter {
  reciterId: number;
  reciterName: string;
  moshafs: NormalizedMoshaf[];
}

export interface PlaylistSurah {
  surahId: number;
  surahName: string;
  audioUrl: string;
}

export interface NormalizedPlaylist {
  reciterId: number;
  reciterName: string;
  moshafId: number;
  moshafName: string;
  rewayaName: string;
  server: string;
  availableSurahIds: number[];
  juz30SurahIds: number[];
  playlist: PlaylistSurah[];
}

/**
 * Normalizes a raw Moshaf object from the API
 */
export function normalizeMp3QuranMoshaf(raw: RawMoshaf): NormalizedMoshaf {
  // Parse comma-separated list of surah numbers (e.g. "1,2,3,4") into array of numbers
  const availableSurahIds = raw.surah_list
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n));

  return {
    moshafId: raw.id,
    moshafName: raw.name,
    rewayaName: raw.rewaya,
    server: raw.server,
    availableSurahIds
  };
}

/**
 * Normalizes a raw Reciter object from the API
 */
export function normalizeMp3QuranReciter(raw: RawReciter): NormalizedReciter {
  const moshafs = (raw.moshaf || []).map(normalizeMp3QuranMoshaf);
  return {
    reciterId: parseInt(raw.id, 10),
    reciterName: raw.name,
    moshafs
  };
}

/**
 * Builds direct audio URL for a surah based on the server path
 */
export function buildSurahAudioUrl(server: string, surahId: number): string {
  const padded = String(surahId).padStart(3, '0');
  // Clean up server URL to make sure it has a trailing slash
  const baseUrl = server.endsWith('/') ? server : `${server}/`;
  return `${baseUrl}${padded}.mp3`;
}

/**
 * Fetches all reciters from MP3Quran.net and caches them
 */
export async function getMp3QuranReciters(forceRefresh = false): Promise<NormalizedReciter[]> {
  const cacheKey = 'islamediaku_mp3quran_reciters';
  
  if (!forceRefresh) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Cache for 7 days
        if (parsed && Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
          return parsed.data;
        }
      } catch (_) {}
    }
  }

  console.log('[mp3QuranApi] Fetching all reciters from MP3Quran API');
  try {
    const response = await fetch('https://www.mp3quran.net/api/v3/reciters?language=eng');
    if (!response.ok) throw new Error('Failed to fetch from MP3Quran');
    const result = await response.json();
    
    if (result && Array.isArray(result.reciters)) {
      const normalized = result.reciters.map(normalizeMp3QuranReciter);
      localStorage.setItem(cacheKey, JSON.stringify({ data: normalized, timestamp: Date.now() }));
      return normalized;
    }
    return [];
  } catch (error) {
    console.error('[mp3QuranApi] Error fetching reciters:', error);
    
    // Fallback to cached copy even if expired, if available
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached).data;
      } catch (_) {}
    }
    return [];
  }
}

/**
 * Retrieves reciters who have at least one surah from Juz 30
 */
export async function getRecitersWithJuz30(forceRefresh = false): Promise<NormalizedReciter[]> {
  const reciters = await getMp3QuranReciters(forceRefresh);
  
  // Filter reciters to only include those with moshafs containing Juz 30 surahs
  return reciters.map(reciter => {
    const validMoshafs = reciter.moshafs.filter(moshaf => {
      // Check if moshaf has any surah in Juz 30
      const intersect = moshaf.availableSurahIds.filter(id => JUZ_30_SURAH_IDS.includes(id));
      // Require at least 5 surahs of Juz 30 to display (most have all or none)
      return intersect.length >= 5;
    });

    return {
      ...reciter,
      moshafs: validMoshafs
    };
  }).filter(reciter => reciter.moshafs.length > 0);
}

/**
 * Builds the playlist for Juz 30 for a specific reciter and moshaf
 */
export async function getJuz30PlaylistByReciter(
  reciterId: number,
  moshafId: number,
  forceRefresh = false
): Promise<NormalizedPlaylist | null> {
  const cacheKey = `islamediaku_juz30_playlist_${reciterId}_${moshafId}`;
  
  if (!forceRefresh) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) { // 24 hours cache for specific playlist
          return parsed.data;
        }
      } catch (_) {}
    }
  }

  console.log(`[mp3QuranApi] Building playlist for reciter ${reciterId}, moshaf ${moshafId}`);
  const reciters = await getRecitersWithJuz30();
  const reciter = reciters.find(r => r.reciterId === reciterId);
  if (!reciter) return null;

  const moshaf = reciter.moshafs.find(m => m.moshafId === moshafId);
  if (!moshaf) return null;

  // Filter available surahs that are in Juz 30
  const availableJuz30Surahs = JUZ_30_SURAH_IDS.filter(id => moshaf.availableSurahIds.includes(id));

  // Build audio playlist items
  const playlist: PlaylistSurah[] = availableJuz30Surahs.map(surahId => ({
    surahId,
    surahName: SURAH_NAMES[surahId] || `Surat ${surahId}`,
    audioUrl: buildSurahAudioUrl(moshaf.server, surahId)
  }));

  const data: NormalizedPlaylist = {
    reciterId,
    reciterName: reciter.reciterName,
    moshafId,
    moshafName: moshaf.moshafName,
    rewayaName: moshaf.rewayaName,
    server: moshaf.server,
    availableSurahIds: moshaf.availableSurahIds,
    juz30SurahIds: availableJuz30Surahs,
    playlist
  };

  localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
  return data;
}

/**
 * Retrieves reciters whose moshaf has all 114 surahs (complete Quran)
 */
export async function getRecitersWithComplete114(forceRefresh = false): Promise<NormalizedReciter[]> {
  const reciters = await getMp3QuranReciters(forceRefresh);
  
  return reciters.map(reciter => {
    const completeMoshafs = reciter.moshafs.filter(moshaf => {
      return moshaf.availableSurahIds.length >= 114;
    });
    return { ...reciter, moshafs: completeMoshafs };
  }).filter(reciter => reciter.moshafs.length > 0);
}

/**
 * Builds a full playlist for all available surahs from a specific reciter/moshaf
 */
export async function getFullPlaylistByReciter(
  reciterId: number,
  moshafId: number,
  forceRefresh = false
): Promise<NormalizedPlaylist | null> {
  const reciters = await getMp3QuranReciters(forceRefresh);
  const reciter = reciters.find(r => r.reciterId === reciterId);
  if (!reciter) return null;

  const moshaf = reciter.moshafs.find(m => m.moshafId === moshafId);
  if (!moshaf) return null;

  const playlist: PlaylistSurah[] = moshaf.availableSurahIds
    .sort((a, b) => a - b)
    .map(surahId => ({
      surahId,
      surahName: ALL_SURAH_NAMES[surahId] || `Surat ${surahId}`,
      audioUrl: buildSurahAudioUrl(moshaf.server, surahId)
    }));

  return {
    reciterId,
    reciterName: reciter.reciterName,
    moshafId,
    moshafName: moshaf.moshafName,
    rewayaName: moshaf.rewayaName,
    server: moshaf.server,
    availableSurahIds: moshaf.availableSurahIds,
    juz30SurahIds: JUZ_30_SURAH_IDS.filter(id => moshaf.availableSurahIds.includes(id)),
    playlist
  };
}

/**
 * Builds a playlist for a specific Juz from a reciter/moshaf
 * Plays all surahs that appear in the Juz
 */
export async function getJuzPlaylist(
  reciterId: number,
  moshafId: number,
  juzNumber: number,
  forceRefresh = false
): Promise<NormalizedPlaylist | null> {
  const juz = JUZ_MAP.find(j => j.juz === juzNumber);
  if (!juz) return null;

  const reciters = await getMp3QuranReciters(forceRefresh);
  const reciter = reciters.find(r => r.reciterId === reciterId);
  if (!reciter) return null;

  const moshaf = reciter.moshafs.find(m => m.moshafId === moshafId);
  if (!moshaf) return null;

  // Get unique surahs in this Juz that the reciter has
  const uniqueSurahIds = [...new Set(juz.surahIds)];
  const availableInJuz = uniqueSurahIds.filter(id => moshaf.availableSurahIds.includes(id));

  const playlist: PlaylistSurah[] = availableInJuz.map(surahId => ({
    surahId,
    surahName: ALL_SURAH_NAMES[surahId] || `Surat ${surahId}`,
    audioUrl: buildSurahAudioUrl(moshaf.server, surahId)
  }));

  return {
    reciterId,
    reciterName: reciter.reciterName,
    moshafId,
    moshafName: moshaf.moshafName,
    rewayaName: moshaf.rewayaName,
    server: moshaf.server,
    availableSurahIds: moshaf.availableSurahIds,
    juz30SurahIds: JUZ_30_SURAH_IDS.filter(id => moshaf.availableSurahIds.includes(id)),
    playlist
  };
}
