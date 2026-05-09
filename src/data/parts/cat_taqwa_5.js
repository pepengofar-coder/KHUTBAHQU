import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';


export const taqwa_10 = {
  id: 405,
  title: 'Takwa Saat Menghadapi Ujian',
  slug: 'takwa-saat-ujian',
  summary: 'Ketakwaan adalah benteng terkuat saat badai ujian datang menerpa.',
  category: 'taqwa', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['takwa', 'sabar', 'ujian'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Hidup ini adalah ujian, dan setiap orang pasti akan diuji sesuai kadar keimanannya." },
    { type: 'paragraph', text: "Takwa adalah perisai yang akan menjaga lisan dan hati kita dari mengeluh dan menyalahkan takdir." },
    { type: 'paragraph', text: "Orang bertakwa tahu bahwa di balik setiap ujian, ada hikmah dan penghapusan dosa." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Mari bersabar dan mengembalikan segalanya kepada sang Pencipta." },
    { type: 'paragraph', text: "Semoga Allah memberikan keteguhan hati kepada kita semua." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};


export const taqwa_11 = {
  id: 406,
  title: 'Buah Ketakwaan: Jalan Keluar dari Masalah',
  slug: 'buah-ketakwaan-jalan-keluar',
  summary: 'Janji Allah memberikan jalan keluar bagi hamba-Nya yang bertakwa.',
  category: 'taqwa', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['takwa', 'rezeki', 'solusi'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Barangsiapa bertakwa kepada Allah, niscaya Dia akan mengadakan baginya jalan keluar." },
    { type: 'paragraph', text: "Ini adalah janji Allah yang pasti bagi mereka yang meletakkan Allah di atas segalanya." },
    { type: 'paragraph', text: "Masalah seberat apa pun akan terasa ringan jika kita serahkan penyelesaiannya kepada Allah." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Kuatkan tawakal dan tingkatkan ketakwaan kita, maka solusi akan datang dari arah yang tak disangka." },
    { type: 'paragraph', text: "Semoga Allah membukakan pintu-pintu kemudahan bagi kita." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};

