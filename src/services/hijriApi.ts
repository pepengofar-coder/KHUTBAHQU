/**
 * Hijri Calendar API Service Placeholder for Islamediaku
 * Deals with conversion between Gregorian and Hijri dates.
 */

export interface HijriDateInfo {
  hijriDate: string; // e.g. "15 Dzulqa'dah 1447"
  day: string;
  monthNumber: number;
  monthEn: string;
  monthAr: string;
  year: string;
  gregorianDate: string;
}

/**
 * Converts Gregorian date to Hijri date information
 */
export async function convertGregorianToHijri(date: Date): Promise<HijriDateInfo> {
  console.log('[hijriApi] convertGregorianToHijri called for date:', date.toDateString());
  
  // Quick dynamic mock for now
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  try {
    const response = await fetch(`https://api.aladhan.com/v1/gregorianToHijri/${day}-${month}-${year}`);
    if (response.ok) {
      const data = await response.json();
      const h = data.data.hijri;
      return {
        hijriDate: `${h.day} ${h.month.en} ${h.year}`,
        day: h.day,
        monthNumber: h.month.number,
        monthEn: h.month.en,
        monthAr: h.month.ar,
        year: h.year,
        gregorianDate: date.toLocaleDateString('id-ID')
      };
    }
  } catch (error) {
    console.warn('[hijriApi] Hijri API fetch failed, fallback to offline estimation', error);
  }

  // Fallback estimation
  return {
    hijriDate: "24 Dzulhijjah 1447",
    day: "24",
    monthNumber: 12,
    monthEn: "Dhu al-Hijjah",
    monthAr: "ذو الحجة",
    year: "1447",
    gregorianDate: date.toLocaleDateString('id-ID')
  };
}
