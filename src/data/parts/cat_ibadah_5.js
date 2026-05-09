import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';


export const ibadah_9 = {
  id: 413,
  title: 'Istiqamah Pasca Ramadhan',
  slug: 'istiqamah-pasca-ramadhan',
  summary: 'Menjaga semangat ibadah setelah bulan suci berlalu.',
  category: 'ibadah', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['ibadah', 'istiqamah', 'konsisten'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Banyak orang yang semangat beribadah hanya di bulan Ramadhan dan meninggalkannya setelah Lebaran." },
    { type: 'paragraph', text: "Padahal, Tuhan bulan Ramadhan adalah Tuhan yang sama di bulan-bulan lainnya." },
    { type: 'paragraph', text: "Tanda diterimanya amal di bulan puasa adalah kebaikan yang berlanjut setelahnya." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Mari pertahankan shalat malam dan sedekah kita, meski sedikit namun konsisten." },
    { type: 'paragraph', text: "Semoga Allah memberikan keistiqamahan di hati kita." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};


export const ibadah_10 = {
  id: 414,
  title: 'Adab Berdoa Kepada Allah',
  slug: 'adab-berdoa-kepada-allah',
  summary: 'Etika dan cara berdoa yang diajarkan agar doa dikabulkan.',
  category: 'ibadah', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['ibadah', 'doa', 'adab'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Doa adalah intisari dari ibadah." },
    { type: 'paragraph', text: "Agar doa dikabulkan, kita harus memperhatikan adab-adabnya: memuji Allah, bershalawat, dan penuh keyakinan." },
    { type: 'paragraph', text: "Jangan tergesa-gesa dalam berdoa, apalagi merasa Allah tidak mendengarkan." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Waktu-waktu mustajab seperti sepertiga malam terakhir harus kita maksimalkan." },
    { type: 'paragraph', text: "Semoga setiap munajat kita didengar dan dikabulkan oleh Allah." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};

