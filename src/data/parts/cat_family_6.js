import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';


export const family_11 = {
  id: 421,
  title: 'Menjaga Silaturahmi Keluarga',
  slug: 'menjaga-silaturahmi-keluarga',
  summary: 'Pentingnya menyambung tali persaudaraan dan ancaman bagi pemutus silaturahmi.',
  category: 'family', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['keluarga', 'silaturahmi', 'persaudaraan'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Memutus tali silaturahmi adalah dosa besar yang diancam tidak akan masuk surga." },
    { type: 'paragraph', text: "Meskipun sanak kerabat kita berbuat buruk, kewajiban kita tetap menyambungnya." },
    { type: 'paragraph', text: "Silaturahmi memanjangkan umur dan melapangkan rezeki." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jangan jadikan perbedaan pendapat duniawi merusak ikatan darah dan persaudaraan kita." },
    { type: 'paragraph', text: "Semoga tali kasih sayang antar kerabat kita semakin kuat." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};

