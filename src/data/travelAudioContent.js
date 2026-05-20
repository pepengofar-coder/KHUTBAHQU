/**
 * Islamediaku — Travel Audio Content Database
 * Menyediakan daftar playlist dan item audio yang aman dan terverifikasi.
 * 
 * Aturan Akses Audio:
 * 1. Jika audioUrl bernilai null/kosong dan route bernilai null/kosong, tombol Putar akan dinonaktifkan
 *    dan menampilkan pesan "Audio belum tersedia."
 * 2. Jika isVerified = false atau enabled = false, audio tidak dapat diputar langsung.
 *    Jika item memiliki sourceUrl, akan diarahkan ke link eksternal resmi.
 * 3. Jika item memiliki route, tombol akan berfungsi sebagai "Buka Fitur" yang mengarahkan ke halaman internal.
 */

export const PLAYLISTS = [
  {
    id: 'tenang-perjalanan',
    title: 'Tenang di Perjalanan',
    subtitle: 'Lantunan Al-Qur\'an dan dzikir yang menenangkan jiwa sepanjang jalan.',
    gradient: 'linear-gradient(135deg, #0047FF, #002B9A)',
    icon: '🚗',
    coverStyle: 'blue-lime'
  },
  {
    id: 'tilawah-pilihan',
    title: 'Tilawah Pilihan',
    subtitle: 'Surah-surah pilihan dengan lantunan sangat merdu qari internasional.',
    gradient: 'linear-gradient(135deg, #1D7CFF, #0047FF)',
    icon: '📖',
    coverStyle: 'royal'
  },
  {
    id: 'murottal-juz-amma',
    title: 'Murottal Juz Amma',
    subtitle: 'Hafalan surat pendek yang sangat cocok didengarkan bersama keluarga.',
    gradient: 'linear-gradient(135deg, #10B981, #047857)',
    icon: '🎧',
    coverStyle: 'green'
  },
  {
    id: 'dzikir-doa',
    title: 'Dzikir & Doa',
    subtitle: 'Penjaga diri di perjalanan melalui untaian doa dan dzikir safar.',
    gradient: 'linear-gradient(135deg, #EC4899, #BE185D)',
    icon: '❤️',
    coverStyle: 'rose'
  },
  {
    id: 'kajian-ringan',
    title: 'Kajian Ringan',
    subtitle: 'Hikmah dan ilmu bermanfaat dalam kajian pendek yang menemani safar.',
    gradient: 'linear-gradient(135deg, #6366F1, #4338CA)',
    icon: '🎙️',
    coverStyle: 'indigo'
  },
  {
    id: 'radio-quran-live',
    title: 'Radio Qur\'an Live',
    subtitle: 'Siaran tilawah Al-Qur\'an 24 jam langsung dari qari dunia.',
    gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
    icon: '📻',
    coverStyle: 'cyan'
  }
];

export const TRAVEL_AUDIO_ITEMS = [
  // 1. Radio & Live
  {
    id: 'radio-rodja-live',
    type: 'radio',
    title: 'Radio Rodja 756 AM',
    subtitle: 'Live kajian Islam & tilawah Al-Qur\'an',
    playlistIds: ['kajian-ringan', 'radio-quran-live'],
    sourceName: 'Radio Rodja 756 AM',
    sourceUrl: 'https://radiorodja.com',
    apiProvider: 'Radio Rodja',
    audioUrl: 'https://radio.rodjaam.com:8000/stream',
    isLive: true,
    isVerified: true,
    enabled: true,
    attribution: 'Sumber audio: Radio Rodja 756 AM',
    duration: null,
    notes: 'Kajian sunnah interaktif dan tilawah langsung.'
  },
  // 2. Tilawah Pilihan (MP3Quran CDN)
  {
    id: 'tilawah-sudais-mulk',
    type: 'tilawah',
    title: 'Surah Al-Mulk',
    subtitle: 'Syaikh Abdurrahman As-Sudais',
    playlistIds: ['tilawah-pilihan', 'tenang-perjalanan'],
    sourceName: 'MP3Quran.net',
    sourceUrl: 'https://mp3quran.net',
    apiProvider: 'MP3Quran.net',
    audioUrl: 'https://server11.mp3quran.net/sds/067.mp3',
    isLive: false,
    isVerified: true,
    enabled: true,
    attribution: 'Sumber audio: MP3Quran.net',
    duration: 180, // Sekitar 3 menit
    notes: 'Surah pelindung dari siksa kubur, dilantunkan imam Masjidil Haram.'
  },
  {
    id: 'tilawah-alafasy-naba',
    type: 'tilawah',
    title: 'Surah An-Naba\'',
    subtitle: 'Syaikh Mishary Rashid Alafasy',
    playlistIds: ['tilawah-pilihan', 'murottal-juz-amma', 'tenang-perjalanan'],
    sourceName: 'MP3Quran.net',
    sourceUrl: 'https://mp3quran.net',
    apiProvider: 'MP3Quran.net',
    audioUrl: 'https://server8.mp3quran.net/afs/078.mp3',
    isLive: false,
    isVerified: true,
    enabled: true,
    attribution: 'Sumber audio: MP3Quran.net',
    duration: 320,
    notes: 'Surah pembuka Juz 30.'
  },
  {
    id: 'tilawah-ghamdi-nas',
    type: 'tilawah',
    title: 'Surah An-Nas',
    subtitle: 'Syaikh Saad Al-Ghamdi',
    playlistIds: ['murottal-juz-amma', 'tenang-perjalanan'],
    sourceName: 'MP3Quran.net',
    sourceUrl: 'https://mp3quran.net',
    apiProvider: 'MP3Quran.net',
    audioUrl: 'https://server7.mp3quran.net/s_gmd/114.mp3',
    isLive: false,
    isVerified: true,
    enabled: true,
    attribution: 'Sumber audio: MP3Quran.net',
    duration: 65,
    notes: 'Perlindungan diri dari bisikan syaitan.'
  },
  // 3. Doa & Dzikir Intern / Route Shortcuts
  {
    id: 'safar-doa-shortcut',
    type: 'doa',
    title: 'Doa Safar (Perjalanan)',
    subtitle: 'Membaca doa keluar rumah dan berkendara',
    playlistIds: ['dzikir-doa', 'tenang-perjalanan'],
    sourceName: 'Hadits Shahih',
    sourceUrl: 'https://almanhaj.or.id',
    apiProvider: 'Islamediaku',
    audioUrl: null, // Tanpa audio langsung, dialihkan ke view teks
    route: '/mode-perjalanan', // Tetap di halaman ini tapi scroll/buka widget Doa Safar!
    isLive: false,
    isVerified: true,
    enabled: true,
    attribution: 'Sumber: HR. Muslim & Tirmidzi',
    notes: 'Buka bacaan teks Doa Safar interaktif dengan terjemahan.'
  },
  {
    id: 'dzikir-pagi-shortcut',
    type: 'dzikir',
    title: 'Dzikir Pagi Lengkap',
    subtitle: 'Buka bacaan dzikir pagi sesuai sunnah',
    playlistIds: ['dzikir-doa'],
    sourceName: 'Almanhaj',
    sourceUrl: 'https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html',
    apiProvider: 'Islamediaku',
    audioUrl: null,
    route: '/doa-dzikir', // Mengarahkan ke fitur Dzikir Pagi Petang aplikasi
    isLive: false,
    isVerified: true,
    enabled: true,
    attribution: 'Sumber teks: Almanhaj.or.id',
    notes: 'Membuka bacaan dzikir pagi interaktif.'
  },
  {
    id: 'dzikir-petang-shortcut',
    type: 'dzikir',
    title: 'Dzikir Petang Lengkap',
    subtitle: 'Buka bacaan dzikir petang sesuai sunnah',
    playlistIds: ['dzikir-doa'],
    sourceName: 'Almanhaj',
    sourceUrl: 'https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html',
    apiProvider: 'Islamediaku',
    audioUrl: null,
    route: '/doa-dzikir',
    isLive: false,
    isVerified: true,
    enabled: true,
    attribution: 'Sumber teks: Almanhaj.or.id',
    notes: 'Membuka bacaan dzikir petang interaktif.'
  },
  // 4. Kajian YouTube placeholders (Needs Review / External links)
  {
    id: 'kajian-yufid-1',
    type: 'kajian',
    title: 'Adab-Adab Mengendarai Kendaraan',
    subtitle: 'Kajian Pendek Yufid.TV',
    playlistIds: ['kajian-ringan'],
    sourceName: 'Yufid.TV Official YouTube',
    sourceUrl: 'https://www.youtube.com/@YufidTV',
    apiProvider: 'YouTube Channel',
    audioUrl: null, // Dinonaktifkan untuk menghormati TOS YouTube
    isLive: false,
    isVerified: false,
    enabled: false,
    attribution: 'Sumber video: Yufid.TV',
    notes: 'Audio belum tersedia untuk pemutaran langsung. Silakan tonton kajian melalui link resmi.'
  },
  {
    id: 'kajian-khalid-1',
    type: 'kajian',
    title: 'Keutamaan Safar dan Keringanan Ibadah',
    subtitle: 'Ustadz Khalid Basalamah',
    playlistIds: ['kajian-ringan', 'pengingat-iman'],
    sourceName: 'Khalid Basalamah Official',
    sourceUrl: 'https://www.youtube.com/@khalidbasalamahofficial',
    apiProvider: 'YouTube',
    audioUrl: null,
    isLive: false,
    isVerified: false,
    enabled: false,
    attribution: 'Sumber video: Khalid Basalamah Official',
    notes: 'Audio belum tersedia. Gunakan tombol YouTube untuk membuka konten resmi.'
  }
];

export const getPlaylistItems = (playlistId) => 
  TRAVEL_AUDIO_ITEMS.filter(item => item.playlistIds.includes(playlistId));

export const getPlaylistById = (id) => PLAYLISTS.find(p => p.id === id);
