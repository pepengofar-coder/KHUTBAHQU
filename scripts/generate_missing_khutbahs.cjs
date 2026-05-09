const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data/parts');

const generateKhutbahFile = (items) => {
  return `import { khutbahIndonesianOpeningTemplates, khutbahOpeningTemplates, WASIAT_TAQWA, PENUTUP_KHUTBAH_1, MUK_KHUTBAH_2, DUA_PENUTUP } from './header.js';

${items.map(item => `
export const ${item.id} = {
  id: ${item.numericId},
  title: '${item.title.replace(/'/g, "\\'")}',
  slug: '${item.slug}',
  summary: '${item.summary.replace(/'/g, "\\'")}',
  category: '${item.category}', type: 'khutbah-jumat', duration: 15, occasion: 'Jumat',
  tags: [${item.tags.map(t => `'${t}'`).join(', ')}], createdAt: '2026-05-09', status: 'published',
  firstKhutbah: [
    { type: 'opening', text: khutbahOpeningTemplates[0] },
    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[1] },
    { type: 'paragraph', text: "Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita senantiasa meningkatkan ketakwaan kita kepada Allah." },
    { type: 'quran', arabic: WASIAT_TAQWA, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa..."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: "${item.content1.replace(/'/g, "\\'")}" },
    { type: 'paragraph', text: "${item.content2.replace(/'/g, "\\'")}" },
    { type: 'paragraph', text: "${item.content3.replace(/'/g, "\\'")}" },
    { type: 'closing', text: PENUTUP_KHUTBAH_1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK_KHUTBAH_2 },
    { type: 'paragraph', text: "${item.content4.replace(/'/g, "\\'")}" },
    { type: 'paragraph', text: "${item.content5.replace(/'/g, "\\'")}" },
  ],
  dua: DUA_PENUTUP,
  references: ['Al-Quran Al-Karim', 'Hadis Shahih'],
};
`).join('\n')}
`;
};

const newKhutbahs = [
  // Tauhid (2) -> cat_tauhid_6.js
  { file: 'cat_tauhid_6.js', category: 'tauhid', numericId: 401, id: 'tauhid_10', title: 'Kemurnian Akidah di Era Digital', slug: 'kemurnian-akidah-era-digital', summary: 'Menjaga tauhid dari syirik-syirik modern dan godaan media sosial.', tags: ['tauhid', 'akidah', 'digital'], 
    content1: 'Di era kemajuan teknologi ini, kita dihadapkan pada banyak tantangan yang dapat menggerus kemurnian tauhid kita.',
    content2: 'Banyak dari kita yang tanpa sadar mempertuhankan popularitas, harta, dan tahta duniawi, yang menggeser kecintaan kita kepada Allah.',
    content3: 'Oleh karena itu, sangat penting bagi kita untuk selalu memfilter informasi dan memperkuat fondasi keimanan.',
    content4: 'Mari kita jaga diri kita dan keluarga dari pemahaman-pemahaman yang menyimpang.',
    content5: 'Semoga Allah menjaga hati kita agar tetap istiqamah di atas jalan tauhid.' },
  { file: 'cat_tauhid_6.js', category: 'tauhid', numericId: 402, id: 'tauhid_11', title: 'Asmaul Husna: Mengenal Sifat Allah', slug: 'asmaul-husna-mengenal-sifat-allah', summary: 'Meningkatkan keimanan dengan merenungi makna Asmaul Husna.', tags: ['tauhid', 'asmaul-husna', 'sifat'], 
    content1: 'Mengenal Allah melalui Asmaul Husna adalah kunci utama untuk mencintai-Nya.',
    content2: 'Barangsiapa yang menghafal dan mengamalkan kandungan dari nama-nama Allah, maka surga jaminannya.',
    content3: 'Setiap nama Allah membawa konsekuensi ubudiyah yang harus kita realisasikan dalam ibadah.',
    content4: 'Pahamilah makna Ar-Rahman, Ar-Rahim, Al-Ghafur, dan jadikan itu penguat jiwa kita.',
    content5: 'Semoga pengenalan kita terhadap Asmaul Husna mendatangkan kedamaian sejati.' },

  // Takwa (4) -> cat_taqwa_4.js, cat_taqwa_5.js
  { file: 'cat_taqwa_4.js', category: 'taqwa', numericId: 403, id: 'taqwa_8', title: 'Takwa Sebagai Bekal Terbaik', slug: 'takwa-bekal-terbaik', summary: 'Takwa adalah sebaik-baiknya bekal untuk perjalanan menuju akhirat.', tags: ['takwa', 'bekal', 'akhirat'], 
    content1: "Dunia ini hanyalah tempat singgah sementara, dan perjalanan panjang menanti kita di akhirat.",
    content2: "Allah subhanahu wa ta'ala berfirman bahwa sebaik-baik bekal adalah ketakwaan.",
    content3: "Ketakwaan bukanlah sekedar memakai pakaian agamis, melainkan rasa takut kepada Allah di mana pun kita berada.",
    content4: 'Tingkatkan ketaatan kita, baik saat ramai maupun saat sendiri.',
    content5: 'Semoga bekal takwa ini mengantarkan kita ke pintu surga-Nya.' },
  { file: 'cat_taqwa_4.js', category: 'taqwa', numericId: 404, id: 'taqwa_9', title: 'Mewujudkan Takwa dalam Pekerjaan', slug: 'takwa-dalam-pekerjaan', summary: 'Bagaimana nilai-nilai takwa dapat diterapkan di lingkungan kerja.', tags: ['takwa', 'kerja', 'profesionalisme'], 
    content1: 'Bekerja mencari nafkah yang halal adalah bagian dari ibadah.',
    content2: 'Seorang mukmin yang bertakwa akan menjaga amanah dan kejujuran di tempat kerjanya.',
    content3: 'Ia tidak akan menipu, mengurangi timbangan, atau mengambil harta yang bukan haknya.',
    content4: 'Jadikan pekerjaan kita sebagai ladang amal saleh.',
    content5: 'Semoga setiap tetes keringat kita dinilai ibadah dan menambah ketakwaan kita.' },
  { file: 'cat_taqwa_5.js', category: 'taqwa', numericId: 405, id: 'taqwa_10', title: 'Takwa Saat Menghadapi Ujian', slug: 'takwa-saat-ujian', summary: 'Ketakwaan adalah benteng terkuat saat badai ujian datang menerpa.', tags: ['takwa', 'sabar', 'ujian'], 
    content1: 'Hidup ini adalah ujian, dan setiap orang pasti akan diuji sesuai kadar keimanannya.',
    content2: 'Takwa adalah perisai yang akan menjaga lisan dan hati kita dari mengeluh dan menyalahkan takdir.',
    content3: 'Orang bertakwa tahu bahwa di balik setiap ujian, ada hikmah dan penghapusan dosa.',
    content4: 'Mari bersabar dan mengembalikan segalanya kepada sang Pencipta.',
    content5: 'Semoga Allah memberikan keteguhan hati kepada kita semua.' },
  { file: 'cat_taqwa_5.js', category: 'taqwa', numericId: 406, id: 'taqwa_11', title: 'Buah Ketakwaan: Jalan Keluar dari Masalah', slug: 'buah-ketakwaan-jalan-keluar', summary: 'Janji Allah memberikan jalan keluar bagi hamba-Nya yang bertakwa.', tags: ['takwa', 'rezeki', 'solusi'], 
    content1: 'Barangsiapa bertakwa kepada Allah, niscaya Dia akan mengadakan baginya jalan keluar.',
    content2: 'Ini adalah janji Allah yang pasti bagi mereka yang meletakkan Allah di atas segalanya.',
    content3: 'Masalah seberat apa pun akan terasa ringan jika kita serahkan penyelesaiannya kepada Allah.',
    content4: 'Kuatkan tawakal dan tingkatkan ketakwaan kita, maka solusi akan datang dari arah yang tak disangka.',
    content5: 'Semoga Allah membukakan pintu-pintu kemudahan bagi kita.' },

  // Shalat (2) -> cat_shalat_5.js
  { file: 'cat_shalat_5.js', category: 'shalat', numericId: 407, id: 'shalat_10', title: 'Kekhusyukan dalam Shalat', slug: 'kekhusyukan-dalam-shalat', summary: 'Cara meraih khusyuk dalam shalat untuk merasakan nikmatnya ibadah.', tags: ['shalat', 'khusyuk', 'ibadah'], 
    content1: 'Shalat yang khusyuk adalah kunci keselamatan dan kebahagiaan seorang mukmin.',
    content2: 'Khusyuk berarti hadirnya hati dan fokusnya pikiran hanya kepada Allah saat kita beribadah.',
    content3: 'Untuk meraih khusyuk, kita perlu memahami makna bacaan dan menghadirkan rasa rendah diri.',
    content4: 'Tinggalkan urusan dunia sejenak ketika kita sudah bertakbiratul ihram.',
    content5: 'Semoga shalat kita diterima dan mencegah kita dari perbuatan keji dan mungkar.' },
  { file: 'cat_shalat_5.js', category: 'shalat', numericId: 408, id: 'shalat_11', title: 'Keutamaan Shalat Berjamaah', slug: 'keutamaan-shalat-berjamaah', summary: 'Pentingnya memakmurkan masjid dengan shalat fardhu berjamaah.', tags: ['shalat', 'berjamaah', 'masjid'], 
    content1: 'Shalat berjamaah memiliki pahala 27 derajat lebih tinggi dibandingkan shalat sendirian.',
    content2: 'Selain itu, shalat berjamaah merupakan syiar Islam dan wadah silaturahmi antar umat muslim.',
    content3: 'Mari kita ramaikan masjid-masjid di sekitar kita, terutama pada waktu Subuh.',
    content4: 'Seorang mukmin hatinya akan selalu terpaut dengan masjid.',
    content5: 'Semoga langkah-langkah kaki kita menuju masjid menghapus dosa-dosa kita.' },

  // Ikhlas (1) -> cat_ikhlas_6.js
  { file: 'cat_ikhlas_6.js', category: 'ikhlas', numericId: 409, id: 'ikhlas_11', title: 'Ikhlas: Ruh dari Segala Amal', slug: 'ikhlas-ruh-dari-amal', summary: 'Tanpa ikhlas, amal ibadah bagaikan jasad tanpa ruh yang tak bernilai.', tags: ['ikhlas', 'amal', 'niat'], 
    content1: 'Syarat diterimanya sebuah amal saleh ada dua: ikhlas karena Allah dan sesuai sunnah.',
    content2: 'Ikhlas berarti memurnikan niat hanya untuk mencari ridha Allah, bukan pujian manusia.',
    content3: 'Amal sekecil apa pun jika didasari ikhlas, akan menjadi besar di sisi Allah.',
    content4: 'Mari terus luruskan niat sebelum, saat, dan sesudah beramal.',
    content5: 'Semoga Allah menjauhkan kita dari sifat riya dan ujub.' },

  // Akhlak (3) -> cat_akhlak_5.js, cat_akhlak_6.js
  { file: 'cat_akhlak_5.js', category: 'akhlak', numericId: 410, id: 'akhlak_9', title: 'Menjaga Lisan dari Ghibah', slug: 'menjaga-lisan-dari-ghibah', summary: 'Bahaya lisan dan pentingnya menjauhkan diri dari membicarakan keburukan orang lain.', tags: ['akhlak', 'lisan', 'ghibah'], 
    content1: 'Lisan adalah nikmat yang besar, namun juga bisa menjerumuskan pemiliknya ke neraka.',
    content2: 'Ghibah, atau membicarakan aib saudara kita, diibaratkan seperti memakan daging saudara sendiri yang telah mati.',
    content3: 'Tahanlah lisan, bicaralah yang baik atau diam.',
    content4: 'Mari kita sibukkan diri dengan memperbaiki aib kita sendiri daripada mengurus aib orang lain.',
    content5: 'Semoga Allah menjaga lisan kita dari ucapan yang menyakiti.' },
  { file: 'cat_akhlak_5.js', category: 'akhlak', numericId: 411, id: 'akhlak_10', title: 'Sabar Menghadapi Gangguan Manusia', slug: 'sabar-menghadapi-gangguan', summary: 'Akhlak mulia saat menghadapi cercaan dan keburukan dari sesama manusia.', tags: ['akhlak', 'sabar', 'sosial'], 
    content1: 'Dalam berinteraksi, gesekan dan gangguan dari orang lain adalah hal yang pasti terjadi.',
    content2: 'Sikap seorang muslim sejati adalah bersabar dan memaafkan, karena balasan Allah jauh lebih besar.',
    content3: 'Nabi Muhammad memberikan contoh nyata bagaimana membalas keburukan dengan kebaikan.',
    content4: 'Janganlah mudah terpancing emosi dan membalas dendam.',
    content5: 'Semoga kita diberikan kebesaran hati untuk mudah memaafkan.' },
  { file: 'cat_akhlak_6.js', category: 'akhlak', numericId: 412, id: 'akhlak_11', title: 'Keutamaan Rasa Malu', slug: 'keutamaan-rasa-malu', summary: 'Malu adalah cabang dari iman yang menahan seseorang dari perbuatan dosa.', tags: ['akhlak', 'malu', 'iman'], 
    content1: 'Rasa malu (haya) adalah benteng yang menjaga kehormatan seorang muslim.',
    content2: 'Malu kepada Allah berarti malu jika Dia melihat kita melakukan maksiat.',
    content3: 'Di zaman ini, rasa malu semakin luntur, banyak orang bangga melakukan dosa secara terang-terangan.',
    content4: 'Mari kembalikan rasa malu itu pada diri kita dan generasi kita.',
    content5: 'Semoga Allah menghiasi akhlak kita dengan rasa malu yang proporsional.' },

  // Ibadah (3) -> cat_ibadah_5.js, cat_ibadah_6.js
  { file: 'cat_ibadah_5.js', category: 'ibadah', numericId: 413, id: 'ibadah_9', title: 'Istiqamah Pasca Ramadhan', slug: 'istiqamah-pasca-ramadhan', summary: 'Menjaga semangat ibadah setelah bulan suci berlalu.', tags: ['ibadah', 'istiqamah', 'konsisten'], 
    content1: 'Banyak orang yang semangat beribadah hanya di bulan Ramadhan dan meninggalkannya setelah Lebaran.',
    content2: 'Padahal, Tuhan bulan Ramadhan adalah Tuhan yang sama di bulan-bulan lainnya.',
    content3: 'Tanda diterimanya amal di bulan puasa adalah kebaikan yang berlanjut setelahnya.',
    content4: 'Mari pertahankan shalat malam dan sedekah kita, meski sedikit namun konsisten.',
    content5: 'Semoga Allah memberikan keistiqamahan di hati kita.' },
  { file: 'cat_ibadah_5.js', category: 'ibadah', numericId: 414, id: 'ibadah_10', title: 'Adab Berdoa Kepada Allah', slug: 'adab-berdoa-kepada-allah', summary: 'Etika dan cara berdoa yang diajarkan agar doa dikabulkan.', tags: ['ibadah', 'doa', 'adab'], 
    content1: 'Doa adalah intisari dari ibadah.',
    content2: 'Agar doa dikabulkan, kita harus memperhatikan adab-adabnya: memuji Allah, bershalawat, dan penuh keyakinan.',
    content3: 'Jangan tergesa-gesa dalam berdoa, apalagi merasa Allah tidak mendengarkan.',
    content4: 'Waktu-waktu mustajab seperti sepertiga malam terakhir harus kita maksimalkan.',
    content5: 'Semoga setiap munajat kita didengar dan dikabulkan oleh Allah.' },
  { file: 'cat_ibadah_6.js', category: 'ibadah', numericId: 415, id: 'ibadah_11', title: 'Menghidupkan Sunnah Harian', slug: 'menghidupkan-sunnah-harian', summary: 'Amalan-amalan kecil yang dicontohkan Rasulullah yang bernilai pahala besar.', tags: ['ibadah', 'sunnah', 'harian'], 
    content1: 'Menghidupkan sunnah adalah bukti cinta kita kepada Baginda Rasulullah shallallahu alaihi wasallam.',
    content2: 'Sunnah-sunnah kecil seperti bersiwak, mendahulukan kanan, dan doa sebelum aktivitas sering dilupakan.',
    content3: 'Meskipun kecil, amalan ini jika dikerjakan akan mendatangkan keberkahan.',
    content4: 'Jadikan sunnah sebagai gaya hidup kita sehari-hari.',
    content5: 'Semoga kita mendapatkan syafaat beliau di hari kiamat.' },

  // Taubat (2) -> cat_taubat_6.js
  { file: 'cat_taubat_6.js', category: 'taubat', numericId: 416, id: 'taubat_10', title: 'Jangan Putus Asa dari Rahmat Allah', slug: 'jangan-putus-asa-dari-rahmat', summary: 'Ampunan Allah sangat luas, menutupi dosa apa pun bagi hamba yang bertaubat.', tags: ['taubat', 'rahmat', 'harapan'], 
    content1: 'Sebesar apa pun dosa kita, pintu taubat Allah selalu terbuka lebar.',
    content2: 'Setan selalu membisikkan keputusasaan agar manusia terus berkubang dalam maksiat.',
    content3: 'Ingatlah bahwa Allah mencintai hamba-Nya yang kembali dan memohon ampun.',
    content4: 'Segeralah bertaubat nasuha sebelum ajal menjemput.',
    content5: 'Semoga Allah menerima taubat kita dan mengampuni segala dosa kita.' },
  { file: 'cat_taubat_6.js', category: 'taubat', numericId: 417, id: 'taubat_11', title: 'Taubat Nasuha: Syarat dan Tandanya', slug: 'taubat-nasuha-syarat-dan-tanda', summary: 'Memahami hakikat taubat yang benar dan tidak diulangi lagi.', tags: ['taubat', 'nasuha', 'ampunan'], 
    content1: 'Taubat nasuha adalah taubat yang murni, yang memenuhi tiga syarat utama.',
    content2: 'Syarat tersebut adalah menyesali, meninggalkan dosa, dan bertekad tidak mengulangi.',
    content3: 'Jika dosa berkaitan dengan manusia, harus ada permintaan maaf kepada yang bersangkutan.',
    content4: 'Mari perbaiki diri kita dan ganti kesalahan masa lalu dengan kebaikan yang banyak.',
    content5: 'Semoga hati kita disucikan dari segala noda maksiat.' },

  { file: 'cat_family_5.js', category: 'family', numericId: 418, id: 'family_8', title: 'Pentingnya Tarbiyah Anak Sejak Dini', slug: 'tarbiyah-anak-sejak-dini', summary: 'Mendidik anak di atas nilai agama adalah tanggung jawab terbesar orang tua.', tags: ['keluarga', 'anak', 'tarbiyah'], 
    content1: "Anak adalah amanah, sekaligus fitnah (ujian) dari Allah subhanahu wa ta'ala.",
    content2: "Pendidikan agama sejak dini akan membentuk karakter mereka agar menjadi anak yang salih.",
    content3: "Jangan biarkan gadget dan pengaruh lingkungan merusak akhlak anak-anak kita.",
    content4: 'Berikan keteladanan, bukan hanya perintah, dalam mendidik anak.',
    content5: 'Semoga anak-anak kita menjadi penyejuk hati dan doa bagi kita kelak.' },
  { file: 'cat_family_5.js', category: 'family', numericId: 419, id: 'family_9', title: 'Harmoni Rumah Tangga Islami', slug: 'harmoni-rumah-tangga-islami', summary: 'Membangun keluarga sakinah mawaddah wa rahmah di tengah ujian.', tags: ['keluarga', 'suami-istri', 'harmoni'], 
    content1: 'Rumah tangga adalah ibadah yang paling panjang dan penuh dinamika.',
    content2: 'Kunci rumah tangga yang sakinah adalah komunikasi, pengertian, dan saling memaafkan.',
    content3: 'Suami harus memuliakan istri, dan istri harus taat kepada suami dalam kebaikan.',
    content4: 'Setiap konflik selesaikanlah dengan musyawarah yang merujuk pada tuntunan agama.',
    content5: 'Semoga keluarga kita dilindungi dari perpecahan dan fitnah.' },
  { file: 'cat_family_5.js', category: 'family', numericId: 420, id: 'family_10', title: 'Birrul Walidain: Berbakti kepada Orang Tua', slug: 'birrul-walidain-berbakti', summary: 'Surga berada di bawah telapak kaki ibu, keridhaan Allah tergantung ridha orang tua.', tags: ['keluarga', 'orang-tua', 'bakti'], 
    content1: 'Hak orang tua setelah tauhid kepada Allah adalah kebaikan dan bakti dari anak-anaknya.',
    content2: 'Berkata ah saja diharamkan, apalagi membentak dan menelantarkan mereka.',
    content3: 'Bagi yang orang tuanya masih hidup, raihlah pintu surga yang paling tengah itu.',
    content4: 'Bagi yang sudah tiada, berdoalah dan bersedekahlah atas nama mereka.',
    content5: 'Semoga kita dicatat sebagai anak yang berbakti dan diampuni dosa-dosanya.' },
  { file: 'cat_family_6.js', category: 'family', numericId: 421, id: 'family_11', title: 'Menjaga Silaturahmi Keluarga', slug: 'menjaga-silaturahmi-keluarga', summary: 'Pentingnya menyambung tali persaudaraan dan ancaman bagi pemutus silaturahmi.', tags: ['keluarga', 'silaturahmi', 'persaudaraan'], 
    content1: 'Memutus tali silaturahmi adalah dosa besar yang diancam tidak akan masuk surga.',
    content2: 'Meskipun sanak kerabat kita berbuat buruk, kewajiban kita tetap menyambungnya.',
    content3: 'Silaturahmi memanjangkan umur dan melapangkan rezeki.',
    content4: 'Jangan jadikan perbedaan pendapat duniawi merusak ikatan darah dan persaudaraan kita.',
    content5: 'Semoga tali kasih sayang antar kerabat kita semakin kuat.' },

  // Youth (2) -> cat_youth_6.js
  { file: 'cat_youth_6.js', category: 'youth', numericId: 422, id: 'youth_10', title: 'Pemuda yang Tumbuh dalam Ketaatan', slug: 'pemuda-tumbuh-dalam-ketaatan', summary: 'Tujuh golongan yang mendapat naungan Allah, salah satunya pemuda yang taat.', tags: ['pemuda', 'ketaatan', 'akhirat'], 
    content1: 'Masa muda adalah masa emas yang diiringi energi melimpah dan godaan yang besar.',
    content2: 'Seorang pemuda yang mampu mengekang hawa nafsunya dan taat kepada Allah memiliki kedudukan yang istimewa.',
    content3: 'Di hari kiamat, masa muda akan ditanya secara khusus untuk apa dihabiskan.',
    content4: 'Jadilah pemuda penggerak kebaikan, agen perubahan yang Islami di tengah masyarakat.',
    content5: 'Semoga Allah memberikan naungan-Nya bagi para pemuda kita di padang mahsyar.' },
  { file: 'cat_youth_6.js', category: 'youth', numericId: 423, id: 'youth_11', title: 'Menjauhi Pergaulan Bebas', slug: 'menjauhi-pergaulan-bebas', summary: 'Ancaman zina dan pergaulan bebas yang mengintai generasi muda saat ini.', tags: ['pemuda', 'pergaulan', 'zina'], 
    content1: 'Pergaulan bebas adalah pintu gerbang menuju kerusakan akhlak dan hilangnya masa depan pemuda.',
    content2: 'Allah melarang keras untuk tidak sekadar mendekati zina, karena godaannya sangat halus dan mematikan.',
    content3: 'Bentengilah pergaulan dengan teman-teman yang saleh dan aktivitas yang bermanfaat.',
    content4: 'Jaga pandangan, jaga kehormatan, karena itu adalah investasi kehidupan.',
    content5: 'Semoga generasi pemuda kita terselamatkan dari wabah kemaksiatan.' },
];

const groupByFile = newKhutbahs.reduce((acc, curr) => {
  if (!acc[curr.file]) acc[curr.file] = [];
  acc[curr.file].push(curr);
  return acc;
}, {});

// Create files
for (const [filename, items] of Object.entries(groupByFile)) {
  const filePath = path.join(dataDir, filename);
  let content = '';
  if (fs.existsSync(filePath)) {
    // Append to existing file (not optimal for imports, but we will assume files didn't exist or we just overwrite/create new ones)
    // Actually, let's just write to them directly as new files. Since they are like cat_tauhid_6.js, they are new files.
  }
  content = generateKhutbahFile(items);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created ${filename}`);
}

// Generate the updated imports and exports for khutbahData.js
let importStmts = '';
let exportIds = [];

for (const [filename, items] of Object.entries(groupByFile)) {
  const ids = items.map(i => i.id).join(', ');
  exportIds.push(...items.map(i => i.id));
  importStmts += `import { ${ids} } from './parts/${filename.replace('.js', '')}.js';\n`;
}

console.log('--- IMPORTS ---');
console.log(importStmts);
console.log('--- EXPORTS ---');
console.log(exportIds.join(', '));
