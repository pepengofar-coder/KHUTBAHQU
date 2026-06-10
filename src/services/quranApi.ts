/**
 * Quran API Service Placeholder for Islamediaku
 * Prepared for integrating with api.quran.com or other public Quran APIs.
 */

export interface SurahSummary {
  id: number;
  name: string;
  nameTransliteration: string;
  nameTranslation: string;
  numberOfVerses: number;
  revelationType: 'meccan' | 'medinan';
}

export interface Verse {
  number: number;
  textArabic: string;
  textLatin: string;
  translationId: string;
  audioUrl?: string;
}

export interface SurahDetail extends SurahSummary {
  verses: Verse[];
}

/**
 * Fetches all chapters (surahs) from the Quran API
 */
export async function getChapters(): Promise<SurahSummary[]> {
  console.log('[quranApi] getChapters placeholder called');
  // Mock data for compatibility
  return [
    { id: 1, name: 'الفاتحة', nameTransliteration: 'Al-Fatihah', nameTranslation: 'Pembukaan', numberOfVerses: 7, revelationType: 'meccan' },
    { id: 2, name: 'البقرة', nameTransliteration: 'Al-Baqarah', nameTranslation: 'Sapi Betina', numberOfVerses: 286, revelationType: 'medinan' }
  ];
}

/**
 * Fetches detail of a single surah by its ID
 */
export async function getSurahDetail(surahId: number): Promise<SurahDetail | null> {
  console.log(`[quranApi] getSurahDetail called for ID: ${surahId}`);
  if (surahId === 1) {
    return {
      id: 1,
      name: 'الفاتحة',
      nameTransliteration: 'Al-Fatihah',
      nameTranslation: 'Pembukaan',
      numberOfVerses: 7,
      revelationType: 'meccan',
      verses: [
        { number: 1, textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', textLatin: 'Bismillāhir-raḥmānir-raḥīm', translationId: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.' }
      ]
    };
  }
  return null;
}
