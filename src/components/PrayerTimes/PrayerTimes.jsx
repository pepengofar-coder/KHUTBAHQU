import { useState, useEffect, useCallback, useRef } from 'react';
import './PrayerTimes.css';

const INDONESIAN_CITIES = [
  { name: 'Jakarta', lat: -6.2088, lon: 106.8456 },
  { name: 'Surabaya', lat: -7.2575, lon: 112.7521 },
  { name: 'Bandung', lat: -6.9175, lon: 107.6191 },
  { name: 'Medan', lat: 3.5952, lon: 98.6722 },
  { name: 'Semarang', lat: -6.9667, lon: 110.4167 },
  { name: 'Makassar', lat: -5.1477, lon: 119.4327 },
  { name: 'Palembang', lat: -2.9761, lon: 104.7754 },
  { name: 'Tangerang', lat: -6.1783, lon: 106.63 },
  { name: 'Depok', lat: -6.4025, lon: 106.7942 },
  { name: 'Bekasi', lat: -6.2349, lon: 106.9896 },
  { name: 'Bogor', lat: -6.5971, lon: 106.806 },
  { name: 'Yogyakarta', lat: -7.7956, lon: 110.3695 },
  { name: 'Malang', lat: -7.9666, lon: 112.6326 },
  { name: 'Denpasar', lat: -8.6705, lon: 115.2126 },
  { name: 'Aceh', lat: 5.5483, lon: 95.3238 },
  { name: 'Padang', lat: -0.9492, lon: 100.3543 },
  { name: 'Pekanbaru', lat: 0.5335, lon: 101.45 },
  { name: 'Batam', lat: 1.1301, lon: 104.0529 },
  { name: 'Banjarmasin', lat: -3.3194, lon: 114.5908 },
  { name: 'Balikpapan', lat: -1.2676, lon: 116.8289 },
  { name: 'Samarinda', lat: -0.5022, lon: 117.1536 },
  { name: 'Manado', lat: 1.4748, lon: 124.8421 },
  { name: 'Ambon', lat: -3.6954, lon: 128.1814 },
  { name: 'Jayapura', lat: -2.5916, lon: 140.6690 },
];

const PRAYERS = [
  { key: 'Fajr', label: 'Subuh', icon: '🌙' },
  { key: 'Dhuhr', label: 'Dzuhur', icon: '☀️' },
  { key: 'Asr', label: 'Ashar', icon: '🌤️' },
  { key: 'Maghrib', label: 'Maghrib', icon: '🌅' },
  { key: 'Isha', label: 'Isya', icon: '🌃' },
];

function parseTime(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function formatTime(timeStr) {
  if (!timeStr) return '--:--';
  return timeStr.substring(0, 5);
}

function getNextPrayer(timings) {
  const now = new Date();
  for (const p of PRAYERS) {
    const t = parseTime(timings[p.key]);
    if (t && t > now) return p.key;
  }
  return PRAYERS[0].key; // after Isha → next is Fajr
}

function getCountdown(timeStr) {
  const target = parseTime(timeStr);
  if (!target) return null;
  const now = new Date();
  let diff = target - now;
  if (diff < 0) diff += 24 * 3600 * 1000;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function PrayerTimes() {
  const [city, setCity] = useState(() => localStorage.getItem('kq_prayer_city') || 'Jakarta');
  const [timings, setTimings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [now, setNow] = useState(new Date());
  const intervalRef = useRef(null);
  const [hijriDate, setHijriDate] = useState('');

  const fetchPrayerTimes = useCallback(async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const cityData = INDONESIAN_CITIES.find(c => c.name === cityName) || INDONESIAN_CITIES[0];
      const today = new Date();
      const dd = today.getDate();
      const mm = today.getMonth() + 1;
      const yyyy = today.getFullYear();
      const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${cityData.lat}&longitude=${cityData.lon}&method=11`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data = await res.json();
      setTimings(data.data.timings);
      const h = data.data.date?.hijri;
      if (h) setHijriDate(`${h.day} ${h.month.en} ${h.year} H`);
    } catch (e) {
      setError('Gagal memuat jadwal sholat. Periksa koneksi internet.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrayerTimes(city);
    localStorage.setItem('kq_prayer_city', city);
  }, [city, fetchPrayerTimes]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const nextPrayerKey = timings ? getNextPrayer(timings) : null;
  const nextPrayer = PRAYERS.find(p => p.key === nextPrayerKey);

  useEffect(() => {
    if (timings && nextPrayerKey) {
      setCountdown(getCountdown(timings[nextPrayerKey]));
    }
  }, [now, timings, nextPrayerKey]);

  const currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const currentDate = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="prayer-times">
      <div className="prayer-times__header">
        <div className="prayer-times__title-area">
          <h2 className="prayer-times__title">🕌 Jadwal Waktu Sholat</h2>
          <p className="prayer-times__date">{currentDate}</p>
          {hijriDate && <p className="prayer-times__hijri">{hijriDate}</p>}
        </div>
        <div className="prayer-times__clock">{currentTime}</div>
      </div>

      <div className="prayer-times__city-row">
        <span className="prayer-times__city-label">📍 Kota:</span>
        <select
          className="prayer-times__city-select"
          value={city}
          onChange={e => setCity(e.target.value)}
        >
          {INDONESIAN_CITIES.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
        <button className="prayer-times__refresh" onClick={() => fetchPrayerTimes(city)} title="Refresh">🔄</button>
      </div>

      {loading && (
        <div className="prayer-times__loading">
          <div className="prayer-times__spinner" />
          <span>Memuat jadwal sholat...</span>
        </div>
      )}

      {error && !loading && (
        <div className="prayer-times__error">⚠️ {error}</div>
      )}

      {!loading && !error && timings && (
        <>
          {nextPrayer && (
            <div className="prayer-times__next">
              <div className="prayer-times__next-label">Sholat berikutnya</div>
              <div className="prayer-times__next-name">{nextPrayer.icon} {nextPrayer.label} — {formatTime(timings[nextPrayer.key])}</div>
              <div className="prayer-times__countdown">{countdown}</div>
            </div>
          )}

          <div className="prayer-times__grid">
            {PRAYERS.map(p => {
              const isNext = p.key === nextPrayerKey;
              const t = parseTime(timings[p.key]);
              const isPast = t && t < now && p.key !== nextPrayerKey;
              return (
                <div key={p.key} className={`prayer-times__item ${isNext ? 'prayer-times__item--next' : ''} ${isPast ? 'prayer-times__item--past' : ''}`}>
                  <span className="prayer-times__prayer-icon">{p.icon}</span>
                  <span className="prayer-times__prayer-name">{p.label}</span>
                  <span className="prayer-times__prayer-time">{formatTime(timings[p.key])}</span>
                  {isNext && <span className="prayer-times__next-badge">Berikutnya</span>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
