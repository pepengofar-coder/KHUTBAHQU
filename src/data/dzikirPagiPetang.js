/**
 * Islamediaku — Dzikir Pagi & Petang Data
 *
 * Sumber referensi:
 * Almanhaj - Dzikir Pagi Dan Petang
 * Oleh Al-Ustadz Yazid bin ‘Abdul Qadir Jawas
 * Link: https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html
 *
 * Catatan:
 * - Teks Arab dan terjemahan diambil murni dari sumber rujukan.
 * - Teks Latin dihilangkan karena tidak ada di sumber aslinya (mencegah salah transliterasi).
 * - Dikelompokkan berdasar waktu (pagi, petang, pagi_petang).
 */

export const DZIKIR_PAGI_PETANG_DATA = [
  // 1. Ayat Kursi
  {
    id: "dzikir-1",
    section: "pagi_petang",
    title: "Ayat Kursi (Al-Baqarah: 255)",
    arabic: "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ، لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    translation: "Allah tidak ada Ilah (yang berhak diibadahi) melainkan Dia Yang Hidup Kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang ada di langit dan di bumi. Tidak ada yang dapat memberi syafa’at di sisi Allah tanpa izin-Nya. Allah mengetahui apa-apa yang (berada) dihadapan mereka, dan dibelakang mereka dan mereka tidak mengetahui apa-apa dari Ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, Allah Mahatinggi lagi Mahabesar.",
    count: 1,
    countText: "1x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "Al-Baqarah: 255. HR. Al-Hakim (1/562)",
  },

  // 2. Al-Ikhlas
  {
    id: "dzikir-2",
    section: "pagi_petang",
    title: "Membaca Surat Al-Ikhlas",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    translation: "Katakanlah, Dia-lah Allah Yang Maha Esa. Allah adalah (Rabb) yang segala sesuatu bergantung kepada-Nya. Dia tidak beranak dan tidak pula diperanakkan. Dan tidak ada seorang pun yang setara dengan-Nya.",
    count: 3,
    countText: "3x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "Al-Ikhlash: 1-4. HR. Abu Dawud no. 5082",
  },

  // 3. Al-Falaq
  {
    id: "dzikir-3",
    section: "pagi_petang",
    title: "Membaca Surat Al-Falaq",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ مِن شَرِّ مَا خَلَقَ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    translation: "Katakanlah: 'Aku berlindung kepada Rabb Yang menguasai (waktu) Shubuh dari kejahatan makhluk-Nya. Dan dari kejahatan malam apabila telah gelap gulita. Dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul. Serta dari kejahatan orang yang dengki apabila dia dengki.'",
    count: 3,
    countText: "3x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "Al-Falaq: 1-5. HR. Abu Dawud no. 5082",
  },

  // 4. An-Naas
  {
    id: "dzikir-4",
    section: "pagi_petang",
    title: "Membaca Surat An-Naas",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ إِلَهِ النَّاسِ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ مِنَ الْجِنَّةِ وَ النَّاسِ",
    translation: "Katakanlah, 'Aku berlindung kepada Rabb (yang memelihara dan menguasai) manusia. Raja manusia. Sembahan (Ilah) manusia. Dari kejahatan (bisikan) syaitan yang biasa bersembunyi. Yang membisikkan (kejahatan) ke dalam dada-dada manusia. Dari golongan jin dan manusia.'",
    count: 3,
    countText: "3x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "An-Naas: 1-6. HR. Abu Dawud no. 5082",
  },

  // 5. Doa Pagi (Ashbahna...)
  {
    id: "dzikir-pagi-5",
    section: "pagi",
    title: "Dzikir Pagi Hari",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِيْ هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوْذُ بِكَ مِنْ شَرِّ مَا فِيْ هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوْذُ بِكَ مِنَ الْكَسَلِ وَسُوْءِ الْكِبَرِ، رَبِّ أَعُوْذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
    translation: "Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji hanya milik Allah. Tidak ada ilah yang berhak diibadahi dengan benar kecuali Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya pujian. Dia-lah Yang Mahakuasa atas segala sesuatu. Wahai Rabb, aku mohon kepada-Mu kebaikan di hari ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari kejahatan hari ini dan kejahatan sesudahnya. Wahai Rabb, aku berlindung kepada-Mu dari kemalasan dan kejelekan di hari tua. Wahai Rabb, aku berlindung kepada-Mu dari siksaan di Neraka dan siksaan di kubur.",
    count: 1,
    countText: "1x",
    timing: "Pagi",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Muslim no. 2723",
  },

  // 6. Doa Petang (Amsayna...)
  {
    id: "dzikir-petang-6",
    section: "petang",
    title: "Dzikir Petang Hari",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ، وَالْحَمْدُ للهِ، لَا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُبِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُبِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُبِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    translation: "Kami telah memasuki waktu sore dan kerajaan hanya milik Allah, segala puji hanya milik Allah. Tidak ada Ilah yang berhak diibadahi dengan benar kecuali Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya pujian. Dia-lah Yang Mahakuasa atas segala sesuatu. Wahai Rabb, aku mohon kepada-Mu kebaikan di malam ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari kejahatan malam ini dan kejahatan sesudahnya. Wahai Rabb, aku berlindung kepada-Mu dari kemalasan dan kejelekan di hari tua. Wahai Rabb, aku berlindung kepada-Mu dari siksaan di Neraka dan siksaan di kubur.",
    count: 1,
    countText: "1x",
    timing: "Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Muslim no. 2723",
  },

  // 7. Doa Pagi (Allahumma Bika Ashbahna)
  {
    id: "dzikir-pagi-7",
    section: "pagi",
    title: "Dzikir Memasuki Waktu Pagi",
    arabic: "اَللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوْتُ وَإِلَيْكَ النُّشُوْرُ",
    translation: "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu sore. Dengan rahmat dan kehendak-Mu kami hidup dan dengan rahmat dan kehendak-Mu kami mati. Dan kepada-Mu kebangkitan (bagi semua makhluk).",
    count: 1,
    countText: "1x",
    timing: "Pagi",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. At-Tirmidzi no. 3391",
  },

  // 8. Doa Petang (Allahumma Bika Amsayna)
  {
    id: "dzikir-petang-8",
    section: "petang",
    title: "Dzikir Memasuki Waktu Sore",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا،وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيْرُ",
    translation: "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu sore dan dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi. Dengan rahmat dan kehendak-Mu kami hidup dan dengan rahmat dan kehendak-Mu kami mati. Dan kepada-Mu tempat kembali (bagi semua makhluk).",
    count: 1,
    countText: "1x",
    timing: "Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. At-Tirmidzi no. 3391",
  },

  // 9. Sayyidul Istighfar
  {
    id: "dzikir-9",
    section: "pagi_petang",
    title: "Sayyidul Istighfar",
    arabic: "اَللَّهُمَّ أَنْتَ رَبِّيْ لاَ إِلَـهَ إِلاَّ أَنْتَ، خَلَقْتَنِيْ وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوْبَ إِلاَّ أَنْتَ",
    translation: "Ya Allah, Engkau adalah Rabb-ku, tidak ada Ilah (yang berhak diibadahi dengan benar) kecuali Engkau, Engkau-lah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku dengan-Mu semampuku. Aku berlindung kepada-Mu dari kejelekan (apa) yang kuperbuat. Aku mengakui nikmat-Mu (yang diberikan) kepadaku dan aku mengakui dosaku, oleh karena itu, ampunilah aku. Sesungguhnya tidak ada yang dapat mengampuni dosa kecuali Engkau.",
    count: 1,
    countText: "1x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Al-Bukhari no. 6306",
  },

  // 10. Allahumma aafini
  {
    id: "dzikir-10",
    section: "pagi_petang",
    title: "Memohon Keselamatan Tubuh",
    arabic: "اَللَّهُمَّ عَافِنِيْ فِيْ بَدَنِيْ، اَللَّهُمَّ عَافِنِيْ فِيْ سَمْعِيْ، اَللَّهُمَّ عَافِنِيْ فِيْ بَصَرِيْ، لاَ إِلَـهَ إِلاَّ أَنْتَ. اَللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوْذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَـهَ إِلاَّ أَنْتَ",
    translation: "Ya Allah, selamatkanlah tubuhku (dari penyakit dan dari apa yang tidak aku inginkan). Ya Allah, selamatkanlah pendengaranku (dari penyakit dan maksiat atau dari apa yang tidak aku inginkan). Ya Allah, selamatkanlah penglihatanku, tidak ada Ilah yang berhak diibadahi dengan benar kecuali Engkau. Ya Allah, sesungguhnya aku berlindung kepada-Mu dari kekufuran dan kefakiran. Aku berlindung kepada-Mu dari siksa kubur, tidak ada Ilah yang berhak diibadahi dengan benar kecuali Engkau.",
    count: 3,
    countText: "3x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Abu Dawud no. 5090",
  },

  // 11. Allahumma inni as-alukal afwa
  {
    id: "dzikir-11",
    section: "pagi_petang",
    title: "Memohon Kebajikan dan Keselamatan",
    arabic: "اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَاْلآخِرَةِ، اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِيْنِيْ وَدُنْيَايَ وَأَهْلِيْ وَمَالِيْ اللَّهُمَّ اسْتُرْ عَوْرَاتِى وَآمِنْ رَوْعَاتِى. اَللَّهُمَّ احْفَظْنِيْ مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِيْ، وَعَنْ يَمِيْنِيْ وَعَنْ شِمَالِيْ، وَمِنْ فَوْقِيْ، وَأَعُوْذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِيْ",
    translation: "Ya Allah, sesungguhnya aku memohon kebajikan dan keselamatan di dunia dan akhirat. Ya Allah, sesungguhnya aku memohon kebajikan dan keselamatan dalam agama, dunia, keluarga dan hartaku. Ya Allah, tutupilah auratku (aib dan sesuatu yang tidak layak dilihat orang) dan tentramkan-lah aku dari rasa takut. Ya Allah, peliharalah aku dari depan, belakang, kanan, kiri dan dari atasku. Aku berlindung dengan kebesaran-Mu, agar aku tidak disambar dari bawahku (aku berlindung dari dibenamkan ke dalam bumi).",
    count: 1,
    countText: "1x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Abu Dawud no. 5074",
  },

  // 12. Allahumma aalimal ghaibi
  {
    id: "dzikir-12",
    section: "pagi_petang",
    title: "Berlindung dari Kejahatan Syaitan",
    arabic: "اَللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَاْلأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيْكَهُ، أَشْهَدُ أَنْ لاَ إِلَـهَ إِلاَّ أَنْتَ، أَعُوْذُ بِكَ مِنْ شَرِّ نَفْسِيْ، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِيْ سُوْءًا أَوْ أَجُرُّهُ إِلَى مُسْلِمٍ",
    translation: "Ya Allah Yang Mahamengetahui yang ghaib dan yang nyata, wahai Rabb Pencipta langit dan bumi, Rabb atas segala sesuatu dan Yang Merajainya. Aku bersaksi bahwa tidak ada Ilah yang berhak diibadahi dengan benar kecuali Engkau. Aku berlindung kepada-Mu dari kejahatan diriku, syaitan dan ajakannya menyekutukan Allah (aku berlindung kepada-Mu) dari berbuat kejelekan atas diriku atau mendorong seorang muslim kepadanya.",
    count: 1,
    countText: "1x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. At-Tirmidzi no. 3392",
  },

  // 13. Bismillahilladzi laa yadhurru
  {
    id: "dzikir-13",
    section: "pagi_petang",
    title: "Berlindung dengan Nama Allah",
    arabic: "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي اْلأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيْعُ الْعَلِيْمُ",
    translation: "Dengan Menyebut Nama Allah, yang dengan Nama-Nya tidak ada satupun yang membahayakan, baik di bumi maupun dilangit. Dia-lah Yang Mahamendengar dan Maha mengetahui.",
    count: 3,
    countText: "3x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. At-Tirmidzi no. 3388",
  },

  // 14. Radhiitu billahi rabba
  {
    id: "dzikir-14",
    section: "pagi_petang",
    title: "Ridha Kepada Keputusan Allah",
    arabic: "رَضِيْتُ بِاللهِ رَبًّا، وَبِاْلإِسْلاَمِ دِيْنًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    translation: "Aku rela (ridha) Allah sebagai Rabb-ku (untukku dan orang lain), Islam sebagai agamaku dan Muhammad صلي الله عليه وسلم sebagai Nabiku (yang diutus oleh Allah).",
    count: 3,
    countText: "3x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Abu Dawud no. 5072",
  },

  // 15. Yaa Hayyu Yaa Qayyum
  {
    id: "dzikir-15",
    section: "pagi_petang",
    title: "Memohon Pertolongan Rahmat Allah",
    arabic: "يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْثُ، أَصْلِحْ لِيْ شَأْنِيْ كُلَّهُ وَلاَ تَكِلْنِيْ إِلَى نَفْسِيْ طَرْفَةَ عَيْنٍ",
    translation: "Wahai Rabb Yang Maha hidup, Wahai Rabb Yang Maha berdiri sendiri (tidak butuh segala sesuatu) dengan rahmat-Mu aku meminta pertolongan, perbaikilah segala urusanku dan jangan diserahkan (urusanku) kepada diriku sendiri meskipun hanya sekejap mata (tanpa mendapat pertolongan dari-Mu).",
    count: 1,
    countText: "1x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. An-Nasa-i no. 575",
  },

  // 16. Pagi (Ashbahna 'ala fithratil islam)
  {
    id: "dzikir-pagi-16",
    section: "pagi",
    title: "Pagi di Atas Fitrah Islam",
    arabic: "أَصْبَحْنَا عَلَى فِطْرَةِ اْلإِسْلاَمِ وَعَلَى كَلِمَةِ اْلإِخْلاَصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ، حَنِيْفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ",
    translation: "Di waktu pagi kami berada diatas fitrah agama Islam, kalimat ikhlas, agama Nabi kami Muhammad صلي الله عليه وسلم dan agama ayah kami, Ibrahim, yang berdiri di atas jalan yang lurus, muslim dan tidak tergolong orang-orang musyrik.",
    count: 1,
    countText: "1x",
    timing: "Pagi",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Ahmad (III/406)",
  },

  // 17. Sore (Amsayna 'ala fithratil islam)
  {
    id: "dzikir-petang-17",
    section: "petang",
    title: "Sore di Atas Fitrah Islam",
    arabic: "أَمْسَيْنَا عَلَى فِطْرَةِ اْلإِسْلاَمِ وَعَلَى كَلِمَةِ اْلإِخْلاَصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ، حَنِيْفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ",
    translation: "Di waktu sore kami berada diatas fitrah agama Islam, kalimat ikhlas, agama Nabi kita Muhammad صلي الله عليه وسلم dan agama ayah kami, Ibrahim, yang berdiri di atas jalan yang lurus, muslim dan tidak tergolong orang-orang yang musyrik.",
    count: 1,
    countText: "1x",
    timing: "Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Ahmad (III/406)",
  },

  // 18. Laa ilaha illallah wahdahu (10x atau 1x)
  {
    id: "dzikir-18",
    section: "pagi_petang",
    title: "Dzikir Tauhid 10x atau 1x",
    arabic: "لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ.",
    translation: "Tidak ada Ilah yang berhak diibadahi dengan benar selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala puji. Dan Dia Mahakuasa atas segala sesuatu.",
    count: 10,
    countText: "10x / 1x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Abu Dawud no. 5077",
  },

  // 18b. Laa ilaha illallah wahdahu (100x setiap hari)
  {
    id: "dzikir-18b",
    section: "pagi_petang",
    title: "Dzikir Tauhid 100x",
    arabic: "لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ.",
    translation: "Tidak ada Ilah yang berhak diibadahi dengan benar selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala puji. Dan Dia Maha kuasa atas segala sesuatu.",
    count: 100,
    countText: "100x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Al-Bukhari no. 3293, Muslim no. 2691",
  },

  // 19. Pagi (Subhanallahi wa bihamdih 'adada khalqih)
  {
    id: "dzikir-pagi-19",
    section: "pagi",
    title: "Dzikir Pujian Bagi Allah",
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",
    translation: "Mahasuci Allah, aku memuji-Nya sebanyak bilangan makhluk-Nya, Mahasuci Allah sesuai ke-ridhaan-Nya, Mahasuci seberat timbangan ‘Arsy-Nya, dan Mahasuci sebanyak tinta (yang menulis) kalimat-Nya.",
    count: 3,
    countText: "3x",
    timing: "Pagi",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Muslim no. 2726",
  },

  // 20. Pagi (Ilman naafi'an)
  {
    id: "dzikir-pagi-20",
    section: "pagi",
    title: "Memohon Ilmu, Rizki, dan Amal Diterima",
    arabic: "اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً",
    translation: "Ya Allah, sesungguhnya aku meminta kepada-Mu ilmu yang bermanfaat, rizki yang halal, dan amalan yang diterima.",
    count: 1,
    countText: "1x",
    timing: "Pagi",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Ibnu Majah no. 925",
  },

  // 21. Subhanallahi wa bihamdih (100x)
  {
    id: "dzikir-21",
    section: "pagi_petang",
    title: "Tasbih 100x",
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    translation: "Mahasuci Allah, aku memuji-Nya.",
    count: 100,
    countText: "100x",
    timing: "Pagi & Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Muslim no. 2691 & 2692",
  },

  // 22. Istighfar (100x)
  {
    id: "dzikir-22",
    section: "pagi_petang",
    title: "Istighfar 100x",
    arabic: "أَسْتَغْفِرُ اللهَ وَأَتُوْبُ إِلَيْهِ",
    translation: "Aku memohon ampunan kepada Allah dan bertaubat kepada-Nya.",
    count: 100,
    countText: "100x",
    timing: "Setiap Hari",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Al-Bukhari & Muslim",
  },

  // 23. Sore (A'udzu bikalimatillahi...)
  {
    id: "dzikir-petang-23",
    section: "petang",
    title: "Berlindung dengan Kalimat Sempurna",
    arabic: "أَعُوْذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    translation: "Aku berlindung dengan kalimat-kalimat Allah yang sempurna, dari kejahatan sesuatu yang diciptakan-Nya.",
    count: 3,
    countText: "3x",
    timing: "Sore",
    sourceName: "Almanhaj",
    sourceUrl: "https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html",
    reference: "HR. Ahmad II/290",
  }
];
