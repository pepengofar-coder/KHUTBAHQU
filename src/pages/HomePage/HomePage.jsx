/* eslint-disable no-undef */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useSEO, JsonLd, SITE_URL, SITE_NAME } from '../../utils/seo';
import { getHijriDateString, getUpcomingEvents } from '../../data/hijriData';
import { getRotatingReflectionAyah } from '../../utils/dailyAyah';
import { getLocalizedGreeting } from '../../utils/dailyGreeting';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';
import FeatureIcon from '../../components/FeatureIcon/FeatureIcon';
import ApkDownloadBar from '../../components/ApkDownloadBar/ApkDownloadBar';
import VariedFeatureCard from '../../components/VariedFeatureCard/VariedFeatureCard';
import KajianBannerCard from '../../components/KajianBannerCard/KajianBannerCard';
import { BookOpen, Compass, CircleDot, Mic, Target, Check, Sparkles, ChevronRight, Bookmark, Headphones, CalendarDays, Clock, CheckSquare, Star, Settings, Info, Sunrise, Sun, CloudSun, Sunset, Moon, MapPin } from 'lucide-react';
import './HomePage.css';

// Minimal prayer time fetch for dashboard
import { useState, useEffect, useRef } from 'react';

const PRAYERS = [
  { key: 'Fajr',    label: 'Subuh' },
  { key: 'Dhuhr',   label: 'Dzuhur' },
  { key: 'Asr',     label: 'Ashar' },
  { key: 'Maghrib', label: 'Maghrib' },
  { key: 'Isha',    label: 'Isya' },
];

const PRAYER_ICONS = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon
};

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
  
  const [greeting, setGreeting] = useState({ text: "Selamat datang 👋", category: "" });
  const [greetingFade, setGreetingFade] = useState('fade-in');
  
  useEffect(() => {
    let mounted = true;
    let timer;

    const updateGreeting = () => {
      const locale = localStorage.getItem('islamediaku_locale') || 'id';
      const newGreeting = getLocalizedGreeting(locale);
      setGreeting(prev => {
        if (prev.text !== newGreeting.text) {
          if (mounted) setGreetingFade('fade-out');
          setTimeout(() => {
            if (mounted) {
              setGreeting(newGreeting);
              setGreetingFade('fade-in');
            }
          }, 300);
          return prev;
        }
        return newGreeting;
      });
    };

    // Initial load
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getLocalizedGreeting(localStorage.getItem('islamediaku_locale') || 'id'));

    let lastSlot = Math.floor(Date.now() / (30 * 60 * 1000));
    timer = setInterval(() => {
      const currentSlot = Math.floor(Date.now() / (30 * 60 * 1000));
      if (currentSlot !== lastSlot) {
        lastSlot = currentSlot;
        updateGreeting();
      }
    }, 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  // Daily Missions
  const todayDateStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }, []);
  
  const [missions, setMissions] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('islamediaku_daily_mission_progress'));
      if (stored && stored.date === todayDateStr) return stored.data;
    } catch (e) {
      console.warn('Daily missions not parsed:', e);
    }
    return [
      { id: 'dzikir', label: 'Dzikir pagi', done: false },
      { id: 'quran', label: 'Baca 5 ayat', done: false },
      { id: 'sholat', label: 'Cek jadwal sholat', done: false },
      { id: 'khutbah', label: 'Baca khutbah singkat', done: false },
    ];
  });

  const toggleMission = (id) => {
    setMissions(prev => {
      const next = prev.map(m => m.id === id ? { ...m, done: !m.done } : m);
      localStorage.setItem('islamediaku_daily_mission_progress', JSON.stringify({ date: todayDateStr, data: next }));
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
  const lastQuranRead = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('islamediaku_quran_last_read'));
      if (stored && stored.surahId) {
        return stored;
      }
      return null;
    } catch { return null; }
  }, []);
  const lastTilawah = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('kq_last_tilawah'));
    } catch { return null; }
  }, []);
  const recentKhutbah = useMemo(() => allKhutbah.length > 0 ? allKhutbah[0] : null, [allKhutbah]);
  const hasResumeData = lastQuranRead || lastTilawah || recentKhutbah;

  return (
    <div className="home-page">
      <JsonLd data={websiteSchema} />
      <JsonLd data={orgSchema} />

      {/* Hero / Greeting */}
      <section className="dash-hero islamic-pattern">
        <div className="dash-hero__inner container">
          <div className={`dash-hero__greeting ${greetingFade}`}>
            <span className="dash-hero__category-badge">{greeting.category || 'Momen'}</span>
            <h1 className="dash-hero__salam">Islamediaku</h1>
            <p className="dash-hero__tagline">Pendamping Islami harian dalam satu aplikasi.</p>
            <p className="dash-hero__desc">Baca Al-Qur'an, cek jadwal sholat, dengarkan tilawah, pantau ibadah, dan temukan renungan Islami setiap hari.</p>
            <p className="dash-hero__date">{gregorian} &bull; <span>📅 {hijriStr}</span></p>
          </div>

          {timings && nextP && (
            <div className="dash-hero__prayer glass-card">
              <span className="dash-hero__prayer-label">Sholat berikutnya</span>
              <span className="dash-hero__prayer-name">{nextP.icon} {nextP.label}</span>
              <span className="dash-hero__prayer-time">{fmt(timings[nextP.key])}</span>
              <span className="dash-hero__countdown">{countdown}</span>
            </div>
          )}
        </div>
      </section>

      {/* Daily Mission Section */}
      <section className="home-section dash-mission container">
        <div className="dash-mission__card">
          <div className="dash-mission__header">
            <div className="dash-mission__title-wrap">
              <h2 className="dash-mission__title"><Target size={18} className="text-accent" /> Misi Ibadah Hari Ini</h2>
              <p className="dash-mission__subtitle">Mulai dengan satu amalan kecil hari ini.</p>
            </div>
            <div className="dash-mission__status">{completedMissions} dari {missions.length} selesai</div>
          </div>
          
          <div className="dash-mission__progress">
            <div className="dash-mission__bar" style={{ width: `${progressPercent}%` }}></div>
          </div>

          <div className="dash-mission__list">
            {missions.map(m => (
              <label key={m.id} className={`dash-mission__item ${m.done ? 'dash-mission__item--done' : ''}`}>
                <div className="dash-mission__checkbox-wrap">
                  <input type="checkbox" className="sr-only" checked={m.done} onChange={() => toggleMission(m.id)} aria-label={m.label} />
                  <div className="dash-mission__checkbox">{m.done ? <Check size={12} strokeWidth={3} /> : null}</div>
                </div>
                <span className="dash-mission__label">{m.label}</span>
              </label>
            ))}
          </div>

          <div className="dash-mission__action">
            <Link to="/tracker" className="btn btn--primary btn--sm">Mulai Misi Tracker</Link>
          </div>
        </div>
      </section>

      {/* Reflection Section */}
      <section className="home-section dash-reflection container">
        <div className="dash-reflection__card">
          <div className="dash-reflection__header">
            <Sparkles size={20} className="dash-reflection__icon" />
            <div className="dash-reflection__title-wrap">
              <h2 className="dash-reflection__title">Renungan Hari Ini</h2>
            </div>
          </div>
          <div className={`dash-reflection__content ${fadeAnim}`}>
            {ayahLoading ? (
              <p className="dash-reflection__text">Memuat renungan...</p>
            ) : dailyAyah ? (
              <>
                <p className="dash-reflection__text">"{dailyAyah.translation}"</p>
                <div className="dash-reflection__footer">
                  <span className="dash-reflection__ref">{dailyAyah.reference}</span>
                  <Link to={`/mushaf/${dailyAyah.surah}#ayah-${dailyAyah.ayah}`} className="dash-reflection__link">Baca Ayat</Link>
                </div>
              </>
            ) : (
              <p className="dash-reflection__text">Renungan harian belum tersedia</p>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dash-actions container">
        <h2 className="dash-section-title dash-actions__title">📖 Menu Utama</h2>
        <div className="dash-actions__grid-main">
          <VariedFeatureCard
            to="/mushaf"
            icon={BookOpen}
            colorVariant="blue"
            title="Mushaf"
            subtitle="Baca Al-Qur’an"
            layoutVariant="grid-card"
          />
          <VariedFeatureCard
            to="/sholat"
            icon={Clock}
            colorVariant="cyan"
            title="Sholat"
            subtitle="Jadwal & Pengingat"
            layoutVariant="grid-card"
          />
          <VariedFeatureCard
            to="/tilawah"
            icon={Headphones}
            colorVariant="blue"
            title="Tilawah"
            subtitle="Dengarkan Qur’an"
            layoutVariant="grid-card"
          />
          <VariedFeatureCard
            to="/doa-dzikir"
            icon={Sparkles}
            colorVariant="mint"
            title="Doa & Dzikir"
            subtitle="Pagi, Petang, Harian"
            layoutVariant="grid-card"
          />
          <VariedFeatureCard
            to="/kalender-hijriah"
            icon={CalendarDays}
            colorVariant="lavender"
            title="Kalender"
            subtitle="Hijriah & Hari Besar"
            layoutVariant="grid-card"
          />
          <VariedFeatureCard
            to="/kiblat"
            icon={Compass}
            colorVariant="gold"
            title="Kiblat"
            subtitle="Arah Sholat"
            layoutVariant="grid-card"
          />
          <VariedFeatureCard
            to="/tracker"
            icon={CheckSquare}
            colorVariant="lime"
            title="Tracker"
            subtitle="Pantau Ibadah"
            layoutVariant="grid-card"
          />
          <VariedFeatureCard
            to="/khutbah"
            icon={Mic}
            colorVariant="cream"
            title="Khutbah"
            subtitle="Materi Pilihan"
            layoutVariant="grid-card"
          />
        </div>

        {/* Secondary Features */}
        <div className="dash-actions__secondary">
          <h3 className="dash-actions__secondary-title">Fitur Tambahan</h3>
          <div className="dash-actions__grid-secondary">
            {[
              { to: '/favorit', icon: Star, color: 'blue', label: 'Favorit', desc: 'Konten tersimpan' },
              { to: '/tasbih', icon: CircleDot, color: 'cyan', label: 'Tasbih', desc: 'Dzikir digital' },
              { to: '/pengaturan', icon: Settings, color: 'indigo', label: 'Pengaturan', desc: 'Preferensi app' },
              { to: '/tentang', icon: Info, color: 'slate', label: 'Tentang', desc: 'Info developer' }
            ].map((a, i) => (
              <Link key={i} to={a.to} className="dash-action-secondary">
                <FeatureIcon icon={a.icon} colorMode={a.color} className="sm" />
                <div className="dash-action-secondary__text">
                  <span className="dash-action-secondary__label">{a.label}</span>
                  <span className="dash-action-secondary__desc">{a.desc}</span>
                </div>
                <ChevronRight size={14} className="dash-action-secondary__arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Mode Shortcut Banner */}
      {/* Travel Mode Shortcut Banner */}
      <section className="home-section dash-travel-banner container">
        <Link to="/mode-perjalanan" className="travel-banner-card">
          <div className="travel-banner-content">
            <div className="travel-banner-icon-wrap">
              <span className="travel-car-icon">🚗</span>
            </div>
            <div className="travel-banner-text">
              <strong>Mode Perjalanan</strong>
              <p>Dengarkan murottal & doa safar penenang jalan.</p>
            </div>
          </div>
          <div className="travel-banner-action">
            Buka <ChevronRight size={16} />
          </div>
        </Link>
      </section>

      {/* Last Read Resume */}
      <section className="home-section dash-resume container">
        <h2 className="dash-section-title"><Bookmark size={20} style={{marginRight: 8, color: 'var(--color-primary)'}} /> Lanjut Baca</h2>
        {hasResumeData ? (
          <div className="dash-resume__cards">
            {lastQuranRead && (
              <Link to={`/mushaf/${lastQuranRead.surahId}#ayah-${lastQuranRead.ayahNumber}`} className="dash-resume-card">
                <FeatureIcon icon={BookOpen} colorMode="blue" className="sm" />
                <div className="dash-resume-card__text">
                  <strong>Mushaf Al-Qur'an</strong>
                  <p>Surah {lastQuranRead.surahName || lastQuranRead.surahId} Ayat {lastQuranRead.ayahNumber}</p>
                </div>
                <span className="dash-resume-card__cta">Lanjutkan <ChevronRight size={16} /></span>
              </Link>
            )}
            {lastTilawah && (
              <Link to="/tilawah" className="dash-resume-card">
                <FeatureIcon icon={Headphones} colorMode="orange" className="sm" />
                <div className="dash-resume-card__text">
                  <strong>Tilawah Live</strong>
                  <p>{lastTilawah.name || 'Channel terakhir'}</p>
                </div>
                <span className="dash-resume-card__cta">Lanjutkan <ChevronRight size={16} /></span>
              </Link>
            )}
            {recentKhutbah && (
              <Link to={`/khutbah/${recentKhutbah.slug}`} className="dash-resume-card">
                <FeatureIcon icon={Mic} colorMode="green" className="sm" />
                <div className="dash-resume-card__text">
                  <strong>Khutbah Terakhir</strong>
                  <p>{recentKhutbah.title}</p>
                </div>
                <span className="dash-resume-card__cta">Lanjutkan <ChevronRight size={16} /></span>
              </Link>
            )}
          </div>
        ) : (
          <div className="dash-resume__empty">
            <Bookmark size={32} className="dash-resume__empty-icon" />
            <p>Belum ada riwayat ibadah. Lanjutkan harimu dengan membaca Al-Qur'an atau dzikir.</p>
            <div className="dash-resume__empty-actions">
              <Link to="/mushaf" className="btn btn--primary btn--sm">Buka Mushaf</Link>
            </div>
          </div>
        )}
      </section>

      {/* Prayer Times Mini */}
      {timings && (
        <section className="home-section dash-prayer container">
          <div className="dash-prayer__header">
            <div>
              <h2 className="dash-section-title">🕌 Jadwal Sholat</h2>
              {locationName && <p className="dash-prayer__location" style={{fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px'}}><MapPin size={12} /> {locationName}</p>}
            </div>
            <Link to="/sholat" className="dash-link">Selengkapnya →</Link>
          </div>
          <div className="dash-prayer__grid">
            {PRAYERS.map(p => {
              const isNext = p.key === nextKey;
              const IconComp = PRAYER_ICONS[p.key] || Sun;
              return (
                <div key={p.key} className={`dash-prayer-card${isNext ? ' dash-prayer-card--next' : ''}`}>
                  <span className="dash-prayer-card__icon-wrapper">
                    <IconComp size={16} className="dash-prayer-card__icon" />
                  </span>
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
        <section className="home-section dash-events container">
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
          <p className="home-about__subtitle">Sahabat ibadah harian untuk sholat, Al-Qur’an, dzikir, tilawah, dan kebiasaan baik.</p>
        </div>

        {/* Kajian Banner Card — fetched from Supabase */}
        <KajianBannerCard />

        {/* Main Layout Area for About Section */}
        <div className="home-about__layout">
          <div className="home-about__main">
            {/* Hero Card */}
            <div className="home-about__hero">
              <div className="home-about__hero-content">
                <h3 className="home-about__hero-title">Teman Ibadah Harianmu</h3>
                <p className="home-about__hero-desc">Islamediaku membantu kamu menjaga rutinitas ibadah dengan fitur yang ringan, rapi, dan mudah digunakan setiap hari.</p>
                <div className="home-about__cta">
                  <Link to="/mushaf" className="btn btn--primary">Mulai Jelajahi</Link>
                </div>
              </div>
              <div className="home-about__hero-visual">
                <div className="hero-visual-pattern"></div>
                <div className="hero-chips">
                  <span className="hero-chip">Sholat</span>
                  <span className="hero-chip">Mushaf</span>
                  <span className="hero-chip">Dzikir</span>
                  <span className="hero-chip">Tilawah</span>
                  <span className="hero-chip">Tracker</span>
                </div>
                <div className="home-about__glow"></div>
              </div>
            </div>

            {/* Benefit Cards */}
            <div className="home-about__benefits">
              <div className="home-about__benefit">
                <FeatureIcon icon={BookOpen} colorMode="blue" />
                <div className="home-about__benefit-text">
                  <h3 className="home-about__benefit-title">Mushaf & Tilawah</h3>
                  <p className="home-about__benefit-desc">Baca Al-Qur'an dan dengarkan tilawah dengan nyaman.</p>
                </div>
              </div>
              <div className="home-about__benefit">
                <FeatureIcon icon={CheckSquare} colorMode="lime" />
                <div className="home-about__benefit-text">
                  <h3 className="home-about__benefit-title">Ibadah Harian</h3>
                  <p className="home-about__benefit-desc">Jadwal sholat, dzikir, dan tracker kebiasaan baik.</p>
                </div>
              </div>
              <div className="home-about__benefit">
                <FeatureIcon icon={Compass} colorMode="cyan" />
                <div className="home-about__benefit-text">
                  <h3 className="home-about__benefit-title">Mode Perjalanan</h3>
                  <p className="home-about__benefit-desc">Doa safar, audio Islami, kiblat, dan pengingat sholat.</p>
                </div>
              </div>
              <div className="home-about__benefit">
                <FeatureIcon icon={Mic} colorMode="green" />
                <div className="home-about__benefit-text">
                  <h3 className="home-about__benefit-title">Konten Islami</h3>
                  <p className="home-about__benefit-desc">Khutbah, materi pilihan, dan pengingat iman harian.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="home-about__sidebar">
            <Link to="/mode-perjalanan" className="home-about__kajian-card-new">
              <div className="kajian-card-new__icon">
                <Headphones size={24} />
              </div>
              <h3 className="kajian-card-new__title">Kajian Pilihan</h3>
              <p className="kajian-card-new__text">Temukan kajian ringan dan pengingat iman harian untuk menemani aktivitasmu.</p>
              <span className="kajian-card-new__cta">Lihat Kajian</span>
            </Link>
          </div>
        </div>

        {/* Apk Download Component */}
        {import.meta.env.VITE_APK_URL || import.meta.env.NEXT_PUBLIC_APK_URL ? (
          <ApkDownloadBar />
        ) : (
          <div className="home-about__apk-empty">
            <p>Aplikasi Android (APK) belum tersedia saat ini.</p>
          </div>
        )}
      </section>
    </div>
  );
}
