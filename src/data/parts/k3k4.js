import { khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';

export const k3 = {
  id: 3, title: 'Membangun Keluarga Sakinah Mawaddah Warahmah', slug: 'membangun-keluarga-sakinah',
  summary: 'Keluarga sakinah, mawaddah, warahmah adalah dambaan setiap muslim. Khutbah ini membahas fondasi keluarga yang kokoh berdasarkan Al-Qur\'an dan Sunnah Rasulullah shallallahu \'alaihi wasallam.',
  category: 'family', type: 'khutbah-jumat', duration: 10, occasion: 'Nikah',
  tags: ['keluarga', 'nikah', 'sakinah'], createdAt: '2026-04-20',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[2] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita meningkatkan ketakwaan kita kepada Allah subhanahu wa ta'ala, yakni dengan menjalankan perintah-Nya dan menjauhi larangan-Nya." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa, dan janganlah kamu mati kecuali dalam keadaan Muslim."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Jamaah Jumat yang berbahagia. Allah subhanahu wa ta'ala menjadikan pernikahan sebagai salah satu tanda kebesaran-Nya. Pernikahan bukan hanya akad yang menghalalkan hubungan antara laki-laki dan perempuan, melainkan sebuah ikatan suci yang di dalamnya terkandung ketenangan, kasih sayang, dan rahmat." },
    { type: 'quran', arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً', translation: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untuk kamu pasangan-pasangan dari jenis kamu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antara kamu rasa kasih dan sayang."', ref: 'QS. Ar-Rum: 21' },
    { type: 'paragraph', text: "Dari ayat ini, kita memahami bahwa tujuan pernikahan dalam Islam bukan sekadar memenuhi kebutuhan biologis. Tujuannya jauh lebih mulia dari itu, yaitu menciptakan ketenangan jiwa (sakinah), membangun cinta kasih (mawaddah), dan mewujudkan kasih sayang (rahmah) dalam kehidupan berumah tangga." },
    { type: 'paragraph', text: "Lalu bagaimana cara membangun keluarga sakinah? Pertama, dasarilah rumah tangga dengan ketakwaan. Suami dan istri yang sama-sama bertakwa kepada Allah akan mudah menyelesaikan setiap masalah karena keduanya merujuk kepada petunjuk Allah dan Rasul-Nya." },
    { type: 'paragraph', text: "Kedua, saling menghormati dan menunaikan hak masing-masing. Rasulullah shallallahu 'alaihi wasallam bersabda:" },
    { type: 'hadith', arabic: 'خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ وَأَنَا خَيْرُكُمْ لِأَهْلِي', translation: '"Sebaik-baik kalian adalah yang paling baik terhadap keluarganya, dan aku adalah yang paling baik di antara kalian terhadap keluargaku."', ref: 'Hadis riwayat Tirmidzi' },
    { type: 'paragraph', text: "Ketiga, berkomunikasi dengan baik dan saling bermusyawarah. Banyak masalah rumah tangga bermula dari komunikasi yang buruk, saling menyalahkan, dan enggan mendengarkan pendapat pasangan." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jamaah shalat Jumat yang dirahmati Allah. Keempat, didiklah anak-anak dengan pendidikan Islam yang baik. Anak adalah amanah dari Allah subhanahu wa ta'ala yang harus kita jaga dan kita didik. Jangan sampai kita sibuk mengejar dunia hingga lupa mendidik anak-anak kita tentang agama mereka." },
    { type: 'paragraph', text: "Kelima, jauhkanlah rumah tangga dari hal-hal yang diharamkan. Kemaksiatan yang masuk ke dalam rumah — baik melalui tontonan, pergaulan, maupun harta yang haram — akan menghilangkan berkah dan mengundang kehancuran rumah tangga." },
    { type: 'paragraph', text: "Semoga Allah subhanahu wa ta'ala menjadikan keluarga kita keluarga yang sakinah, mawaddah, warahmah. Keluarga yang menjadi tempat ketenangan, penuh kasih sayang, dan selalu berada di atas petunjuk Allah subhanahu wa ta'ala." },
  ],
  dua: DUA_PENUTUP,
  references: ['QS. Ar-Rum: 21', 'QS. Ali Imran: 102', 'Hadis riwayat Tirmidzi'],
};

export const k4 = {
  id: 4, title: 'Empat Kunci Keselamatan dalam Surat Al-Asr', slug: 'empat-kunci-keselamatan-surat-al-asr',
  summary: "Imam Asy-Syafi'i rahimahullah berkata: seandainya Allah hanya menurunkan surat ini saja, niscaya itu sudah cukup bagi manusia. Khutbah ini mengupas empat kunci keselamatan yang terkandung dalam surat Al-Asr.",
  category: 'taqwa', type: 'khutbah-jumat', duration: 9, occasion: 'Jumat',
  tags: ['tafsir', 'waktu', 'amal-saleh'], createdAt: '2026-04-18',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah senantiasa bertakwa kepada Allah subhanahu wa ta'ala." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa, dan janganlah kamu mati kecuali dalam keadaan Muslim."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Jamaah Jumat yang berbahagia. Hari ini khatib ingin mengajak kita merenungkan salah satu surat terpendek dalam Al-Qur'an, namun memiliki kandungan yang sangat agung. Imam Asy-Syafi'i rahimahullah pernah berkata: 'Seandainya Allah hanya menurunkan surat ini saja kepada manusia, niscaya itu sudah cukup bagi mereka.' Surat tersebut adalah Surat Al-Asr." },
    { type: 'quran', arabic: 'وَالْعَصْرِ ○ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ○ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', translation: '"Demi masa. Sesungguhnya manusia benar-benar berada dalam kerugian, kecuali orang-orang yang beriman, mengerjakan kebajikan, saling menasihati dalam kebenaran, dan saling menasihati dalam kesabaran."', ref: 'QS. Al-Asr: 1-3' },
    { type: 'paragraph', text: "Allah subhanahu wa ta'ala bersumpah demi waktu, kemudian menegaskan bahwa seluruh manusia berada dalam kerugian. Seluruhnya tanpa terkecuali. Kecuali mereka yang memenuhi empat syarat yang disebutkan dalam surat ini." },
    { type: 'paragraph', text: "Syarat pertama adalah iman. Iman kepada Allah, malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, Hari Akhir, dan takdir baik maupun buruk. Iman inilah yang menjadi fondasi seluruh kebaikan." },
    { type: 'paragraph', text: "Syarat kedua adalah amal saleh. Iman tanpa amal adalah seperti pohon tanpa buah. Seorang mukmin sejati adalah yang mengamalkan imannya dalam bentuk ibadah dan ketaatan kepada Allah subhanahu wa ta'ala." },
    { type: 'paragraph', text: "Syarat ketiga adalah saling menasihati dalam kebenaran. Seorang muslim tidak hanya memperbaiki dirinya sendiri, tetapi juga peduli terhadap kebaikan orang lain. Ia mengajak kepada kebaikan dan mencegah dari kemungkaran dengan cara yang hikmah dan lemah lembut." },
    { type: 'paragraph', text: "Syarat keempat adalah saling menasihati dalam kesabaran. Karena jalan kebenaran tidaklah mudah. Akan ada ujian, cobaan, dan rintangan. Maka seorang mukmin saling menguatkan satu sama lain untuk tetap sabar di atas kebenaran." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jamaah shalat Jumat yang dirahmati Allah. Surat Al-Asr mengajarkan kita bahwa waktu adalah modal kehidupan yang paling berharga. Setiap detik yang berlalu tidak akan pernah kembali. Maka sungguh merugi orang yang menyia-nyiakan waktunya untuk hal-hal yang tidak bermanfaat." },
    { type: 'paragraph', text: "Marilah kita mengisi waktu-waktu kita dengan keimanan yang kuat, amal saleh yang istiqamah, saling menasihati dalam kebenaran, dan saling menguatkan dalam kesabaran. Inilah empat kunci keselamatan yang Allah subhanahu wa ta'ala ajarkan kepada kita." },
    { type: 'paragraph', text: "Semoga Allah subhanahu wa ta'ala menjadikan kita termasuk hamba-hamba-Nya yang tidak merugi, yaitu mereka yang beriman, beramal saleh, dan saling menasihati dalam kebenaran dan kesabaran." },
  ],
  dua: DUA_PENUTUP,
  references: ['QS. Al-Asr: 1-3', 'QS. Ali Imran: 102'],
};
