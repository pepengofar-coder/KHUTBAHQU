import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';


export const akhlak_11 = {
  id: 412,
  title: 'Keutamaan Rasa Malu',
  slug: 'keutamaan-rasa-malu',
  summary: 'Malu adalah cabang dari iman yang menahan seseorang dari perbuatan dosa.',
  category: 'akhlak', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['akhlak', 'malu', 'iman'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Rasa malu (haya) adalah benteng yang menjaga kehormatan seorang muslim." },
    { type: 'paragraph', text: "Malu kepada Allah berarti malu jika Dia melihat kita melakukan maksiat." },
    { type: 'paragraph', text: "Di zaman ini, rasa malu semakin luntur, banyak orang bangga melakukan dosa secara terang-terangan." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Mari kembalikan rasa malu itu pada diri kita dan generasi kita." },
    { type: 'paragraph', text: "Semoga Allah menghiasi akhlak kita dengan rasa malu yang proporsional." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};

