import { useEffect, useRef, useState } from 'react';

const ADZAN_URL = 'https://s3.eu-west-2.amazonaws.com/islamic-network/makkah.mp3';

export function useAdzanAlarm() {
  const [adzanEnabled, setAdzanEnabled] = useState(() => localStorage.getItem('kq_adzan_enabled') === '1');
  const [timings, setTimings] = useState(null);
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
    if (adzanEnabled && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [adzanEnabled]);

  // Fetch today's timings
  useEffect(() => {
    if (!adzanEnabled) return;
    const fetchPrayer = async () => {
      try {
        const d = new Date();
        const city = localStorage.getItem('kq_prayer_city') || 'Jakarta';
        const cities = { Jakarta: [-6.2088, 106.8456], Surabaya: [-7.2575, 112.7521], Bandung: [-6.9175, 107.6191] };
        const [lat, lon] = cities[city] || cities.Jakarta;
        const r = await fetch(`https://api.aladhan.com/v1/timings/${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}?latitude=${lat}&longitude=${lon}&method=11`);
        const data = await r.json();
        setTimings(data.data.timings);
      } catch (err) {
        console.error("Failed to fetch timings for alarm", err);
      }
    };
    fetchPrayer();
    
    // Refetch at midnight
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 1, 0) - now;
    const timer = setTimeout(fetchPrayer, msUntilMidnight);
    return () => clearTimeout(timer);
  }, [adzanEnabled]);

  // Check time every minute
  useEffect(() => {
    if (!adzanEnabled || !timings) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentH = String(now.getHours()).padStart(2, '0');
      const currentM = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${currentH}:${currentM}`;

      const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      
      for (const p of PRAYERS) {
        if (timings[p] === timeStr) {
          const alarmKey = `${now.toISOString().split('T')[0]}_${p}`;
          if (lastAlarmRef.current !== alarmKey) {
            // Trigger alarm
            lastAlarmRef.current = alarmKey;
            localStorage.setItem('kq_last_alarm', alarmKey);
            
            // Play Audio
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log('Audio autoplay blocked', e));

            // Show Notification
            if (Notification.permission === 'granted') {
              new Notification('Waktu Sholat Telah Tiba', {
                body: `Waktu sholat ${p} telah masuk untuk wilayah Anda.`,
                icon: '/icon-192.png'
              });
            }
          }
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [adzanEnabled, timings]);

  const toggleAdzan = () => {
    const next = !adzanEnabled;
    setAdzanEnabled(next);
    localStorage.setItem('kq_adzan_enabled', next ? '1' : '0');
    if (next && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  return { adzanEnabled, toggleAdzan };
}
