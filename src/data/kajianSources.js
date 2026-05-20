/**
 * Islamediaku — Kajian & Audio Sources List
 * Keamanan dan orisinalitas hak cipta sangat diprioritaskan.
 * Yufid TV dan Ustadz Official dinonaktifkan dari direct play (enabled: false)
 * untuk mematuhi kebijakan YouTube (disediakan external link).
 * MP3Quran API dan Radio Rodja Live diaktifkan (enabled: true) karena menyediakan stream publik.
 */

export const KAJIAN_SOURCES = [
  {
    id: 'mp3quran',
    name: 'MP3Quran.net Live Radios',
    type: 'mp3quran',
    sourceName: 'MP3Quran.net',
    sourceUrl: 'https://mp3quran.net',
    apiProvider: 'MP3Quran Official API',
    category: 'Murottal & Radio',
    attribution: 'Sumber audio: MP3Quran.net',
    permissionStatus: 'approved',
    isVerified: true,
    enabled: true,
    notes: 'Menggunakan API resmi MP3Quran untuk mendapatkan live stream tilawah Al-Qur\'an.'
  },
  {
    id: 'radio-rodja',
    name: 'Radio Rodja 756 AM Live Stream',
    type: 'radio_live',
    sourceName: 'Radio Rodja 756 AM',
    sourceUrl: 'https://radiorodja.com',
    apiProvider: 'Radio Rodja',
    category: 'Kajian & Radio',
    attribution: 'Sumber audio: Radio Rodja 756 AM',
    permissionStatus: 'approved',
    isVerified: true,
    enabled: true,
    notes: 'Menggunakan live stream audio publik resmi yang disediakan di website Radio Rodja.'
  },
  {
    id: 'yufid-tv',
    name: 'Yufid.TV Official YouTube',
    type: 'youtube_channel',
    sourceName: 'Yufid.TV',
    sourceUrl: 'https://www.youtube.com/@YufidTV',
    apiProvider: 'YouTube API v3 / Link',
    category: 'Video Kajian',
    attribution: 'Sumber konten: Yufid.TV',
    permissionStatus: 'needs_review',
    isVerified: false,
    enabled: false,
    notes: 'Hanya menyediakan tombol external link menuju ke channel YouTube resmi untuk mematuhi kebijakan YouTube.'
  },
  {
    id: 'khalid-basalamah',
    name: 'Khalid Basalamah Official YouTube',
    type: 'youtube_channel',
    sourceName: 'Khalid Basalamah Official',
    sourceUrl: 'https://www.youtube.com/@khalidbasalamahofficial',
    apiProvider: 'YouTube API / Link',
    category: 'Video Kajian',
    attribution: 'Sumber konten: Khalid Basalamah Official',
    permissionStatus: 'needs_review',
    isVerified: false,
    enabled: false,
    notes: 'Menyediakan tombol external link ke YouTube Khalid Basalamah.'
  },
  {
    id: 'firanda-andirja',
    name: 'Dr. Firanda Andirja Official YouTube',
    type: 'youtube_channel',
    sourceName: 'Dr. Firanda Andirja',
    sourceUrl: 'https://www.youtube.com/@DrFirandaAndirja',
    apiProvider: 'YouTube API / Link',
    category: 'Video Kajian',
    attribution: 'Sumber konten: Dr. Firanda Andirja',
    permissionStatus: 'needs_review',
    isVerified: false,
    enabled: false,
    notes: 'Menyediakan tombol external link ke YouTube Firanda Andirja.'
  }
];

export const getSourceById = (id) => KAJIAN_SOURCES.find(s => s.id === id);
