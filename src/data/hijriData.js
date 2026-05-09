/**
 * Hijri Calendar Utilities
 * Approximate Hijri date calculation (Kuwaiti algorithm)
 */

export const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi'ul Awal", "Rabi'ul Akhir",
  'Jumadal Ula', 'Jumadal Akhirah', 'Rajab', "Sya'ban",
  'Ramadan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'
];

export const ISLAMIC_EVENTS = [
  { name: '1 Muharram (Tahun Baru Hijriah)', month: 1,  day: 1,  theme: 'muharram', type: 'event' },
  { name: 'Hari Asyura',                     month: 1,  day: 10, theme: 'muharram', type: 'event' },
  { name: "Maulid Nabi Muhammad ﷺ",          month: 3,  day: 12, theme: 'maulid',   type: 'event' },
  { name: "Isra' Mi'raj",                    month: 7,  day: 27, theme: 'ibadah',   type: 'event' },
  { name: 'Awal Ramadan',                    month: 9,  day: 1,  theme: 'ramadan',  type: 'event' },
  { name: 'Nuzulul Quran',                   month: 9,  day: 17, theme: 'ramadan',  type: 'event' },
  { name: 'Lailatul Qadr (perkiraan)',        month: 9,  day: 27, theme: 'ramadan',  type: 'event' },
  { name: 'Idul Fitri',                      month: 10, day: 1,  theme: 'gratitude',type: 'event' },
  { name: 'Puasa Arafah',                    month: 12, day: 9,  theme: 'hajj',     type: 'fast' },
  { name: 'Idul Adha',                       month: 12, day: 10, theme: 'qurban',   type: 'event' },
];

/**
 * PUASA-PUASA SUNNAH
 * Berisi: jenis puasa, hari Hijriah spesifik atau pola (Senin/Kamis, Ayyamul Bidh, dll)
 */
export const SUNNAH_FASTS = [
  // ── Puasa berdasarkan tanggal Hijriah ──────────────────────
  {
    id: 'aasyura',
    name: 'Puasa Asyura',
    icon: '🌙',
    color: '#7C3AED',
    month: 1,
    days: [9, 10], // 9 Tasyua + 10 Asyura (dianjurkan keduanya)
    dalil: 'HR. Muslim no. 1162',
    description: 'Puasa pada 9 dan 10 Muharram. Menghapus dosa setahun yang lalu.',
    type: 'date',
  },
  {
    id: 'arafah',
    name: 'Puasa Arafah',
    icon: '⛰️',
    color: '#059669',
    month: 12,
    days: [9],
    dalil: 'HR. Muslim no. 1162',
    description: 'Puasa pada 9 Dzulhijjah. Menghapus dosa dua tahun (tahun lalu & tahun depan).',
    type: 'date',
  },
  {
    id: 'syawal6',
    name: 'Puasa 6 Hari Syawal',
    icon: '🌟',
    color: '#D97706',
    month: 10,
    days: [2, 3, 4, 5, 6, 7], // lazimnya 2–7 Syawal (tidak harus berurutan)
    dalil: 'HR. Muslim no. 1164',
    description: 'Enam hari di bulan Syawal setelah Idul Fitri. Pahalanya seperti puasa setahun penuh.',
    type: 'date',
  },
  {
    id: 'rajab',
    name: 'Puasa Rajab',
    icon: '✨',
    color: '#0EA5E9',
    month: 7,
    days: [1],
    dalil: 'Bulan haram (dimuliakan)',
    description: 'Puasa di bulan Rajab adalah salah satu bulan haram yang dimuliakan Allah.',
    type: 'date',
  },
  {
    id: 'syaban',
    name: "Puasa Sya'ban (Nisfu Sya'ban)",
    icon: '🌕',
    color: '#8B5CF6',
    month: 8,
    days: [15],
    dalil: 'HR. Nasa\'i',
    description: "Puasa di pertengahan Sya'ban (15 Sya'ban). Malam yang penuh keberkahan.",
    type: 'date',
  },
  // ── Puasa berulang mingguan ────────────────────────────────
  {
    id: 'senin_kamis',
    name: 'Puasa Senin & Kamis',
    icon: '📅',
    color: '#0F3D2E',
    dalil: 'HR. Tirmidzi no. 747',
    description: 'Amalan diangkat kepada Allah pada hari Senin dan Kamis. Nabi ﷺ rutin berpuasa pada dua hari ini.',
    type: 'weekly',
    weekdays: [1, 4], // 0=Ahad, 1=Senin, 4=Kamis
  },
  // ── Puasa Ayyamul Bidh (13, 14, 15 setiap bulan) ──────────
  {
    id: 'ayyamul_bidh',
    name: 'Puasa Ayyamul Bidh',
    icon: '🌔',
    color: '#F59E0B',
    dalil: 'HR. Nasa\'i no. 2420',
    description: 'Puasa pada 13, 14, dan 15 setiap bulan Hijriah. Pahalanya seperti puasa sepanjang masa.',
    type: 'monthly',
    monthDays: [13, 14, 15],
  },
  // ── Puasa Daud ─────────────────────────────────────────────
  {
    id: 'daud',
    name: 'Puasa Daud',
    icon: '⚖️',
    color: '#6366F1',
    dalil: 'HR. Bukhari no. 1979',
    description: 'Puasa selang-seling: sehari puasa, sehari berbuka. Puasa yang paling dicintai Allah.',
    type: 'info', // tampilkan hanya sebagai info, tidak di kalender
  },
];

// ── Gregorian ↔ Hijri ────────────────────────────────────────
export function gregorianToHijri(gDate) {
  try {
    const d = new Date(gDate);
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'numeric', year: 'numeric'
    });
    const parts = formatter.formatToParts(d);
    const day   = parseInt(parts.find(p => p.type === 'day').value, 10);
    const month = parseInt(parts.find(p => p.type === 'month').value, 10);
    const year  = parseInt(parts.find(p => p.type === 'year').value.replace(/\D/g, ''), 10);
    return { year, month, day };
  } catch {
    const d = new Date(gDate);
    const y = d.getFullYear(), m = d.getMonth(), day = d.getDate();
    let jd = Math.floor((1461 * (y + 4800 + Math.floor((m - 13) / 12))) / 4)
      + Math.floor((367 * (m - 1 - 12 * Math.floor((m - 13) / 12))) / 12)
      - Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 13) / 12)) / 100)) / 4)
      + day - 32075;
    const l  = jd - 1948440 + 10632;
    const n  = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j  = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719)
             + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
             - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const hm = Math.floor((24 * l3) / 709);
    const hd = l3 - Math.floor((709 * hm) / 24);
    const hy = 30 * n + j - 30;
    return { year: hy, month: hm, day: hd };
  }
}

/** Perkiraan konversi Hijri → Gregorian (±1–2 hari) */
export function hijriToGregorian(hYear, hMonth, hDay) {
  // Approximate using epoch offset
  const N = hDay + Math.ceil(29.5001 * (hMonth - 1))
    + (hYear - 1) * 354
    + Math.floor((3 + 11 * hYear) / 30);
  const JD = N + 1948440 - 385;
  const L  = JD + 68569;
  const n  = Math.floor((4 * L) / 146097);
  const l2 = L - Math.floor((146097 * n + 3) / 4);
  const i  = Math.floor((4000 * (l2 + 1)) / 1461001);
  const l3 = l2 - Math.floor((1461 * i) / 4) + 31;
  const j  = Math.floor((80 * l3) / 2447);
  const day   = l3 - Math.floor((2447 * j) / 80);
  const l4    = Math.floor(j / 11);
  const month = j + 2 - 12 * l4;
  const year  = 100 * (n - 49) + i + l4;
  return new Date(year, month - 1, day);
}

export function getHijriDateString(gDate = new Date()) {
  const h = gregorianToHijri(gDate);
  return `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} H`;
}

export function getHijriMonthName(monthNum) {
  return HIJRI_MONTHS[monthNum - 1] || '';
}

export function getUpcomingEvents(gDate = new Date()) {
  const h = gregorianToHijri(gDate);
  const currentDayOfYear = (h.month - 1) * 30 + h.day;
  return ISLAMIC_EVENTS.map(evt => {
    const evtDay = (evt.month - 1) * 30 + evt.day;
    let diff = evtDay - currentDayOfYear;
    if (diff < 0) diff += 354;
    return { ...evt, daysUntil: diff };
  }).sort((a, b) => a.daysUntil - b.daysUntil);
}

export function getRecommendedThemes(hijriMonth) {
  const map = {
    1:  ['muharram', 'taqwa'], 2:  ['patience', 'akhlak'],
    3:  ['maulid',   'akhlak'],4:  ['ibadah',   'social'],
    5:  ['gratitude','family'],6:  ['patience', 'youth'],
    7:  ['ibadah',   'taqwa'], 8:  ['ramadan',  'taqwa'],
    9:  ['ramadan',  'ibadah'],10: ['gratitude','social'],
    11: ['hajj',     'ibadah'],12: ['hajj',     'qurban'],
  };
  return map[hijriMonth] || ['taqwa', 'ibadah'];
}

/**
 * Generate all days of a Gregorian month, annotated with Hijri date + sunnah fast markers
 * @param {number} gYear  - Gregorian year
 * @param {number} gMonth - Gregorian month (0-indexed)
 * @returns {Array} array of day objects
 */
export function buildMonthCalendar(gYear, gMonth) {
  const firstDay  = new Date(gYear, gMonth, 1);
  const daysInMonth = new Date(gYear, gMonth + 1, 0).getDate();
  const startWeekday = firstDay.getDay(); // 0=Sun

  const days = [];

  // Empty slots before first day
  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(gYear, gMonth, d);
    const hijri   = gregorianToHijri(date);
    const weekday = date.getDay();
    const isToday = date.getTime() === today.getTime();

    // Islamic events on this Hijri date
    const events = ISLAMIC_EVENTS.filter(e => e.month === hijri.month && e.day === hijri.day);

    // Sunnah fasts on this day
    const fasts = [];

    for (const sf of SUNNAH_FASTS) {
      if (sf.type === 'date' && sf.month === hijri.month && sf.days.includes(hijri.day)) {
        fasts.push(sf);
      }
      if (sf.type === 'weekly' && sf.weekdays.includes(weekday)) {
        // Exclude Ramadan (month 9) — mandatory fasting already
        if (hijri.month !== 9) fasts.push(sf);
      }
      if (sf.type === 'monthly' && sf.monthDays.includes(hijri.day)) {
        fasts.push(sf);
      }
    }

    days.push({ gDay: d, date, hijri, weekday, isToday, events, fasts });
  }

  return days;
}

export const HIJRI_DISCLAIMER = 'Tanggal Hijriah bersifat perkiraan dan dapat berbeda tergantung rukyatul hilal atau penetapan pemerintah setempat.';
