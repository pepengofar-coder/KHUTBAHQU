import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';


export const taqwa_8 = {
  id: 403,
  title: 'Takwa Sebagai Bekal Terbaik',
  slug: 'takwa-bekal-terbaik',
  summary: 'Takwa adalah sebaik-baiknya bekal untuk perjalanan menuju akhirat.',
  category: 'taqwa', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['takwa', 'bekal', 'akhirat'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Dunia ini hanyalah tempat singgah sementara, dan perjalanan panjang menanti kita di akhirat." },
    { type: 'paragraph', text: "Allah subhanahu wa ta\'ala berfirman bahwa sebaik-baik bekal adalah ketakwaan." },
    { type: 'paragraph', text: "Ketakwaan bukanlah sekedar memakai pakaian agamis, melainkan rasa takut kepada Allah di mana pun kita berada." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Tingkatkan ketaatan kita, baik saat ramai maupun saat sendiri." },
    { type: 'paragraph', text: "Semoga bekal takwa ini mengantarkan kita ke pintu surga-Nya." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};


export const taqwa_9 = {
  id: 404,
  title: 'Mewujudkan Takwa dalam Pekerjaan',
  slug: 'takwa-dalam-pekerjaan',
  summary: 'Bagaimana nilai-nilai takwa dapat diterapkan di lingkungan kerja.',
  category: 'taqwa', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['takwa', 'kerja', 'profesionalisme'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Bekerja mencari nafkah yang halal adalah bagian dari ibadah." },
    { type: 'paragraph', text: "Seorang mukmin yang bertakwa akan menjaga amanah dan kejujuran di tempat kerjanya." },
    { type: 'paragraph', text: "Ia tidak akan menipu, mengurangi timbangan, atau mengambil harta yang bukan haknya." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jadikan pekerjaan kita sebagai ladang amal saleh." },
    { type: 'paragraph', text: "Semoga setiap tetes keringat kita dinilai ibadah dan menambah ketakwaan kita." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};

