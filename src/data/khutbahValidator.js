/**
 * KhutbahQu — Content Validation & Utilities
 * Fungsi-fungsi untuk validasi, estimasi durasi, deteksi duplikasi, dan deteksi singkatan.
 */

const WORDS_PER_MINUTE = 110; // Tempo baca khutbah (lambat, dengan jeda dan penghayatan)
const MIN_WORD_COUNT = 600;   // ~5.5 menit minimum (termasuk teks Arab)
const IDEAL_WORD_COUNT = 900; // ~8-9 menit ideal

/**
 * Menghitung jumlah kata dari seluruh blok konten khutbah
 * Termasuk teks Arab (dihitung terpisah karena tempo baca lebih lambat)
 */
export function countWords(khutbah) {
  let text = '';
  const blocks = [...(khutbah.firstKhutbah || []), ...(khutbah.secondKhutbah || [])];
  for (const b of blocks) {
    if (b.text) text += ' ' + b.text;
    if (b.arabic) text += ' ' + b.arabic;
    if (b.translation) text += ' ' + b.translation;
  }
  if (khutbah.summary) text += ' ' + khutbah.summary;
  if (khutbah.dua) text += ' ' + khutbah.dua;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Estimasi durasi baca (menit) berdasarkan jumlah kata
 */
export function estimateReadingDuration(khutbah) {
  const words = countWords(khutbah);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * Menghitung durasi baca dalam format string: "±X menit"
 */
export function formatDuration(khutbah) {
  return `±${estimateReadingDuration(khutbah)} menit`;
}

/**
 * Deteksi apakah konten terlalu pendek untuk dibacakan (< 7 menit)
 */
export function isContentTooShort(khutbah) {
  const words = countWords(khutbah);
  return { tooShort: words < MIN_WORD_COUNT, wordCount: words, minRequired: MIN_WORD_COUNT, estimatedMinutes: Math.round(words / WORDS_PER_MINUTE) };
}

/**
 * Deteksi singkatan lafaz penghormatan yang tidak boleh digunakan
 */
export function detectAbbreviations(text) {
  const patterns = [
    { regex: /\bSAW\b/g, label: 'SAW', fix: "shallallahu 'alaihi wasallam" },
    { regex: /\bS\.A\.W\.?\b/gi, label: 'S.A.W', fix: "shallallahu 'alaihi wasallam" },
    { regex: /\bSWT\b/g, label: 'SWT', fix: "subhanahu wa ta'ala" },
    { regex: /\bS\.W\.T\.?\b/gi, label: 'S.W.T', fix: "subhanahu wa ta'ala" },
    { regex: /\bRA\b/g, label: 'RA', fix: "radhiyallahu 'anhu" },
    { regex: /\bR\.A\.?\b/gi, label: 'R.A', fix: "radhiyallahu 'anhu/'anha" },
    { regex: /\bAS\b(?=\s|$|[.,;:])/g, label: 'AS', fix: "'alaihissalam" },
    { regex: /\bA\.S\.?\b/gi, label: 'A.S', fix: "'alaihissalam" },
    { regex: /\bHR\.\s/g, label: 'HR.', fix: "Hadis riwayat " },
  ];

  const issues = [];
  for (const p of patterns) {
    const matches = text.match(p.regex);
    if (matches) {
      issues.push({ abbreviation: p.label, count: matches.length, suggestion: p.fix });
    }
  }
  return issues;
}

/**
 * Scan seluruh konten khutbah untuk singkatan
 */
export function scanKhutbahForAbbreviations(khutbah) {
  let fullText = khutbah.title + ' ' + khutbah.summary + ' ';
  const blocks = [...(khutbah.firstKhutbah || []), ...(khutbah.secondKhutbah || [])];
  for (const b of blocks) {
    if (b.text) fullText += b.text + ' ';
    if (b.translation) fullText += b.translation + ' ';
    if (b.ref) fullText += b.ref + ' ';
  }
  for (const r of (khutbah.references || [])) fullText += r + ' ';
  return detectAbbreviations(fullText);
}

/**
 * Deteksi placeholder dan konten belum selesai
 */
export function detectPlaceholders(text) {
  const patterns = [
    /lorem ipsum/i,
    /\bTODO\b/,
    /coming soon/i,
    /isi khutbah di sini/i,
    /kalimat belum lengkap/i,
    /\[.*\.\.\.\]/,
    /\.\.\.\s*$/,
  ];
  const issues = [];
  for (const p of patterns) {
    if (p.test(text)) issues.push(p.source);
  }
  return issues;
}

/**
 * Deteksi duplikasi judul atau slug di dalam list
 */
export function detectDuplicates(khutbahList) {
  const titleMap = {};
  const slugMap = {};
  const duplicates = [];

  for (const k of khutbahList) {
    const titleLower = k.title.toLowerCase().trim();
    const slug = k.slug;

    if (titleMap[titleLower]) {
      duplicates.push({ type: 'title', value: k.title, ids: [titleMap[titleLower], k.id] });
    } else {
      titleMap[titleLower] = k.id;
    }

    if (slugMap[slug]) {
      duplicates.push({ type: 'slug', value: slug, ids: [slugMap[slug], k.id] });
    } else {
      slugMap[slug] = k.id;
    }
  }
  return duplicates;
}

/**
 * Deteksi kemiripan judul (fuzzy) — cek apakah tema sudah ada
 */
export function isSimilarTitle(newTitle, existingTitles, threshold = 0.6) {
  const normalize = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const newWords = new Set(normalize(newTitle).split(/\s+/));

  for (const existing of existingTitles) {
    const existWords = new Set(normalize(existing).split(/\s+/));
    const intersection = [...newWords].filter(w => existWords.has(w));
    const union = new Set([...newWords, ...existWords]);
    const similarity = intersection.length / union.size;
    if (similarity >= threshold) return { similar: true, existingTitle: existing, similarity: Math.round(similarity * 100) };
  }
  return { similar: false };
}

/**
 * Validasi lengkap satu khutbah — mengembalikan semua masalah
 */
export function validateKhutbah(khutbah) {
  const issues = [];

  // 1. Cek struktur dasar
  if (!khutbah.title) issues.push({ severity: 'error', message: 'Judul kosong' });
  if (!khutbah.slug) issues.push({ severity: 'error', message: 'Slug kosong' });
  if (!khutbah.summary) issues.push({ severity: 'error', message: 'Summary kosong' });
  if (!khutbah.category) issues.push({ severity: 'error', message: 'Kategori belum dipilih' });

  // 2. Cek khutbah pertama
  if (!khutbah.firstKhutbah || khutbah.firstKhutbah.length === 0) {
    issues.push({ severity: 'error', message: 'Khutbah pertama kosong' });
  } else {
    const hasOpening = khutbah.firstKhutbah.some(b => b.type === 'opening');
    const hasClosing = khutbah.firstKhutbah.some(b => b.type === 'closing');
    const hasDalil = khutbah.firstKhutbah.some(b => b.type === 'quran' || b.type === 'hadith');
    if (!hasOpening) issues.push({ severity: 'warning', message: 'Khutbah pertama tidak memiliki pembukaan (mukaddimah)' });
    if (!hasClosing) issues.push({ severity: 'warning', message: 'Khutbah pertama tidak memiliki penutup' });
    if (!hasDalil) issues.push({ severity: 'warning', message: 'Khutbah pertama tidak memiliki dalil (ayat/hadis)' });
  }

  // 3. Cek khutbah kedua
  if (!khutbah.secondKhutbah || khutbah.secondKhutbah.length === 0) {
    issues.push({ severity: 'warning', message: 'Khutbah kedua kosong' });
  }

  // 4. Cek doa
  if (!khutbah.dua) issues.push({ severity: 'warning', message: 'Doa penutup kosong' });

  // 5. Cek panjang konten
  const lengthCheck = isContentTooShort(khutbah);
  if (lengthCheck.tooShort) {
    issues.push({ severity: 'warning', message: `Konten terlalu pendek (${lengthCheck.wordCount} kata, minimal ${lengthCheck.minRequired}). Estimasi: ${lengthCheck.estimatedMinutes} menit` });
  }

  // 6. Cek singkatan
  const abbrevs = scanKhutbahForAbbreviations(khutbah);
  for (const a of abbrevs) {
    issues.push({ severity: 'error', message: `Ditemukan singkatan "${a.abbreviation}" (${a.count}x). Gunakan: ${a.suggestion}` });
  }

  // 7. Cek placeholder
  let allText = khutbah.title + ' ' + khutbah.summary + ' ';
  const blocks = [...(khutbah.firstKhutbah || []), ...(khutbah.secondKhutbah || [])];
  for (const b of blocks) {
    if (b.text) allText += b.text + ' ';
    if (b.translation) allText += b.translation + ' ';
  }
  const placeholders = detectPlaceholders(allText);
  for (const p of placeholders) {
    issues.push({ severity: 'error', message: `Ditemukan placeholder: "${p}"` });
  }

  return {
    valid: issues.filter(i => i.severity === 'error').length === 0,
    issues,
    wordCount: countWords(khutbah),
    estimatedMinutes: estimateReadingDuration(khutbah),
  };
}

/**
 * Buat slug dari judul
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}
