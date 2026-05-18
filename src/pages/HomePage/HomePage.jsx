import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useSEO, JsonLd, SITE_URL, SITE_NAME } from '../../utils/seo';
import { getHijriDateString, getUpcomingEvents, getRecommendedThemes, HIJRI_MONTHS } from '../../data/hijriData';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';
import './HomePage.css';

// Minimal prayer time fetch for dashboard
import { useState, useEffect, useRef } from 'react';

const PRAYERS=[{key:'Fajr',label:'Subuh',icon:'🌙'},{key:'Dhuhr',label:'Dzuhur',icon:'☀️'},{key:'Asr',label:'Ashar',icon:'🌤️'},{key:'Maghrib',label:'Maghrib',icon:'🌇'},{key:'Isha',label:'Isya',icon:'🌃'}];
function parseTime(s){if(!s)return null;const[h,m]=s.split(':').map(Number);const d=new Date();d.setHours(h,m,0,0);return d}
function fmt(s){return s?s.substring(0,5):'--:--'}
function getNext(t){const now=new Date();for(const p of PRAYERS){const d=parseTime(t[p.key]);if(d&&d>now)return p.key}return PRAYERS[0].key}

export default function HomePage() {
  const { allKhutbah, recentKhutbah, categories } = useApp();

  useSEO({
    title: 'Islamediaku - Teks Khutbah Jumat, Kultum, dan Tausiyah Islam Siap Pakai',
    description: 'Kumpulan teks khutbah Jumat, kultum Ramadhan, tausiyah Islam, dan rekomendasi tema dakwah berdasarkan kalender Hijriah. Siap pakai untuk khatib, dai, ustaz, dan pengurus masjid.',
    path: '/',
  });

  const now = new Date();
  const hijriStr = useMemo(() => getHijriDateString(now), []);
  const events = useMemo(() => getUpcomingEvents(now).slice(0, 3), []);
  const gregorian = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Hijri month themes
  const firstEvt = events[0];
  const hijriMonth = useMemo(() => {
    const h = now; // approximate
    return Math.floor(now.getMonth()) + 1; // placeholder
  }, []);

  // Prayer times mini
  const [timings, setTimings] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [nowTime, setNowTime] = useState(new Date());
  const iv = useRef(null);

  useEffect(() => {
    const fetchPrayer = async () => {
      try {
        const d = new Date();
        const city = localStorage.getItem('kq_prayer_city') || 'Jakarta';
        const cities = { Jakarta: [-6.2088, 106.8456], Surabaya: [-7.2575, 112.7521], Bandung: [-6.9175, 107.6191] };
        const [lat, lon] = cities[city] || cities.Jakarta;
        const r = await fetch(`https://api.aladhan.com/v1/timings/${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}?latitude=${lat}&longitude=${lon}&method=11`);
        const data = await r.json();
        setTimings(data.data.timings);
      } catch {}
    };
    fetchPrayer();
    iv.current = setInterval(() => setNowTime(new Date()), 1000);
    return () => clearInterval(iv.current);
  }, []);

  const nextKey = timings ? getNext(timings) : null;
  const nextP = PRAYERS.find(p => p.key === nextKey);
  useEffect(() => {
    if (!timings || !nextKey) return;
    const t = parseTime(timings[nextKey]); if (!t) return;
    let diff = t - nowTime; if (diff < 0) diff += 864e5;
    const h = Math.floor(diff / 36e5), m = Math.floor(diff % 36e5 / 6e4), s = Math.floor(diff % 6e4 / 1e3);
    setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
  }, [nowTime, timings, nextKey]);

  const featured = allKhutbah.slice(0, 3);
  const weekly = allKhutbah.filter(k => k.type === 'khutbah-jumat').slice(0, 2);

  const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, description: 'Platform materi khutbah Islam siap pakai.', inLanguage: 'id-ID', potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/khutbah?q={search_term_string}`, 'query-input': 'required name=search_term_string' } };
  const orgSchema = { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/logo.png` };

  // Mushaf last read
  const lastSurah = localStorage.getItem('kq_mushaf_last');

  return (
    <div className="home-page">
      <JsonLd data={websiteSchema} />
      <JsonLd data={orgSchema} />

      {/* Hero / Greeting */}
      <section className="dash-hero">
        <div className="dash-hero__inner container">
          <div className="dash-hero__greeting">
            <h1 className="dash-hero__salam">Assalamu'alaikum 👋</h1>
            <p className="dash-hero__date">{gregorian}</p>
            <p className="dash-hero__hijri">📅 {hijriStr}</p>
          </div>
          {timings && nextP && (
            <div className="dash-hero__prayer">
              <span className="dash-hero__prayer-label">Sholat berikutnya</span>
              <span className="dash-hero__prayer-name">{nextP.icon} {nextP.label}</span>
              <span className="dash-hero__prayer-time">{fmt(timings[nextP.key])}</span>
              <span className="dash-hero__countdown">{countdown}</span>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dash-actions container">
        <div className="dash-actions__grid">
          {[
            { to: '/mushaf', icon: '📖', label: 'Mushaf' },
            { to: '/kiblat', icon: '🧭', label: 'Kiblat' },
            { to: '/doa-dzikir', icon: '🌅', label: 'Doa Pagi' },
            { to: '/doa-dzikir', icon: '🌇', label: 'Doa Petang' },
            { to: '/tasbih', icon: '📿', label: 'Tasbih' },
            { to: '/khutbah', icon: '🕌', label: 'Khutbah' },
          ].map((a, i) => (
            <Link key={i} to={a.to} className="dash-action">
              <span className="dash-action__icon">{a.icon}</span>
              <span className="dash-action__label">{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Last Read Resume */}
      {(lastSurah || recentKhutbah.length > 0) && (
        <section className="dash-resume container">
          <h2 className="dash-section-title">📚 Lanjut Baca</h2>
          <div className="dash-resume__cards">
            {lastSurah && (
              <Link to="/mushaf" className="dash-resume-card">
                <span className="dash-resume-card__icon">📖</span>
                <div>
                  <strong>Mushaf Al-Qur'an</strong>
                  <p>Surah terakhir: {lastSurah}</p>
                </div>
                <span className="dash-resume-card__arrow">→</span>
              </Link>
            )}
            {recentKhutbah.length > 0 && (
              <Link to={`/khutbah/${recentKhutbah[0].slug}`} className="dash-resume-card">
                <span className="dash-resume-card__icon">🕌</span>
                <div>
                  <strong>Khutbah Terakhir</strong>
                  <p>{recentKhutbah[0].title}</p>
                </div>
                <span className="dash-resume-card__arrow">→</span>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Prayer Times Mini */}
      {timings && (
        <section className="dash-prayer container">
          <div className="dash-prayer__header">
            <h2 className="dash-section-title">🕌 Jadwal Sholat</h2>
            <Link to="/sholat" className="dash-link">Selengkapnya →</Link>
          </div>
          <div className="dash-prayer__grid">
            {PRAYERS.map(p => {
              const isNext = p.key === nextKey;
              return (
                <div key={p.key} className={`dash-prayer-card${isNext ? ' dash-prayer-card--next' : ''}`}>
                  <span className="dash-prayer-card__icon">{p.icon}</span>
                  <span className="dash-prayer-card__name">{p.label}</span>
                  <span className="dash-prayer-card__time">{fmt(timings[p.key])}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="dash-events container">
          <div className="dash-prayer__header">
            <h2 className="dash-section-title">🕌 Peristiwa Islam</h2>
            <Link to="/kalender-hijriah" className="dash-link">Kalender →</Link>
          </div>
          <div className="dash-events__list">
            {events.map((e, i) => (
              <div key={i} className={`dash-event${e.daysUntil === 0 ? ' dash-event--today' : ''}`}>
                <span className="dash-event__name">{e.name}</span>
                <span className="dash-event__badge">{e.daysUntil === 0 ? '🎉 Hari ini!' : `${e.daysUntil} hari lagi`}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Khutbah */}
      <section className="dash-khutbah container">
        <div className="dash-prayer__header">
          <h2 className="dash-section-title">⭐ Khutbah Pilihan</h2>
          <Link to="/khutbah" className="dash-link">Lihat Semua →</Link>
        </div>
        <div className="home-featured__grid">
          {featured.map(k => <KhutbahCard key={k.id} khutbah={k} />)}
        </div>
      </section>

      {/* Tracker Summary */}
      <section className="dash-tracker container">
        <div className="dash-prayer__header">
          <h2 className="dash-section-title">✅ Tracker Ibadah</h2>
          <Link to="/tracker" className="dash-link">Buka Tracker →</Link>
        </div>
        <div className="dash-tracker__card">
          <p>Pantau sholat, tilawah, dzikir, dan amal harian Anda.</p>
          <Link to="/tracker" className="btn btn--primary btn--sm">Mulai Tracking →</Link>
        </div>
      </section>

      {/* SEO text section */}
      <section className="home-seo-text container">
        <div className="home-seo-text__inner">
          <h2 className="home-seo-text__title">Tentang Islamediaku</h2>
          <p>
            <strong>Islamediaku</strong> adalah platform Islamic companion app yang menyediakan koleksi lengkap teks khutbah Jumat, kultum Ramadhan, tausiyah singkat, jadwal sholat, arah kiblat, mushaf Al-Qur'an, dzikir pagi petang, dan materi dakwah untuk berbagai momen Islami.
          </p>
          <p>
            Tersedia lebih dari <strong>{allKhutbah.length} naskah</strong> khutbah dalam berbagai kategori. Setiap materi dilengkapi dalil Al-Qur'an dan hadis shahih, serta fitur <em>Mode Mimbar</em>, <Link to="/kalender-hijriah">kalender Hijriah</Link>, dan <Link to="/tracker">tracker ibadah</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
