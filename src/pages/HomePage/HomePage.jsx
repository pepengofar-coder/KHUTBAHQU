import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useSEO, JsonLd, SITE_URL, SITE_NAME } from '../../utils/seo';
import { getHijriDateString, getUpcomingEvents } from '../../data/hijriData';
import { getDailyAyah } from '../../utils/dailyAyah';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';
import './HomePage.css';

// Minimal prayer time fetch for dashboard
import { useState, useEffect, useRef } from 'react';

const PRAYERS=[{key:'Fajr',label:'Subuh',icon:'🌙'},{key:'Dhuhr',label:'Dzuhur',icon:'☀️'},{key:'Asr',label:'Ashar',icon:'🌤️'},{key:'Maghrib',label:'Maghrib',icon:'🌇'},{key:'Isha',label:'Isya',icon:'🌃'}];
function parseTime(s){if(!s)return null;const[h,m]=s.split(':').map(Number);const d=new Date();d.setHours(h,m,0,0);return d}
function fmt(s){return s?s.substring(0,5):'--:--'}
function getNext(t){const now=new Date();for(const p of PRAYERS){const d=parseTime(t[p.key]);if(d&&d>now)return p.key}return PRAYERS[0].key}

export default function HomePage() {
  const { allKhutbah, recentKhutbah } = useApp();

  useSEO({
    title: 'Islamediaku - Teks Khutbah Jumat, Kultum, dan Tausiyah Islam Siap Pakai',
    description: 'Kumpulan teks khutbah Jumat, kultum Ramadhan, tausiyah Islam, dan rekomendasi tema dakwah berdasarkan kalender Hijriah. Siap pakai untuk khatib, dai, ustaz, dan pengurus masjid.',
    path: '/',
  });

  const now = useMemo(() => new Date(), []);
  const hijriStr = useMemo(() => getHijriDateString(now), [now]);
  const events = useMemo(() => getUpcomingEvents(now).slice(0, 3), [now]);
  const gregorian = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Hijri month themes


  // Daily Missions
  const todayDateStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }, []);
  
  const [missions, setMissions] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('kq_daily_missions'));
      if (stored && stored.date === todayDateStr) return stored.data;
    } catch (e) {
      console.warn('Daily missions not parsed:', e);
    }
    return [
      { id: 'dzikir', label: 'Dzikir pagi', done: false },
      { id: 'quran', label: 'Baca 5 ayat', done: false },
      { id: 'sholat', label: 'Cek jadwal sholat', done: true },
      { id: 'khutbah', label: 'Baca khutbah singkat', done: false },
    ];
  });

  const toggleMission = (id) => {
    setMissions(prev => {
      const next = prev.map(m => m.id === id ? { ...m, done: !m.done } : m);
      localStorage.setItem('kq_daily_missions', JSON.stringify({ date: todayDateStr, data: next }));
      return next;
    });
  };

  const completedMissions = missions.filter(m => m.done).length;
  const progressPercent = Math.round((completedMissions / missions.length) * 100);

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
      } catch (e) {
        console.warn('Failed fetching prayer times:', e);
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
  }, [nowTime, timings, nextKey]);

  const featured = allKhutbah.slice(0, 3);

  // Daily Reflection
  const [dailyAyah, setDailyAyah] = useState(null);
  const [ayahLoading, setAyahLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchAyah = async () => {
      try {
        const data = await getDailyAyah();
        if (mounted) setDailyAyah(data);
      } catch (err) {
        console.warn('Failed to fetch daily ayah:', err);
      } finally {
        if (mounted) setAyahLoading(false);
      }
    };
    fetchAyah();
    return () => { mounted = false; };
  }, []);

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

          {/* Daily Mission Component */}
          <div className="dash-hero__mission">
            <div className="dash-hero__mission-header">
              <div className="dash-hero__mission-title">
                <span>🎯</span> Misi Ibadah Hari Ini
              </div>
              <div className="dash-hero__mission-status">{completedMissions} dari {missions.length} selesai</div>
            </div>
            
            <div className="dash-hero__mission-progress">
              <div className="dash-hero__mission-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <div className="dash-hero__mission-list">
              {missions.map(m => (
                <div key={m.id} className={`dash-hero__mission-item ${m.done ? 'dash-hero__mission-item--done' : ''}`} onClick={() => toggleMission(m.id)}>
                  <div className="dash-hero__mission-checkbox">{m.done ? '✓' : ''}</div>
                  <span className="dash-hero__mission-label">{m.label}</span>
                </div>
              ))}
            </div>

            <div className="dash-hero__mission-action">
              <Link to="/tracker" className="dash-hero__mission-btn">Buka Tracker</Link>
            </div>
          </div>

          {/* Reflection Micro Card */}
          <div className="dash-hero__reflection">
            <span className="dash-hero__reflection-icon">✨</span>
            <div className="dash-hero__reflection-text">
              <strong>Renungan Hari Ini</strong>
              {ayahLoading ? (
                <p>Memuat renungan...</p>
              ) : dailyAyah ? (
                <p>"{dailyAyah.translation}" ({dailyAyah.reference})</p>
              ) : (
                <p>Renungan harian belum tersedia</p>
              )}
            </div>
            {!ayahLoading && dailyAyah && (
              <Link to={`/mushaf?surah=${dailyAyah.surah}&ayah=${dailyAyah.ayah}`} className="dash-hero__reflection-link">Baca</Link>
            )}
          </div>
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

      {/* Modern About Section */}
      <section className="home-about container">
        <div className="home-about__header">
          <h2 className="home-about__title">Tentang Islamediaku</h2>
          <p className="home-about__subtitle">Satu aplikasi untuk menemani ibadah harianmu, dari jadwal sholat, mushaf, doa, dzikir, hingga khutbah.</p>
        </div>

        {/* Highlight Card */}
        <div className="home-about__highlight">
          <div className="home-about__highlight-content">
            <p><strong>Islamediaku</strong> dirancang sebagai teman ibadah harian yang ringan, rapi, dan mudah digunakan. Semua fitur penting dikumpulkan dalam satu tempat agar pengguna bisa lebih mudah menjaga rutinitas ibadah, membaca Al-Qur'an, berdzikir, dan menemukan inspirasi Islami setiap hari.</p>
            <div className="home-about__cta">
              <Link to="/mushaf" className="btn btn--primary">Mulai Jelajahi</Link>
            </div>
          </div>
          {/* Subtle Glow Background */}
          <div className="home-about__glow"></div>
        </div>

        {/* Mini Stats */}
        <div className="home-about__stats">
          <div className="home-about__stat-item">
            <span className="home-about__stat-num">5</span>
            <span className="home-about__stat-label">Waktu Sholat</span>
          </div>
          <div className="home-about__stat-item">
            <span className="home-about__stat-num">114</span>
            <span className="home-about__stat-label">Surah</span>
          </div>
          <div className="home-about__stat-item">
            <span className="home-about__stat-num">30</span>
            <span className="home-about__stat-label">Juz</span>
          </div>
          <div className="home-about__stat-item">
            <span className="home-about__stat-num">Doa</span>
            <span className="home-about__stat-label">Harian</span>
          </div>
        </div>

        {/* Benefit Cards */}
        <div className="home-about__benefits">
          <div className="home-about__benefit">
            <div className="home-about__bubble">🧭</div>
            <h3 className="home-about__benefit-title">Ibadah Harian Lebih Terarah</h3>
            <p className="home-about__benefit-desc">Jadwal sholat, dzikir, dan tracker membantu membangun kebiasaan baik.</p>
          </div>
          <div className="home-about__benefit">
            <div className="home-about__bubble">📖</div>
            <h3 className="home-about__benefit-title">Mushaf Mudah Diakses</h3>
            <p className="home-about__benefit-desc">Baca Al-Qur'an dengan tampilan bersih dan nyaman di mobile.</p>
          </div>
          <div className="home-about__benefit">
            <div className="home-about__bubble">🤲</div>
            <h3 className="home-about__benefit-title">Doa & Dzikir Lebih Praktis</h3>
            <p className="home-about__benefit-desc">Akses doa pagi, doa petang, tasbih, dan doa harian dalam satu tempat.</p>
          </div>
          <div className="home-about__benefit">
            <div className="home-about__bubble">🕌</div>
            <h3 className="home-about__benefit-title">Inspirasi Islami Setiap Hari</h3>
            <p className="home-about__benefit-desc">Temukan tema khutbah, kalender Hijriah, dan renungan harian.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
