import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';


export const ibadah_11 = {
  id: 415,
  title: 'Menghidupkan Sunnah Harian',
  slug: 'menghidupkan-sunnah-harian',
  summary: 'Amalan-amalan kecil yang dicontohkan Rasulullah yang bernilai pahala besar.',
  category: 'ibadah', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['ibadah', 'sunnah', 'harian'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Menghidupkan sunnah adalah bukti cinta kita kepada Baginda Rasulullah shallallahu alaihi wasallam." },
    { type: 'paragraph', text: "Sunnah-sunnah kecil seperti bersiwak, mendahulukan kanan, dan doa sebelum aktivitas sering dilupakan." },
    { type: 'paragraph', text: "Meskipun kecil, amalan ini jika dikerjakan akan mendatangkan keberkahan." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jadikan sunnah sebagai gaya hidup kita sehari-hari." },
    { type: 'paragraph', text: "Semoga kita mendapatkan syafaat beliau di hari kiamat." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};

