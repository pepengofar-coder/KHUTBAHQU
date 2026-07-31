import { useEffect, useRef, useState, useCallback } from 'react';

const ADZAN_URL = 'https://s3.eu-west-2.amazonaws.com/islamic-network/makkah.mp3';

export function useAdzanAlarm() {
  const [adzanEnabled, setAdzanEnabled] = useState(() => localStorage.getItem('kq_adzan_enabled') === '1');
  const [timings, setTimings] = useState(null);
  const [locationLabel, setLocationLabel] = useState(() => localStorage.getItem('kq_gps_label') || 'Lokasi Terdeteksi');
  const [locationMode, setLocationMode] = useState('detecting'); // 'gps' | 'manual' | 'detecting'
  const audioRef = useRef(null);
  const lastAlarmRef = useRef(localStorage.getItem('kq_last_alarm') || '');

  // Initialize audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(ADZAN_URL);
    }
  }, []);

  // Request Notification Permission
  useEffect(() => {
    if (adzanEnabled && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [adzanEnabled]);

  // GPS Location & Prayer Timings Fetcher
  const fetchPrayerTimes = useCallback(async () => {
    if (!adzanEnabled) return;
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    const fetchByCoords = async (lat, lon, labelName) => {
      try {
        const r = await fetch(`https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lon}&method=11`);
        const data = await r.json();
        if (data?.data?.timings) {
          setTimings(data.data.timings);
          setLocationLabel(labelName);
          setLocationMode('gps');
          localStorage.setItem('kq_gps_lat', lat);
          localStorage.setItem('kq_gps_lon', lon);
          localStorage.setItem('kq_gps_label', labelName);
        }
      } catch (err) {
        console.error("Failed to fetch timings by GPS", err);
      }
    };

    const fetchFallback = async () => {
      try {
        const city = localStorage.getItem('kq_prayer_city') || 'Jakarta';
        const cities = {
          Jakarta: [-6.2088, 106.8456],
          Surabaya: [-7.2575, 112.7521],
          Bandung: [-6.9175, 107.6191],
          Medan: [3.5952, 98.6722],
          Semarang: [-6.9667, 110.4167],
          Makassar: [-5.1477, 119.4327],
          Yogyakarta: [-7.7956, 110.3695],
        };
        const [lat, lon] = cities[city] || cities.Jakarta;
        const r = await fetch(`https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lon}&method=11`);
        const data = await r.json();
        if (data?.data?.timings) {
          setTimings(data.data.timings);
          setLocationLabel(city);
          setLocationMode('manual');
        }
      } catch (err) {
        console.error("Failed fallback prayer timings fetch", err);
      }
    };

    // Try Navigator Geolocation (Active GPS)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
          let label = 'GPS Anda';
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=id`);
            const geoData = await res.json();
            label = geoData.address?.city || geoData.address?.town || geoData.address?.county || 'GPS Anda';
          } catch {
            label = 'GPS Anda';
          }
          await fetchByCoords(lat, lon, label);
        },
        async (err) => {
          console.warn("GPS Permission / Detection failed, using cached or fallback city", err);
          // Check cached GPS coords
          const cachedLat = localStorage.getItem('kq_gps_lat');
          const cachedLon = localStorage.getItem('kq_gps_lon');
          const cachedLabel = localStorage.getItem('kq_gps_label');
          if (cachedLat && cachedLon) {
            await fetchByCoords(cachedLat, cachedLon, cachedLabel || 'GPS (Cached)');
          } else {
            await fetchFallback();
          }
        },
        { timeout: 7000, maximumAge: 300000 }
      );
    } else {
      await fetchFallback();
    }
  }, [adzanEnabled]);

  // Initial & Midnight refetch
  useEffect(() => {
    fetchPrayerTimes();

    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 1, 0) - now;
    const timer = setTimeout(fetchPrayerTimes, msUntilMidnight);
    return () => clearTimeout(timer);
  }, [fetchPrayerTimes]);

  // Real-time alarm ticker (checks every 5 seconds)
  useEffect(() => {
    if (!adzanEnabled || !timings) return;

    const PRAYER_LABELS = {
      Fajr: 'Subuh',
      Dhuhr: 'Dzuhur',
      Asr: 'Ashar',
      Maghrib: 'Maghrib',
      Isha: 'Isya'
    };

    const interval = setInterval(() => {
      const now = new Date();
      const currentH = String(now.getHours()).padStart(2, '0');
      const currentM = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${currentH}:${currentM}`;

      const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

      for (const p of PRAYERS) {
        const rawTime = timings[p];
        if (rawTime) {
          const cleanTime = rawTime.substring(0, 5);
          if (cleanTime === timeStr) {
            const alarmKey = `${now.toISOString().split('T')[0]}_${p}`;
            if (lastAlarmRef.current !== alarmKey) {
              lastAlarmRef.current = alarmKey;
              localStorage.setItem('kq_last_alarm', alarmKey);

              // Play Adhan Audio
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.log('Audio autoplay blocked by browser', e));
              }

              // Show Browser Push Notification
              if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                const label = PRAYER_LABELS[p] || p;
                new Notification(`Waktu Sholat ${label} Telah Tiba 🕌`, {
                  body: `Waktu sholat ${label} telah masuk untuk wilayah ${locationLabel}. Mari tunaikan ibadah tepat waktu.`,
                  icon: '/icon-192.png',
                  tag: alarmKey,
                });
              }
            }
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [adzanEnabled, timings, locationLabel]);

  const toggleAdzan = () => {
    const next = !adzanEnabled;
    setAdzanEnabled(next);
    localStorage.setItem('kq_adzan_enabled', next ? '1' : '0');
    if (next) {
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      fetchPrayerTimes();
    }
  };

  return { adzanEnabled, toggleAdzan, timings, locationLabel, locationMode, fetchPrayerTimes };
}
