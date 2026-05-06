/**
 * KhutbahQu — Daftar Sumber Referensi Khutbah
 * Website-website ini digunakan HANYA sebagai inspirasi tema, struktur, dan kualitas.
 * Konten TIDAK boleh disalin mentah. Harus ditulis ulang secara orisinal.
 */

export const SOURCES_INDONESIA = [
  { id: 'muslim-or-id', name: 'Muslim.or.id', url: 'https://muslim.or.id/category/khotbah-jumat', lang: 'id', focus: 'Khutbah Jumat Ahlus Sunnah' },
  { id: 'rumaysho', name: 'Rumaysho.com', url: 'https://rumaysho.com/category/naskah-khutbah/khutbah-jumat', lang: 'id', focus: 'Naskah Khutbah Jumat lengkap' },
  { id: 'khotbahjumat', name: 'KhotbahJumat.com', url: 'https://khotbahjumat.com', lang: 'id', focus: 'Koleksi khutbah Jumat' },
  { id: 'almanhaj', name: 'AlManhaj.or.id', url: 'https://almanhaj.or.id', lang: 'id', focus: 'Kajian dan khutbah Ahlus Sunnah' },
  { id: 'firanda', name: 'BekalIslam Firanda', url: 'https://bekalislam.firanda.com/category/khotbah', lang: 'id', focus: 'Khutbah dari Ustadz Firanda Andirja' },
  { id: 'radiorodja', name: 'Radio Rodja', url: 'https://www.radiorodja.com/download/khutbah-jumat', lang: 'id', focus: 'Audio dan naskah khutbah Jumat' },
];

export const SOURCES_INTERNATIONAL = [
  { id: 'islamhouse', name: 'IslamHouse.com', url: 'https://islamhouse.com', lang: 'multi', focus: 'Materi dakwah multibahasa' },
  { id: 'khutbah-info', name: 'Khutbah.info', url: 'https://www.khutbah.info/khutbahs', lang: 'en', focus: 'Koleksi khutbah bahasa Inggris' },
  { id: 'haramain', name: 'Masjidil Haram & Nabawi', url: 'https://manaratalharamain.gov.sa', lang: 'ar', focus: 'Khutbah resmi Haramain' },
  { id: 'awqaf-uae', name: 'Awqaf UAE', url: 'https://www.awqaf.gov.ae/khutba-archive', lang: 'ar', focus: 'Arsip khutbah resmi UAE' },
  { id: 'abdurrahman', name: 'Abdurrahman.org', url: 'https://abdurrahman.org/salah/friday-jumuah', lang: 'en', focus: 'Materi Jumat dalam bahasa Inggris' },
  { id: 'sunnah-com', name: 'Sunnah.com', url: 'https://sunnah.com', lang: 'multi', focus: 'Database hadis online' },
  { id: 'kalamullah', name: 'Kalamullah.com', url: 'https://kalamullah.com', lang: 'en', focus: 'Perpustakaan Islam digital' },
];

export const ALL_SOURCES = [...SOURCES_INDONESIA, ...SOURCES_INTERNATIONAL];

/** Tema yang bisa diambil dari sumber referensi */
export const SUGGESTED_THEMES = [
  { theme: 'tauhid', label: 'Tauhid', description: 'Mengesakan Allah subhanahu wa ta\'ala' },
  { theme: 'taqwa', label: 'Takwa', description: 'Ketakwaan kepada Allah subhanahu wa ta\'ala' },
  { theme: 'shalat', label: 'Shalat', description: 'Keutamaan dan hukum shalat' },
  { theme: 'akhlak', label: 'Akhlak', description: 'Budi pekerti dan adab Islami' },
  { theme: 'death', label: 'Kematian', description: 'Mengingat kematian dan akhirat' },
  { theme: 'family', label: 'Keluarga', description: 'Rumah tangga Islami' },
  { theme: 'ramadan', label: 'Ramadhan', description: 'Puasa dan ibadah Ramadhan' },
  { theme: 'hajj', label: 'Dzulhijjah', description: 'Haji, qurban, dan bulan Dzulhijjah' },
  { theme: 'jumat', label: 'Hari Jumat', description: 'Keutamaan dan adab hari Jumat' },
  { theme: 'taubat', label: 'Tobat', description: 'Keutamaan taubat dan istighfar' },
  { theme: 'dunia', label: 'Fitnah Dunia', description: 'Bahaya cinta dunia berlebihan' },
  { theme: 'lisan', label: 'Menjaga Lisan', description: 'Adab berbicara dan bahaya lisan' },
  { theme: 'quran', label: 'Al-Qur\'an', description: 'Keutamaan membaca dan mengamalkan Al-Qur\'an' },
  { theme: 'sunnah', label: 'Sunnah', description: 'Mengikuti Sunnah Rasulullah shallallahu \'alaihi wasallam' },
  { theme: 'patience', label: 'Sabar', description: 'Keutamaan bersabar dalam ujian' },
  { theme: 'gratitude', label: 'Syukur', description: 'Mensyukuri nikmat Allah subhanahu wa ta\'ala' },
  { theme: 'social', label: 'Sosial', description: 'Hubungan bermasyarakat dalam Islam' },
  { theme: 'youth', label: 'Pemuda', description: 'Pembinaan generasi muda Muslim' },
];

/** Status konten khutbah */
export const CONTENT_STATUSES = {
  DRAFT: 'draft',
  REVIEW: 'review',
  READY: 'ready',
  PUBLISHED: 'published',
};

export const STATUS_LABELS = {
  draft: { label: 'Draft', color: '#6B7280', icon: '📝' },
  review: { label: 'Perlu Review', color: '#D97706', icon: '🔍' },
  ready: { label: 'Siap Publish', color: '#059669', icon: '✅' },
  published: { label: 'Published', color: '#0F3D2E', icon: '🟢' },
};
