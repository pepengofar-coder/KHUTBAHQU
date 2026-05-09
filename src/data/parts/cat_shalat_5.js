import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';


export const shalat_10 = {
  id: 407,
  title: 'Kekhusyukan dalam Shalat',
  slug: 'kekhusyukan-dalam-shalat',
  summary: 'Cara meraih khusyuk dalam shalat untuk merasakan nikmatnya ibadah.',
  category: 'shalat', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['shalat', 'khusyuk', 'ibadah'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Shalat yang khusyuk adalah kunci keselamatan dan kebahagiaan seorang mukmin." },
    { type: 'paragraph', text: "Khusyuk berarti hadirnya hati dan fokusnya pikiran hanya kepada Allah saat kita beribadah." },
    { type: 'paragraph', text: "Untuk meraih khusyuk, kita perlu memahami makna bacaan dan menghadirkan rasa rendah diri." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Tinggalkan urusan dunia sejenak ketika kita sudah bertakbiratul ihram." },
    { type: 'paragraph', text: "Semoga shalat kita diterima dan mencegah kita dari perbuatan keji dan mungkar." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};


export const shalat_11 = {
  id: 408,
  title: 'Keutamaan Shalat Berjamaah',
  slug: 'keutamaan-shalat-berjamaah',
  summary: 'Pentingnya memakmurkan masjid dengan shalat fardhu berjamaah.',
  category: 'shalat', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['shalat', 'berjamaah', 'masjid'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Shalat berjamaah memiliki pahala 27 derajat lebih tinggi dibandingkan shalat sendirian." },
    { type: 'paragraph', text: "Selain itu, shalat berjamaah merupakan syiar Islam dan wadah silaturahmi antar umat muslim." },
    { type: 'paragraph', text: "Mari kita ramaikan masjid-masjid di sekitar kita, terutama pada waktu Subuh." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Seorang mukmin hatinya akan selalu terpaut dengan masjid." },
    { type: 'paragraph', text: "Semoga langkah-langkah kaki kita menuju masjid menghapus dosa-dosa kita." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};

