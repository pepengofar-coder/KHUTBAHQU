import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';


export const akhlak_9 = {
  id: 410,
  title: 'Menjaga Lisan dari Ghibah',
  slug: 'menjaga-lisan-dari-ghibah',
  summary: 'Bahaya lisan dan pentingnya menjauhkan diri dari membicarakan keburukan orang lain.',
  category: 'akhlak', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['akhlak', 'lisan', 'ghibah'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Lisan adalah nikmat yang besar, namun juga bisa menjerumuskan pemiliknya ke neraka." },
    { type: 'paragraph', text: "Ghibah, atau membicarakan aib saudara kita, diibaratkan seperti memakan daging saudara sendiri yang telah mati." },
    { type: 'paragraph', text: "Tahanlah lisan, bicaralah yang baik atau diam." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Mari kita sibukkan diri dengan memperbaiki aib kita sendiri daripada mengurus aib orang lain." },
    { type: 'paragraph', text: "Semoga Allah menjaga lisan kita dari ucapan yang menyakiti." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};


export const akhlak_10 = {
  id: 411,
  title: 'Sabar Menghadapi Gangguan Manusia',
  slug: 'sabar-menghadapi-gangguan',
  summary: 'Akhlak mulia saat menghadapi cercaan dan keburukan dari sesama manusia.',
  category: 'akhlak', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['akhlak', 'sabar', 'sosial'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Dalam berinteraksi, gesekan dan gangguan dari orang lain adalah hal yang pasti terjadi." },
    { type: 'paragraph', text: "Sikap seorang muslim sejati adalah bersabar dan memaafkan, karena balasan Allah jauh lebih besar." },
    { type: 'paragraph', text: "Nabi Muhammad memberikan contoh nyata bagaimana membalas keburukan dengan kebaikan." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Janganlah mudah terpancing emosi dan membalas dendam." },
    { type: 'paragraph', text: "Semoga kita diberikan kebesaran hati untuk mudah memaafkan." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};

