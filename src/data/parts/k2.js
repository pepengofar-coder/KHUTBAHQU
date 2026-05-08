import { khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';

export const k2 = {
  id: 2, title: 'Bahaya Riba dan Cara Menghindarinya', slug: 'bahaya-riba-cara-menghindarinya',
  summary: 'Riba adalah dosa besar yang diharamkan dengan tegas dalam Al-Qur\'an dan Sunnah. Khutbah ini membahas ancaman riba, bentuk-bentuk riba di era modern, dan solusi muamalah yang sesuai syariat.',
  category: 'social', type: 'khutbah-jumat', duration: 10, occasion: 'Jumat',
  tags: ['riba', 'muamalah', 'ekonomi'], createdAt: '2026-04-25',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dimuliakan Allah subhanahu wa ta'ala. Marilah kita bersama-sama meningkatkan ketakwaan kepada Allah subhanahu wa ta'ala dengan menjalankan segala perintah-Nya dan menjauhi seluruh larangan-Nya, termasuk menjauhi segala bentuk riba." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa, dan janganlah kamu mati kecuali dalam keadaan Muslim."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Jamaah Jumat yang berbahagia. Salah satu dosa besar yang Allah subhanahu wa ta'ala peringatkan dengan sangat keras dalam Al-Qur'an adalah riba. Allah subhanahu wa ta'ala berfirman:" },
    { type: 'quran', arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَذَرُوا مَا بَقِيَ مِنَ الرِّبَا إِنْ كُنْتُمْ مُؤْمِنِينَ ○ فَإِنْ لَمْ تَفْعَلُوا فَأْذَنُوا بِحَرْبٍ مِنَ اللَّهِ وَرَسُولِهِ', translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dan tinggalkanlah sisa riba yang belum dipungut, jika kamu orang-orang yang beriman. Maka jika kamu tidak melaksanakannya, ketahuilah bahwa akan ada perang dari Allah dan Rasul-Nya."', ref: 'QS. Al-Baqarah: 278-279' },
    { type: 'paragraph', text: "Perhatikanlah betapa kerasnya ancaman ini, jamaah sekalian. Allah subhanahu wa ta'ala mengumumkan perang terhadap pelaku riba. Tidak ada dosa lain yang diancam dengan pernyataan perang dari Allah dan Rasul-Nya selain riba. Ini menunjukkan betapa besar bahaya riba di sisi Allah subhanahu wa ta'ala." },
    { type: 'paragraph', text: "Rasulullah shallallahu 'alaihi wasallam juga melaknat seluruh pihak yang terlibat dalam transaksi riba, sebagaimana hadis yang diriwayatkan oleh Imam Muslim:" },
    { type: 'hadith', arabic: 'لَعَنَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ آكِلَ الرِّبَا وَمُؤْكِلَهُ وَكَاتِبَهُ وَشَاهِدَيْهِ وَقَالَ هُمْ سَوَاءٌ', translation: '"Rasulullah shallallahu \'alaihi wasallam melaknat pemakan riba, pemberi makan riba, penulisnya, dan kedua saksinya. Beliau bersabda: mereka semua sama."', ref: 'Hadis riwayat Muslim' },
    { type: 'paragraph', text: "Di era modern ini, praktik riba telah menyebar dalam berbagai bentuk yang terkadang tidak kita sadari. Pinjaman berbunga di bank konvensional, kartu kredit dengan bunga, pinjaman online dengan bunga yang sangat tinggi, serta berbagai skema investasi yang mengandung unsur riba — semua ini perlu kita waspadai." },
    { type: 'paragraph', text: "Islam tidaklah melarang jual beli dan usaha. Justru Islam sangat menganjurkan manusia untuk bekerja dan mencari nafkah yang halal. Yang dilarang adalah mengambil keuntungan dari riba, karena riba itu menzalimi orang lain." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jamaah shalat Jumat yang dirahmati Allah. Lalu bagaimana solusinya? Islam telah memberikan alternatif yang adil dan berkah dalam bermuamalah. Di antaranya adalah jual beli yang halal, mudharabah (bagi hasil), musyarakah (kerja sama), dan ijarah (sewa-menyewa). Semua akad ini bebas dari unsur riba dan menjamin keadilan bagi kedua belah pihak." },
    { type: 'paragraph', text: "Marilah kita bertekad untuk membersihkan harta kita dari unsur riba. Pilihlah lembaga keuangan syariah jika memungkinkan. Pelajarilah hukum-hukum muamalah agar kita tidak terjerumus dalam riba tanpa kita sadari. Karena harta yang bercampur riba tidak akan pernah membawa berkah, meskipun tampak banyak secara lahiriah." },
    { type: 'paragraph', text: "Semoga Allah subhanahu wa ta'ala memberikan kita rezeki yang halal dan berkah, serta menjauhkan kita dari segala bentuk riba dan harta yang haram." },
  ],
  dua: DUA_PENUTUP,
  references: ['QS. Al-Baqarah: 278-279', 'QS. Ali Imran: 102', 'Hadis riwayat Muslim'],
};
