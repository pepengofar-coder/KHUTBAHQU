/**
 * Prayer Times API Service Placeholder for Islamediaku
 * Prepared for integration with api.aladhan.com.
 */

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface PrayerData {
  timings: PrayerTimes;
  date: {
    readable: string;
    timestamp: string;
    hijri: {
      date: string;
      day: string;
      month: { number: number; en: string; ar: string };
      year: string;
    };
  };
}

/**
 * Fetches prayer times by latitude and longitude for a given date
 */
export async function getPrayerTimesByCoords(
  coords: Coordinate,
  dateStr: string // DD-MM-YYYY
): Promise<PrayerData | null> {
  console.log(`[prayerApi] getPrayerTimesByCoords called for: ${coords.latitude}, ${coords.longitude} on date ${dateStr}`);
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=11`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[prayerApi] Failed to fetch live prayer times:', error);
    return null;
  }
}
