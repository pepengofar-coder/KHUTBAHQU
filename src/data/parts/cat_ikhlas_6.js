import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';


export const ikhlas_11 = {
  id: 409,
  title: 'Ikhlas: Ruh dari Segala Amal',
  slug: 'ikhlas-ruh-dari-amal',
  summary: 'Tanpa ikhlas, amal ibadah bagaikan jasad tanpa ruh yang tak bernilai.',
  category: 'ikhlas', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['ikhlas', 'amal', 'niat'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Syarat diterimanya sebuah amal saleh ada dua: ikhlas karena Allah dan sesuai sunnah." },
    { type: 'paragraph', text: "Ikhlas berarti memurnikan niat hanya untuk mencari ridha Allah, bukan pujian manusia." },
    { type: 'paragraph', text: "Amal sekecil apa pun jika didasari ikhlas, akan menjadi besar di sisi Allah." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Mari terus luruskan niat sebelum, saat, dan sesudah beramal." },
    { type: 'paragraph', text: "Semoga Allah menjauhkan kita dari sifat riya dan ujub." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};

