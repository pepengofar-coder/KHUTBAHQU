/**
 * MP3Quran.net API Service for Islamediaku
 * Fetches and filters reciters, moshafs, and audio files for Juz 30.
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
