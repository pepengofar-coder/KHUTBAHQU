export const CATEGORIES = [
  { id: 'akhlak', label: 'Akhlak', icon: '🤝' },
  { id: 'ibadah', label: 'Ibadah', icon: '🕌' },
  { id: 'family', label: 'Keluarga', icon: '👨‍👩‍👧' },
  { id: 'youth', label: 'Pemuda', icon: '🧑' },
  { id: 'ramadan', label: 'Ramadan', icon: '🌙' },
  { id: 'hajj', label: 'Haji', icon: '🕋' },
  { id: 'qurban', label: 'Qurban', icon: '🐑' },
  { id: 'muharram', label: 'Muharram', icon: '📅' },
  { id: 'maulid', label: 'Maulid', icon: '💚' },
  { id: 'social', label: 'Sosial', icon: '🏘️' },
  { id: 'death', label: 'Kematian & Akhirat', icon: '⏳' },
  { id: 'taqwa', label: 'Taqwa', icon: '🤲' },
  { id: 'gratitude', label: 'Syukur', icon: '🙏' },
  { id: 'patience', label: 'Sabar', icon: '💪' },
];

export const TYPES = [
  { id: 'khutbah-jumat', label: 'Khutbah Jumat' },
  { id: 'khutbah-singkat', label: 'Khutbah Singkat' },
  { id: 'kultum', label: 'Kultum' },
  { id: 'tausiyah', label: 'Tausiyah' },
];

const MUK = `إِنَّ الْحَمْدَ لِلَّهِ نَحْمَدُهُ وَنَسْتَعِينُهُ وَنَسْتَغْفِرُهُ وَنَعُوذُ بِاللَّهِ مِنْ شُرُورِ أَنْفُسِنَا وَسَيِّئَاتِ أَعْمَالِنَا`;
const DUA = `رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ`;

export const khutbahList = [
  {
    id: 1, title: 'Keutamaan Menjaga Lisan', slug: 'keutamaan-menjaga-lisan',
    summary: 'Lisan adalah organ kecil berdampak besar. Khutbah ini membahas adab berbicara dalam Islam dan bahaya lisan yang tidak dijaga.',
    category: 'akhlak', type: 'khutbah-jumat', duration: 10, occasion: 'Jumat',
    tags: ['lisan', 'adab', 'ghibah'], createdAt: '2026-05-02',
    firstKhutbah: [
      { type: 'opening', text: MUK },
      { type: 'paragraph', text: "Ma'asyiral muslimin rahimakumullah. Segala puji bagi Allah yang telah memberikan kita nikmat iman dan Islam. Shalawat serta salam semoga tercurah kepada Nabi Muhammad shallallahu 'alaihi wasallam." },
      { type: 'quran', arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا', translation: '"Hai orang-orang yang beriman, bertakwalah kepada Allah dan katakanlah perkataan yang benar."', ref: 'QS. Al-Ahzab: 70' },
      { type: 'paragraph', text: 'Allah memerintahkan kita untuk berkata yang benar (qaulan sadida). Perkataan yang benar adalah perkataan yang tepat sasaran, tidak menyakiti, dan membawa kebaikan.' },
      { type: 'hadith', arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', translation: '"Barangsiapa beriman kepada Allah dan Hari Akhir, hendaklah berkata baik atau diam."', ref: 'HR. Bukhari & Muslim' },
    ],
    secondKhutbah: [
      { type: 'paragraph', text: 'Jamaah sekalian, lisan adalah organ tubuh kecil namun dampaknya sangat besar. Rasulullah menjelaskan bahwa mayoritas penyebab seseorang masuk neraka adalah karena lisannya.' },
      { type: 'paragraph', text: 'Maka marilah kita menjaga lisan, berbicara yang bermanfaat, menghindari ghibah, namimah, dan perkataan dusta.' },
    ],
    dua: DUA, references: ['QS. Al-Ahzab: 70', 'HR. Bukhari & Muslim'],
  },
  {
    id: 2, title: 'Hukum Riba di Era Modern', slug: 'hukum-riba-era-modern',
    summary: 'Riba adalah dosa besar yang diharamkan dalam Al-Quran. Khutbah ini membahas bentuk-bentuk riba modern dan cara menghindarinya.',
    category: 'social', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
    tags: ['riba', 'muamalah', 'ekonomi'], createdAt: '2026-04-25',
    firstKhutbah: [
      { type: 'opening', text: MUK },
      { type: 'paragraph', text: "Pada hari yang mulia ini, marilah kita meningkatkan ketakwaan kepada Allah dengan menjalankan perintah-Nya dan menjauhi larangan-Nya." },
      { type: 'quran', arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَذَرُوا مَا بَقِيَ مِنَ الرِّبَا إِنْ كُنْتُمْ مُؤْمِنِينَ', translation: '"Bertakwalah kepada Allah dan tinggalkanlah sisa riba jika kamu orang beriman."', ref: 'QS. Al-Baqarah: 278' },
    ],
    secondKhutbah: [
      { type: 'paragraph', text: 'Praktik riba telah menyebar dalam berbagai bentuk: kredit berbunga, pinjaman online ilegal, dan skema investasi riba. Marilah kita berhati-hati dalam muamalah.' },
    ],
    dua: DUA, references: ['QS. Al-Baqarah: 278-279'],
  },
  {
    id: 3, title: 'Panduan Keluarga Sakinah', slug: 'panduan-keluarga-sakinah',
    summary: 'Keluarga sakinah mawaddah warahmah adalah dambaan setiap muslim. Bagaimana membangun fondasi keluarga kokoh berdasarkan Al-Quran dan Sunnah.',
    category: 'family', type: 'khutbah-jumat', duration: 12, occasion: 'Nikah',
    tags: ['keluarga', 'nikah', 'sakinah'], createdAt: '2026-04-20',
    firstKhutbah: [
      { type: 'opening', text: MUK },
      { type: 'quran', arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً', translation: '"Di antara tanda kekuasaan-Nya ialah Dia menciptakan pasangan dari jenismu sendiri agar kamu merasa tenteram, dan dijadikan rasa kasih dan sayang."', ref: 'QS. Ar-Rum: 21' },
    ],
    secondKhutbah: [
      { type: 'paragraph', text: 'Fondasi keluarga kokoh dibangun atas ketakwaan, saling menghormati, komunikasi yang baik, dan menunaikan hak kewajiban masing-masing.' },
    ],
    dua: DUA, references: ['QS. Ar-Rum: 21'],
  },
  {
    id: 4, title: 'Tafsir Surat Al-Asr', slug: 'tafsir-surat-al-asr',
    summary: "Imam Syafi'i berkata: seandainya manusia merenungkan surat ini saja, niscaya itu sudah cukup bagi mereka.",
    category: 'taqwa', type: 'kultum', duration: 8, occasion: 'Umum',
    tags: ['tafsir', 'waktu', 'amal-saleh'], createdAt: '2026-04-18',
    firstKhutbah: [
      { type: 'quran', arabic: 'وَالْعَصْرِ ○ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ○ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', translation: '"Demi masa. Manusia dalam kerugian, kecuali yang beriman, beramal saleh, saling menasihati kebenaran dan kesabaran."', ref: 'QS. Al-Asr: 1-3' },
      { type: 'paragraph', text: 'Empat syarat keselamatan: iman, amal saleh, saling menasihati kebenaran, dan saling menasihati kesabaran.' },
    ],
    secondKhutbah: [], dua: DUA, references: ['QS. Al-Asr: 1-3'],
  },
  {
    id: 5, title: 'Keutamaan Hari Raya Idul Fitri', slug: 'keutamaan-idul-fitri',
    summary: 'Hari raya Idul Fitri adalah hari kemenangan bagi yang berjuang menahan hawa nafsu selama Ramadhan.',
    category: 'gratitude', type: 'khutbah-singkat', duration: 11, occasion: 'Idul Fitri',
    tags: ['idul-fitri', 'ramadan', 'syukur'], createdAt: '2026-03-30',
    firstKhutbah: [
      { type: 'opening', text: 'اَللهُ أَكْبَرُ اَللهُ أَكْبَرُ اَللهُ أَكْبَرُ لاَ إِلَهَ إِلاَّ اللهُ وَاللهُ أَكْبَرُ اَللهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ' },
      { type: 'hadith', arabic: 'لِلصَّائِمِ فَرْحَتَانِ فَرْحَةٌ عِنْدَ فِطْرِهِ وَفَرْحَةٌ عِنْدَ لِقَاءِ رَبِّهِ', translation: '"Bagi yang berpuasa ada dua kegembiraan: saat berbuka dan saat berjumpa Tuhannya."', ref: 'HR. Bukhari & Muslim' },
    ],
    secondKhutbah: [
      { type: 'paragraph', text: 'Marilah menjaga amal setelah Ramadhan. Jangan sampai Ramadhan berlalu tanpa meninggalkan bekas kebaikan.' },
    ],
    dua: DUA, references: ['HR. Bukhari & Muslim'],
  },
  {
    id: 6, title: 'Adab Bertetangga dalam Islam', slug: 'adab-bertetangga',
    summary: 'Islam sangat menekankan pentingnya menjaga hubungan baik dengan tetangga berdasarkan hadits Nabi.',
    category: 'social', type: 'khutbah-jumat', duration: 9, occasion: 'Jumat',
    tags: ['tetangga', 'sosial', 'adab'], createdAt: '2026-04-11',
    firstKhutbah: [
      { type: 'opening', text: MUK },
      { type: 'hadith', arabic: 'مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنْتُ أَنَّهُ سَيُوَرِّثُهُ', translation: '"Jibril senantiasa berpesan tentang tetangga hingga aku menyangka tetangga akan mendapat warisan."', ref: 'HR. Bukhari & Muslim' },
    ],
    secondKhutbah: [
      { type: 'paragraph', text: 'Hak tetangga: tidak menyakiti, menjaga keamanan, berbagi makanan, dan menjenguk saat sakit.' },
    ],
    dua: DUA, references: ['HR. Bukhari & Muslim'],
  },
  {
    id: 7, title: 'Keutamaan Bulan Muharram', slug: 'keutamaan-bulan-muharram',
    summary: 'Bulan Muharram adalah salah satu bulan haram yang memiliki keutamaan besar, termasuk puasa Asyura.',
    category: 'muharram', type: 'khutbah-jumat', duration: 10, occasion: '1 Muharram',
    tags: ['muharram', 'asyura', 'puasa'], createdAt: '2026-04-05',
    firstKhutbah: [
      { type: 'opening', text: MUK },
      { type: 'hadith', arabic: 'أَفْضَلُ الصِّيَامِ بَعْدَ رَمَضَانَ شَهْرُ اللَّهِ الْمُحَرَّمُ', translation: '"Puasa terbaik setelah Ramadhan adalah puasa bulan Allah, Muharram."', ref: 'HR. Muslim' },
    ],
    secondKhutbah: [
      { type: 'paragraph', text: 'Bulan Muharram adalah waktu untuk muhasabah, introspeksi diri, dan memperbanyak amal ibadah khususnya puasa sunnah.' },
    ],
    dua: DUA, references: ['HR. Muslim'],
  },
  {
    id: 8, title: 'Meneladani Akhlak Rasulullah SAW', slug: 'meneladani-akhlak-rasulullah',
    summary: 'Nabi Muhammad SAW adalah teladan terbaik dalam akhlak. Khutbah maulid tentang sifat-sifat mulia beliau.',
    category: 'maulid', type: 'tausiyah', duration: 12, occasion: 'Maulid Nabi',
    tags: ['maulid', 'akhlak', 'rasulullah'], createdAt: '2026-03-20',
    firstKhutbah: [
      { type: 'opening', text: MUK },
      { type: 'quran', arabic: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ', translation: '"Dan sesungguhnya engkau benar-benar berbudi pekerti yang agung."', ref: 'QS. Al-Qalam: 4' },
      { type: 'paragraph', text: 'Rasulullah adalah manusia paling sempurna akhlaknya. Beliau lemah lembut, pemaaf, jujur, dan penuh kasih sayang.' },
    ],
    secondKhutbah: [],
    dua: DUA, references: ['QS. Al-Qalam: 4'],
  },
  {
    id: 9, title: 'Persiapan Menyambut Ramadhan', slug: 'persiapan-menyambut-ramadan',
    summary: 'Tips persiapan menyambut bulan suci Ramadhan agar puasa kita lebih bermakna dan penuh berkah.',
    category: 'ramadan', type: 'kultum', duration: 7, occasion: 'Ramadan',
    tags: ['ramadan', 'puasa', 'persiapan'], createdAt: '2026-03-15',
    firstKhutbah: [
      { type: 'opening', text: MUK },
      { type: 'paragraph', text: "Rasulullah mempersiapkan diri menyambut Ramadhan dengan memperbanyak puasa di bulan Sya'ban dan berdoa agar disampaikan ke Ramadhan." },
      { type: 'quran', arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِنْ قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ', translation: '"Hai orang beriman, diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang sebelum kamu agar kamu bertakwa."', ref: 'QS. Al-Baqarah: 183' },
    ],
    secondKhutbah: [],
    dua: DUA, references: ['QS. Al-Baqarah: 183'],
  },
  {
    id: 10, title: 'Makna Qurban dan Pengorbanan', slug: 'makna-qurban-pengorbanan',
    summary: 'Qurban bukan sekadar menyembelih hewan, tetapi simbol ketundukan dan pengorbanan seorang hamba kepada Allah.',
    category: 'qurban', type: 'khutbah-singkat', duration: 10, occasion: 'Idul Adha',
    tags: ['qurban', 'idul-adha', 'pengorbanan'], createdAt: '2026-03-10',
    firstKhutbah: [
      { type: 'opening', text: 'اَللهُ أَكْبَرُ اَللهُ أَكْبَرُ اَللهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ' },
      { type: 'quran', arabic: 'لَنْ يَنَالَ اللَّهَ لُحُومُهَا وَلَا دِمَاؤُهَا وَلَٰكِنْ يَنَالُهُ التَّقْوَىٰ مِنْكُمْ', translation: '"Daging dan darahnya tidak sampai kepada Allah, tetapi ketakwaan kamulah yang sampai kepada-Nya."', ref: 'QS. Al-Hajj: 37' },
    ],
    secondKhutbah: [
      { type: 'paragraph', text: 'Qurban mengajarkan kita tentang pengorbanan, keikhlasan, dan berbagi dengan sesama yang membutuhkan.' },
    ],
    dua: DUA, references: ['QS. Al-Hajj: 37'],
  },
  {
    id: 11, title: 'Pemuda Islam: Harapan Umat', slug: 'pemuda-islam-harapan-umat',
    summary: 'Pemuda adalah tiang peradaban. Islam memberikan perhatian besar pada pembinaan generasi muda yang berakhlak mulia.',
    category: 'youth', type: 'tausiyah', duration: 10, occasion: 'Umum',
    tags: ['pemuda', 'generasi', 'pendidikan'], createdAt: '2026-03-05',
    firstKhutbah: [
      { type: 'opening', text: MUK },
      { type: 'hadith', arabic: 'سَبْعَةٌ يُظِلُّهُمُ اللَّهُ فِي ظِلِّهِ يَوْمَ لاَ ظِلَّ إِلاَّ ظِلُّهُ ... وَشَابٌّ نَشَأَ فِي عِبَادَةِ رَبِّهِ', translation: '"Tujuh golongan yang dinaungi Allah... di antaranya pemuda yang tumbuh dalam ibadah kepada Tuhannya."', ref: 'HR. Bukhari & Muslim' },
      { type: 'paragraph', text: 'Pemuda adalah aset berharga umat. Mereka yang tumbuh dalam ketaatan kepada Allah akan menjadi pilar kebangkitan peradaban Islam.' },
    ],
    secondKhutbah: [],
    dua: DUA, references: ['HR. Bukhari & Muslim'],
  },
  {
    id: 12, title: 'Mengingat Kematian dan Hari Akhir', slug: 'mengingat-kematian-hari-akhir',
    summary: 'Mengingat kematian adalah penawar hati yang lalai. Khutbah tentang persiapan menghadapi hari yang pasti datang.',
    category: 'death', type: 'khutbah-jumat', duration: 13, occasion: 'Jumat',
    tags: ['kematian', 'akhirat', 'taubat'], createdAt: '2026-02-28',
    firstKhutbah: [
      { type: 'opening', text: MUK },
      { type: 'quran', arabic: 'كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ', translation: '"Setiap yang bernyawa pasti akan merasakan kematian."', ref: 'QS. Ali Imran: 185' },
      { type: 'paragraph', text: 'Kematian adalah kepastian yang tidak bisa ditawar. Orang bijak adalah yang mempersiapkan bekal untuk perjalanan panjang menuju akhirat.' },
    ],
    secondKhutbah: [
      { type: 'paragraph', text: 'Rasulullah bersabda: "Perbanyaklah mengingat pemutus segala kenikmatan (kematian)." Mengingat kematian bukan untuk takut, tetapi untuk memotivasi kita beramal lebih baik.' },
    ],
    dua: DUA, references: ['QS. Ali Imran: 185', 'HR. Tirmidzi'],
  },
];
