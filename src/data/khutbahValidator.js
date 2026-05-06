/**
 * KhutbahQu — Content Validation & Utilities
 * Fungsi-fungsi untuk validasi, estimasi durasi, deteksi duplikasi, dan deteksi singkatan.
 */

const WORDS_PER_MINUTE = 110; // Tempo baca khutbah (lambat, dengan jeda dan penghayatan)
const MIN_WORD_COUNT = 1200;  // ~11 menit minimum
const IDEAL_WORD_COUNT = 1500; // ~14 menit ideal

/** Status konten */
export const CONTENT_STATUS = {
  DRAFT: 'draft',
  REVIEW: 'review',
  PUBLISHED: 'published',
};

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
 * Deteksi apakah konten terlalu pendek untuk dibacakan (< 11 menit)
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
 * Deteksi apakah khutbah memiliki minimal 1 ayat Al-Qur'an
 */
export function hasQuranVerse(khutbah) {
  const blocks = [...(khutbah.firstKhutbah || []), ...(khutbah.secondKhutbah || [])];
  return blocks.some(b => b.type === 'quran');
}

/**
 * Deteksi apakah khutbah memiliki minimal 1 hadis
 */
export function hasHadith(khutbah) {
  const blocks = [...(khutbah.firstKhutbah || []), ...(khutbah.secondKhutbah || [])];
  return blocks.some(b => b.type === 'hadith');
}

/**
 * Deteksi konten bertema maulid (dilarang)
 */
export function hasMaulidContent(khutbah) {
  const maulidPatterns = [/\bmaulid\b/i, /\bmilad\s*nabi\b/i, /\bperayaan\s*maulid\b/i];
  let text = (khutbah.title || '') + ' ' + (khutbah.summary || '') + ' ' + (khutbah.category || '');
  for (const tag of (khutbah.tags || [])) text += ' ' + tag;
  return maulidPatterns.some(p => p.test(text));
}

/**
 * Auto-determine status berdasarkan validasi
 */
export function getAutoStatus(khutbah) {
  const words = countWords(khutbah);
  const blocks = [...(khutbah.firstKhutbah || []), ...(khutbah.secondKhutbah || [])];
  const hasSecond = (khutbah.secondKhutbah || []).length > 0;
  const hasDua = !!khutbah.dua;
  const hasQuran = blocks.some(b => b.type === 'quran');
  const hasHadis = blocks.some(b => b.type === 'hadith');
  const abbrevs = scanKhutbahForAbbreviations(khutbah);

  if (words < MIN_WORD_COUNT || !hasSecond || !hasDua || !hasQuran || !hasHadis || abbrevs.length > 0) {
    return words < 600 ? CONTENT_STATUS.DRAFT : CONTENT_STATUS.REVIEW;
  }
  return khutbah.status || CONTENT_STATUS.PUBLISHED;
}

/**
 * Hitung jumlah khutbah per kategori
 */
export function countByCategory(khutbahList) {
  const counts = {};
  for (const k of khutbahList) {
    counts[k.category] = (counts[k.category] || 0) + 1;
  }
  return counts;
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
    if (!hasOpening) issues.push({ severity: 'warning', message: 'Khutbah pertama tidak memiliki pembukaan (mukaddimah)' });
    if (!hasClosing) issues.push({ severity: 'warning', message: 'Khutbah pertama tidak memiliki penutup' });
  }

  // 3. Cek dalil
  if (!hasQuranVerse(khutbah)) {
    issues.push({ severity: 'error', message: 'Tidak ada ayat Al-Qur\'an. Minimal 1 ayat wajib ada.' });
  }
  if (!hasHadith(khutbah)) {
    issues.push({ severity: 'error', message: 'Tidak ada hadis. Minimal 1 hadis shahih/hasan wajib ada.' });
  }

  // 4. Cek khutbah kedua
  if (!khutbah.secondKhutbah || khutbah.secondKhutbah.length === 0) {
    issues.push({ severity: 'error', message: 'Khutbah kedua kosong — wajib ada' });
  }

  // 5. Cek doa
  if (!khutbah.dua) issues.push({ severity: 'error', message: 'Doa penutup kosong — wajib ada' });

  // 6. Cek panjang konten
  const lengthCheck = isContentTooShort(khutbah);
  if (lengthCheck.tooShort) {
    issues.push({ severity: 'error', message: `Konten terlalu pendek (${lengthCheck.wordCount} kata, minimal ${lengthCheck.minRequired}). Estimasi: ${lengthCheck.estimatedMinutes} menit` });
  }

  // 7. Cek singkatan
  const abbrevs = scanKhutbahForAbbreviations(khutbah);
  for (const a of abbrevs) {
    issues.push({ severity: 'error', message: `Ditemukan singkatan "${a.abbreviation}" (${a.count}x). Gunakan: ${a.suggestion}` });
  }

  // 8. Cek placeholder
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

  // 9. Cek maulid
  if (hasMaulidContent(khutbah)) {
    issues.push({ severity: 'error', message: 'Konten bertema Maulid terdeteksi — tidak diperbolehkan' });
  }

  return {
    valid: issues.filter(i => i.severity === 'error').length === 0,
    issues,
    wordCount: countWords(khutbah),
    estimatedMinutes: estimateReadingDuration(khutbah),
    autoStatus: getAutoStatus(khutbah),
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
