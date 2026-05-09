import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';


export const youth_10 = {
  id: 422,
  title: 'Pemuda yang Tumbuh dalam Ketaatan',
  slug: 'pemuda-tumbuh-dalam-ketaatan',
  summary: 'Tujuh golongan yang mendapat naungan Allah, salah satunya pemuda yang taat.',
  category: 'youth', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['pemuda', 'ketaatan', 'akhirat'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Masa muda adalah masa emas yang diiringi energi melimpah dan godaan yang besar." },
    { type: 'paragraph', text: "Seorang pemuda yang mampu mengekang hawa nafsunya dan taat kepada Allah memiliki kedudukan yang istimewa." },
    { type: 'paragraph', text: "Di hari kiamat, masa muda akan ditanya secara khusus untuk apa dihabiskan." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jadilah pemuda penggerak kebaikan, agen perubahan yang Islami di tengah masyarakat." },
    { type: 'paragraph', text: "Semoga Allah memberikan naungan-Nya bagi para pemuda kita di padang mahsyar." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};


export const youth_11 = {
  id: 423,
  title: 'Menjauhi Pergaulan Bebas',
  slug: 'menjauhi-pergaulan-bebas',
  summary: 'Ancaman zina dan pergaulan bebas yang mengintai generasi muda saat ini.',
  category: 'youth', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: ['pemuda', 'pergaulan', 'zina'], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "Pergaulan bebas adalah pintu gerbang menuju kerusakan akhlak dan hilangnya masa depan pemuda." },
    { type: 'paragraph', text: "Allah melarang keras untuk tidak sekadar mendekati zina, karena godaannya sangat halus dan mematikan." },
    { type: 'paragraph', text: "Bentengilah pergaulan dengan teman-teman yang saleh dan aktivitas yang bermanfaat." },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "Jaga pandangan, jaga kehormatan, karena itu adalah investasi kehidupan." },
    { type: 'paragraph', text: "Semoga generasi pemuda kita terselamatkan dari wabah kemaksiatan." },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};

