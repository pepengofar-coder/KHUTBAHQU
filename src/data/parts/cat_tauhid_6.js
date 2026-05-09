import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';


export const tauhid_10 = {
  id: 401,
  title: 'Kemurnian Akidah di Era Digital',
  slug: 'kemurnian-akidah-era-digital',
  summary: 'Menjaga tauhid dari syirik-syirik modern dan godaan media sosial.',
  category: 'tauhid', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['tauhid', 'akidah', 'digital'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Di era kemajuan teknologi ini, kita dihadapkan pada banyak tantangan yang dapat menggerus kemurnian tauhid kita." },
    { type: 'paragraph', text: "Banyak dari kita yang tanpa sadar mempertuhankan popularitas, harta, dan tahta duniawi, yang menggeser kecintaan kita kepada Allah." },
    { type: 'paragraph', text: "Oleh karena itu, sangat penting bagi kita untuk selalu memfilter informasi dan memperkuat fondasi keimanan." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Mari kita jaga diri kita dan keluarga dari pemahaman-pemahaman yang menyimpang." },
    { type: 'paragraph', text: "Semoga Allah menjaga hati kita agar tetap istiqamah di atas jalan tauhid." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};


export const tauhid_11 = {
  id: 402,
  title: 'Asmaul Husna: Mengenal Sifat Allah',
  slug: 'asmaul-husna-mengenal-sifat-allah',
  summary: 'Meningkatkan keimanan dengan merenungi makna Asmaul Husna.',
  category: 'tauhid', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['tauhid', 'asmaul-husna', 'sifat'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Mengenal Allah melalui Asmaul Husna adalah kunci utama untuk mencintai-Nya." },
    { type: 'paragraph', text: "Barangsiapa yang menghafal dan mengamalkan kandungan dari nama-nama Allah, maka surga jaminannya." },
    { type: 'paragraph', text: "Setiap nama Allah membawa konsekuensi ubudiyah yang harus kita realisasikan dalam ibadah." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Pahamilah makna Ar-Rahman, Ar-Rahim, Al-Ghafur, dan jadikan itu penguat jiwa kita." },
    { type: 'paragraph', text: "Semoga pengenalan kita terhadap Asmaul Husna mendatangkan kedamaian sejati." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};

