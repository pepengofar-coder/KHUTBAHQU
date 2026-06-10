/**
 * Hijri Calendar API Service for Islamediaku
 * Fetches and converts Hijri dates using AlAdhan / MyQuran endpoints.
 */

export interface HijriDateInfo {
  hijriDate: string; // e.g., "15 Dzulqa'dah 1447"
  day: string;
  monthNumber: number;
  monthEn: string;
  monthAr: string;
  year: string;
  gregorianDate: string;
}

/**
 * Converts a Gregorian date to Hijri date info
 */
export async function convertToHijri(date: Date): Promise<HijriDateInfo> {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();

  const cacheKey = `islamediaku_hijri_${y}-${m}-${d}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) { // 24 hours cache
        return parsed.data;
      }
    } catch (_) {}
  }

  console.log(`[hijriApi] Converting ${d}-${m}-${y} to Hijri`);
  try {
    const response = await fetch(`https://api.aladhan.com/v1/gregorianToHijri/${d}-${m}-${y}`);
    if (!response.ok) throw new Error('API responded with error');
    const result = await response.json();
    if (result.data && result.data.hijri) {
      const h = result.data.hijri;
      // Map Arabic hijri months to Indonesian commonly accepted spelling
      const indonesianMonths: Record<string, string> = {
        'Muharram': 'Muharram',
        'Safar': 'Safar',
        'Rabi\' al-awwal': 'Rabiul Awal',
        'Rabi\' ath-thani': 'Rabiul Akhir',
        'Jumada al-ula': 'Jumadil Awal',
        'Jumada al-akhirah': 'Jumadil Akhir',
        'Rajab': 'Rajab',
        'Sha\'ban': 'Sya\'ban',
        'Ramadan': 'Ramadhan',
        'Shawwal': 'Syawal',
        'Dhu al-Qi\'dah': 'Dzulqa\'dah',
        'Dhu al-Hijjah': 'Dzulhijjah'
      };

      const monthName = indonesianMonths[h.month.en] || h.month.en;
      const formatted: HijriDateInfo = {
        hijriDate: `${h.day} ${monthName} ${h.year}`,
        day: h.day,
        monthNumber: h.month.number,
        monthEn: h.month.en,
        monthAr: h.month.ar,
        year: h.year,
        gregorianDate: date.toLocaleDateString('id-ID')
      };

      localStorage.setItem(cacheKey, JSON.stringify({ data: formatted, timestamp: Date.now() }));
      return formatted;
    }
    throw new Error('Invalid Hijri API response structure');
  } catch (error) {
    console.error('[hijriApi] Failed to convert date via API, calculating offline estimation:', error);
    
    // Very simple mathematical approximation for offline fallback
    // Based on average Islamic lunar calendar length of 354.367 days
    const baseDate = new Date(622, 6, 16); // 16 July 622 AD is approximate start of Hijri calendar
    const diffTime = Math.abs(date.getTime() - baseDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const hijriYears = Math.floor(diffDays / 354.367);
    const dayOfHijriYear = Math.floor(diffDays % 354.367);
    
    const hijriMonth = Math.floor(dayOfHijriYear / 29.5) + 1;
    const hijriDay = Math.floor(dayOfHijriYear % 29.5) + 1;

    const fallbackMonths = [
      'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 
      'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Sya\'ban', 
      'Ramadhan', 'Syawal', 'Dzulqa\'dah', 'Dzulhijjah'
    ];

    const fallbackMonthsAr = [
      'المحرّم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
      'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
      'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];

    return {
      hijriDate: `${hijriDay} ${fallbackMonths[hijriMonth - 1] || 'Ramadhan'} ${hijriYears}`,
      day: String(hijriDay),
      monthNumber: hijriMonth,
      monthEn: fallbackMonths[hijriMonth - 1] || 'Ramadan',
      monthAr: fallbackMonthsAr[hijriMonth - 1] || 'رمضان',
      year: String(hijriYears),
      gregorianDate: date.toLocaleDateString('id-ID')
    };
  }
}
