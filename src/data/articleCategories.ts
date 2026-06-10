export interface ArticleCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or Lucide icon name
}

export interface DummyArticle {
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  sourceId: string;
  license: string;
  attribution: string;
  date: string;
  author: string;
}

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  { id: 'dasar-islam', name: 'Dasar Islam', description: 'Aqidah, Rukun Islam, Rukun Iman, dan syahadat dasar.', icon: '🕌' },
  { id: 'ibadah-harian', name: 'Ibadah Harian', description: 'Panduan tata cara sholat, puasa, wudhu, dan bersuci.', icon: '⏰' },
  { id: 'doa-dzikir', name: 'Doa & Dzikir', description: 'Keutamaan, adab, dan bacaan doa serta dzikir harian.', icon: '✨' },
  { id: 'quran-tadabbur', name: 'Qur’an & Tadabbur', description: 'Tafsir ringkas, hikmah ayat, dan kiat membaca Al-Qur\'an.', icon: '📖' },
  { id: 'sejarah-islam', name: 'Sejarah Islam', description: 'Sirah Nabawiyah, kisah sahabat, dan masa keemasan Islam.', icon: '⏳' },
  { id: 'ensiklopedia-islam', name: 'Ensiklopedia Islam', description: 'Istilah keislaman, konsep keilmuan, dan peradaban.', icon: '📚' },
  { id: 'akhlak-muslim', name: 'Akhlak Muslim', description: 'Adab bergaul, bersosialisasi, dan pembinaan moral Islami.', icon: '💎' },
  { id: 'keluarga-muslim', name: 'Keluarga Muslim', description: 'Pendidikan anak, hubungan suami istri, dan rumah tangga sakinah.', icon: '🏡' }
];

export const DUMMY_ARTICLES: DummyArticle[] = [
  {
    slug: 'rukun-islam-dan-penjelasannya',
    title: 'Mengenal Lima Rukun Islam Sebagai Fondasi Keyakinan',
    category: 'dasar-islam',
    summary: 'Penjelasan ringkas mengenai lima pilar utama yang menyusun kerangka peribadatan dan keyakinan seorang Muslim.',
    content: 'Rukun Islam adalah lima tindakan dasar dalam Islam, yang dianggap sebagai pondasi wajib bagi setiap orang yang beriman. Kelima rukun tersebut meliputi: \n\n1. **Syahadat**: Menyatakan keyakinan pada keesaan Allah dan kerasulan Muhammad.\n2. **Sholat**: Mendirikan sholat wajib lima kali sehari semalam.\n3. **Zakat**: Memberikan sebagian harta kepada yang berhak setelah mencapai batas minimal (nisab).\n4. **Puasa (Shaum)**: Berpuasa di bulan Ramadhan untuk melatih ketakwaan.\n5. **Haji**: Menunaikan ibadah haji ke Baitullah bagi yang mampu secara finansial, fisik, dan keamanan perjalanan.\n\nPondasi ini menjadi tiang penopang keislaman seseorang dan membentuk integritas spiritual dalam kehidupan sehari-hari.',
    sourceId: 'wikipedia',
    license: 'CC BY-SA 4.0',
    attribution: 'Diadaptasi dari entitas "Rukun Islam" di Wikipedia Bahasa Indonesia.',
    date: '2026-06-01',
    author: 'Kontributor Wikipedia'
  },
  {
    slug: 'sejarah-singkat-penyusunan-mushaf-alquran',
    title: 'Sejarah Singkat Kodifikasi dan Penyusunan Mushaf Al-Qur\'an',
    category: 'sejarah-islam',
    summary: 'Bagaimana Al-Qur\'an dikumpulkan dari hafalan para sahabat hingga dibukukan menjadi Mushaf Utsmani yang kita baca hari ini.',
    content: 'Proses kodifikasi Al-Qur\'an melewati beberapa tahap penting sepanjang sejarah awal Islam. Pada masa Rasulullah SAW, ayat-ayat Al-Qur\'an dicatat di pelepah kurma, batu datar, dan tulang hewan, di samping dihafalkan oleh ribuan sahabat.\n\nPada masa Khalifah Abu Bakar Ash-Shiddiq, atas usulan Umar bin Khattab, pengumpulan lembaran-lembaran Al-Qur\'an mulai dilakukan secara sistematis yang dipimpin oleh Zaid bin Tsabit karena banyaknya penghafal yang syahid di Perang Yamamah.\n\nSelanjutnya, pada masa Khalifah Utsman bin Affan, terjadi standardisasi dialek bacaan guna mencegah perselisihan. Mushaf induk didefinisikan dan disalin ke beberapa salinan resmi yang dikirim ke kota-kota besar Islam. Metode penulisan inilah yang sekarang dikenal dengan Rasm Utsmani.',
    sourceId: 'wikipedia',
    license: 'CC BY-SA 4.0',
    attribution: 'Diringkas berdasarkan artikel "Sejarah Al-Qur\'an" di Wikipedia Bahasa Indonesia.',
    date: '2026-06-05',
    author: 'Kontributor Wikipedia'
  },
  {
    slug: 'keutamaan-sholat-berjamaah-dalam-hadits',
    title: 'Keutamaan Menegakkan Sholat Berjamaah bagi Umat Muslim',
    category: 'ibadah-harian',
    summary: 'Menelusuri hadits-hadits sahih dan penjelasan ulama mengenai keutamaan sholat berjamaah dibandingkan sholat sendirian.',
    content: 'Sholat berjamaah memiliki kedudukan yang sangat tinggi dalam syariat Islam. Berdasarkan hadits sahih riwayat Al-Bukhari dan Muslim, Rasulullah SAW bersabda bahwa sholat berjamaah melampaui sholat sendirian dengan selisih dua puluh tujuh derajat.\n\nSelain nilai pahala yang berlipat ganda, sholat berjamaah juga berfungsi sebagai sarana silaturahmi antarwarga masyarakat sekitar masjid, menunjukkan persamaan derajat manusia di hadapan Sang Pencipta, serta menumbuhkan disiplin hidup bersama dengan mengikuti gerakan imam secara tertib.',
    sourceId: 'wikibooks',
    license: 'CC BY-SA 4.0',
    attribution: 'Dikutip dari materi "Pendidikan Agama Islam" di Wikibooks Bahasa Indonesia.',
    date: '2026-06-08',
    author: 'Penyunting Wikibooks'
  },
  {
    slug: 'adab-doa-dan-waktu-mustajab',
    title: 'Adab Berdoa serta Waktu-waktu yang Mustajab untuk Bermunajat',
    category: 'doa-dzikir',
    summary: 'Panduan tata cara berdoa yang baik agar ibadah lebih khusyuk beserta pilihan waktu terbaik agar doa dikabulkan.',
    content: 'Doa adalah inti dari ibadah. Agar doa kita dipanjatkan dengan baik, Islam mengajarkan beberapa adab, di antaranya:\n\n1. Mengawali doa dengan memuji Allah SWT dan bershalawat atas Rasulullah SAW.\n2. Berdoa dengan penuh ketundukan (khusyuk) dan penuh keyakinan bahwa Allah akan mengabulkannya.\n3. Menghadap kiblat dan mengangkat kedua tangan.\n\nAdapun waktu-waktu yang dinilai mustajab untuk berdoa meliputi sepertiga malam terakhir, saat sujud terakhir dalam sholat, di antara adzan dan iqamah, serta saat turun hujan lebat.',
    sourceId: 'cc-journals',
    license: 'CC BY 4.0',
    attribution: 'Diadaptasi dari tinjauan pustaka jurnal studi keislaman berlisensi Creative Commons BY.',
    date: '2026-06-09',
    author: 'Redaksi Jurnal Studi Islam'
  }
];
