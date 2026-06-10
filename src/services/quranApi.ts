/**
 * Quran API Service for Islamediaku
 * Connects with EQuran.id API v2.
 */

const BASE_URL = 'https://equran.id/api/v2';

export interface SurahSummary {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah';
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>; // Maps qari ID to audio URL
}

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah';
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
  ayat: Ayat[];
  suratSebelumnya: any;
  suratSelanjutnya: any;
}

export interface TafsirAyat {
  ayat: number;
  teks: string;
}

export interface SurahTafsir {
  nomor: number;
  nama: string;
  namaLatin: string;
  tafsir: TafsirAyat[];
}

/**
 * Fetches all surahs from EQuran.id
 */
export async function getChapters(): Promise<SurahSummary[]> {
  console.log('[quranApi] Fetching all chapters from EQuran.id');
  try {
    const response = await fetch(`${BASE_URL}/surat`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('[quranApi] Failed to fetch chapters:', error);
    // Return empty list on failure, let components handle empty state
    return [];
  }
}

/**
 * Fetches detail of a single surah by number
 */
export async function getSurahDetail(surahId: number): Promise<SurahDetail | null> {
  console.log(`[quranApi] Fetching surah detail for number: ${surahId}`);
  try {
    const response = await fetch(`${BASE_URL}/surat/${surahId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error(`[quranApi] Failed to fetch surah detail for ${surahId}:`, error);
    return null;
  }
}

/**
 * Fetches tafsir of a single surah by number
 */
export async function getTafsir(surahId: number): Promise<SurahTafsir | null> {
  console.log(`[quranApi] Fetching tafsir for surah: ${surahId}`);
  try {
    const response = await fetch(`${BASE_URL}/tafsir/${surahId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error(`[quranApi] Failed to fetch tafsir for surah ${surahId}:`, error);
    return null;
  }
}
