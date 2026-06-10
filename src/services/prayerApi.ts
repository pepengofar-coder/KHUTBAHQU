/**
 * Prayer Times API Service for Islamediaku
 * Integrates MyQuran API v3 (priority for Indonesia) and AlAdhan API (global/fallback).
 */

import { Coordinate, PrayerTimes as CommonPrayerTimes } from './prayerApi.types';

const MYQURAN_BASE = 'https://api.myquran.com/v3';
const ALADHAN_BASE = 'https://api.aladhan.com/v1';

export interface City {
  id: string;
  lokasi: string;
}

export interface MyQuranSchedule {
  tanggal: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface MyQuranPrayerResponse {
  id: string;
  lokasi: string;
  daerah: string;
  jadwal: MyQuranSchedule;
}

/**
 * Fetches all Indonesian cities from MyQuran API
 */
export async function getCities(): Promise<City[]> {
  const cacheKey = 'islamediaku_cities_cache';
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.data && Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) { // 7 days cache
        return parsed.data;
      }
    } catch (_) {}
  }

  console.log('[prayerApi] Fetching cities from MyQuran');
  try {
    const response = await fetch(`${MYQURAN_BASE}/sholat/kabkota/semua`);
    if (!response.ok) throw new Error('Failed to load cities');
    const result = await response.json();
    if (result.status && Array.isArray(result.data)) {
      localStorage.setItem(cacheKey, JSON.stringify({ data: result.data, timestamp: Date.now() }));
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('[prayerApi] Error loading cities:', error);
    return [];
  }
}

/**
 * Fetches local Indonesian prayer schedule by city ID and Date
 */
export async function getPrayerSchedule(
  cityId: string,
  date: Date
): Promise<CommonPrayerTimes | null> {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const cacheKey = `islamediaku_prayer_${cityId}_${y}-${m}-${d}`;

  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) { // 24 hours cache
        return parsed.data;
      }
    } catch (_) {}
  }

  console.log(`[prayerApi] Fetching schedule for city ${cityId} on ${y}/${m}/${d}`);
  try {
    const response = await fetch(`${MYQURAN_BASE}/sholat/jadwal/${cityId}/${y}/${m}/${d}`);
    if (!response.ok) throw new Error('Failed to fetch schedule');
    const result = await response.json();
    if (result.status && result.data && result.data.jadwal) {
      const j = result.data.jadwal;
      const formatted: CommonPrayerTimes = {
        Fajr: j.subuh,
        Sunrise: j.terbit,
        Dhuhr: j.dzuhur,
        Asr: j.ashar,
        Sunset: j.maghrib, // Approximation
        Maghrib: j.maghrib,
        Isha: j.isya,
        Imsak: j.imsak,
        Midnight: '00:00' // Approximation fallback
      };
      localStorage.setItem(cacheKey, JSON.stringify({ data: formatted, timestamp: Date.now() }));
      return formatted;
    }
    return null;
  } catch (error) {
    console.error('[prayerApi] Error getting prayer schedule from MyQuran:', error);
    return null;
  }
}

/**
 * Fetches prayer times from AlAdhan API (Used as global coordinate-based fallback)
 */
export async function getPrayerTimesByCoords(
  coords: Coordinate,
  date: Date
): Promise<CommonPrayerTimes | null> {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();

  const cacheKey = `islamediaku_prayer_gps_${coords.latitude.toFixed(4)}_${coords.longitude.toFixed(4)}_${y}-${m}-${d}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
        return parsed.data;
      }
    } catch (_) {}
  }

  console.log(`[prayerApi] Fetching AlAdhan schedule for GPS: ${coords.latitude}, ${coords.longitude}`);
  try {
    const response = await fetch(
      `${ALADHAN_BASE}/timings/${d}-${m}-${y}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=11`
    );
    if (!response.ok) throw new Error('AlAdhan response was not ok');
    const result = await response.json();
    if (result.data && result.data.timings) {
      const t = result.data.timings;
      const formatted: CommonPrayerTimes = {
        Fajr: t.Fajr,
        Sunrise: t.Sunrise,
        Dhuhr: t.Dhuhr,
        Asr: t.Asr,
        Sunset: t.Sunset,
        Maghrib: t.Maghrib,
        Isha: t.Isha,
        Imsak: t.Imsak,
        Midnight: t.Midnight || '00:00'
      };
      localStorage.setItem(cacheKey, JSON.stringify({ data: formatted, timestamp: Date.now() }));
      return formatted;
    }
    return null;
  } catch (error) {
    console.error('[prayerApi] Error getting prayer times by coordinates:', error);
    return null;
  }
}

/**
 * Helper to calculate the next prayer time from the current schedule
 */
export function getNextPrayerTime(schedule: CommonPrayerTimes, date: Date): { key: string; timeStr: string } {
  const prayers = [
    { key: 'Fajr', label: 'Subuh' },
    { key: 'Dhuhr', label: 'Dzuhur' },
    { key: 'Asr', label: 'Ashar' },
    { key: 'Maghrib', label: 'Maghrib' },
    { key: 'Isha', label: 'Isya' }
  ];

  const parseTimeToDate = (timeStr: string, baseDate: Date) => {
    const [h, min] = timeStr.split(':').map(Number);
    const d = new Date(baseDate);
    d.setHours(h, min, 0, 0);
    return d;
  };

  const now = new Date(date);
  
  // Find the first prayer today that is in the future
  for (const p of prayers) {
    const pTime = parseTimeToDate(schedule[p.key as keyof CommonPrayerTimes], now);
    if (pTime > now) {
      return { key: p.key, timeStr: schedule[p.key as keyof CommonPrayerTimes] };
    }
  }

  // If all prayers today have passed, the next prayer is Fajr tomorrow
  return { key: 'Fajr', timeStr: schedule.Fajr };
}
