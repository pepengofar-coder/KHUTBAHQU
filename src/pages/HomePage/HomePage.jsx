/* eslint-disable no-undef */
import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO, JsonLd, SITE_URL, SITE_NAME } from '../../utils/seo';
import { getHijriDateString } from '../../data/hijriData';
import { getLocalizedGreeting } from '../../utils/dailyGreeting';
import { useI18n, getPrayerDisplayName } from '../../context/I18nContext';
import ApkDownloadBar from '../../components/ApkDownloadBar/ApkDownloadBar';
import IllustratedFeatureCard from '../../components/IllustratedFeatureCard/IllustratedFeatureCard';
import DailyRecommendations from '../../components/DailyRecommendations/DailyRecommendations';
import SpiritualJourney from '../../components/SpiritualJourney/SpiritualJourney';
import useDailyMission from '../../hooks/useDailyMission';
import { getDailyProgress, updateTrackerItem } from '../../utils/dailyProgress';
import { DUMMY_ARTICLES } from '../../data/articleCategories';
import { DOA_DZIKIR_DATA } from '../../data/doaDzikir';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';
import { motion } from 'framer-motion';
import { 
  BookOpen, Compass, ScrollText, Sparkles, ChevronRight, Headphones, 
  CalendarDays, Clock, CheckSquare, Sunrise, Sun, CloudSun, Sunset, 
  Moon, MapPin, CheckCircle2, Circle, FileText, Bookmark 
} from 'lucide-react';
import './HomePage.css';

function SafarDashboardIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="safar-dashboard-icon">
      <defs>
        <linearGradient id="safarBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <filter id="safarGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="28" cy="28" r="26" fill="url(#safarBgGrad)" opacity="0.9" />
      <circle cx="28" cy="28" r="20" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="1 7" strokeLinecap="round" opacity="0.8" />
      <path d="M 33 16 A 11 11 0 0 1 24 33 A 11 11 0 0 0 33 16" fill="#ffffff" opacity="0.95" filter="url(#safarGlow)" />
      <path d="M 19 36 C 22 36, 25 38, 28 39 C 31 38, 34 36, 37 36 V 44 C 34 44, 31 45, 28 47 C 25 45, 22 44, 19 44 Z" fill="#ffffff" />
      <path d="M 28 39 V 47" stroke="#0d9488" strokeWidth="1.5" />
    </svg>
  );
}

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

function parseTime(s) {
  if (!s) return null;
  const [h, m] = s.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function fmt(s) {
  return s ? s.substring(0, 5) : '--:--';
}

function getNext(t) {
  const now = new Date();
  for (const p of PRAYERS) {
    const d = parseTime(t[p.key]);
    if (d && d > now) return p.key;
  }
  return PRAYERS[0].key;
}

export default function HomePage() {
  const { t, language } = useI18n();
  const { missions, toggleMission } = useDailyMission();
  const navigate = useNavigate();

  useSEO({
    title: 'Islamediaku - Platform Islami Modern untuk Ibadah Harian',
    description: 'Baca Al-Qur’an, cek jadwal sholat, dengarkan murottal, catat ibadah, gunakan tasbih digital, dan akses doa harian dalam satu platform islami modern.',
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
  
  // Last read progress state
  const [lastRead, setLastRead] = useState(null);

  // Random Daily Doa state
  const [dailyDoa, setDailyDoa] = useState(null);

  // Tracker Progress state
  const [progressData, setProgressData] = useState(() => getDailyProgress());

  useEffect(() => {
    // Load last read surah from localStorage
    try {
      const stored = localStorage.getItem('islamediaku_quran_last_read');
      if (stored) setLastRead(JSON.parse(stored));
    } catch (e) {
      console.warn('Failed parsing last read:', e);
    }

    // Load a random daily Doa from categories (harian)
    const harianDoas = DOA_DZIKIR_DATA.filter(d => d.category === 'harian');
    if (harianDoas.length > 0) {
      const randomIdx = Math.floor(Math.random() * harianDoas.length);
      setDailyDoa(harianDoas[randomIdx]);
    }
  }, []);

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
    setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
  }, [nowTime, timings, nextKey]);

  const toggleIbadah = (id) => {
    setProgressData(prev => updateTrackerItem(id, prev));
  };

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
            
            {/* Hero CTAs */}
            <div className="dash-hero__ctas">
              <Link to="/mushaf" className="btn btn--primary hero-cta-btn">
                Mulai Baca Qur'an
              </Link>
              <Link to="/sholat" className="btn btn--secondary hero-cta-btn">
                Cek Jadwal Sholat
              </Link>
            </div>
            
            {/* Compact Mini Goal Tracker */}
            <div className="dash-hero__mini-goals">
              <span className="dash-hero__mini-goals-title">Misi</span>
              <div className="dash-hero__mini-goals-list">
                {missions.map(m => (
                  <motion.button
                    key={m.id}
                    className={`dash-hero__mini-goal-item ${m.done ? 'done' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleMission(m.id);
                    }}
                    title={m.label}
                    whileHover={{ scale: 1.12, y: -2 }}
                    whileTap={{ scale: 0.92, y: 0 }}
                  >
                    <span className="dash-hero__mini-goal-emoji">{m.icon}</span>
                    <span className="dash-hero__mini-goal-dot" />
                  </motion.button>
                ))}
              </div>
            </div>
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

      {/* Greeting Card */}
      <div className={`container greeting-card-wrapper ${greetingFade}`}>
         <div className="greeting-card">
           <span className="greeting-card-icon">💡</span>
           <p className="greeting-card-text">{greeting.text}</p>
         </div>
      </div>

      {/* Daily Mission Section */}
      <SpiritualJourney />

      {/* NEW: Lanjutkan Bacaan (Last Read Progress) */}
      <section className="container home-section" style={{ marginTop: 'var(--sp-2)' }}>
        <SectionHeader 
          title="Lanjutkan Bacaan" 
          subtitle="Aktivitas membaca Al-Qur'an terakhir Anda"
          icon={Bookmark}
        />
        {lastRead ? (
          <Card 
            onClick={() => navigate(`/mushaf/${lastRead.surah}`)} 
            className="flex items-center justify-between p-4" 
            hoverable
          >
            <div>
              <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                Surat {lastRead.surahName || `Surat ${lastRead.surah}`}
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Ayat {lastRead.ayah} • Terakhir dibaca
              </p>
            </div>
            <div className="btn btn--primary btn--sm flex items-center gap-1">
              Buka <ChevronRight size={14} />
            </div>
          </Card>
        ) : (
          <Card 
            onClick={() => navigate('/mushaf')} 
            className="flex items-center justify-between p-4" 
            hoverable
          >
            <div>
              <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                Mulai Membaca Al-Qur'an
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Belum ada riwayat membaca. Klik untuk membuka surat Al-Fatihah.
              </p>
            </div>
            <div className="btn btn--outline btn--sm flex items-center gap-1">
              Mulai <ChevronRight size={14} />
            </div>
          </Card>
        )}
      </section>

      {/* Quick Actions / Shortcuts */}
      <section className="dash-actions container">
        <SectionHeader title={t('nav.more')} icon={Compass} />
        
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
            to="/artikel"
            visual={FileText}
            colorVariant="blue"
            title="Artikel"
            subtitle="Edukasi & Sejarah Islam Legal"
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
        </div>
      </section>

      {/* NEW: Doa Harian Ringkas */}
      {dailyDoa && (
        <section className="container home-section">
          <SectionHeader 
            title="Doa Hari Ini" 
            subtitle="Renungan dan doa harian untuk dibaca"
            icon={Sparkles}
            actionLink="/doa-dzikir"
            actionLabel="Semua Doa"
          />
          <Card className="p-5 flex flex-col gap-3">
            <h4 className="text-sm font-bold text-[var(--color-primary)]">{dailyDoa.title}</h4>
            <p className="text-right text-lg md:text-xl font-semibold text-[var(--color-text-primary)] leading-loose my-2 font-arabic select-all">
              {dailyDoa.arabic}
            </p>
            {dailyDoa.latin && (
              <p className="text-xs italic text-[var(--color-text-muted)] leading-relaxed">
                "{dailyDoa.latin}"
              </p>
            )}
            <p className="text-xs text-[var(--color-text-primary)] leading-relaxed">
              <strong>Artinya:</strong> {dailyDoa.translation}
            </p>
            <span className="text-[9px] text-[var(--color-text-muted)] mt-1 font-medium">
              Sumber: {dailyDoa.source}
            </span>
          </Card>
        </section>
      )}

      {/* NEW: Tracker Ibadah Ringkas */}
      <section className="container home-section">
        <SectionHeader 
          title="Tracker Sholat Hari Ini" 
          subtitle="Catat ibadah wajib sholat lima waktu"
          icon={CheckSquare}
          actionLink="/tracker"
          actionLabel="Tracker Lengkap"
        />
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map(id => {
            const isDone = progressData.tracker?.[id];
            const labels = { subuh: 'Subuh', dzuhur: 'Dzuhur', ashar: 'Ashar', maghrib: 'Maghrib', isya: 'Isya' };
            const icons = { subuh: '🌙', dzuhur: '☀️', ashar: '🌤️', maghrib: '🌇', isya: '🌃' };
            
            return (
              <Card 
                key={id}
                onClick={() => toggleIbadah(id)}
                className={`flex items-center justify-between p-3.5 transition-all ${
                  isDone ? 'bg-[var(--color-primary-light)]/20 border-[var(--color-primary)]/40' : ''
                }`}
                hoverable
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{icons[id]}</span>
                  <span className="text-xs font-semibold text-[var(--color-text-primary)]">{labels[id]}</span>
                </div>
                <div className="text-[var(--color-primary)]">
                  {isDone ? <CheckCircle2 size={18} fill="currentColor" className="text-white" /> : <Circle size={18} className="text-[var(--color-border)]" />}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* NEW: Artikel Edukasi Terkini */}
      <section className="container home-section">
        <SectionHeader 
          title="Artikel Edukasi" 
          subtitle="Khazanah artikel Islami legal berlisensi resmi"
          icon={ScrollText}
          actionLink="/artikel"
          actionLabel="Lihat Semua"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DUMMY_ARTICLES.slice(0, 2).map(article => (
            <Card 
              key={article.slug}
              onClick={() => navigate(`/artikel/${article.slug}`)}
              className="p-4 flex flex-col justify-between"
              hoverable
            >
              <div>
                <span className="text-[9px] font-bold text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded uppercase tracking-wide">
                  {article.category.replace('-', ' ')}
                </span>
                <h4 className="text-sm font-bold text-[var(--color-text-primary)] mt-2 line-clamp-1 hover:text-[var(--color-primary)] transition-colors">
                  {article.title}
                </h4>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>
              <div className="flex items-center justify-between text-[9px] text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-3 mt-3">
                <span>Sumber: {article.author}</span>
                <span className="px-1.5 py-0.25 rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)]">
                  {article.license}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Travel Mode Shortcut Banner */}
      <section className="home-section dash-travel-banner container">
        <Link to="/mode-perjalanan" className="travel-banner-card">
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
          <div className="travel-banner-content">
            <motion.div 
              className="travel-banner-icon-wrap"
              whileHover={{ scale: 1.15, rotate: 6 }}
              whileTap={{ scale: 0.92, rotate: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 14 }}
            >
              <SafarDashboardIcon />
              <div className="travel-banner__compass-glow" />
            </motion.div>
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

      {/* Prayer Times Mini Schedule */}
      {timings && (
        <section className="home-section dash-prayer container">
          <div className="dash-prayer__header">
            <div>
              <h2 className="dash-section-title">Jadwal Lengkap Hari Ini</h2>
              {locationName && <p className="dash-prayer__location" style={{fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px'}}><MapPin size={12} /> {locationName}</p>}
            </div>
            <Link to="/sholat" className="dash-link">Lihat Jadwal Lengkap &rarr;</Link>
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

      {/* Benefits Section */}
      <section className="dash-benefits container home-section">
        <SectionHeader title="Mengapa Memilih Kami?" icon={Sparkles} />
        <div className="dash-benefits__grid">
          <div className="dash-benefit-card">
            <div className="dash-benefit-card__icon-wrap">🕋</div>
            <h3>Semua Fitur Islami</h3>
            <p>Mulai dari jadwal sholat, Qur'an, murottal, tracker ibadah, tasbih digital hingga mode safar terintegrasi.</p>
          </div>
          <div className="dash-benefit-card">
            <div className="dash-benefit-card__icon-wrap">🎨</div>
            <h3>Tampilan Modern</h3>
            <p>Tampilan modern, elegan, premium, dan sangat mudah digunakan oleh siapa saja.</p>
          </div>
          <div className="dash-benefit-card">
            <div className="dash-benefit-card__icon-wrap">📅</div>
            <h3>Cocok Harian</h3>
            <p>Pendamping terbaik untuk mencatat dan memantau perkembangan ibadah harian Anda secara konsisten.</p>
          </div>
          <div className="dash-benefit-card">
            <div className="dash-benefit-card__icon-wrap">🚀</div>
            <h3>Ringan & Responsif</h3>
            <p>Sangat ringan diakses, hemat memori, dan sangat responsif di berbagai perangkat mobile.</p>
          </div>
        </div>
      </section>

      {/* Today's Choices (Daily Recommendations) */}
      <section className="home-section container" style={{ marginTop: 'var(--sp-4)' }}>
        <DailyRecommendations />
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
