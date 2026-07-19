/* eslint-disable no-undef */
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO, JsonLd, SITE_URL, SITE_NAME } from '../../utils/seo';
import { getHijriDateString } from '../../data/hijriData';
import { getLocalizedGreeting } from '../../utils/dailyGreeting';
import { useI18n, getPrayerDisplayName } from '../../context/I18nContext';
import IllustratedFeatureCard from '../../components/IllustratedFeatureCard/IllustratedFeatureCard';
import SpiritualJourney from '../../components/SpiritualJourney/SpiritualJourney';
import useDailyMission from '../../hooks/useDailyMission';
import { DOA_DZIKIR_DATA } from '../../data/doaDzikir';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';
import { motion, useInView } from 'framer-motion';
import { 
  BookOpen, Compass, Sparkles, ChevronRight, Headphones, 
  CalendarDays, Clock, CheckSquare, Sunrise, Sun, CloudSun, Sunset, 
  Moon, MapPin, CircleDot, ScrollText, Music, Car, Dumbbell,
  Copy, Check, Zap, TrendingUp, Award
} from 'lucide-react';
import './HomePage.css';

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

// ---- Streak Counter ----
function getStreak() {
  try {
    const stored = JSON.parse(localStorage.getItem('islamediaku_streak') || '{}');
    const today = new Date().toISOString().split('T')[0];
    if (stored.lastDate === today) return stored.count || 1;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (stored.lastDate === yesterday) {
      const newCount = (stored.count || 0) + 1;
      localStorage.setItem('islamediaku_streak', JSON.stringify({ lastDate: today, count: newCount }));
      return newCount;
    }
    localStorage.setItem('islamediaku_streak', JSON.stringify({ lastDate: today, count: 1 }));
    return 1;
  } catch { return 1; }
}

function updateStreak() {
  try {
    const stored = JSON.parse(localStorage.getItem('islamediaku_streak') || '{}');
    const today = new Date().toISOString().split('T')[0];
    if (stored.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const count = stored.lastDate === yesterday ? (stored.count || 0) + 1 : 1;
      localStorage.setItem('islamediaku_streak', JSON.stringify({ lastDate: today, count }));
    }
  } catch { /* silent */ }
}

// ---- Scroll-triggered animation wrapper ----
function ScrollReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ---- Animated Number ----
function AnimatedNumber({ value, duration = 1500 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseInt(value) || 0;
    if (end === 0) return;
    const step = Math.ceil(end / (duration / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { start = end; clearInterval(timer); }
      setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

export default function HomePage() {
  const { t, language } = useI18n();
  const { missions, toggleMission } = useDailyMission();
  const navigate = useNavigate();

  useSEO({
    title: 'Islamediaku — Sahabat Ibadah Harian Muslim',
    description: 'Baca Al-Qur\'an, cek jadwal sholat, dengarkan murottal 30 juz, catat ibadah harian, gunakan tasbih digital, dan akses doa & dzikir dalam satu platform Islami modern.',
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
  const [doaCopied, setDoaCopied] = useState(false);

  // Streak
  const [streak, setStreak] = useState(1);

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

    // Update streak
    updateStreak();
    setStreak(getStreak());
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
  const [prayerProgress, setPrayerProgress] = useState(0);
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

    // Calculate progress to next prayer
    const nextIdx = PRAYERS.findIndex(p => p.key === nextKey);
    const prevIdx = nextIdx > 0 ? nextIdx - 1 : PRAYERS.length - 1;
    const prevTime = parseTime(timings[PRAYERS[prevIdx].key]);
    if (prevTime && t) {
      let total = t - prevTime; if (total < 0) total += 864e5;
      let elapsed = nowTime - prevTime; if (elapsed < 0) elapsed += 864e5;
      setPrayerProgress(Math.min(100, Math.max(0, (elapsed / total) * 100)));
    }
  }, [nowTime, timings, nextKey]);

  // Copy doa to clipboard
  const handleCopyDoa = useCallback(async () => {
    if (!dailyDoa) return;
    try {
      const text = `${dailyDoa.title}\n\n${dailyDoa.arabic}\n\n${dailyDoa.latin || ''}\n\nArtinya: ${dailyDoa.translation}\n\nSumber: ${dailyDoa.source}`;
      await navigator.clipboard.writeText(text);
      setDoaCopied(true);
      setTimeout(() => setDoaCopied(false), 2000);
    } catch { /* silent */ }
  }, [dailyDoa]);

  const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, description: 'Platform Islami harian untuk Qur\'an, jadwal sholat, doa, dzikir, tilawah, dan tracker ibadah.', inLanguage: 'id-ID', potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/khutbah?q={search_term_string}`, 'query-input': 'required name=search_term_string' } };
  const orgSchema = { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/logo.png` };

  return (
    <div className="home-page">
      <JsonLd data={websiteSchema} />
      <JsonLd data={orgSchema} />

      {/* ═══════════════ A. Hero Section — Premium Immersive ═══════════════ */}
      <section className="dash-hero islamic-pattern">
        <div className="dash-hero__inner container">
          <div className="dash-hero__content">
            <motion.h1 
              className="dash-hero__salam"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Islamediaku
            </motion.h1>
            <motion.p 
              className="dash-hero__desc"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Sahabat ibadah harian Anda — Al-Qur'an, jadwal sholat, doa & dzikir, arah kiblat, dan tracker ibadah dalam satu platform.
            </motion.p>
            <p className="dash-hero__date">{gregorian} &bull; <span>{hijriStr}</span></p>
            
            {/* Streak Badge */}
            {streak > 1 && (
              <motion.div 
                className="dash-hero__streak"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <Zap size={14} />
                <span>{streak} hari berturut-turut</span>
              </motion.div>
            )}
            
            {/* Hero CTAs */}
            <div className="dash-hero__ctas">
              <Link to="/mushaf" className="btn btn--primary hero-cta-btn">
                <BookOpen size={16} /> Baca Qur'an
              </Link>
              <Link to="/sholat" className="btn btn--secondary hero-cta-btn">
                <Clock size={16} /> Jadwal Sholat
              </Link>
            </div>
            
            {/* Compact Mini Goal Tracker */}
            <div className="dash-hero__mini-goals">
              <span className="dash-hero__mini-goals-title">Misi Harian</span>
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
            <motion.div 
              className="dash-hero__prayer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="dash-hero__prayer-left">
                <span className="dash-hero__prayer-label">{t('home.next_prayer.title')}</span>
                <div className="dash-hero__prayer-name-row">
                  {(() => {
                    const NextPIcon = PRAYER_ICONS[nextP.key] || Sun;
                    return <h2 className="dash-hero__prayer-name"><NextPIcon size={20} /> {getPrayerDisplayName(nextP.key, now, language, t)}</h2>;
                  })()}
                </div>
                <span className="dash-hero__prayer-time">{fmt(timings[nextP.key])}</span>
                {/* Prayer Progress Bar */}
                <div className="dash-hero__prayer-progress">
                  <motion.div 
                    className="dash-hero__prayer-progress-fill"
                    animate={{ width: `${prayerProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
              
              <div className="dash-hero__prayer-right">
                <Link to="/sholat" className="dash-hero__prayer-link">{t('home.next_prayer.view')} <ChevronRight size={14} /></Link>
                <span className="dash-hero__prayer-countdown">{countdown}</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quick Action Floating Shortcuts */}
      <div className="home-quick-actions container">
        <Link to="/mushaf" className="home-quick-action" aria-label="Qur'an">
          <div className="home-quick-action__icon home-quick-action__icon--quran"><BookOpen size={18} /></div>
          <span>Qur'an</span>
        </Link>
        <Link to="/sholat" className="home-quick-action" aria-label="Sholat">
          <div className="home-quick-action__icon home-quick-action__icon--sholat"><Clock size={18} /></div>
          <span>Sholat</span>
        </Link>
        <Link to="/doa-dzikir" className="home-quick-action" aria-label="Doa">
          <div className="home-quick-action__icon home-quick-action__icon--doa"><Sparkles size={18} /></div>
          <span>Doa</span>
        </Link>
        <Link to="/tasbih" className="home-quick-action" aria-label="Tasbih">
          <div className="home-quick-action__icon home-quick-action__icon--tasbih"><CircleDot size={18} /></div>
          <span>Tasbih</span>
        </Link>
        <Link to="/kiblat" className="home-quick-action" aria-label="Kiblat">
          <div className="home-quick-action__icon home-quick-action__icon--kiblat"><Compass size={18} /></div>
          <span>Kiblat</span>
        </Link>
      </div>

      {/* Greeting Card */}
      <div className={`container greeting-card-wrapper ${greetingFade}`}>
         <div className="greeting-card">
           <span className="greeting-card-icon">💡</span>
           <p className="greeting-card-text">{greeting.text}</p>
         </div>
      </div>

      {/* ═══════════════ Perjalanan Spiritual (Unified Tracker) ═══════════════ */}
      <ScrollReveal>
        <SpiritualJourney />
      </ScrollReveal>

      {/* ═══════════════ Lanjutkan Bacaan ═══════════════ */}
      <ScrollReveal delay={0.1}>
        <section className="container home-section">
          {lastRead ? (
            <Card 
              onClick={() => navigate(`/mushaf/${lastRead.surah}`)} 
              className="continue-reading-card" 
              hoverable
            >
              <div className="continue-reading-card__body">
                <div className="continue-reading-card__icon-container">
                  <BookOpen size={20} />
                </div>
                <div className="continue-reading-card__details">
                  <div className="continue-reading-card__header">
                    <span className="continue-reading-card__title">Lanjutkan Membaca</span>
                    <span className="continue-reading-card__subtitle">Aktivitas terakhir Anda</span>
                  </div>
                  <div className="continue-reading-card__location">
                    <span className="continue-reading-card__surah">
                      Surat {lastRead.surahName || `Surat ${lastRead.surah}`}
                    </span>
                    <span className="continue-reading-card__ayah">
                      Ayat {lastRead.ayah}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/mushaf/${lastRead.surah}`);
                }}
                className="continue-reading-card__btn"
              >
                Buka <ChevronRight size={14} />
              </button>
            </Card>
          ) : (
            <Card 
              onClick={() => navigate('/mushaf')} 
              className="continue-reading-card" 
              hoverable
            >
              <div className="continue-reading-card__body">
                <div className="continue-reading-card__icon-container">
                  <BookOpen size={20} />
                </div>
                <div className="continue-reading-card__details">
                  <div className="continue-reading-card__header">
                    <span className="continue-reading-card__title">Mulai Membaca Al-Qur'an</span>
                    <span className="continue-reading-card__subtitle">Belum ada riwayat membaca</span>
                  </div>
                  <div className="continue-reading-card__location">
                    <span className="continue-reading-card__surah">Surat Al-Fatihah</span>
                    <span className="continue-reading-card__ayah">Ayat 1</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/mushaf');
                }}
                className="continue-reading-card__btn continue-reading-card__btn--start"
              >
                Mulai <ChevronRight size={14} />
              </button>
            </Card>
          )}
        </section>
      </ScrollReveal>

      {/* ═══════════════ B. Main Feature Cards ═══════════════ */}
      <ScrollReveal delay={0.15}>
        <section className="dash-actions container">
          <SectionHeader title={t('nav.more')} icon={Compass} />
          
          {/* Group: Al-Qur'an */}
          <h4 className="feature-group-label">📖 Al-Qur'an</h4>
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
              to="/tilawah"
              visual={Headphones}
              colorVariant="indigo"
              title="Tilawah"
              subtitle="Dengarkan tilawah Al-Qur'an"
            />

            <IllustratedFeatureCard
              to="/murottal-30-juz"
              visual={Music}
              colorVariant="purple"
              title="Murottal 30 Juz"
              subtitle="Murottal lengkap 30 Juz"
            />
          </div>

          {/* Group: Ibadah Harian */}
          <h4 className="feature-group-label">🕌 Ibadah Harian</h4>
          <div className="dash-actions__grid-main">
            <IllustratedFeatureCard
              to="/sholat"
              visual={Clock}
              colorVariant="cyan"
              title={t('nav.prayer')}
              subtitle={t('feature.prayer').split(' - ')[1] || t('feature.prayer')}
            />

            <IllustratedFeatureCard
              to="/kiblat"
              visual={Compass}
              colorVariant="gold"
              title={t('nav.qibla')}
              subtitle={t('feature.qibla').split(' - ')[1] || t('feature.qibla')}
            />

            <IllustratedFeatureCard
              to="/doa-dzikir"
              visual={Sparkles}
              colorVariant="mint"
              title={t('nav.dua_dhikr')}
              subtitle={t('feature.dua').split(' - ')[1] || t('feature.dua')}
            />

            <IllustratedFeatureCard
              to="/tasbih"
              visual={CircleDot}
              colorVariant="indigo"
              title="Tasbih Digital"
              subtitle="Counter dzikir & tasbih"
            />
          </div>

          {/* Group: Produktivitas & Kebiasaan */}
          <h4 className="feature-group-label">✅ Produktivitas & Kebiasaan</h4>
          <div className="dash-actions__grid-main">
            <IllustratedFeatureCard
              to="/tracker"
              visual={CheckSquare}
              colorVariant="lime"
              title={t('nav.tracker')}
              subtitle={t('feature.tracker').split(' - ')[1] || t('feature.tracker')}
            />

            <IllustratedFeatureCard
              to="/good-path"
              visual={Compass}
              colorVariant="emerald"
              title="Good Path"
              subtitle="Sistem pembiasaan & perbaikan diri"
            />

            <IllustratedFeatureCard
              to="/good-path/home-workout"
              visual={Dumbbell}
              colorVariant="orange"
              title="Home Workout"
              subtitle="Latihan fisik terstruktur di rumah"
            />
          </div>

          {/* Group: Fitur Pendukung */}
          <h4 className="feature-group-label">🌙 Fitur Pendukung</h4>
          <div className="dash-actions__grid-main">
            <IllustratedFeatureCard
              to="/kalender-hijriah"
              visual={CalendarDays}
              colorVariant="lavender"
              title={t('nav.calendar')}
              subtitle={t('feature.calendar').split(' - ')[1] || t('feature.calendar')}
            />

            <IllustratedFeatureCard
              to="/khutbah"
              visual={ScrollText}
              colorVariant="amber"
              title="Khutbah"
              subtitle="Materi khutbah pilihan"
            />

            <IllustratedFeatureCard
              to="/mode-perjalanan"
              visual={Car}
              colorVariant="teal"
              title="Mode Perjalanan"
              subtitle="Panduan ibadah saat safar"
            />
          </div>
        </section>
      </ScrollReveal>

      {/* ═══════════════ C. Doa Hari Ini ═══════════════ */}
      {dailyDoa && (
        <ScrollReveal delay={0.1}>
          <section className="container home-section daily-doa-section">
            <div className="daily-doa-header">
              <div className="daily-doa-header__left">
                <div className="daily-doa-header__icon-wrapper">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="daily-doa-header__title">Doa Hari Ini</h3>
                  <p className="daily-doa-header__subtitle">Renungan dan doa harian untuk dibaca</p>
                </div>
              </div>
              <Link to="/doa-dzikir" className="daily-doa-header__link">
                Semua Doa <span className="arrow">&rarr;</span>
              </Link>
            </div>

            <Card className="daily-doa-card">
              <div className="daily-doa-card__body">
                <h4 className="daily-doa-card__title">{dailyDoa.title}</h4>
                
                <p className="daily-doa-card__arabic font-arabic select-all">
                  {dailyDoa.arabic}
                </p>
                
                {dailyDoa.latin && (
                  <p className="daily-doa-card__latin">
                    "{dailyDoa.latin}"
                  </p>
                )}
                
                <div className="daily-doa-card__translation">
                  <strong className="daily-doa-card__translation-label">Artinya:</strong>
                  <p className="daily-doa-card__translation-text">{dailyDoa.translation}</p>
                </div>
                
                <div className="daily-doa-card__footer">
                  <span className="daily-doa-card__source">Sumber: {dailyDoa.source}</span>
                  <button 
                    className={`daily-doa-card__copy-btn ${doaCopied ? 'copied' : ''}`}
                    onClick={handleCopyDoa}
                    aria-label="Salin doa"
                  >
                    {doaCopied ? <><Check size={13} /> Tersalin</> : <><Copy size={13} /> Salin</>}
                  </button>
                </div>
              </div>
            </Card>
          </section>
        </ScrollReveal>
      )}

      {/* ═══════════════ Travel Mode Compact Card ═══════════════ */}
      <ScrollReveal delay={0.05}>
        <section className="home-section container">
          <Link to="/mode-perjalanan" className="travel-compact-card">
            <div className="travel-compact-card__icon">
              <Car size={22} />
            </div>
            <div className="travel-compact-card__text">
              <strong>Mode Perjalanan</strong>
              <p>Panduan ibadah, doa safar, kiblat & radio Islami saat bepergian</p>
            </div>
            <ChevronRight size={18} className="travel-compact-card__arrow" />
          </Link>
        </section>
      </ScrollReveal>

      {/* ═══════════════ Prayer Times Mini Schedule ═══════════════ */}
      {timings && (
        <ScrollReveal delay={0.1}>
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
        </ScrollReveal>
      )}

      {/* ═══════════════ Benefits Section ═══════════════ */}
      <ScrollReveal delay={0.15}>
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
      </ScrollReveal>
    </div>
  );
}
