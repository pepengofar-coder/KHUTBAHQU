/**
 * Qibla API Service for Islamediaku
 * Computes Qibla direction based on GPS coordinates using AlAdhan API with local trigonometric fallback.
 */

import { Coordinate } from './prayerApi.types';

export interface QiblaDirectionResponse {
  latitude: number;
  longitude: number;
  direction: number; // Degrees from North (clockwise)
}

/**
 * Fetches the Qibla direction for coordinates from the Aladhan API
 */
export async function getQiblaDirection(coords: Coordinate): Promise<QiblaDirectionResponse> {
  console.log(`[qiblaApi] Fetching Qibla direction for: ${coords.latitude}, ${coords.longitude}`);
  
  const cacheKey = `islamediaku_qibla_${coords.latitude.toFixed(4)}_${coords.longitude.toFixed(4)}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && Date.now() - parsed.timestamp < 30 * 24 * 60 * 60 * 1000) { // 30 days cache
        return parsed.data;
      }
    } catch (_) {}
  }

  try {
    const response = await fetch(`https://api.aladhan.com/v1/qibla/${coords.latitude}/${coords.longitude}`);
    if (!response.ok) throw new Error('Qibla API returned error');
    const result = await response.json();
    if (result.data && typeof result.data.direction === 'number') {
      const data: QiblaDirectionResponse = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        direction: result.data.direction
      };
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      return data;
    }
    throw new Error('Invalid response structure');
  } catch (error) {
    console.warn('[qiblaApi] Failed to fetch live Qibla direction, computing offline approximation:', error);
    
    // Mathematical approximation for Qibla direction from latitude/longitude (Kaaba is at 21.4225° N, 39.8262° E)
    const latRad = coords.latitude * Math.PI / 180;
    const lonRad = coords.longitude * Math.PI / 180;
    const kaabaLatRad = 21.4225 * Math.PI / 180;
    const kaabaLonRad = 39.8262 * Math.PI / 180;
    
    const y = Math.sin(kaabaLonRad - lonRad);
    const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(kaabaLonRad - lonRad);
    let qiblaRad = Math.atan2(y, x);
    let qiblaDeg = qiblaRad * 180 / Math.PI;
    if (qiblaDeg < 0) qiblaDeg += 360;
    
    const data: QiblaDirectionResponse = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      direction: qiblaDeg
    };
    return data;
  }
}
