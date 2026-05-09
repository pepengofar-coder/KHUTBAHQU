import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';


export const taubat_10 = {
  id: 416,
  title: 'Jangan Putus Asa dari Rahmat Allah',
  slug: 'jangan-putus-asa-dari-rahmat',
  summary: 'Ampunan Allah sangat luas, menutupi dosa apa pun bagi hamba yang bertaubat.',
  category: 'taubat', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['taubat', 'rahmat', 'harapan'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Sebesar apa pun dosa kita, pintu taubat Allah selalu terbuka lebar." },
    { type: 'paragraph', text: "Setan selalu membisikkan keputusasaan agar manusia terus berkubang dalam maksiat." },
    { type: 'paragraph', text: "Ingatlah bahwa Allah mencintai hamba-Nya yang kembali dan memohon ampun." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Segeralah bertaubat nasuha sebelum ajal menjemput." },
    { type: 'paragraph', text: "Semoga Allah menerima taubat kita dan mengampuni segala dosa kita." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};


export const taubat_11 = {
  id: 417,
  title: 'Taubat Nasuha: Syarat dan Tandanya',
  slug: 'taubat-nasuha-syarat-dan-tanda',
  summary: 'Memahami hakikat taubat yang benar dan tidak diulangi lagi.',
  category: 'taubat', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['taubat', 'nasuha', 'ampunan'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Taubat nasuha adalah taubat yang murni, yang memenuhi tiga syarat utama." },
    { type: 'paragraph', text: "Syarat tersebut adalah menyesali, meninggalkan dosa, dan bertekad tidak mengulangi." },
    { type: 'paragraph', text: "Jika dosa berkaitan dengan manusia, harus ada permintaan maaf kepada yang bersangkutan." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Mari perbaiki diri kita dan ganti kesalahan masa lalu dengan kebaikan yang banyak." },
    { type: 'paragraph', text: "Semoga hati kita disucikan dari segala noda maksiat." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};

