/* eslint-disable no-undef */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useSEO, JsonLd, SITE_URL, SITE_NAME } from '../../utils/seo';
import { getHijriDateString, getUpcomingEvents } from '../../data/hijriData';
import { getRotatingReflectionAyah } from '../../utils/dailyAyah';
import { getDailyGreeting } from '../../utils/dailyGreeting';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';
import FeatureIcon from '../../components/FeatureIcon/FeatureIcon';
import ApkDownloadBar from '../../components/ApkDownloadBar/ApkDownloadBar';
import { BookOpen, Compass, Sunrise, Sunset, CircleDot, Mic, Target, Check, Sparkles, ChevronRight, Bookmark, Headphones, CalendarDays, Heart } from 'lucide-react';
import './HomePage.css';

// Minimal prayer time fetch for dashboard
import { useState, useEffect, useRef } from 'react';

const PRAYERS=[{key:'Fajr',label:'Subuh',icon:'🌙'},{key:'Dhuhr',label:'Dzuhur',icon:'☀️'},{key:'Asr',label:'Ashar',icon:'🌤️'},{key:'Maghrib',label:'Maghrib',icon:'🌇'},{key:'Isha',label:'Isya',icon:'🌃'}];
function parseTime(s){if(!s)return null;const[h,m]=s.split(':').map(Number);const d=new Date();d.setHours(h,m,0,0);return d}
function fmt(s){return s?s.substring(0,5):'--:--'}
function getNext(t){const now=new Date();for(const p of PRAYERS){const d=parseTime(t[p.key]);if(d&&d>now)return p.key}return PRAYERS[0].key}

export default function HomePage() {
  const { allKhutbah } = useApp();

  useSEO({
    title: 'Islamediaku - Teks Khutbah Jumat, Kultum, dan Tausiyah Islam Siap Pakai',
    description: 'Kumpulan teks khutbah Jumat, kultum Ramadhan, tausiyah Islam, dan rekomendasi tema dakwah berdasarkan kalender Hijriah. Siap pakai untuk khatib, dai, ustaz, dan pengurus masjid.',
    path: '/',
  });

  const now = useMemo(() => new Date(), []);
  const hijriStr = useMemo(() => getHijriDateString(now), [now]);
  const events = useMemo(() => getUpcomingEvents(now).slice(0, 3), [now]);
  const gregorian = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  
  const [greetingText, setGreetingText] = useState("Assalamu'alaikum 👋");
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreetingText(getDailyGreeting());
  }, []);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
  }, [nowTime, timings, nextKey]);

  const featured = allKhutbah.slice(0, 3);

  // Daily Reflection (Rotating)
  const [dailyAyah, setDailyAyah] = useState(null);
  const [ayahLoading, setAyahLoading] = useState(true);
  const [fadeAnim, setFadeAnim] = useState('fade-in');

  useEffect(() => {
    let mounted = true;
    let timer;

    const fetchAyah = async () => {
      if (mounted) setFadeAnim('fade-out');
      
      try {
        const data = await getRotatingReflectionAyah();
        if (mounted) {
          setTimeout(() => {
            if (mounted) {
              setDailyAyah(data);
              setFadeAnim('fade-in');
              setAyahLoading(false);
            }
          }, 300);
        }
      } catch (err) {
        console.warn('Failed to fetch rotating ayah:', err);
        if (mounted) {
          setAyahLoading(false);
          setFadeAnim('fade-in');
        }
      }
    };

    fetchAyah();
    let lastSlot = Math.floor(Date.now() / (5 * 60 * 1000));
    
    timer = setInterval(() => {
      const currentSlot = Math.floor(Date.now() / (5 * 60 * 1000));
      if (currentSlot !== lastSlot) {
        lastSlot = currentSlot;
        fetchAyah();
      }
    }, 60 * 1000);

    return () => { 
      mounted = false; 
      clearInterval(timer);
    };
  }, []);

  const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, description: 'Platform materi khutbah Islam siap pakai.', inLanguage: 'id-ID', potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/khutbah?q={search_term_string}`, 'query-input': 'required name=search_term_string' } };
  const orgSchema = { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/logo.png` };

  // Last read data
  const lastSurah = localStorage.getItem('kq_mushaf_last');
  const lastTilawah = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('kq_last_tilawah'));
    } catch { return null; }
  }, []);
  const recentKhutbah = useMemo(() => allKhutbah.slice(0, 3), [allKhutbah]);
  const hasResumeData = lastSurah || lastTilawah || recentKhutbah.length > 0;

  return (
    <div className="home-page">
      <JsonLd data={websiteSchema} />
      <JsonLd data={orgSchema} />

      {/* Hero / Greeting */}
      <section className="dash-hero">
        <div className="dash-hero__inner container">
          <div className="dash-hero__greeting fade-in-slide">
            <h1 className="dash-hero__salam">{greetingText}</h1>
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
                <Target size={16} style={{marginRight: 6}} className="dash-hero__mission-title-icon" /> Misi Ibadah Hari Ini
              </div>
              <div className="dash-hero__mission-status">{completedMissions}/{missions.length}</div>
            </div>
            
            <div className="dash-hero__mission-progress">
              <div className="dash-hero__mission-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <div className="dash-hero__mission-list">
              {missions.map(m => (
                <div key={m.id} className={`dash-hero__mission-item ${m.done ? 'dash-hero__mission-item--done' : ''}`} onClick={() => toggleMission(m.id)}>
                  <div className="dash-hero__mission-checkbox">{m.done ? <Check size={12} strokeWidth={3} /> : null}</div>
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
            <div className="dash-hero__reflection-header">
              <Sparkles size={18} className="dash-hero__reflection-icon" />
              <div className="dash-hero__reflection-title">
                <strong>Renungan Hari Ini</strong>
                <span className="dash-hero__reflection-badge">Berganti tiap 5 menit</span>
              </div>
            </div>
            <div className={`dash-hero__reflection-content ${fadeAnim}`}>
              {ayahLoading ? (
                <p>Memuat renungan...</p>
              ) : dailyAyah ? (
                <>
                  <p>"{dailyAyah.translation}"</p>
                  <div className="dash-hero__reflection-footer">
                    <span className="dash-hero__reflection-ref">{dailyAyah.reference}</span>
                    <Link to={`/mushaf?surah=${dailyAyah.surah}&ayah=${dailyAyah.ayah}`} className="dash-hero__reflection-link">Baca</Link>
                  </div>
                </>
              ) : (
                <p>Renungan harian belum tersedia</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dash-actions container">
        <div className="dash-actions__grid">
          {[
            { to: '/mushaf', icon: BookOpen, color: 'blue', label: 'Mushaf' },
            { to: '/kiblat', icon: Compass, color: 'indigo', label: 'Kiblat' },
            { to: '/doa-dzikir', icon: Sunrise, color: 'lime', label: 'Doa Pagi' },
            { to: '/doa-dzikir', icon: Sunset, color: 'orange', label: 'Doa Petang' },
            { to: '/tasbih', icon: CircleDot, color: 'cyan', label: 'Tasbih' },
            { to: '/khutbah', icon: Mic, color: 'green', label: 'Khutbah' },
            { to: '/tilawah', icon: Headphones, color: 'orange', label: 'Tilawah' },
            { to: '/kalender-hijriah', icon: CalendarDays, color: 'amber', label: 'Kalender' },
          ].map((a, i) => (
            <Link key={i} to={a.to} className="dash-action">
              <FeatureIcon icon={a.icon} colorMode={a.color} />
              <span className="dash-action__label">{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Last Read Resume */}
      <section className="dash-resume container">
        <h2 className="dash-section-title"><Bookmark size={20} style={{marginRight: 8, color: 'var(--color-primary)'}} /> Lanjut Baca</h2>
        {hasResumeData ? (
          <div className="dash-resume__cards">
            {lastSurah && (
              <Link to="/mushaf" className="dash-resume-card">
                <FeatureIcon icon={BookOpen} colorMode="blue" className="sm" />
                <div>
                  <strong>Mushaf Al-Qur'an</strong>
                  <p>Surah terakhir: {lastSurah}</p>
                </div>
                <ChevronRight size={18} className="dash-resume-card__arrow" />
              </Link>
            )}
            {lastTilawah && (
              <Link to="/tilawah" className="dash-resume-card">
                <FeatureIcon icon={Headphones} colorMode="orange" className="sm" />
                <div>
                  <strong>Tilawah Live</strong>
                  <p>{lastTilawah.name || 'Channel terakhir'}</p>
                </div>
                <ChevronRight size={18} className="dash-resume-card__arrow" />
              </Link>
            )}
            {recentKhutbah.length > 0 && (
              <Link to={`/khutbah/${recentKhutbah[0].slug}`} className="dash-resume-card">
                <FeatureIcon icon={Mic} colorMode="green" className="sm" />
                <div>
                  <strong>Khutbah Terakhir</strong>
                  <p>{recentKhutbah[0].title}</p>
                </div>
                <ChevronRight size={18} className="dash-resume-card__arrow" />
              </Link>
            )}
          </div>
        ) : (
          <div className="dash-resume__empty">
            <BookOpen size={32} className="dash-resume__empty-icon" />
            <p>Belum ada riwayat baca. Mulai jelajahi mushaf atau dengarkan tilawah!</p>
            <div className="dash-resume__empty-actions">
              <Link to="/mushaf" className="btn btn--primary btn--sm">Buka Mushaf</Link>
              <Link to="/tilawah" className="btn btn--outline btn--sm">Tilawah Live</Link>
            </div>
          </div>
        )}
      </section>

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

        {/* Benefit Cards — Using FeatureIcon instead of emoji */}
        <div className="home-about__benefits">
          <div className="home-about__benefit">
            <FeatureIcon icon={Compass} colorMode="blue" />
            <h3 className="home-about__benefit-title">Ibadah Harian Lebih Terarah</h3>
            <p className="home-about__benefit-desc">Jadwal sholat, dzikir, dan tracker membantu membangun kebiasaan baik.</p>
          </div>
          <div className="home-about__benefit">
            <FeatureIcon icon={BookOpen} colorMode="green" />
            <h3 className="home-about__benefit-title">Mushaf Mudah Diakses</h3>
            <p className="home-about__benefit-desc">Baca Al-Qur'an dengan tampilan bersih dan nyaman di mobile.</p>
          </div>
          <div className="home-about__benefit">
            <FeatureIcon icon={Heart} colorMode="rose" />
            <h3 className="home-about__benefit-title">Doa & Dzikir Lebih Praktis</h3>
            <p className="home-about__benefit-desc">Akses doa pagi, doa petang, tasbih, dan doa harian dalam satu tempat.</p>
          </div>
          <div className="home-about__benefit">
            <FeatureIcon icon={Sparkles} colorMode="amber" />
            <h3 className="home-about__benefit-title">Inspirasi Islami Setiap Hari</h3>
            <p className="home-about__benefit-desc">Temukan tema khutbah, kalender Hijriah, dan renungan harian.</p>
          </div>
        </div>

        {/* Apk Download Component */}
        <ApkDownloadBar />
      </section>
    </div>
  );
}
