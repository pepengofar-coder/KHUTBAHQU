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
  { name: 'Jayapura', lat: -2.5916, lon: 140.669 },
];

const PRAYERS = [
  { key: 'Fajr',    label: 'Subuh',   icon: '🌙' },
  { key: 'Dhuhr',   label: 'Dzuhur',  icon: '☀️' },
  { key: 'Asr',     label: 'Ashar',   icon: '🌤️' },
  { key: 'Maghrib', label: 'Maghrib', icon: '🌅' },
  { key: 'Isha',    label: 'Isya',    icon: '🌃' },
];

function parseTime(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function formatTime(timeStr) {
  return timeStr ? timeStr.substring(0, 5) : '--:--';
}

function getNextPrayerKey(timings) {
  const now = new Date();
  for (const p of PRAYERS) {
    const t = parseTime(timings[p.key]);
    if (t && t > now) return p.key;
  }
  return PRAYERS[0].key;
}

function getCountdown(timeStr) {
  const target = parseTime(timeStr);
  if (!target) return '00:00:00';
  const now = new Date();
  let diff = target - now;
  if (diff < 0) diff += 24 * 3600 * 1000;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// Reverse geocode lat/lon → city name via Nominatim
async function reversGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=id`,
      { headers: { 'Accept-Language': 'id' } }
    );
    const data = await res.json();
    const addr = data.address || {};
    return addr.city || addr.town || addr.county || addr.state || 'Lokasi Anda';
  } catch {
    return 'Lokasi Anda';
  }
}

export default function PrayerTimes() {
  // Location state
  const [locationMode, setLocationMode] = useState('detecting'); // 'detecting' | 'gps' | 'manual' | 'denied'
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsLabel, setGpsLabel] = useState('Lokasi Anda');
  const [manualCity, setManualCity] = useState(() => localStorage.getItem('kq_prayer_city') || 'Jakarta');

  // Prayer data
  const [timings, setTimings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hijriDate, setHijriDate] = useState('');

  // Clock
  const [now, setNow] = useState(new Date());
  const [countdown, setCountdown] = useState('');
  const intervalRef = useRef(null);

  // ── Try GPS on first load ────────────────────────────────────
  const tryGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationMode('manual');
      return;
    }
    setLocationMode('detecting');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setGpsCoords({ lat, lon });
        const label = await reversGeocode(lat, lon);
        setGpsLabel(label);
        setLocationMode('gps');
      },
      () => {
        // Permission denied or unavailable → use manual city
        setLocationMode('denied');
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => { tryGPS(); }, [tryGPS]);

  // ── Fetch prayer times whenever coords/city changes ─────────
  const fetchPrayerTimes = useCallback(async ({ lat, lon } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const dd = today.getDate();
      const mm = today.getMonth() + 1;
      const yyyy = today.getFullYear();

      let fetchLat = lat, fetchLon = lon;
      if (!fetchLat || !fetchLon) {
        const city = INDONESIAN_CITIES.find(c => c.name === manualCity) || INDONESIAN_CITIES[0];
        fetchLat = city.lat;
        fetchLon = city.lon;
      }

      const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${fetchLat}&longitude=${fetchLon}&method=11`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data = await res.json();
      setTimings(data.data.timings);
      const h = data.data.date?.hijri;
      if (h) setHijriDate(`${h.day} ${h.month.en} ${h.year} H`);
    } catch {
      setError('Gagal memuat jadwal sholat. Periksa koneksi internet.');
    } finally {
      setLoading(false);
    }
  }, [manualCity]);

  // Re-fetch when location mode resolves
  useEffect(() => {
    if (locationMode === 'gps' && gpsCoords) {
      fetchPrayerTimes(gpsCoords);
    } else if (locationMode === 'manual' || locationMode === 'denied') {
      fetchPrayerTimes();
    }
  }, [locationMode, gpsCoords, fetchPrayerTimes]);

  // Save manual city preference
  useEffect(() => {
    if (locationMode === 'manual') {
      localStorage.setItem('kq_prayer_city', manualCity);
      fetchPrayerTimes();
    }
  }, [manualCity]); // eslint-disable-line

  // ── Clock tick ───────────────────────────────────────────────
  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const nextPrayerKey = timings ? getNextPrayerKey(timings) : null;
  const nextPrayer    = PRAYERS.find(p => p.key === nextPrayerKey);

  useEffect(() => {
    if (timings && nextPrayerKey) {
      setCountdown(getCountdown(timings[nextPrayerKey]));
    }
  }, [now, timings, nextPrayerKey]);

  const currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const currentDate = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Label to show in location row
  const locationLabel = locationMode === 'gps' ? gpsLabel : (locationMode === 'detecting' ? 'Mendeteksi...' : manualCity);

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

      {/* Location Row */}
      <div className="prayer-times__city-row">
        {locationMode === 'gps' ? (
          // GPS mode
          <>
            <span className="prayer-times__city-label">📍 {gpsLabel}</span>
            <span className="prayer-times__gps-badge">GPS</span>
            <button
              className="prayer-times__switch-btn"
              onClick={() => setLocationMode('manual')}
              title="Pilih kota manual"
            >🔄 Pilih Kota</button>
          </>
        ) : locationMode === 'detecting' ? (
          // Detecting
          <>
            <span className="prayer-times__city-label">📡 Mendeteksi lokasi...</span>
            <button
              className="prayer-times__switch-btn"
              onClick={() => setLocationMode('manual')}
            >Pilih Manual</button>
          </>
        ) : (
          // Manual / denied
          <>
            <span className="prayer-times__city-label">📍 Kota:</span>
            <select
              className="prayer-times__city-select"
              value={manualCity}
              onChange={e => setManualCity(e.target.value)}
            >
              {INDONESIAN_CITIES.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
            <button
              className="prayer-times__refresh"
              onClick={tryGPS}
              title="Coba gunakan lokasi GPS"
            >📡</button>
          </>
        )}
        <button
          className="prayer-times__refresh"
          onClick={() => locationMode === 'gps' ? fetchPrayerTimes(gpsCoords) : fetchPrayerTimes()}
          title="Refresh"
        >🔄</button>
      </div>

      {locationMode === 'denied' && (
        <div className="prayer-times__denied-msg">
          ⚠️ Izin lokasi ditolak. Silakan pilih kota secara manual, atau aktifkan izin lokasi di pengaturan browser.
        </div>
      )}

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
              <div className="prayer-times__next-name">
                {nextPrayer.icon} {nextPrayer.label} — {formatTime(timings[nextPrayer.key])}
              </div>
              <div className="prayer-times__countdown">{countdown}</div>
            </div>
          )}

          <div className="prayer-times__grid">
            {PRAYERS.map(p => {
              const isNext = p.key === nextPrayerKey;
              const t = parseTime(timings[p.key]);
              const isPast = t && t < now && !isNext;
              return (
                <div
                  key={p.key}
                  className={`prayer-times__item${isNext ? ' prayer-times__item--next' : ''}${isPast ? ' prayer-times__item--past' : ''}`}
                >
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
