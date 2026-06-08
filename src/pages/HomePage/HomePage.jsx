/* eslint-disable no-undef */
import { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSEO, JsonLd, SITE_URL, SITE_NAME } from '../../utils/seo';
import { getHijriDateString } from '../../data/hijriData';
import { getLocalizedGreeting } from '../../utils/dailyGreeting';
import { useI18n, getPrayerDisplayName } from '../../context/I18nContext';
import ApkDownloadBar from '../../components/ApkDownloadBar/ApkDownloadBar';
import IllustratedFeatureCard from '../../components/IllustratedFeatureCard/IllustratedFeatureCard';
import HomeBanners from '../../components/HomeBanners/HomeBanners';
import DailyMission from '../../components/DailyMission/DailyMission';
import { BookOpen, Compass, ScrollText, Sparkles, ChevronRight, Headphones, CalendarDays, Clock, CheckSquare, Sunrise, Sun, CloudSun, Sunset, Moon, MapPin } from 'lucide-react';
import './HomePage.css';

// Premium 3D-styled custom SVG travel icon for the Mode Safar homepage entry point
function SafarDashboardIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="safar-dashboard-icon"
      aria-hidden="true"
    >
      <defs>
        {/* Deep navy base background */}
        <radialGradient id="icon-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0B0F19" />
        </radialGradient>
        {/* Emerald/Teal primary accent gradient */}
        <linearGradient id="emerald-teal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
        {/* Soft gold highlight */}
        <linearGradient id="gold-highlight" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        {/* Purple glow shadow */}
        <filter id="purple-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#8B5CF6" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Rounded App-Icon Base with Gold Border and Purple Glow */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="url(#icon-bg)"
        stroke="#EAB308"
        strokeWidth="1.5"
        filter="url(#purple-glow)"
      />

      {/* Subtle Mosque Silhouette in background */}
      <path
        d="M20 44V34C20 30 22 28 25 28C28 28 30 30 30 34V44M16 44H34"
        stroke="#1E293B"
        strokeWidth="1"
        fill="none"
        opacity="0.35"
      />
      <path
        d="M32 44V38C32 36 33 35 34 35C35 35 36 36 36 38V44M30 44H40"
        stroke="#1E293B"
        strokeWidth="1"
        fill="none"
        opacity="0.35"
      />

      {/* Travel Route/Path (Dashed curvy line) */}
      <path
        d="M14 46C18 36 34 30 44 26"
        stroke="url(#emerald-teal)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="4 3"
      />

      {/* Suitcase in bottom-left */}
      <g transform="translate(10, 36)">
        <rect x="2" y="4" width="12" height="9" rx="2" fill="url(#emerald-teal)" stroke="#0F766E" strokeWidth="0.5" />
        <path d="M5 4V2H11V4" stroke="#EAB308" strokeWidth="1" fill="none" />
      </g>

      {/* Map Pin at target end */}
      <g transform="translate(43, 20)">
        <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 14 5 14C5 14 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.5C4.17 6.5 3.5 5.83 3.5 5C3.5 4.17 4.17 3.5 5 3.5C5.83 3.5 6.5 4.17 6.5 5C6.5 5.83 5.83 6.5 5 6.5Z" fill="#EF4444" />
      </g>

      {/* Crescent Moon in top-right */}
      <path
        d="M48 6A12 12 0 0 0 38 18A12 12 0 1 1 48 6Z"
        fill="url(#gold-highlight)"
        transform="translate(-6, 2)"
      />

      {/* Compass Outer Ring (Centered around Qibla marker) */}
      <circle cx="33" cy="35" r="13" stroke="#EAB308" strokeWidth="1.5" fill="#0F172A" fillOpacity="0.8" />
      <circle cx="33" cy="35" r="10" stroke="#334155" strokeWidth="0.75" strokeDasharray="2 2" />

      {/* Compass Needle (Qibla marker pointing up-left) */}
      <polygon points="33,25 36,35 33,33" fill="#EF4444" />
      <polygon points="33,45 30,35 33,33" fill="#94A3B8" />
      <circle cx="33" cy="35" r="1.5" fill="#FBBF24" />

      {/* Tiny Qibla Marker Arrow at top-left edge of compass */}
      <polygon points="26,24 23,21 27,20" fill="#10B981" />
    </svg>
  );
}


// Minimal prayer time fetch for dashboard

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
  const { t, language } = useI18n();

  useSEO({
    title: 'Islamediaku - Sahabat Ibadah Harian',
    description: 'Islamediaku adalah aplikasi Islami harian untuk jadwal sholat, Al-Qur’an, dzikir, tilawah, tracker ibadah, Good Path, Mode Perjalanan, dan konten Islami pilihan.',
    path: '/',
  });

  const now = useMemo(() => new Date(), []);
  const hijriStr = useMemo(() => getHijriDateString(now), [now]);
  const gregorian = useMemo(() => {
    const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  }, [now]);
  
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

  // Daily Missions — now handled by DailyMission component

  // Prayer times mini
  const [timings, setTimings] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [nowTime, setNowTime] = useState(new Date());
  const [locationName, setLocationName] = useState('Jakarta');
  const iv = useRef(null);

  useEffect(() => {
    const fetchPrayer = async () => {
      try {
        const d = new Date();
        const city = localStorage.getItem('kq_prayer_city') || 'Jakarta';
        setLocationName(city);
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


  const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, description: 'Platform materi khutbah Islam siap pakai.', inLanguage: 'id-ID', potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/khutbah?q={search_term_string}`, 'query-input': 'required name=search_term_string' } };
  const orgSchema = { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/logo.png` };

  return (
    <div className="home-page">
      <JsonLd data={websiteSchema} />
      <JsonLd data={orgSchema} />

      {/* Hero Section */}
      <section className="dash-hero islamic-pattern">
        <div className="dash-hero__inner container">
          <div className="dash-hero__content">
            <h1 className="dash-hero__salam">{t('home.hero.title')}</h1>
            <p className="dash-hero__desc">{t('home.hero.subtitle')}</p>
            <p className="dash-hero__date">{gregorian} &bull; <span>{hijriStr}</span></p>
          </div>

          {timings && nextP && (
            <div className="dash-hero__prayer">
              <div className="dash-hero__prayer-left">
                <span className="dash-hero__prayer-label">{t('home.next_prayer.title')}</span>
                <div className="dash-hero__prayer-name-row">
                  {(() => {
                    const NextPIcon = PRAYER_ICONS[nextP.key] || Sun;
                    return <h2 className="dash-hero__prayer-name"><NextPIcon size={20} /> {getPrayerDisplayName(nextP.key, now, language, t)}</h2>;
                  })()}
                </div>
                <span className="dash-hero__prayer-time">{fmt(timings[nextP.key])}</span>
              </div>
              
              <div className="dash-hero__prayer-right">
                <Link to="/sholat" className="dash-hero__prayer-link">{t('home.next_prayer.view')} <ChevronRight size={14} /></Link>
                <span className="dash-hero__prayer-countdown">{countdown}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Greeting Card moved below hero */}
      <div className={`container greeting-card-wrapper ${greetingFade}`}>
         <div className="greeting-card">
           <span className="greeting-card-icon">💡</span>
           <p className="greeting-card-text">{greeting.text}</p>
         </div>
      </div>

      {/* Daily Mission Section */}
      <DailyMission />

      {/* Quick Actions */}
      <section className="dash-actions container">
        <h2 className="dash-section-title">📖 {t('nav.more')}</h2>
        <div className="dash-actions__grid-main">
          <div className="featured-card-wrap">
            <IllustratedFeatureCard
              to="/mushaf"
              visual={BookOpen}
              colorVariant="blue"
              title={t('nav.mushaf')}
              subtitle={t('feature.mushaf').split(' - ')[1] || t('feature.mushaf')}
              featured
            />
          </div>

          <IllustratedFeatureCard
            to="/sholat"
            visual={Clock}
            colorVariant="cyan"
            title={t('nav.prayer')}
            subtitle={t('feature.prayer').split(' - ')[1] || t('feature.prayer')}
          />

          <IllustratedFeatureCard
            to="/tilawah"
            visual={Headphones}
            colorVariant="indigo"
            title={t('nav.recitation')}
            subtitle={t('feature.recitation').split(' - ')[1] || t('feature.recitation')}
          />

          <IllustratedFeatureCard
            to="/doa-dzikir"
            visual={Sparkles}
            colorVariant="mint"
            title={t('nav.dua_dhikr')}
            subtitle={t('feature.dua').split(' - ')[1] || t('feature.dua')}
          />

          <IllustratedFeatureCard
            to="/kalender-hijriah"
            visual={CalendarDays}
            colorVariant="lavender"
            title={t('nav.calendar')}
            subtitle={t('feature.calendar').split(' - ')[1] || t('feature.calendar')}
          />

          <IllustratedFeatureCard
            to="/kiblat"
            visual={Compass}
            colorVariant="gold"
            title={t('nav.qibla')}
            subtitle={t('feature.qibla').split(' - ')[1] || t('feature.qibla')}
          />

          <IllustratedFeatureCard
            to="/tracker"
            visual={CheckSquare}
            colorVariant="lime"
            title={t('nav.tracker')}
            subtitle={t('feature.tracker').split(' - ')[1] || t('feature.tracker')}
          />

          <IllustratedFeatureCard
            to="/khutbah"
            visual={ScrollText}
            colorVariant="cream"
            title={t('nav.khutbah')}
            subtitle={t('feature.khutbah').split(' - ')[1] || t('feature.khutbah')}
          />
        </div>

      </section>

      {/* Travel Mode Shortcut Banner */}
      <section className="home-section dash-travel-banner container">
        <Link to="/mode-perjalanan" className="travel-banner-card">
          {/* Animated background elements */}
          <div className="travel-banner__bg">
            <div className="travel-banner__stars" />
            <div className="travel-banner__aurora" />
            <div className="travel-banner__road">
              <div className="travel-banner__road-dash" />
              <div className="travel-banner__road-dash" />
              <div className="travel-banner__road-dash" />
              <div className="travel-banner__road-dash" />
              <div className="travel-banner__road-dash" />
            </div>
            <div className="travel-banner__mosque" />
            <div className="travel-banner__particle travel-banner__particle--1" />
            <div className="travel-banner__particle travel-banner__particle--2" />
            <div className="travel-banner__particle travel-banner__particle--3" />
            <div className="travel-banner__particle travel-banner__particle--4" />
            <div className="travel-banner__particle travel-banner__particle--5" />
          </div>
          {/* Card content */}
          <div className="travel-banner-content">
            <div className="travel-banner-icon-wrap">
              <SafarDashboardIcon />
            </div>
            <div className="travel-banner-text">
              <span className="travel-banner-badge">Cocok untuk perjalanan</span>
              <strong>Sedang dalam perjalanan?</strong>
              <p>Panduan ibadah saat perjalanan, doa safar, qiblat, dan radio Islami dalam satu tempat.</p>
            </div>
          </div>
          <div className="travel-banner-action">
            Buka Mode Safar <ChevronRight size={16} />
          </div>
        </Link>
      </section>

      {/* Prayer Times Mini */}
      {timings && (
        <section className="home-section dash-prayer container">
          <div className="dash-prayer__header">
            <div>
              <h2 className="dash-section-title">🕌 {t('prayer.schedule')}</h2>
              {locationName && <p className="dash-prayer__location" style={{fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px'}}><MapPin size={12} /> {locationName}</p>}
            </div>
            <Link to="/sholat" className="dash-link">{t('nav.more')} →</Link>
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
                  <span className="dash-prayer-card__name">{getPrayerDisplayName(p.key, now, language, t)}</span>
                  <span className="dash-prayer-card__time">{fmt(timings[p.key])}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Tracker Summary */}
      <section className="dash-tracker container">
        <div className="dash-prayer__header">
          <h2 className="dash-section-title">✅ {t('nav.tracker')}</h2>
          <Link to="/tracker" className="dash-link">{t('btn.open')} →</Link>
        </div>
        <div className="dash-tracker__card">
          <p>{t('feature.tracker')}</p>
          <Link to="/tracker" className="btn btn--primary btn--sm">{t('btn.start')} →</Link>
        </div>
      </section>

      {/* Banner Section */}
      <section className="home-section container" style={{ marginTop: 'var(--sp-4)' }}>
        <HomeBanners />
      </section>

      {/* Apk Download Component */}
      {import.meta.env.VITE_APK_URL || import.meta.env.NEXT_PUBLIC_APK_URL ? (
        <section className="home-section container" style={{ paddingBottom: 'var(--sp-12)' }}>
          <ApkDownloadBar />
        </section>
      ) : null}
    </div>
  );
}
