/**
 * KhutbahQu — Draft Generator
 * Script lokal untuk menambah draft khutbah baru.
 *
 * Cara menjalankan:
 *   node scripts/generateDraft.mjs "Judul Khutbah" --theme taqwa --source muslim-or-id
 *
 * Script ini akan:
 * 1. Membuat file draft baru di src/data/drafts/
 * 2. Mengisi template struktur khutbah lengkap
 * 3. Menandai status sebagai "draft"
 * 4. Mencatat sumber inspirasi
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRAFTS_DIR = path.join(__dirname, '..', 'src', 'data', 'drafts');

// Parse arguments
const args = process.argv.slice(2);
const title = args.find(a => !a.startsWith('--')) || 'Judul Khutbah Baru';
const theme = args.find((a, i) => args[i - 1] === '--theme') || 'taqwa';
const sourceId = args.find((a, i) => args[i - 1] === '--source') || '';

function generateSlug(t) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80);
}

function getNextId() {
  if (!fs.existsSync(DRAFTS_DIR)) return 100;
  const files = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.json'));
  if (files.length === 0) return 100;
  const ids = files.map(f => {
    try { return JSON.parse(fs.readFileSync(path.join(DRAFTS_DIR, f), 'utf-8')).id || 0; } catch { return 0; }
  });
  return Math.max(...ids) + 1;
}

// Check duplicates
function checkDuplicate(slug) {
  if (!fs.existsSync(DRAFTS_DIR)) return false;
  const files = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.json'));
  for (const f of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(DRAFTS_DIR, f), 'utf-8'));
      if (data.slug === slug) return true;
    } catch { /* skip */ }
  }
  return false;
}

// Ensure drafts dir exists
if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });

const slug = generateSlug(title);
if (checkDuplicate(slug)) {
  console.error(`\u274C Duplikat! Sudah ada draft dengan slug: "${slug}"`);
  process.exit(1);
}

const id = getNextId();
const now = new Date().toISOString().split('T')[0];

const MUK = 'إِنَّ الْحَمْدَ لِلَّهِ نَحْمَدُهُ وَنَسْتَعِينُهُ وَنَسْتَغْفِرُهُ، وَنَعُوذُ بِاللَّهِ مِنْ شُرُورِ أَنْفُسِنَا وَمِنْ سَيِّئَاتِ أَعْمَالِنَا، مَنْ يَهْدِهِ اللَّهُ فَلاَ مُضِلَّ لَهُ وَمَنْ يُضْلِلْ فَلاَ هَادِيَ لَهُ. أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ';
const WASIAT = 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ حَقَّ تُقَاتِهِ وَلاَ تَمُوتُنَّ إِلاَّ وَأَنْتُمْ مُسْلِمُونَ';
const PENUTUP1 = 'بَارَكَ اللَّهُ لِي وَلَكُمْ فِي الْقُرْآنِ الْعَظِيمِ، وَنَفَعَنِي وَإِيَّاكُمْ بِمَا فِيهِ مِنَ الْآيَاتِ وَالذِّكْرِ الْحَكِيمِ، أَقُولُ قَوْلِي هَذَا وَأَسْتَغْفِرُ اللَّهَ الْعَظِيمَ لِي وَلَكُمْ وَلِسَائِرِ الْمُسْلِمِينَ مِنْ كُلِّ ذَنْبٍ فَاسْتَغْفِرُوهُ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ';
const MUK2 = 'إِنَّ الْحَمْدَ لِلَّهِ نَحْمَدُهُ وَنَسْتَعِينُهُ وَنَسْتَغْفِرُهُ، وَنَعُوذُ بِاللَّهِ مِنْ شُرُورِ أَنْفُسِنَا، وَالصَّلاَةُ وَالسَّلاَمُ عَلَى نَبِيِّنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ';
const DUA = 'اَللَّهُمَّ اغْفِرْ لِلْمُسْلِمِينَ وَالْمُسْلِمَاتِ وَالْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ. رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ';

const draft = {
  id,
  title,
  slug,
  summary: `[DRAFT] Silakan tulis ringkasan khutbah tentang: ${title}`,
  category: theme,
  type: 'khutbah-jumat',
  duration: 0,
  occasion: 'Jumat',
  tags: [theme],
  createdAt: now,
  updatedAt: now,
  status: 'draft',
  sourceInspiration: sourceId ? [sourceId] : [],
  sourceNotes: `Tema terinspirasi dari sumber referensi. Konten ditulis ulang secara orisinal.`,
  firstKhutbah: [
    { type: 'opening', text: MUK },
    { type: 'paragraph', text: `Ma'asyiral muslimin jamaah shalat Jumat yang dirahmati Allah subhanahu wa ta'ala. Marilah kita meningkatkan ketakwaan kita kepada Allah subhanahu wa ta'ala.` },
    { type: 'quran', arabic: WASIAT, translation: '"Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa, dan janganlah kamu mati kecuali dalam keadaan Muslim."', ref: 'QS. Ali Imran: 102' },
    { type: 'paragraph', text: `[TULIS ISI UTAMA KHUTBAH PERTAMA DI SINI — Bahas tema "${title}" dengan dalil yang relevan]` },
    { type: 'quran', arabic: '[TEKS ARAB AYAT]', translation: '[TERJEMAH AYAT]', ref: '[QS. Nama Surat: Ayat]' },
    { type: 'paragraph', text: '[PENJELASAN DALIL DAN NASIHAT PRAKTIS UNTUK JAMAAH]' },
    { type: 'closing', text: PENUTUP1 },
  ],
  secondKhutbah: [
    { type: 'opening', text: MUK2 },
    { type: 'paragraph', text: '[TULIS ISI KHUTBAH KEDUA — Ringkasan nasihat dan motivasi]' },
    { type: 'paragraph', text: '[DOA DAN PENUTUP KHUTBAH KEDUA]' },
  ],
  dua: DUA,
  references: [],
};

const filename = `draft-${slug}.json`;
const filepath = path.join(DRAFTS_DIR, filename);
fs.writeFileSync(filepath, JSON.stringify(draft, null, 2), 'utf-8');

console.log(`\u2705 Draft berhasil dibuat!`);
console.log(`   File: src/data/drafts/${filename}`);
console.log(`   ID: ${id}`);
console.log(`   Slug: ${slug}`);
console.log(`   Tema: ${theme}`);
console.log(`   Status: draft`);
console.log(`\n\uD83D\uDCDD Langkah selanjutnya:`);
console.log(`   1. Buka file draft dan lengkapi konten khutbah`);
console.log(`   2. Ganti semua placeholder [TULIS...] dengan konten asli`);
console.log(`   3. Ubah status menjadi "review" setelah selesai menulis`);
console.log(`   4. Review dan ubah status menjadi "ready" atau "published"`);
console.log(`   5. Import ke khutbahData.js untuk ditampilkan di website`);
