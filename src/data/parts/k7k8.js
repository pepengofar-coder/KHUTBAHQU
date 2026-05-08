import { khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';

export const k7 = {
  id: 7, title: 'Keutamaan Bulan Muharram dan Puasa Asyura', slug: 'keutamaan-bulan-muharram',
  summary: 'Bulan Muharram adalah salah satu bulan yang dimuliakan Allah subhanahu wa ta\'ala. Di dalamnya terdapat keutamaan puasa sunnah, khususnya puasa Asyura pada tanggal 10 Muharram.',
  category: 'muharram', type: 'khutbah-jumat', duration: 9, occasion: '1 Muharram',
  tags: ['muharram', 'asyura', 'puasa'], createdAt: '2026-04-05',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[2] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita meningkatkan ketakwaan kita kepada Allah subhanahu wa ta'ala." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa, dan janganlah kamu mati kecuali dalam keadaan Muslim."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Jamaah Jumat yang berbahagia. Kita kini berada di bulan Muharram, salah satu bulan yang Allah subhanahu wa ta'ala muliakan. Allah subhanahu wa ta'ala berfirman:" },
    { type: 'quran', arabic: 'إِنَّ عِدَّةَ الشُّهُورِ عِنْدَ اللَّهِ اثْنَا عَشَرَ شَهْرًا فِي كِتَابِ اللَّهِ يَوْمَ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ مِنْهَا أَرْبَعَةٌ حُرُمٌ', translation: '"Sesungguhnya jumlah bulan menurut Allah adalah dua belas bulan sebagaimana dalam ketetapan Allah saat Dia menciptakan langit dan bumi, di antaranya ada empat bulan haram."', ref: 'QS. At-Taubah: 36' },
    { type: 'paragraph', text: "Bulan Muharram termasuk salah satu dari empat bulan haram tersebut. Rasulullah shallallahu 'alaihi wasallam menyebutkan keutamaan puasa di bulan ini:" },
    { type: 'hadith', arabic: 'أَفْضَلُ الصِّيَامِ بَعْدَ رَمَضَانَ شَهْرُ اللَّهِ الْمُحَرَّمُ', translation: '"Puasa yang paling utama setelah puasa Ramadhan adalah puasa di bulan Allah, yaitu bulan Muharram."', ref: 'Hadis riwayat Muslim' },
    { type: 'paragraph', text: "Di antara hari yang istimewa di bulan Muharram adalah hari Asyura, yaitu tanggal 10 Muharram. Rasulullah shallallahu 'alaihi wasallam berpuasa pada hari tersebut dan menganjurkan umatnya untuk berpuasa." },
    { type: 'hadith', arabic: 'صِيَامُ يَوْمِ عَاشُورَاءَ أَحْتَسِبُ عَلَى اللَّهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ', translation: '"Puasa hari Asyura, aku berharap kepada Allah agar menghapuskan dosa-dosa setahun sebelumnya."', ref: 'Hadis riwayat Muslim' },
    { type: 'paragraph', text: "Sungguh besar keutamaan yang Allah berikan. Hanya dengan berpuasa satu hari saja, dosa-dosa kecil selama setahun bisa diampuni oleh Allah subhanahu wa ta'ala. Maka janganlah kita lewatkan kesempatan ini." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jamaah shalat Jumat yang dirahmati Allah. Selain sebagai bulan yang dimuliakan, Muharram juga menjadi momentum bagi kita untuk bermuhasabah, mengevaluasi diri, dan memperbarui niat kebaikan kita. Tahun baru Hijriah hendaklah menjadi titik balik untuk memperbaiki hubungan kita dengan Allah subhanahu wa ta'ala dan sesama manusia." },
    { type: 'paragraph', text: "Semoga Allah subhanahu wa ta'ala menerima amal ibadah kita dan memberikan kita kesempatan untuk memperbanyak kebaikan di tahun yang baru ini." },
  ],
  dua: DUA_PENUTUP,
  references: ['QS. At-Taubah: 36', 'QS. Ali Imran: 102', 'Hadis riwayat Muslim'],
};

export const k8 = {
  id: 8, title: 'Meneladani Akhlak Mulia Rasulullah shallallahu \'alaihi wasallam', slug: 'meneladani-akhlak-rasulullah',
  summary: 'Nabi Muhammad shallallahu \'alaihi wasallam adalah teladan terbaik dalam segala aspek kehidupan. Khutbah ini membahas beberapa sifat mulia beliau yang patut kita teladani.',
  category: 'maulid', type: 'khutbah-jumat', duration: 10, occasion: 'Maulid Nabi',
  tags: ['maulid', 'akhlak', 'rasulullah'], createdAt: '2026-03-20',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita meningkatkan ketakwaan kepada Allah subhanahu wa ta'ala." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa, dan janganlah kamu mati kecuali dalam keadaan Muslim."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Jamaah Jumat yang berbahagia. Allah subhanahu wa ta'ala telah mengutus kepada kita seorang rasul yang mulia, yang menjadi teladan sempurna dalam segala aspek kehidupan. Allah subhanahu wa ta'ala berfirman tentang beliau:" },
    { type: 'quran', arabic: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ', translation: '"Dan sesungguhnya engkau (Muhammad) benar-benar berbudi pekerti yang agung."', ref: 'QS. Al-Qalam: 4' },
    { type: 'paragraph', text: "Di antara akhlak mulia beliau shallallahu 'alaihi wasallam adalah kejujuran. Bahkan sebelum diangkat menjadi rasul, beliau sudah dikenal oleh masyarakat Mekkah dengan gelar Al-Amin, yaitu orang yang dapat dipercaya. Musuh-musuh beliau pun mengakui kejujurannya." },
    { type: 'paragraph', text: "Beliau juga dikenal sangat penyayang dan lemah lembut. Allah subhanahu wa ta'ala berfirman:" },
    { type: 'quran', arabic: 'فَبِمَا رَحْمَةٍ مِنَ اللَّهِ لِنْتَ لَهُمْ وَلَوْ كُنْتَ فَظًّا غَلِيظَ الْقَلْبِ لَانْفَضُّوا مِنْ حَوْلِكَ', translation: '"Maka berkat rahmat Allah-lah, engkau bersikap lemah lembut terhadap mereka. Sekiranya engkau bersikap keras dan berhati kasar, tentulah mereka menjauhkan diri dari sekitarmu."', ref: 'QS. Ali Imran: 159' },
    { type: 'paragraph', text: "Beliau juga sangat dermawan dan pemaaf. Beliau memaafkan penduduk Mekkah yang telah menyiksa dan mengusir beliau selama bertahun-tahun, ketika beliau berhasil membebaskan kota Mekkah. Beliau berkata kepada mereka: 'Pergilah kalian, kalian bebas.' Sungguh kemuliaan akhlak yang luar biasa." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jamaah shalat Jumat yang dirahmati Allah. Mencintai Rasulullah shallallahu 'alaihi wasallam bukan hanya dengan kata-kata, tetapi dengan meneladani akhlak beliau dalam kehidupan sehari-hari. Jadilah orang yang jujur, amanah, penyayang, dermawan, dan pemaaf sebagaimana beliau." },
    { type: 'paragraph', text: "Allah subhanahu wa ta'ala berfirman:" },
    { type: 'quran', arabic: 'لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ', translation: '"Sungguh pada diri Rasulullah terdapat teladan yang baik bagi kamu."', ref: 'QS. Al-Ahzab: 21' },
    { type: 'paragraph', text: "Semoga Allah subhanahu wa ta'ala memberikan kita kemampuan untuk meneladani akhlak mulia Rasulullah shallallahu 'alaihi wasallam dan mengumpulkan kita bersamanya di surga kelak." },
  ],
  dua: DUA_PENUTUP,
  references: ['QS. Al-Qalam: 4', 'QS. Ali Imran: 159', 'QS. Al-Ahzab: 21', 'QS. Ali Imran: 102'],
};
