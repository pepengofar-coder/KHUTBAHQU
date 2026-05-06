import { MUK_LENGKAP, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';

export const k11 = {
  id: 11, title: 'Pemuda Islam: Harapan Umat dan Pilar Peradaban', slug: 'pemuda-islam-harapan-umat',
  summary: 'Pemuda adalah tiang peradaban. Islam memberikan perhatian besar pada pembinaan generasi muda agar menjadi pribadi yang berakhlak mulia, berilmu, dan bertakwa kepada Allah subhanahu wa ta\'ala.',
  category: 'youth', type: 'khutbah-jumat', duration: 9, occasion: 'Jumat',
  tags: ['pemuda', 'generasi', 'pendidikan'], createdAt: '2026-03-05',
  firstKhutbah: [
    { type: 'opening', text: MUK_LENGKAP },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita meningkatkan ketakwaan kita kepada Allah subhanahu wa ta'ala." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa, dan janganlah kamu mati kecuali dalam keadaan Muslim."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Jamaah Jumat yang berbahagia. Pemuda adalah pilar utama sebuah peradaban. Maju mundurnya suatu umat sangat ditentukan oleh kualitas generasi mudanya. Rasulullah shallallahu 'alaihi wasallam memberikan perhatian yang sangat besar terhadap pembinaan pemuda." },
    { type: 'paragraph', text: "Di antara kabar gembira yang Rasulullah shallallahu 'alaihi wasallam sampaikan untuk para pemuda adalah:" },
    { type: 'hadith', arabic: 'سَبْعَةٌ يُظِلُّهُمُ اللَّهُ فِي ظِلِّهِ يَوْمَ لاَ ظِلَّ إِلاَّ ظِلُّهُ ... وَشَابٌّ نَشَأَ فِي عِبَادَةِ رَبِّهِ', translation: '"Tujuh golongan yang akan dinaungi oleh Allah di bawah naungan-Nya pada hari yang tidak ada naungan kecuali naungan-Nya... di antaranya adalah pemuda yang tumbuh dalam ketaatan kepada Tuhannya."', ref: 'Hadis riwayat Bukhari dan Muslim' },
    { type: 'paragraph', text: "Pemuda yang dimaksud di sini bukan sekadar pemuda yang berusia muda, tetapi pemuda yang mengisi masa mudanya dengan ibadah, ketaatan, dan kebaikan. Pemuda yang menjaga shalatnya, menjaga pandangannya, menjaga pergaulannya, dan menjauhi kemaksiatan." },
    { type: 'paragraph', text: "Lihatlah bagaimana para sahabat Rasulullah shallallahu 'alaihi wasallam yang masih muda telah menjadi pemimpin-pemimpin besar. Usamah bin Zaid radhiyallahu 'anhu memimpin pasukan di usia belasan tahun. Mu'adz bin Jabal radhiyallahu 'anhu menjadi duta Islam ke Yaman di usia muda. Ali bin Abi Thalib radhiyallahu 'anhu memeluk Islam saat masih sangat belia." },
    { type: 'paragraph', text: "Namun di sisi lain, kita juga melihat tantangan yang dihadapi pemuda Muslim saat ini sangatlah besar. Godaan teknologi, pergaulan bebas, narkoba, dan ideologi-ideologi yang menyesatkan menjadi ancaman nyata bagi generasi muda kita." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jamaah shalat Jumat yang dirahmati Allah. Maka kewajiban kita bersama — sebagai orang tua, guru, tokoh masyarakat, dan ulama — adalah membina generasi muda dengan pendidikan Islam yang benar. Tanamkan akidah yang kuat, ajarkan akhlak yang mulia, dan berikan teladan yang baik." },
    { type: 'paragraph', text: "Kepada para pemuda, khatib berpesan: manfaatkanlah masa muda kalian sebelum datang masa tua. Jangan sia-siakan waktu untuk hal-hal yang tidak bermanfaat. Jadilah pemuda yang menjadi kebanggaan umat, bukan pemuda yang menjadi beban umat." },
    { type: 'paragraph', text: "Semoga Allah subhanahu wa ta'ala menjaga generasi muda kita dari segala fitnah dan menjadikan mereka pilar kebangkitan umat Islam." },
  ],
  dua: DUA_PENUTUP,
  references: ['QS. Ali Imran: 102', 'Hadis riwayat Bukhari dan Muslim'],
};

export const k12 = {
  id: 12, title: 'Mengingat Kematian: Penawar Hati yang Lalai', slug: 'mengingat-kematian-penawar-hati-lalai',
  summary: 'Kematian adalah kepastian yang tidak bisa ditawar. Mengingat kematian bukanlah untuk menakut-nakuti, melainkan untuk memotivasi kita agar senantiasa mempersiapkan bekal terbaik menuju kehidupan yang kekal.',
  category: 'death', type: 'khutbah-jumat', duration: 10, occasion: 'Jumat',
  tags: ['kematian', 'akhirat', 'taubat'], createdAt: '2026-02-28',
  firstKhutbah: [
    { type: 'opening', text: MUK_LENGKAP },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita meningkatkan ketakwaan kepada Allah subhanahu wa ta'ala." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa, dan janganlah kamu mati kecuali dalam keadaan Muslim."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Jamaah Jumat yang berbahagia. Pada kesempatan kali ini, khatib ingin mengajak kita semua untuk merenungkan satu kepastian yang tidak bisa kita hindari, yaitu kematian. Allah subhanahu wa ta'ala berfirman:" },
    { type: 'quran', arabic: 'كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ الْقِيَامَةِ', translation: '"Setiap yang bernyawa pasti akan merasakan kematian. Dan sesungguhnya pahala kamu akan disempurnakan pada hari kiamat."', ref: 'QS. Ali Imran: 185' },
    { type: 'paragraph', text: "Kematian tidak mengenal usia, tidak mengenal jabatan, tidak mengenal kekayaan. Raja dan rakyat biasa, orang kaya dan orang miskin, orang tua dan anak muda — semuanya akan merasakan kematian. Tidak ada yang bisa menghindar darinya." },
    { type: 'quran', arabic: 'أَيْنَمَا تَكُونُوا يُدْرِكْكُمُ الْمَوْتُ وَلَوْ كُنْتُمْ فِي بُرُوجٍ مُشَيَّدَةٍ', translation: '"Di mana pun kamu berada, kematian akan mendapatkan kamu, meskipun kamu berada di dalam benteng yang tinggi dan kokoh."', ref: 'QS. An-Nisa: 78' },
    { type: 'paragraph', text: "Rasulullah shallallahu 'alaihi wasallam menganjurkan kita untuk sering mengingat kematian:" },
    { type: 'hadith', arabic: 'أَكْثِرُوا ذِكْرَ هَاذِمِ اللَّذَّاتِ يَعْنِي الْمَوْتَ', translation: '"Perbanyaklah mengingat pemutus segala kenikmatan, yaitu kematian."', ref: 'Hadis riwayat Tirmidzi, dishahihkan oleh Al-Albani' },
    { type: 'paragraph', text: "Mengingat kematian bukan untuk membuat kita takut dan pesimis, melainkan untuk menyadarkan kita dari kelalaian. Betapa banyak orang yang terlena oleh dunia, menumpuk harta, mengejar jabatan, tetapi lupa bahwa semua itu akan ditinggalkan saat malaikat maut datang menjemput." },
    { type: 'paragraph', text: "Orang bijak adalah orang yang mempersiapkan bekal untuk perjalanan panjang menuju akhirat. Bekal itu bukan harta dan jabatan, melainkan amal saleh, taubat yang tulus, dan hubungan yang baik dengan Allah subhanahu wa ta'ala dan sesama manusia." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jamaah shalat Jumat yang dirahmati Allah. Maka marilah kita mempersiapkan diri untuk menghadapi kematian dengan sebaik-baiknya. Perbanyaklah istighfar dan taubat. Tunaikan kewajiban-kewajiban yang masih tertunda. Bayarlah utang-utang, baik utang kepada Allah maupun utang kepada sesama manusia." },
    { type: 'paragraph', text: "Perbaikilah hubungan yang sempat retak. Maafkanlah orang yang pernah menyakiti kita, dan mintalah maaf kepada orang yang pernah kita sakiti. Karena kita tidak tahu kapan ajal menjemput. Jangan sampai kita meninggal dalam keadaan masih memiliki hak orang lain yang belum kita tunaikan." },
    { type: 'paragraph', text: "Semoga Allah subhanahu wa ta'ala memberikan kita husnul khatimah, menjadikan kita hamba-hamba-Nya yang siap menghadap-Nya dengan wajah yang berseri-seri, dan memasukkan kita ke dalam surga-Nya yang penuh kenikmatan." },
  ],
  dua: DUA_PENUTUP,
  references: ['QS. Ali Imran: 185', 'QS. An-Nisa: 78', 'QS. Ali Imran: 102', 'Hadis riwayat Tirmidzi'],
};
