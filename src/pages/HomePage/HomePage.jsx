/* eslint-disable no-undef */
import { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSEO, JsonLd, SITE_URL, SITE_NAME } from '../../utils/seo';
import { getHijriDateString } from '../../data/hijriData';
import { getLocalizedGreeting } from '../../utils/dailyGreeting';
import { useI18n, getPrayerDisplayName } from '../../context/I18nContext';
import ApkDownloadBar from '../../components/ApkDownloadBar/ApkDownloadBar';
import IllustratedFeatureCard from '../../components/IllustratedFeatureCard/IllustratedFeatureCard';
import KajianBannerCard from '../../components/KajianBannerCard/KajianBannerCard';
import DailyMission from '../../components/DailyMission/DailyMission';
import { BookOpen, Compass, ScrollText, Sparkles, ChevronRight, Headphones, CalendarDays, Clock, CheckSquare, Sunrise, Sun, CloudSun, Sunset, Moon, MapPin } from 'lucide-react';
import './HomePage.css';

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
      {/* Travel Mode Shortcut Banner */}
      <section className="home-section dash-travel-banner container">
        <Link to="/mode-perjalanan" className="travel-banner-card">
          <div className="travel-banner-content">
            <div className="travel-banner-icon-wrap">
              <span className="travel-car-icon">🚗</span>
            </div>
            <div className="travel-banner-text">
              <strong>Sedang dalam perjalanan?</strong>
              <p>Aktifkan Mode Safar untuk akses cepat doa, arah kiblat, dan murottal penenang jalan.</p>
            </div>
          </div>
          <div className="travel-banner-action">
            Aktifkan Mode Safar <ChevronRight size={16} />
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

      {/* Kajian Banner */}
      <section className="home-section container" style={{ marginTop: 'var(--sp-4)' }}>
        <KajianBannerCard />
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
