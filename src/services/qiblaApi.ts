/**
 * Qibla API Service Placeholder for Islamediaku
 * Deals with computing direction of Qibla from a set of coordinates.
 */

import { Coordinate } from './prayerApi';

export interface QiblaDirectionResponse {
  latitude: number;
  longitude: number;
  direction: number; // Degrees from North (clockwise)
}

/**
 * Fetches the Qibla direction for a set of coordinates from the Aladhan Qibla endpoint
 */
export async function getQiblaDirection(coords: Coordinate): Promise<QiblaDirectionResponse | null> {
  console.log(`[qiblaApi] getQiblaDirection called for: ${coords.latitude}, ${coords.longitude}`);
  try {
    const response = await fetch(`https://api.aladhan.com/v1/qibla/${coords.latitude}/${coords.longitude}`);
    if (!response.ok) throw new Error('Qibla API responded with error');
    const data = await response.json();
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      direction: data.data.direction
    };
  } catch (error) {
    console.error('[qiblaApi] Failed to fetch live Qibla direction, computing offline approximation:', error);
    
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
    
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      direction: qiblaDeg
    };
  }
}
