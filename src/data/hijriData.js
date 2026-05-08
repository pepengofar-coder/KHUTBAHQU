/**
 * Hijri Calendar Utilities
 * Approximate Hijri date calculation (Kuwaiti algorithm)
 */

const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi'ul Awal", "Rabi'ul Akhir",
  'Jumadal Ula', 'Jumadal Akhirah', 'Rajab', "Sya'ban",
  'Ramadan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'
];

const ISLAMIC_EVENTS = [
  { name: '1 Muharram (Tahun Baru Hijriah)', month: 1, day: 1, theme: 'muharram' },
  { name: 'Hari Asyura', month: 1, day: 10, theme: 'muharram' },
  { name: 'Maulid Nabi Muhammad SAW', month: 3, day: 12, theme: 'maulid' },
  { name: "Isra' Mi'raj", month: 7, day: 27, theme: 'ibadah' },
  { name: 'Nuzulul Quran', month: 9, day: 17, theme: 'ramadan' },
  { name: 'Awal Ramadan', month: 9, day: 1, theme: 'ramadan' },
  { name: 'Lailatul Qadr (perkiraan)', month: 9, day: 27, theme: 'ramadan' },
  { name: 'Idul Fitri', month: 10, day: 1, theme: 'gratitude' },
  { name: 'Puasa Arafah', month: 12, day: 9, theme: 'hajj' },
  { name: 'Idul Adha', month: 12, day: 10, theme: 'qurban' },
];

export function gregorianToHijri(gDate) {
  try {
    const d = new Date(gDate);
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(d);
    const day = parseInt(parts.find(p => p.type === 'day').value, 10);
    const month = parseInt(parts.find(p => p.type === 'month').value, 10);
    const yearStr = parts.find(p => p.type === 'year').value;
    const year = parseInt(yearStr.replace(/\D/g, ''), 10);
    return { year, month, day };
  } catch (e) {
    const d = new Date(gDate);
    const y = d.getFullYear(), m = d.getMonth(), day = d.getDate();
    let jd = Math.floor((1461 * (y + 4800 + Math.floor((m - 13) / 12))) / 4)
      + Math.floor((367 * (m - 1 - 12 * Math.floor((m - 13) / 12))) / 12)
      - Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 13) / 12)) / 100)) / 4)
      + day - 32075;
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719)
      + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
      - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const hm = Math.floor((24 * l3) / 709);
    const hd = l3 - Math.floor((709 * hm) / 24);
    const hy = 30 * n + j - 30;
    return { year: hy, month: hm, day: hd };
  }
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
    1: ['muharram', 'taqwa'], 2: ['patience', 'akhlak'],
    3: ['maulid', 'akhlak'], 4: ['ibadah', 'social'],
    5: ['gratitude', 'family'], 6: ['patience', 'youth'],
    7: ['ibadah', 'taqwa'], 8: ['ramadan', 'taqwa'],
    9: ['ramadan', 'ibadah'], 10: ['gratitude', 'social'],
    11: ['hajj', 'ibadah'], 12: ['hajj', 'qurban'],
  };
  return map[hijriMonth] || ['taqwa', 'ibadah'];
}

export const HIJRI_DISCLAIMER = 'Tanggal Hijriah bersifat perkiraan dan dapat berbeda tergantung rukyatul hilal atau penetapan pemerintah setempat.';

export { HIJRI_MONTHS, ISLAMIC_EVENTS };
