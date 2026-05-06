import { MUK_LENGKAP, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';

export const k9 = {
  id: 9, title: 'Persiapan Menyambut Bulan Suci Ramadhan', slug: 'persiapan-menyambut-ramadan',
  summary: 'Ramadhan adalah bulan penuh rahmat dan ampunan. Khutbah ini membahas langkah-langkah persiapan agar kita dapat meraih keberkahan Ramadhan secara maksimal.',
  category: 'ramadan', type: 'khutbah-jumat', duration: 9, occasion: 'Ramadan',
  tags: ['ramadan', 'puasa', 'persiapan'], createdAt: '2026-03-15',
  firstKhutbah: [
    { type: 'opening', text: MUK_LENGKAP },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita meningkatkan ketakwaan kepada Allah subhanahu wa ta'ala." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa, dan janganlah kamu mati kecuali dalam keadaan Muslim."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Jamaah Jumat yang berbahagia. Tidak lama lagi kita akan kedatangan tamu agung, yaitu bulan suci Ramadhan. Bulan yang di dalamnya Allah subhanahu wa ta'ala menurunkan Al-Qur'an, bulan yang di dalamnya terdapat malam Lailatul Qadr yang lebih baik dari seribu bulan." },
    { type: 'quran', arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِنْ قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ', translation: '"Wahai orang-orang yang beriman, diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang-orang sebelum kamu, agar kamu bertakwa."', ref: 'QS. Al-Baqarah: 183' },
    { type: 'paragraph', text: "Rasulullah shallallahu 'alaihi wasallam sangat antusias menyambut Ramadhan. Beliau memperbanyak puasa sunnah di bulan Sya'ban sebagai persiapan. Beliau juga berdoa: 'Ya Allah, berkahilah kami di bulan Rajab dan Sya'ban, dan sampaikanlah kami ke bulan Ramadhan.'" },
    { type: 'paragraph', text: "Lalu bagaimana seharusnya kita mempersiapkan diri menyambut Ramadhan? Pertama, bertaubat dari segala dosa. Bersihkan hati dari dendam, iri hati, dan sifat-sifat tercela. Kedua, perbanyak puasa sunnah di bulan Sya'ban untuk melatih fisik dan mental kita." },
    { type: 'paragraph', text: "Ketiga, pelajari hukum-hukum puasa agar ibadah kita sesuai dengan tuntunan Rasulullah shallallahu 'alaihi wasallam. Keempat, siapkan program ibadah selama Ramadhan: target khatam Al-Qur'an, shalat tarawih berjamaah, dan perbanyak sedekah." },
    { type: 'paragraph', text: "Kelima, selesaikan utang puasa Ramadhan yang lalu bagi yang memiliki tanggungan. Jangan sampai Ramadhan datang sementara kita masih memiliki utang puasa tahun sebelumnya." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jamaah shalat Jumat yang dirahmati Allah. Rasulullah shallallahu 'alaihi wasallam bersabda:" },
    { type: 'hadith', arabic: 'إِذَا جَاءَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الْجَنَّةِ وَغُلِّقَتْ أَبْوَابُ النَّارِ وَصُفِّدَتِ الشَّيَاطِينُ', translation: '"Apabila bulan Ramadhan tiba, maka dibukakanlah pintu-pintu surga, ditutuplah pintu-pintu neraka, dan setan-setan dibelenggu."', ref: 'Hadis riwayat Bukhari dan Muslim' },
    { type: 'paragraph', text: "Sungguh Ramadhan adalah kesempatan emas. Pintu surga dibuka lebar, pintu neraka ditutup, dan setan-setan dibelenggu. Maka sungguh merugi orang yang melewatkan Ramadhan tanpa mendapatkan ampunan dari Allah subhanahu wa ta'ala." },
    { type: 'paragraph', text: "Semoga Allah subhanahu wa ta'ala menyampaikan kita ke bulan Ramadhan dalam keadaan sehat dan iman yang kuat, serta menjadikan kita hamba-hamba-Nya yang meraih ampunan di bulan yang mulia tersebut." },
  ],
  dua: DUA_PENUTUP,
  references: ['QS. Al-Baqarah: 183', 'QS. Ali Imran: 102', 'Hadis riwayat Bukhari dan Muslim'],
};

export const k10 = {
  id: 10, title: 'Makna Qurban: Ketundukan dan Pengorbanan', slug: 'makna-qurban-ketundukan-pengorbanan',
  summary: 'Ibadah qurban bukan sekadar menyembelih hewan. Ia adalah simbol ketundukan total seorang hamba kepada Allah subhanahu wa ta\'ala, sebagaimana yang dicontohkan oleh Nabi Ibrahim \'alaihissalam.',
  category: 'qurban', type: 'khutbah-singkat', duration: 8, occasion: 'Idul Adha',
  tags: ['qurban', 'idul-adha', 'pengorbanan'], createdAt: '2026-03-10',
  firstKhutbah: [
    { type: 'opening', text: 'اَللهُ أَكْبَرُ اَللهُ أَكْبَرُ اَللهُ أَكْبَرُ، لاَ إِلَهَ إِلاَّ اللهُ وَاللهُ أَكْبَرُ، اَللهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ' },
    { type: 'paragraph', text: "Ma'asyiral muslimin, jamaah shalat Ied yang dirahmati Allah subhanahu wa ta'ala. Pada hari yang agung ini, kita berkumpul untuk merayakan Idul Adha, hari raya pengorbanan. Hari ini kita mengingat kisah agung Nabi Ibrahim 'alaihissalam yang diperintahkan oleh Allah subhanahu wa ta'ala untuk menyembelih putranya, Ismail 'alaihissalam." },
    { type: 'paragraph', text: "Nabi Ibrahim 'alaihissalam dan Ismail 'alaihissalam keduanya tunduk kepada perintah Allah subhanahu wa ta'ala dengan penuh keikhlasan. Dan Allah subhanahu wa ta'ala pun menggantikan Ismail dengan seekor sembelihan yang besar. Inilah asal mula disyariatkannya ibadah qurban." },
    { type: 'quran', arabic: 'لَنْ يَنَالَ اللَّهَ لُحُومُهَا وَلَا دِمَاؤُهَا وَلَٰكِنْ يَنَالُهُ التَّقْوَىٰ مِنْكُمْ', translation: '"Daging dan darah hewan-hewan qurban itu tidak akan sampai kepada Allah, tetapi yang sampai kepada-Nya adalah ketakwaan dari kamu."', ref: 'QS. Al-Hajj: 37' },
    { type: 'paragraph', text: "Ayat ini memberikan pelajaran yang sangat dalam. Yang Allah inginkan bukan daging dan darah hewan qurban, melainkan ketakwaan, keikhlasan, dan ketundukan kita kepada-Nya. Maka ibadah qurban adalah latihan bagi kita untuk belajar berkorban di jalan Allah subhanahu wa ta'ala." },
    { type: 'paragraph', text: "Qurban juga mengajarkan kita tentang kepedulian sosial. Daging qurban dibagikan kepada fakir miskin, tetangga, dan sesama muslim. Ini menumbuhkan rasa solidaritas dan saling berbagi di tengah masyarakat." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jamaah shalat Ied yang dirahmati Allah. Marilah kita mengambil pelajaran dari kisah Nabi Ibrahim 'alaihissalam. Beliau adalah hamba yang sepenuhnya tunduk kepada Allah. Ketika diperintahkan untuk meninggalkan keluarganya di padang pasir, beliau tunduk. Ketika diperintahkan untuk menyembelih putranya, beliau tunduk. Inilah makna islam yang sesungguhnya: berserah diri sepenuhnya kepada Allah subhanahu wa ta'ala." },
    { type: 'paragraph', text: "Semoga ibadah qurban kita di tahun ini diterima oleh Allah subhanahu wa ta'ala, dan semoga kita bisa meneladani semangat pengorbanan dan ketundukan Nabi Ibrahim 'alaihissalam dalam kehidupan sehari-hari." },
  ],
  dua: DUA_PENUTUP,
  references: ['QS. Al-Hajj: 37', 'QS. Ash-Shaffat: 102-107'],
};
