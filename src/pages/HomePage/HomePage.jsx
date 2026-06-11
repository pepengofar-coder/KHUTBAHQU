/* eslint-disable no-undef */
import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO, JsonLd, SITE_URL, SITE_NAME } from '../../utils/seo';
import { getHijriDateString } from '../../data/hijriData';
import { useI18n, getPrayerDisplayName } from '../../context/I18nContext';
import { getDailyProgress } from '../../utils/dailyProgress';
import { DUMMY_ARTICLES } from '../../data/articleCategories';
import { DOA_DZIKIR_DATA } from '../../data/doaDzikir';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';
import { 
  BookOpen, Compass, ScrollText, Sparkles, ChevronRight, Headphones, 
  Clock, CheckSquare, Sunrise, Sun, CloudSun, Sunset, 
  Moon, MapPin, Bookmark, CircleDot, CalendarDays
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

export default function HomePage() {
  const { t, language } = useI18n();
  const navigate = useNavigate();

  useSEO({
    title: 'Islamediaku - Platform Islami Modern untuk Ibadah Harian',
    description: 'Baca Al-Qur’an, cek jadwal sholat, dengarkan murottal, catat ibadah harian, gunakan tasbih digital, dan akses doa harian dalam satu platform islami modern.',
    path: '/',
  });

  const now = useMemo(() => new Date(), []);
  const hijriStr = useMemo(() => getHijriDateString(now), [now]);
  const gregorian = useMemo(() => {
    const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  }, [now]);
  
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

  // Read daily progress again on focus to stay in sync
  useEffect(() => {
    const handleFocus = () => {
      setProgressData(getDailyProgress());
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, description: 'Platform Islami harian untuk Qur’an, doa, jadwal sholat, murottal, artikel edukasi, dan tracker ibadah.', inLanguage: 'id-ID', potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/khutbah?q={search_term_string}`, 'query-input': 'required name=search_term_string' } };
  const orgSchema = { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/logo.png` };

  // Calculate dynamic tracker variables
  const totalItems = 9;
  const doneCount = Object.values(progressData.tracker || {}).filter(Boolean).length;
  const percent = Math.round((doneCount / totalItems) * 100);
  const sholatDone = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].filter(id => progressData.tracker?.[id]).length;
  const dzikirDone = ['dzikir_pagi', 'dzikir_petang'].filter(id => progressData.tracker?.[id]).length;
  const tilawahDone = progressData.tracker?.tilawah ? 1 : 0;
  
  const nextPrayerDisplayName = timings && nextP ? getPrayerDisplayName(nextP.key, now, language, t) : '';
  const nextPrayerTime = timings && nextP ? fmt(timings[nextP.key]) : '';

  return (
    <div className="home-page">
      <JsonLd data={websiteSchema} />
      <JsonLd data={orgSchema} />

      {/* Futuristic Background Blur Glow Shapes */}
      <div className="blur-glow-shape blur-glow-shape--1"></div>
      <div className="blur-glow-shape blur-glow-shape--2"></div>

      {/* Main Hero Card Container */}
      <div className="container hero-container">
        <div className="hero-dashboard-card islamic-pattern">
          {/* Aesthetic Mosque Outline / Crescent Decoration */}
          <div className="hero-card-ornament">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 25 A 75 75 0 1 0 175 100 A 65 65 0 1 1 100 25 Z" fill="rgba(255, 255, 255, 0.035)" />
            </svg>
          </div>

          <div className="hero-dashboard-card__left">
            <div className="hero-dashboard-card__brand">
              <img src="/logo-icon.png" alt="" className="hero-dashboard-card__brand-logo" width={24} height={24} />
              <span className="hero-dashboard-card__brand-name">Islamediaku</span>
            </div>
            <h1 className="hero-dashboard-card__title">Sahabat Ibadah Harian</h1>
            <p className="hero-dashboard-card__desc">
              Baca Qur’an, pantau jadwal sholat, dzikir, murottal, dan catat ibadah harian dalam satu aplikasi.
            </p>
            <div className="hero-dashboard-card__ctas">
              <Link to="/mushaf" className="btn btn--primary hero-dashboard-card__btn">
                Baca Qur'an
              </Link>
              <Link to="/sholat" className="btn btn--secondary hero-dashboard-card__btn">
                Jadwal Sholat
              </Link>
            </div>
          </div>

          <div className="hero-dashboard-card__right">
            {timings && nextP && (
              <div className="next-prayer-glass-card">
                <div className="next-prayer-glass-card__header">
                  <span className="next-prayer-glass-card__label">Sholat Berikutnya</span>
                  {locationName && (
                    <span className="next-prayer-glass-card__city">
                      <MapPin size={10} style={{ marginRight: '3px', display: 'inline-block', verticalAlign: 'middle' }} />
                      {locationName}
                    </span>
                  )}
                </div>
                <div className="next-prayer-glass-card__body">
                  {(() => {
                    const NextPIcon = PRAYER_ICONS[nextP.key] || Sun;
                    return (
                      <h2 className="next-prayer-glass-card__name">
                        <NextPIcon size={20} className="text-accent" />
                        {nextPrayerDisplayName}
                      </h2>
                    );
                  })()}
                  <span className="next-prayer-glass-card__time">{nextPrayerTime}</span>
                </div>
                <div className="next-prayer-glass-card__footer">
                  <span className="next-prayer-glass-card__countdown">{countdown}</span>
                  <Link to="/sholat" className="next-prayer-glass-card__link">
                    Lihat Jadwal
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mini Dashboard Strip */}
      <div className="container">
        <div className="mini-dash-strip">
          <div className="mini-dash-pill">
            <CalendarDays size={14} className="text-blue" />
            <span>{gregorian}</span>
          </div>
          <div className="mini-dash-pill">
            <Moon size={14} className="text-gold" />
            <span>{hijriStr}</span>
          </div>
          <div className="mini-dash-pill">
            <Clock size={14} className="text-cyan" />
            <span>{nextPrayerDisplayName ? `${nextPrayerDisplayName} ${nextPrayerTime}` : '--:--'}</span>
          </div>
          <div className="mini-dash-pill">
            <CheckSquare size={14} className="text-mint" />
            <span>{doneCount}/{totalItems} Ibadah</span>
          </div>
        </div>
      </div>

      {/* Akses Cepat (Quick Action Cards) */}
      <section className="container home-section">
        <SectionHeader title="Akses Cepat" icon={Compass} />
        <div className="quick-access-grid">
          <Link to="/mushaf" className="quick-access-card">
            <span className="quick-access-icon bg-blue-soft"><BookOpen size={24} /></span>
            <h4 className="quick-access-title">Mushaf</h4>
            <p className="quick-access-desc">Baca Al-Qur'an harian</p>
          </Link>
          <Link to="/sholat" className="quick-access-card">
            <span className="quick-access-icon bg-cyan-soft"><Clock size={24} /></span>
            <h4 className="quick-access-title">Jadwal Sholat</h4>
            <p className="quick-access-desc">Waktu sholat & imsak</p>
          </Link>
          <Link to="/doa-dzikir" className="quick-access-card">
            <span className="quick-access-icon bg-mint-soft"><Sparkles size={24} /></span>
            <h4 className="quick-access-title">Doa & Dzikir</h4>
            <p className="quick-access-desc">Kumpulan doa & dzikir</p>
          </Link>
          <Link to="/murottal-30-juz" className="quick-access-card">
            <span className="quick-access-icon bg-indigo-soft"><Headphones size={24} /></span>
            <h4 className="quick-access-title">Murottal</h4>
            <p className="quick-access-desc">Dengarkan Juz 30</p>
          </Link>
          <Link to="/tasbih" className="quick-access-card">
            <span className="quick-access-icon bg-lavender-soft"><CircleDot size={24} /></span>
            <h4 className="quick-access-title">Tasbih</h4>
            <p className="quick-access-desc">Tasbih digital</p>
          </Link>
          <Link to="/kiblat" className="quick-access-card">
            <span className="quick-access-icon bg-gold-soft"><Compass size={24} /></span>
            <h4 className="quick-access-title">Kiblat</h4>
            <p className="quick-access-desc">Cek arah kiblat sholat</p>
          </Link>
        </div>
      </section>

      {/* Lanjutkan Aktivitas (Continue Activity) */}
      <section className="container home-section">
        <SectionHeader 
          title="Lanjutkan Aktivitas" 
          subtitle="Kembali ke aktivitas ibadah terakhir Anda"
          icon={Bookmark}
        />
        <div className="continue-activity-grid">
          {/* Card 1: Qur'an Reading */}
          {lastRead ? (
            <Card 
              onClick={() => navigate(`/mushaf/${lastRead.surah}`)} 
              className="continue-card-horiz" 
              hoverable
            >
              <div className="continue-card-horiz__left">
                <div className="continue-card-horiz__icon bg-blue-soft">
                  <BookOpen size={20} className="text-blue" />
                </div>
                <div className="continue-card-horiz__info">
                  <h4 className="continue-card-horiz__title">Surat {lastRead.surahName || `Surat ${lastRead.surah}`}</h4>
                  <p className="continue-card-horiz__subtitle">Ayat {lastRead.ayah} • Terakhir dibaca</p>
                </div>
              </div>
              <div className="btn btn--primary btn--sm continue-card-horiz__btn">
                Buka
              </div>
            </Card>
          ) : (
            <Card 
              onClick={() => navigate('/mushaf')} 
              className="continue-card-horiz" 
              hoverable
            >
              <div className="continue-card-horiz__left">
                <div className="continue-card-horiz__icon bg-blue-soft">
                  <BookOpen size={20} className="text-blue" />
                </div>
                <div className="continue-card-horiz__info">
                  <h4 className="continue-card-horiz__title">Mulai dari Al-Fatihah</h4>
                  <p className="continue-card-horiz__subtitle">Baca Al-Qur'an harian</p>
                </div>
              </div>
              <div className="btn btn--outline btn--sm continue-card-horiz__btn">
                Mulai
              </div>
            </Card>
          )}

          {/* Card 2: Murottal */}
          <Card 
            onClick={() => navigate('/murottal-30-juz')} 
            className="continue-card-horiz" 
            hoverable
          >
            <div className="continue-card-horiz__left">
              <div className="continue-card-horiz__icon bg-indigo-soft">
                <Headphones size={20} className="text-indigo" />
              </div>
              <div className="continue-card-horiz__info">
                <h4 className="continue-card-horiz__title">Murottal Juz 30</h4>
                <p className="continue-card-horiz__subtitle">Pilih qari Juz 30</p>
              </div>
            </div>
            <div className="btn btn--outline btn--sm continue-card-horiz__btn">
              Putar
            </div>
          </Card>

          {/* Card 3: Daily Dua */}
          <Card 
            onClick={() => navigate('/doa-dzikir')} 
            className="continue-card-horiz" 
            hoverable
          >
            <div className="continue-card-horiz__left">
              <div className="continue-card-horiz__icon bg-mint-soft">
                <Sparkles size={20} className="text-mint" />
              </div>
              <div className="continue-card-horiz__info">
                <h4 className="continue-card-horiz__title">Doa Pilihan</h4>
                <p className="continue-card-horiz__subtitle">Baca doa pilihan hari ini</p>
              </div>
            </div>
            <div className="btn btn--outline btn--sm continue-card-horiz__btn">
              Buka
            </div>
          </Card>
        </div>
      </section>

      {/* Today Content Grid (Dua Hari Ini & Artikel Edukasi Side-by-Side) */}
      <section className="container home-section">
        <div className="today-content-grid">
          {/* Today's Dua */}
          {dailyDoa && (
            <div className="today-content-grid__col">
              <SectionHeader 
                title="Doa Hari Ini" 
                subtitle="Renungan dan doa harian untuk dibaca"
                icon={Sparkles}
              />
              <Card className="p-5 flex flex-col justify-between h-full today-doa-card">
                <div>
                  <h4 className="text-sm font-bold text-[var(--color-primary)] mb-2">{dailyDoa.title}</h4>
                  <p className="text-right text-lg font-semibold text-[var(--color-text-primary)] leading-loose my-2 font-arabic select-all">
                    {dailyDoa.arabic}
                  </p>
                  {dailyDoa.latin && (
                    <p className="text-xs italic text-[var(--color-text-muted)] leading-relaxed mb-2">
                      "{dailyDoa.latin}"
                    </p>
                  )}
                  <p className="text-xs text-[var(--color-text-primary)] leading-relaxed">
                    <strong>Artinya:</strong> {dailyDoa.translation.length > 130 ? dailyDoa.translation.substring(0, 130) + '...' : dailyDoa.translation}
                  </p>
                  {dailyDoa.source && (
                    <div className="text-[9px] text-[var(--color-text-muted)] mt-2 font-medium">
                      Sumber: {dailyDoa.source}
                    </div>
                  )}
                </div>
                <div className="flex justify-start mt-4">
                  <Link to="/doa-dzikir" className="btn btn--outline btn--sm">
                    Semua Doa
                  </Link>
                </div>
              </Card>
            </div>
          )}

          {/* Educational Articles */}
          <div className="today-content-grid__col">
            <SectionHeader 
              title="Artikel Edukasi" 
              subtitle="Khazanah artikel Islami berlisensi resmi"
              icon={ScrollText}
            />
            <div className="flex flex-col gap-3 h-full justify-between">
              <div className="flex flex-col gap-3">
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
                      <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-1 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-2.5 mt-2.5">
                      <span>Sumber: {article.author}</span>
                      <span className="px-1.5 py-0.25 rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)]">
                        {article.license}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex justify-start mt-3">
                <Link to="/artikel" className="btn btn--outline btn--sm">
                  Lihat Semua Artikel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracker Summary Card */}
      <section className="container home-section">
        <SectionHeader 
          title="Ringkasan Ibadah Hari Ini" 
          subtitle="Pantau progres ibadah harian Anda"
          icon={CheckSquare}
        />
        <Card className="p-5 tracker-summary-card">
          <div className="tracker-summary-header flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-[var(--color-text-primary)]">Progres Hari Ini</h4>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{doneCount} dari {totalItems} aktivitas selesai</p>
            </div>
            <div className="tracker-summary-percentage font-bold text-lg text-[var(--color-primary)]">
              {percent}%
            </div>
          </div>
          
          <div className="w-full bg-[var(--color-border)] rounded-full h-2 mb-5 overflow-hidden">
            <div 
              className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-500" 
              style={{ width: `${percent}%` }}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="tracker-indicator-item p-3 rounded-xl bg-[var(--color-bg-secondary)] flex flex-col items-center justify-center border border-[var(--color-border)]">
              <Clock size={16} className="text-cyan mb-1" />
              <span className="text-[10px] font-bold text-[var(--color-text-muted)]">SHOLAT</span>
              <span className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">{sholatDone}/5</span>
            </div>
            <div className="tracker-indicator-item p-3 rounded-xl bg-[var(--color-bg-secondary)] flex flex-col items-center justify-center border border-[var(--color-border)]">
              <Sparkles size={16} className="text-mint mb-1" />
              <span className="text-[10px] font-bold text-[var(--color-text-muted)]">DZIKIR</span>
              <span className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">{dzikirDone}/2</span>
            </div>
            <div className="tracker-indicator-item p-3 rounded-xl bg-[var(--color-bg-secondary)] flex flex-col items-center justify-center border border-[var(--color-border)]">
              <BookOpen size={16} className="text-blue mb-1" />
              <span className="text-[10px] font-bold text-[var(--color-text-muted)]">TILAWAH</span>
              <span className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">{tilawahDone}/1</span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link to="/tracker" className="btn btn--primary btn--sm flex items-center gap-1">
              Buka Tracker <ChevronRight size={14} />
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
