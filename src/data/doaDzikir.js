/**
 * Islamediaku — Doa & Dzikir Data
 *
 * Sumber utama: Al-Ma'tsurat Sughro (almatsurat.id) & Hishnul Muslim
 *
 * TODO: Verifikasi teks Arab, harakat, terjemahan, dan sumber oleh ustaz/editor
 * sebelum digunakan secara publik. Data ini adalah seed awal.
 */

export const DOA_CATEGORIES = [
  { id: 'pagi', label: 'Dzikir Pagi', icon: '🌅' },
  { id: 'petang', label: 'Dzikir Petang', icon: '🌇' },
  { id: 'harian', label: 'Doa Harian', icon: '🤲' },
  { id: 'tidur', label: 'Doa Tidur', icon: '🌙' },
  { id: 'masjid', label: 'Doa Masjid', icon: '🕌' },
  { id: 'rezeki', label: 'Doa Rezeki', icon: '💰' },
  { id: 'ilmu', label: 'Doa Ilmu', icon: '📚' },
  { id: 'perlindungan', label: 'Doa Perlindungan', icon: '🛡️' },
];

export const DOA_DZIKIR_DATA = [
  {
    id: "pagi-1",
    category: "pagi",
    title: "Ta'awudz",
    arabic: "أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-2",
    category: "pagi",
    title: "Surat Al-Fātiḥah",
    arabic: "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ ١ ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ ٢ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ٣ مَٰلِكِ يَوۡمِ ٱلدِّينِ ٤ إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ ٥ ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ ٦ صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ ٧",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-3",
    category: "pagi",
    title: "Surat Al-Baqarah Ayat 1-5",
    arabic: "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\nالٓمٓ ١ ذَٰلِكَ ٱلۡكِتَٰبُ لَا رَيۡبَۛ فِيهِۛ هُدٗى لِّلۡمُتَّقِينَ ٢ ٱلَّذِينَ يُؤۡمِنُونَ بِٱلۡغَيۡبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقۡنَٰهُمۡ يُنفِقُونَ ۙ ٣ وَٱلَّذِينَ يُؤۡمِنُونَ بِمَآ أُنزِلَ إِلَيۡكَ وَمَآ أُنزِلَ مِن قَبۡلِكَ وَبِٱلۡأٓخِرَةِ هُمۡ يُوقِنُونَ ٤ أُوْلَٰٓئِكَ عَلَىٰ هُدٗى مِّن رَّبِّهِمۡۖ وَأُوْلَٰٓئِكَ هُمُ ٱلۡمُفۡلِحُونَ ٥",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-4",
    category: "pagi",
    title: "Surat Al-Baqarah Ayat 255-257",
    arabic: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ ٢٥٥ لَآ إِكْرَاهَ فِى ٱلدِّينِ ۖ قَد تَّبَيَّنَ ٱلرُّشْدُ مِنَ ٱلۡغَىِّ ۚ فَمَن يَكْفُرْ بِٱلطَّـٰغُوتِ وَيُؤْمِنۢ بِٱللَّهِ فَقَدِ ٱسْتَمْسَكَ بِٱلۡعُرْوَةِ ٱلۡوُثۡقَىٰ لَا ٱنفِصَامَ لَهَا ۗ وَٱللَّهُ سَمِيعٌ عَلِيمٌ ٢٥٦ ٱللَّهُ وَلِىُّ ٱلَّذِينَ ءَامَنُوا يُخْرِجُهُم مِّنَ ٱلظُّلُمَـٰتِ إِلَى ٱلنُّورِ ۖ وَٱلَّذِينَ كَفَرُوٓا أَوْلِيَآؤُهُمُ ٱلطَّـٰغُوتُ يُخْرِجُونَهُم مِّنَ ٱلنُّورِ إِلَى ٱلظُّلُمَـٰتِ ۗ أُولَـٰٓئِكَ أَصْحَـٰبُ ٱلنَّارِ ۖ هُمْ فِيهَا خَـٰلِدُونَ ٢٥٧",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-5",
    category: "pagi",
    title: "Surat Al-Baqarah Ayat 284-286",
    arabic: "لِّلَّهِ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ وَإِن تُبْدُوا مَا فِىٓ أَنفُسِكُمْ أَوْ تُخْفُوهُ يُحَاسِبْكُم بِهِ ٱللَّهُ ۖ فَيَغْفِرُ لِمَن يَشَآءُ وَيُعَذِّبُ مَن يَشَآءُ ۗ وَٱللَّهُ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ ٢٨٤ ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَـٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِۦ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ ٱلْمَصِيرُ ٢٨٥ لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَـٰفِرِينَ ٢٨٦",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-6",
    category: "pagi",
    title: "Surat Al-Ikhlās",
    arabic: "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\nقُلۡ هُوَ ٱللَّهُ أَحَدٌ ١ ٱللَّهُ ٱلصَّمَدُ ٢ لَمْ يَلِدْ وَلَمْ يُولَدْ ٣ وَلَمۡ يَكُن لَّهُۥ كُفُوًا أَحَدُۢ ٤",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-7",
    category: "pagi",
    title: "Surat Al-Falaq",
    arabic: "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\nقُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ ١ مِن شَرِّ مَا خَلَقَ ٢ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ٣ وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلۡعُقَدِ ٤ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ٥",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-8",
    category: "pagi",
    title: "Surat An-Nās",
    arabic: "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\nقُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ ١ مَلِكِ ٱلنَّاسِ ٢ إِلَـٰهِ ٱلنَّاسِ ٣ مِن شَرِّ ٱلۡوَسۡوَاسِ ٱلۡخَنَّاسِ ٤ ٱلَّذِى يُوَسۡوِسُ فِى صُدُورِ ٱلنَّاسِ ٥ مِنَ ٱلۡجِنَّةِ وَٱلنَّاسِ ٦",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-9",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "اَصْبَحْنَا وَاَصْبَحَ الْمُلْكُ لِلّٰهِ وَالْحَمْدُ لِلّٰهِ لَا شَرِيْكَ لَهُ. لَآ اِلٰهَ اِلَّا هُوَ وَاِلَيْهِ النُّشُوْرُ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-10",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "اَصْبَحْنَا عَلَى فِطْرَةِ الإِْسْلَامِ. وَكَلِمَةِ الْإِحْلَاصِ. وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللّهُ عَلَيْهِ وَسَلَّمَ. وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ حَنِيْفًا. وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-11",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ إِنِّي اَصْبَحْتُ مِنْكَ فِى نِعْمَةٍ وَعَافِيَةٍ وَسِتْرٍ. فَأَتِمَّ عَلَيَّ نِعْمَتَكَ وَعَافِيَتَكَ وَسِتْرَكَ فِي الدُّنْيَا وَ الْأَخِرَةِ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-12",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللُّهُمَّ مَآ أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيْكَ لَكَ. فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-13",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "يَارَبِّي لَكَ الْحَمْدُ كَمَا يَنْبِغِي لِجَلاَلِ وَجْهِكَ وَ عَظِيْمِ سُلْطَانِكَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-14",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "رَضِيتُ بِاللّهِ رَبًّا. وَبِالْإِسْلَامِ دِيْنًا. وَ بِمُحَمَّدٍ نَبِيَّا وَرَسُوْلاً",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-15",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "سُبْحَانَ اللّهِ وَبِحَمْدِه. عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ. وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-16",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "بِسْمِ اللّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِى الْأَرْضِ وَلَا فِى السَّمَاءِ وَهُوَ السَّمِيْعُ الْعَلِيْمُ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-17",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ إِنَّا نَعُوْذُبِكَ مِنْ أَنْ نُشْرِكَ بِكَ شَيْئًا نَعْلَمُهُ. وَنَسْتَغْفِرُكَ لِمَا لَا نَعْلَمُهُ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-18",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "أَعُوْذُ بِكَلِمَاتِ اللّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-19",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ إِنِّى أَعُوْذُبِكَ مِنَ الْهَمِّ وَ الْحَزَن. وَأَعُوْذُبِكَ مِنَ الْعَجْزِ وَالْكَسَلِ. وَأَعُوْذُبِكَ مِنَ الْجُبْنِ وَالْبُخْلِ. وَأَعُوْذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-20",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي. اللَّهُمَّ عَافِنِي فِي سَمْعِي. اللَّهُمَّ عَافِنِي فِي بَصَرِي. لَآ إِلٰهَ إِلَّآ أَنْتَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-21",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ إِنِّى أَعُوْذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ. وَأَعُوْذُ بِكَ مِنْ عَذَابِ الْقَبْرِ. لَا إِلٰهَ إِلَّآ أَنْتَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-22",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَآ إلٰهَ إِلَّآ أنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ. وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَاسْتَطَعْتُ. أَعُوْذُبِكَ مِنْ شَرِّمَا صَنَعْتُ أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ. وَأَبُوْءُ بِذَنْبِى. فَاغْفِرْ لِى فَإِنَّهُوْ لَا يَغْفِرُ الذُّنُوْبَ إِلَّآ أَنْتَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-23",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "أَسْتَغْفِرُ اللّهَ الَّذِي لَآ إِلٰهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّوْمُ وَأَتُوْبُ إِلَيْهِ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-24",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى اٰلِ مُحَمَّدٍ. كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيْمَ وَعَلَى اٰلِ إِبْرَاهِيْمَ. وَبَارِكْ عَلَى مُحَمَّدٍ وَعَلَى اٰلِ مُحَمَّدٍ. كَمَا بَارَكْتَ عَلَى إِبْرَاهِيْمَ وَعَلٰى اٰلِ إِبْرَاهِيْمَ. فِي الْعَالَمِيْنَ إِنَّكَ حَمِيْدٌ مَجيْدٌ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-25",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "سُبْحَانَ اللّهِ. وَالْحَمْدُ لِلّٰهِ. وَلَآ إِلٰهَ إِلَّا اللّهُ. وَاللّهُ أَكْبَرُ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-26",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "لَا إِلٰهَ إِلَّا اللّهُ وَحْدَهُو لَاشَرِيْكَ لَه. لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-27",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ. أَشْهَدُ أَنْ لَآ إِلٰهَ إِلاَّ أَنْتَ أَسْتَغْفِرُكَ وَأَتُوْبُ إِلَيْكَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-28",
    category: "pagi",
    title: "Doa Al-Ma'tsurat",
    arabic: "للَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ عَبْدِكَ وَنَبِيِّكَ وَرَسُوْلِكَ النَّبِيِّ الْأُمِّيِّ وَعَلَى اٰلِهِ وَصَحْبِهِ وَ سَلِّمْ تَسْلِيْمًا. عَدَدَمَآ أَحَاطَ بِهِ عِلْمُكَ. وَخَطَّ بِهِ قَلَمُكَ. وَأَحْصَاهُ كِتَابُكَ. وَارْضَ اللَّهُمَّ عَنْ سَادَاتِنَا أَبِى بَكْرِ وَعُمَرَ وَعُثْمَانَ وَعَلِيٍّ وَعَنِ الصَّحَابَةِ أَجْمَعِيْنَ. وَعَنِ التَّابِعِيْنَ وَ تَابِعِيْهِمْ بِإِحْسَانٍ إِلَى يَوْمِ الدِّيْنِ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-29",
    category: "pagi",
    title: "Surat Ash-Shaffat Ayat 180-182",
    arabic: "سُبْحٰنَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُوْنَ ١٨٠ وَسَلٰمٌ عَلَى الْمُرْسَلِيْنَ ١٨١ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ ١٨٢",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-30",
    category: "pagi",
    title: "Surat Al-Imran Ayat 26-27",
    arabic: "قُلِ اللّٰهُمَّ مٰلِكَ الْمُلْكِ تُؤْتِى الْمُلْكَ مَنْ تَشَآءُ وَتَنْزِعُ الْمُلْكَ مِمَّنْ تَشَآءُۖ وَتُعِزُّ مَنْ تَشَآءُ وَتُذِلُّ مَنْ تَشَآءُۗ بِيَدِكَ الْخَيْرُۗ اِنَّكَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ ٢٦ تُوْلِجُ الَّيْلَ فِى النَّهَارِ وَتُوْلِجُ النَّهَارَ فِى الَّيْلِ وَتُخْرِجُ الْحَيَّ مِنَ الْمَيِّتِ وَتُخْرِجُ الْمَيِّتَ مِنَ الْحَيِّ وَتَرْزُقُ مَنْ تَشَآءُ بِغَيْرِ حِسَابٍ٢٧",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-31",
    category: "pagi",
    title: "Doa Robitoh",
    arabic: "اللَّهُمَّ إِنَّ هٰذَا إِقْبَالُ نَهَارِكَ وَإِدْبَارُ لَيْلِكَ وَأَصْوَاتُ دُعَاتِكَ فَاغْفِرْلِيْ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "pagi-32",
    category: "pagi",
    title: "Doa Robitoh",
    arabic: "اللَّهُمَّ إِنَّكَ تَعْلَمُ أَنَّ هٰذِهِ الْقُلُوْبَ قَدِ اجْتَمَعَتْ عَلَى مَحَبَّتِكَ. وَالْتَقَتْ عَلَى طَاعَتِكَ. وَتَوَحَّدَتْ عَلَى دَعْوَتِكَ. وَتَعَاهَدَتْ عَلَى نُصْرَةِ شَرِيْعَتِكَ. فَوَثِّقِ اللّٰهُمَّ رَابِطَتَهَا وَأَدِمْ وُدَّهَا وَاهْدِهَا سُبُلَهَا وَامْلَأْهَا بُنُوْرِكَ الَّذِي لَا يَخْبُو وَاشْرَحْ صُدُوْرَهَا. بِفَيْضِ الإِيْمَانِ بِكَ وَجَمِيْلِ التَّوَكُّلِ عَلَيْكَ وَأَحْيِهَا بِمَعْرِفَتِكَ وَأَمِتْهَا عَلَى الشَّهَادَةِ فِى سَبِيْلِكَ إِنَّكَ نِعْمَ الْمَوْلَى وَنِعْمَ النَّصِيْرُ. اللّٰهُمَّ اَمِيْن. وَصَلَّى اللّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى اٰلِهِ وَصَحْبِهِ وَسَلَّمَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-1",
    category: "petang",
    title: "Ta'awudz",
    arabic: "أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-2",
    category: "petang",
    title: "Surat Al-Fātiḥah",
    arabic: "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ ١ ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ ٢ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ٣ مَٰلِكِ يَوۡمِ ٱلدِّينِ ٤ إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ ٥ ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ ٦ صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ ٧",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-3",
    category: "petang",
    title: "Surat Al-Baqarah Ayat 1-5",
    arabic: "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\nالٓمٓ ١ ذَٰلِكَ ٱلۡكِتَٰبُ لَا رَيۡبَۛ فِيهِۛ هُدٗى لِّلۡمُتَّقِينَ ٢ ٱلَّذِينَ يُؤۡمِنُونَ بِٱلۡغَيۡبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقۡنَٰهُمۡ يُنفِقُونَ ۙ ٣ وَٱلَّذِينَ يُؤۡمِنُونَ بِمَآ أُنزِلَ إِلَيۡكَ وَمَآ أُنزِلَ مِن قَبۡلِكَ وَبِٱلۡأٓخِرَةِ هُمۡ يُوقِنُونَ ٤ أُوْلَٰٓئِكَ عَلَىٰ هُدٗى مِّن رَّبِّهِمۡۖ وَأُوْلَٰٓئِكَ هُمُ ٱلۡمُفۡلِحُونَ ٥",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-4",
    category: "petang",
    title: "Surat Al-Baqarah Ayat 255-257",
    arabic: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ ٢٥٥ لَآ إِكْرَاهَ فِى ٱلدِّينِ ۖ قَد تَّبَيَّنَ ٱلرُّشْدُ مِنَ ٱلۡغَىِّ ۚ فَمَن يَكْفُرْ بِٱلطَّـٰغُوتِ وَيُؤْمِنۢ بِٱللَّهِ فَقَدِ ٱسْتَمْسَكَ بِٱلۡعُرْوَةِ ٱلۡوُثۡقَىٰ لَا ٱنفِصَامَ لَهَا ۗ وَٱللَّهُ سَمِيعٌ عَلِيمٌ ٢٥٦ ٱللَّهُ وَلِىُّ ٱلَّذِينَ ءَامَنُوا يُخْرِجُهُم مِّنَ ٱلظُّلُمَـٰتِ إِلَى ٱلنُّورِ ۖ وَٱلَّذِينَ كَفَرُوٓا أَوْلِيَآؤُهُمُ ٱلطَّـٰغُوتُ يُخْرِجُونَهُم مِّنَ ٱلنُّورِ إِلَى ٱلظُّلُمَـٰتِ ۗ أُولَـٰٓئِكَ أَصْحَـٰبُ ٱلنَّارِ ۖ هُمْ فِيهَا خَـٰلِدُونَ ٢٥٧",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-5",
    category: "petang",
    title: "Surat Al-Baqarah Ayat 284-286",
    arabic: "لِّلَّهِ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ وَإِن تُبْدُوا مَا فِىٓ أَنفُسِكُمْ أَوْ تُخْفُوهُ يُحَاسِبْكُم بِهِ ٱللَّهُ ۖ فَيَغْفِرُ لِمَن يَشَآءُ وَيُعَذِّبُ مَن يَشَآءُ ۗ وَٱللَّهُ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ ٢٨٤ ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَـٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِۦ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ ٱلْمَصِيرُ ٢٨٥ لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَـٰفِرِينَ ٢٨٦",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-6",
    category: "petang",
    title: "Surat Al-Ikhlās",
    arabic: "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\nقُلۡ هُوَ ٱللَّهُ أَحَدٌ ١ ٱللَّهُ ٱلصَّمَدُ ٢ لَمْ يَلِدْ وَلَمْ يُولَدْ ٣ وَلَمۡ يَكُن لَّهُۥ كُفُوًا أَحَدُۢ ٤",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-7",
    category: "petang",
    title: "Surat Al-Falaq",
    arabic: "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\nقُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ ١ مِن شَرِّ مَا خَلَقَ ٢ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ٣ وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلۡعُقَدِ ٤ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ٥",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-8",
    category: "petang",
    title: "Surat An-Nās",
    arabic: "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\nقُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ ١ مَلِكِ ٱلنَّاسِ ٢ إِلَـٰهِ ٱلنَّاسِ ٣ مِن شَرِّ ٱلۡوَسۡوَاسِ ٱلۡخَنَّاسِ ٤ ٱلَّذِى يُوَسۡوِسُ فِى صُدُورِ ٱلنَّاسِ ٥ مِنَ ٱلۡجِنَّةِ وَٱلنَّاسِ ٦",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-9",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلّٰهِ وَالْحَمْدُ لِلّٰهِ لَا شَرِيْكَ لَهُ. لَآ إِلٰهَ اِلاَّ هُوَ وَاِلَيْهِ النُّشُوْرُ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-10",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ. وَكَلِمَةِ الإِخْلَاصِ. وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللّهُ عَلَيْهِ وَسَلَّمَ. وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ حَنِيْفًا. وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-11",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللُّهُمَّ إِنِّى أَمْسَيْتُ مِنْكَ فِى نِعْمَةٍ وَعَافِيَةٍ وَسِتْرٍ. فَأَتِمَّ عَلَيَّ نِعْمَتَكَ وَعَافِيَتَكَ وَسِتْرَكَ فِي الدُّنْيَا وَالأَخِرَةِ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-12",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ مَآ أَمْسَىْ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيْكَ لَكَ. فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-13",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "يَارَبِّي لَكَ الْحَمْدُ كَمَا يَنْبِغِي لِجَلاَلِ وَجْهِكَ وَ عَظِيْمِ سُلْطَانِكَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-14",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "رَضِيتُ بِاللّهِ رَبًّا. وَبِالْإِسْلَامِ دِيْنًا. وَ بِمُحَمَّدٍ نَبِيَّا وَرَسُوْلاً",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-15",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "سُبْحَانَ اللّهِ وَبِحَمْدِه. عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ. وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-16",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "بِسْمِ اللّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِى الْأَرْضِ وَلَا فِى السَّمَاءِ وَهُوَ السَّمِيْعُ الْعَلِيْمُ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-17",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ إِنَّا نَعُوْذُبِكَ مِنْ أَنْ نُشْرِكَ بِكَ شَيْئًا نَعْلَمُهُ. وَنَسْتَغْفِرُكَ لِمَا لَا نَعْلَمُهُ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-18",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "أَعُوْذُ بِكَلِمَاتِ اللّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-19",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ إِنِّى أَعُوْذُبِكَ مِنَ الْهَمِّ وَ الْحَزَن. وَأَعُوْذُبِكَ مِنَ الْعَجْزِ وَالْكَسَلِ. وَأَعُوْذُبِكَ مِنَ الْجُبْنِ وَالْبُخْلِ. وَأَعُوْذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-20",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي. اللَّهُمَّ عَافِنِي فِي سَمْعِي. اللَّهُمَّ عَافِنِي فِي بَصَرِي. لَآ إِلٰهَ إِلَّآ أَنْتَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-21",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ إِنِّى أَعُوْذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ. وَأَعُوْذُ بِكَ مِنْ عَذَابِ الْقَبْرِ. لَا إِلٰهَ إِلَّآ أَنْتَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-22",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَآ إلٰهَ إِلَّآ أنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ. وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَاسْتَطَعْتُ. أَعُوْذُبِكَ مِنْ شَرِّمَا صَنَعْتُ أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ. وَأَبُوْءُ بِذَنْبِى. فَاغْفِرْ لِى فَإِنَّهُوْ لَا يَغْفِرُ الذُّنُوْبَ إِلَّآ أَنْتَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-23",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "أَسْتَغْفِرُ اللّهَ الَّذِي لَآ إِلٰهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّوْمُ وَأَتُوْبُ إِلَيْهِ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-24",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى اٰلِ مُحَمَّدٍ. كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيْمَ وَعَلَى اٰلِ إِبْرَاهِيْمَ. وَبَارِكْ عَلَى مُحَمَّدٍ وَعَلَى اٰلِ مُحَمَّدٍ. كَمَا بَارَكْتَ عَلَى إِبْرَاهِيْمَ وَعَلٰى اٰلِ إِبْرَاهِيْمَ. فِي الْعَالَمِيْنَ إِنَّكَ حَمِيْدٌ مَجيْدٌ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-25",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "سُبْحَانَ اللّهِ. وَالْحَمْدُ لِلّٰهِ. وَلَآ إِلٰهَ إِلَّا اللّهُ. وَاللّهُ أَكْبَرُ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-26",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "لَا إِلٰهَ إِلَّا اللّهُ وَحْدَهُو لَاشَرِيْكَ لَه. لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-27",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ. أَشْهَدُ أَنْ لَآ إِلٰهَ إِلاَّ أَنْتَ أَسْتَغْفِرُكَ وَأَتُوْبُ إِلَيْكَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-28",
    category: "petang",
    title: "Doa Al-Ma'tsurat",
    arabic: "للَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ عَبْدِكَ وَنَبِيِّكَ وَرَسُوْلِكَ النَّبِيِّ الْأُمِّيِّ وَعَلَى اٰلِهِ وَصَحْبِهِ وَ سَلِّمْ تَسْلِيْمًا. عَدَدَمَآ أَحَاطَ بِهِ عِلْمُكَ. وَخَطَّ بِهِ قَلَمُكَ. وَأَحْصَاهُ كِتَابُكَ. وَارْضَ اللَّهُمَّ عَنْ سَادَاتِنَا أَبِى بَكْرِ وَعُمَرَ وَعُثْمَانَ وَعَلِيٍّ وَعَنِ الصَّحَابَةِ أَجْمَعِيْنَ. وَعَنِ التَّابِعِيْنَ وَ تَابِعِيْهِمْ بِإِحْسَانٍ إِلَى يَوْمِ الدِّيْنِ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-29",
    category: "petang",
    title: "Surat Ash-Shaffat Ayat 180-182",
    arabic: "سُبْحٰنَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُوْنَ ١٨٠ وَسَلٰمٌ عَلَى الْمُرْسَلِيْنَ ١٨١ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ ١٨٢",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-30",
    category: "petang",
    title: "Surat Al-Imran Ayat 26-27",
    arabic: "قُلِ اللّٰهُمَّ مٰلِكَ الْمُلْكِ تُؤْتِى الْمُلْكَ مَنْ تَشَآءُ وَتَنْزِعُ الْمُلْكَ مِمَّنْ تَشَآءُۖ وَتُعِزُّ مَنْ تَشَآءُ وَتُذِلُّ مَنْ تَشَآءُۗ بِيَدِكَ الْخَيْرُۗ اِنَّكَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ ٢٦ تُوْلِجُ الَّيْلَ فِى النَّهَارِ وَتُوْلِجُ النَّهَارَ فِى الَّيْلِ وَتُخْرِجُ الْحَيَّ مِنَ الْمَيِّتِ وَتُخْرِجُ الْمَيِّتَ مِنَ الْحَيِّ وَتَرْزُقُ مَنْ تَشَآءُ بِغَيْرِ حِسَابٍ٢٧",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-31",
    category: "petang",
    title: "Doa Robitoh",
    arabic: "اللَّهُمَّ إِنَّ هٰذَا إِقْبَالُ لَيْلِكَ وَإِدْبَارُ نَهَارِكَ وَأَصْوَاتُ دُعَاتِكَ فَاغْفِرْلِيْ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "petang-32",
    category: "petang",
    title: "Doa Robitoh",
    arabic: "اللَّهُمَّ إِنَّكَ تَعْلَمُ أَنَّ هٰذِهِ الْقُلُوْبَ قَدِ اجْتَمَعَتْ عَلَى مَحَبَّتِكَ. وَالْتَقَتْ عَلَى طَاعَتِكَ. وَتَوَحَّدَتْ عَلَى دَعْوَتِكَ. وَتَعَاهَدَتْ عَلَى نُصْرَةِ شَرِيْعَتِكَ. فَوَثِّقِ اللّٰهُمَّ رَابِطَتَهَا وَأَدِمْ وُدَّهَا وَاهْدِهَا سُبُلَهَا وَامْلَأْهَا بُنُوْرِكَ الَّذِي لَا يَخْبُو وَاشْرَحْ صُدُوْرَهَا. بِفَيْضِ الإِيْمَانِ بِكَ وَجَمِيْلِ التَّوَكُّلِ عَلَيْكَ وَأَحْيِهَا بِمَعْرِفَتِكَ وَأَمِتْهَا عَلَى الشَّهَادَةِ فِى سَبِيْلِكَ إِنَّكَ نِعْمَ الْمَوْلَى وَنِعْمَ النَّصِيْرُ. اللّٰهُمَّ اَمِيْن. وَصَلَّى اللّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى اٰلِهِ وَصَحْبِهِ وَسَلَّمَ",
    latin: "",
    translation: "",
    repetition: 1,
    source: "Al Ma'tsurat Sughro (almatsurat.id)"
  },
  {
    id: "harian-1",
    category: "harian",
    title: "Doa Sebelum Makan",
    arabic: "بِسْمِ اللَّهِ",
    latin: "Bismillah.",
    translation: "Dengan nama Allah.",
    repetition: 1,
    source: "HR. Abu Dawud no. 3767 dan Tirmidzi no. 1858 — Hishnul Muslim no. 183"
  },
  {
    id: "harian-2",
    category: "harian",
    title: "Doa Sesudah Makan",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    latin: "Alhamdulillahil ladzii ath'amanii haadzaa wa razaqaniih min ghairi haulin minnii wa laa quwwah.",
    translation: "Segala puji bagi Allah yang telah memberi makan ini kepadaku dan memberi rezeki kepadaku tanpa daya dan kekuatan dariku.",
    repetition: 1,
    source: "HR. Abu Dawud no. 4023 dan Tirmidzi no. 3458 — Hishnul Muslim no. 188"
  },
  {
    id: "harian-3",
    category: "harian",
    title: "Doa Keluar Rumah",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    latin: "Bismillahi tawakkaltu 'alallah wa laa haula wa laa quwwata illaa billah.",
    translation: "Dengan nama Allah, aku bertawakal kepada Allah. Tidak ada daya dan kekuatan kecuali dari Allah.",
    repetition: 1,
    source: "HR. Abu Dawud no. 5095 dan Tirmidzi no. 3426 — Hishnul Muslim no. 47"
  },
  {
    id: "tidur-1",
    category: "tidur",
    title: "Doa Sebelum Tidur",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    latin: "Bismika Allahumma amuutu wa ahyaa.",
    translation: "Dengan nama-Mu ya Allah, aku mati dan aku hidup.",
    repetition: 1,
    source: "HR. Bukhari no. 6324 — Hishnul Muslim no. 102"
  },
  {
    id: "tidur-2",
    category: "tidur",
    title: "Doa Bangun Tidur",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdulillahil ladzii ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur.",
    translation: "Segala puji bagi Allah yang telah menghidupkan kami sesudah mematikan kami dan kepada-Nya kami dikembalikan.",
    repetition: 1,
    source: "HR. Bukhari no. 6312 — Hishnul Muslim no. 1"
  },
  {
    id: "masjid-1",
    category: "masjid",
    title: "Doa Masuk Masjid",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    latin: "Allahumma iftah lii abwaaba rahmatik.",
    translation: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.",
    repetition: 1,
    source: "HR. Muslim no. 713 — Hishnul Muslim no. 18"
  },
  {
    id: "masjid-2",
    category: "masjid",
    title: "Doa Keluar Masjid",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    latin: "Allahumma innii as-aluka min fadlik.",
    translation: "Ya Allah, sesungguhnya aku memohon kepada-Mu dari karunia-Mu.",
    repetition: 1,
    source: "HR. Muslim no. 713 — Hishnul Muslim no. 19"
  },
  {
    id: "rezeki-1",
    category: "rezeki",
    title: "Doa Dimudahkan Rezeki",
    arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    latin: "Allahummakfinii bi halaalika 'an haraamika wa aghninii bi fadhlika 'amman siwaak.",
    translation: "Ya Allah, cukupkanlah aku dengan yang halal dari yang haram, dan kayakanlah aku dengan karunia-Mu dari selain-Mu.",
    repetition: 1,
    source: "HR. Tirmidzi no. 3563 — Hishnul Muslim no. 121"
  },
  {
    id: "ilmu-1",
    category: "ilmu",
    title: "Doa Tambah Ilmu",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    latin: "Rabbi zidnii 'ilmaa.",
    translation: "Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan.",
    repetition: 1,
    source: "QS. Thaha: 114"
  },
  {
    id: "perlindungan-1",
    category: "perlindungan",
    title: "Doa Perlindungan dari Setan",
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    latin: "A'uudzu billahi minasy syaithaanir rajiim.",
    translation: "Aku berlindung kepada Allah dari setan yang terkutuk.",
    repetition: 1,
    source: "QS. An-Nahl: 98"
  },
  {
    id: "perlindungan-2",
    category: "perlindungan",
    title: "Doa Memohon Keselamatan",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    latin: "Allahumma innii as-alukal 'aafiyata fid dunyaa wal aakhirah.",
    translation: "Ya Allah, sesungguhnya aku memohon keselamatan kepada-Mu di dunia dan di akhirat.",
    repetition: 1,
    source: "HR. Abu Dawud no. 5074 — Hishnul Muslim no. 85"
  }
];
