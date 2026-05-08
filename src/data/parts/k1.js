import { khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';

export const k1 = {
  id: 1, title: 'Keutamaan Menjaga Lisan', slug: 'keutamaan-menjaga-lisan',
  summary: 'Lisan adalah anggota tubuh yang kecil namun dampaknya sangat besar. Khutbah ini membahas perintah Allah subhanahu wa ta\'ala dan Rasulullah shallallahu \'alaihi wasallam tentang adab berbicara, bahaya ghibah, namimah, dan dusta, serta keutamaan menjaga lisan.',
  category: 'akhlak', type: 'khutbah-jumat', duration: 10, occasion: 'Jumat',
  tags: ['lisan', 'adab', 'ghibah'], createdAt: '2026-05-02',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[2] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah subhanahu wa ta'ala, dengan menjalankan segala perintah-Nya dan menjauhi segala larangan-Nya. Sebagaimana firman Allah subhanahu wa ta'ala:" },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa, dan janganlah kamu mati kecuali dalam keadaan Muslim."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Jamaah Jumat yang berbahagia. Pada kesempatan yang mulia ini, khatib ingin mengajak diri khatib sendiri dan seluruh jamaah untuk merenungkan satu perkara yang sering kita remehkan, namun dampaknya sangat besar di sisi Allah subhanahu wa ta'ala, yaitu menjaga lisan." },
    { type: 'paragraph', text: "Allah subhanahu wa ta'ala berfirman dalam Al-Qur'an:" },
    { type: 'quran', arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا ○ يُصْلِحْ لَكُمْ أَعْمَالَكُمْ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ', translation: '"Wahai orang-orang yang beriman, bertakwalah kamu kepada Allah dan ucapkanlah perkataan yang benar, niscaya Allah akan memperbaiki amal-amalmu dan mengampuni dosa-dosamu."', ref: 'QS. Al-Ahzab: 70-71' },
    { type: 'paragraph', text: "Perhatikanlah, jamaah sekalian. Allah subhanahu wa ta'ala menghubungkan antara takwa dengan ucapan yang benar. Ini menunjukkan bahwa menjaga lisan adalah bagian dari ketakwaan. Orang yang benar-benar bertakwa adalah orang yang menjaga lisannya dari perkataan yang bathil, menyakitkan, dan tidak bermanfaat." },
    { type: 'paragraph', text: "Rasulullah shallallahu 'alaihi wasallam juga memberikan perhatian yang sangat besar terhadap masalah lisan ini. Dalam sebuah hadis yang diriwayatkan oleh Imam Bukhari dan Imam Muslim, beliau bersabda:" },
    { type: 'hadith', arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', translation: '"Barangsiapa yang beriman kepada Allah dan Hari Akhir, maka hendaklah ia berkata baik atau diam."', ref: 'Hadis riwayat Bukhari dan Muslim' },
    { type: 'paragraph', text: "Hadis ini memberikan kita dua pilihan yang sangat jelas: berkata baik atau diam. Tidak ada pilihan ketiga. Jika yang ingin kita ucapkan itu baik, bermanfaat, dan membawa kebaikan, maka ucapkanlah. Namun jika tidak, maka diamlah. Diam itu lebih selamat." },
    { type: 'paragraph', text: "Jamaah yang dimuliakan Allah. Betapa banyak persahabatan yang hancur hanya karena satu kalimat yang menyakitkan. Betapa banyak rumah tangga yang retak karena ucapan yang tidak dijaga. Betapa banyak fitnah di tengah masyarakat yang bermula dari ghibah dan namimah. Allah subhanahu wa ta'ala berfirman:" },
    { type: 'quran', arabic: 'مَا يَلْفِظُ مِنْ قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ', translation: '"Tidak ada satu pun perkataan yang diucapkannya melainkan ada di sisinya malaikat pengawas yang selalu siap mencatat."', ref: 'QS. Qaf: 18' },
    { type: 'paragraph', text: "Setiap kata yang keluar dari mulut kita dicatat oleh malaikat. Tidak ada yang luput, tidak ada yang terlewat. Maka hendaklah kita memikirkan terlebih dahulu sebelum berbicara: apakah ucapan ini akan menambah kebaikan ataukah justru menambah dosa?" },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jamaah shalat Jumat yang dirahmati Allah. Dalam khutbah kedua ini, khatib ingin mengingatkan kembali betapa bahayanya lisan yang tidak terjaga. Rasulullah shallallahu 'alaihi wasallam pernah bertanya kepada sahabat Mu'adz bin Jabal radhiyallahu 'anhu:" },
    { type: 'hadith', arabic: 'وَهَلْ يَكُبُّ النَّاسَ فِي النَّارِ عَلَى وُجُوهِهِمْ إِلَّا حَصَائِدُ أَلْسِنَتِهِمْ', translation: '"Dan tidaklah manusia ditelungkupkan ke dalam neraka di atas wajah-wajah mereka melainkan karena hasil panenan lisan mereka."', ref: 'Hadis riwayat Tirmidzi' },
    { type: 'paragraph', text: "Maka marilah kita bertekad mulai hari ini untuk lebih menjaga lisan kita. Hindarilah ghibah, yaitu membicarakan kejelekan saudara kita di belakangnya. Hindarilah namimah, yaitu mengadu domba. Hindarilah dusta, karena dusta itu menunjukkan kepada keburukan dan keburukan menunjukkan kepada neraka." },
    { type: 'paragraph', text: "Sebaliknya, gunakanlah lisan kita untuk hal-hal yang mulia: berdzikir kepada Allah, membaca Al-Qur'an, menasihati dengan cara yang baik, mendoakan sesama muslim, dan berkata jujur meskipun pahit." },
    { type: 'paragraph', text: "Semoga Allah subhanahu wa ta'ala menjadikan kita hamba-hamba-Nya yang senantiasa menjaga lisan, memperbanyak dzikir, dan jauh dari perkataan yang sia-sia." },
  ],
  dua: DUA_PENUTUP,
  references: ['QS. Al-Ahzab: 70-71', 'QS. Ali Imran: 102', 'QS. Qaf: 18', 'Hadis riwayat Bukhari dan Muslim', 'Hadis riwayat Tirmidzi'],
};
