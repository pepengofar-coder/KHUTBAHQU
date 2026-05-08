import { khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';

const TAKBIR = 'اَللهُ أَكْبَرُ اَللهُ أَكْبَرُ اَللهُ أَكْبَرُ، لاَ إِلَهَ إِلاَّ اللهُ وَاللهُ أَكْبَرُ، اَللهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ';

export const k5 = {
  id: 5, title: 'Meraih Kemenangan Sejati di Hari Idul Fitri', slug: 'meraih-kemenangan-idul-fitri',
  summary: 'Idul Fitri adalah hari kemenangan bagi orang-orang yang telah berjuang menahan hawa nafsu selama Ramadhan. Khutbah ini mengingatkan makna kemenangan sejati dan semangat menjaga keistiqamahan setelah Ramadhan.',
  category: 'gratitude', type: 'khutbah-singkat', duration: 8, occasion: 'Idul Fitri',
  tags: ['idul-fitri', 'ramadan', 'syukur'], createdAt: '2026-03-30',
  firstKhutbah: [
    { type: 'opening', text: TAKBIR },
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: "Ma'asyiral muslimin, jamaah shalat Ied yang dirahmati Allah subhanahu wa ta'ala. Pada pagi yang penuh kebahagiaan ini, kita berkumpul untuk merayakan hari kemenangan, Idul Fitri. Takbir, tahlil, dan tahmid kita kumandangkan sebagai ungkapan rasa syukur kepada Allah subhanahu wa ta'ala yang telah memberikan kekuatan kepada kita untuk menyelesaikan ibadah puasa selama sebulan penuh." },
    { type: 'paragraph', text: "Hari ini adalah hari kebahagiaan. Rasulullah shallallahu 'alaihi wasallam bersabda:" },
    { type: 'hadith', arabic: 'لِلصَّائِمِ فَرْحَتَانِ: فَرْحَةٌ عِنْدَ فِطْرِهِ، وَفَرْحَةٌ عِنْدَ لِقَاءِ رَبِّهِ', translation: '"Bagi orang yang berpuasa ada dua kegembiraan: kegembiraan ketika berbuka puasa dan kegembiraan ketika berjumpa dengan Tuhannya."', ref: 'Hadis riwayat Bukhari dan Muslim' },
    { type: 'paragraph', text: "Kegembiraan pertama kita rasakan hari ini, yaitu saat kita telah menyelesaikan ibadah puasa Ramadhan. Adapun kegembiraan kedua adalah kegembiraan yang jauh lebih besar, yaitu saat kita berjumpa dengan Allah subhanahu wa ta'ala di akhirat kelak dan menerima pahala puasa kita." },
    { type: 'paragraph', text: "Namun jamaah sekalian, Idul Fitri bukan berarti akhir dari ibadah kita. Idul Fitri adalah awal dari semangat baru. Tuhan yang kita ibadahi di bulan Ramadhan adalah Tuhan yang sama yang harus kita ibadahi di bulan-bulan berikutnya. Maka janganlah kita menjadi hamba yang hanya mengenal Allah di bulan Ramadhan saja." },
    { type: 'paragraph', text: "Marilah kita jaga amalan-amalan baik yang telah kita bangun selama Ramadhan: shalat berjamaah, membaca Al-Qur'an, sedekah, dan menahan diri dari hal-hal yang diharamkan. Jadikanlah Ramadhan sebagai madrasah yang membentuk karakter kita menjadi lebih baik secara permanen." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jamaah shalat Ied yang berbahagia. Pada hari yang mulia ini, marilah kita saling memaafkan dengan tulus dan ikhlas. Bersihkanlah hati dari dendam, iri, dan dengki. Sambunglah kembali silaturahmi yang mungkin sempat terputus. Karena sesungguhnya Idul Fitri adalah hari kembali kepada fitrah, kembali kepada kesucian." },
    { type: 'paragraph', text: "Semoga Allah subhanahu wa ta'ala menerima seluruh amal ibadah kita di bulan Ramadhan, mengampuni dosa-dosa kita, dan menjadikan kita hamba-hamba-Nya yang istiqamah di atas kebaikan." },
  ],
  dua: DUA_PENUTUP,
  references: ['Hadis riwayat Bukhari dan Muslim'],
};

export const k6 = {
  id: 6, title: 'Menunaikan Hak Tetangga dalam Islam', slug: 'menunaikan-hak-tetangga',
  summary: 'Islam sangat menekankan pentingnya menjaga hubungan baik dengan tetangga. Malaikat Jibril \'alaihissalam terus-menerus berwasiat tentang tetangga hingga Rasulullah shallallahu \'alaihi wasallam menyangka tetangga akan mendapat warisan.',
  category: 'social', type: 'khutbah-jumat', duration: 9, occasion: 'Jumat',
  tags: ['tetangga', 'sosial', 'adab'], createdAt: '2026-04-11',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita meningkatkan ketakwaan kepada Allah subhanahu wa ta'ala." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa, dan janganlah kamu mati kecuali dalam keadaan Muslim."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Jamaah Jumat yang berbahagia. Islam adalah agama yang sempurna. Islam tidak hanya mengatur hubungan kita dengan Allah subhanahu wa ta'ala, tetapi juga mengatur hubungan kita dengan sesama manusia, termasuk dengan tetangga kita." },
    { type: 'paragraph', text: "Rasulullah shallallahu 'alaihi wasallam bersabda tentang betapa agungnya kedudukan tetangga dalam Islam:" },
    { type: 'hadith', arabic: 'مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنْتُ أَنَّهُ سَيُوَرِّثُهُ', translation: '"Malaikat Jibril \'alaihissalam senantiasa berwasiat kepadaku tentang tetangga, hingga aku menyangka bahwa tetangga itu akan mendapatkan hak warisan."', ref: 'Hadis riwayat Bukhari dan Muslim' },
    { type: 'paragraph', text: "Subhanallah. Betapa tingginya kedudukan tetangga dalam Islam. Sampai-sampai Rasulullah shallallahu 'alaihi wasallam menyangka bahwa tetangga akan dijadikan ahli waris karena begitu seringnya Jibril 'alaihissalam berwasiat tentang hak-hak tetangga." },
    { type: 'paragraph', text: "Di antara hak-hak tetangga dalam Islam adalah: tidak menyakitinya baik dengan perkataan maupun perbuatan, menjaga keamanan dan kehormatan tetangga, berbagi makanan dengannya, menjenguknya ketika sakit, mengucapkan selamat atas kebahagiaannya, dan ikut berbelasungkawa atas musibahnya." },
    { type: 'quran', arabic: 'وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ وَالْيَتَامَىٰ وَالْمَسَاكِينِ وَالْجَارِ ذِي الْقُرْبَىٰ وَالْجَارِ الْجُنُبِ', translation: '"Dan sembahlah Allah dan janganlah kamu mempersekutukan-Nya dengan sesuatu apa pun. Dan berbuat baiklah kepada kedua orang tua, kerabat, anak-anak yatim, orang-orang miskin, tetangga dekat dan tetangga jauh."', ref: 'QS. An-Nisa: 36' },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jamaah shalat Jumat yang dirahmati Allah. Sebaliknya, Islam juga melarang keras perbuatan menyakiti tetangga. Rasulullah shallallahu 'alaihi wasallam bersabda bahwa tidak beriman seseorang yang tetangganya tidak merasa aman dari gangguannya. Ini menunjukkan bahwa menyakiti tetangga adalah tanda lemahnya iman seseorang." },
    { type: 'paragraph', text: "Marilah kita menjadi tetangga yang baik. Saling menghormati meskipun berbeda suku dan latar belakang. Saling membantu dalam kebaikan. Saling menjaga kehormatan satu sama lain. Karena orang-orang yang paling dicintai Allah adalah mereka yang paling bermanfaat bagi orang lain." },
    { type: 'paragraph', text: "Semoga Allah subhanahu wa ta'ala menjadikan kita tetangga yang baik, yang selalu menyebarkan kebaikan dan menjaga hak-hak sesama." },
  ],
  dua: DUA_PENUTUP,
  references: ['QS. An-Nisa: 36', 'QS. Ali Imran: 102', 'Hadis riwayat Bukhari dan Muslim'],
};
