import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import { getHijriDateString } from '../../data/hijriData';
import { getLocalizedGreeting } from '../../utils/dailyGreeting';
import {
  Target, BookOpen, Headphones, Heart, ChevronRight,
  Settings, Trash2, Smartphone, Clock,
  CheckCircle, Plus, X, Bookmark,
  Volume2, Compass, Sun, Moon, Footprints
} from 'lucide-react';
import './RuangSayaPage.css';

// ── Safe localStorage helpers ──
function safeJsonParse(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function getTodayKey() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localD = new Date(d.getTime() - (offset * 60 * 1000));
  return localD.toISOString().split('T')[0];
}

// ── SVG Progress Ring ──
function ProgressRing({ percent = 0, size = 120, stroke = 8 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color = percent >= 100 ? '#10B981' : percent >= 50 ? '#0047FF' : '#1D7CFF';

  return (
    <svg width={size} height={size} className="rs-progress-ring">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(0,71,255,0.08)" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
    </svg>
  );
}

export default function RuangSayaPage() {
  useSEO({
    title: 'Ruang Saya | Islamediaku',
    description: 'Dashboard pribadi untuk memantau progres ibadah, bacaan, dan kebiasaan baikmu.',
    path: '/ruang-saya',
    robots: 'noindex, follow',
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [gratitudeText, setGratitudeText] = useState('');
  const [gratitudeNotes, setGratitudeNotes] = useState(() => safeJsonParse('islamediaku_gratitude_notes', []));

  // ── Date & Greeting ──
  const now = useMemo(() => new Date(), []);
  const gregorian = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hijriStr = useMemo(() => getHijriDateString(now), [now]);
  const greeting = useMemo(() => {
    const locale = typeof localStorage !== 'undefined' ? (localStorage.getItem('islamediaku_locale') || 'id') : 'id';
    return getLocalizedGreeting(locale);
  }, []);

  const todayKey = getTodayKey();

  // ── Dynamic personal subtitle ──
  const hour = now.getHours();
  const personalSubtitle = hour < 10
    ? 'Semoga hari ini penuh keberkahan.'
    : hour < 15
    ? 'Lanjutkan kebaikan kecil yang sudah kamu mulai.'
    : hour < 18
    ? 'Satu langkah baik hari ini tetap berarti.'
    : 'Akhiri harimu dengan kebaikan dan syukur.';

  // ── Sync Tracker & Stats ──
  const trackerData = useMemo(() => safeJsonParse('islamediaku_tracker_daily', {}), []);
  const todayTracker = trackerData[todayKey] || {};

  const missions = useMemo(() => {
    const stored = safeJsonParse('islamediaku_daily_mission_progress');
    if (stored && stored.date === todayKey) return stored.data;
    return null;
  }, [todayKey]);

  const completedMissions = missions ? missions.filter(m => m.done).length : 0;
  const totalMissions = missions ? missions.length : 0;

  // Sholat count from tracker (keys containing 'sholat' or 'shalat')
  const sholatKeys = Object.keys(todayTracker).filter(k => /shol|shal|subuh|dzuhur|ashar|maghrib|isya/i.test(k));
  const sholatDone = sholatKeys.filter(k => todayTracker[k]).length;
  const sholatTotal = Math.max(sholatKeys.length, 5);

  // Dzikir Progress
  const dzikirPagi = safeJsonParse('islamediaku_dzikir_pagi_progress', { date: null, completed: [] });
  const dzikirPetang = safeJsonParse('islamediaku_dzikir_petang_progress', { date: null, completed: [] });
  const pagiDone = dzikirPagi.date === todayKey ? dzikirPagi.completed.length : 0;
  const petangDone = dzikirPetang.date === todayKey ? dzikirPetang.completed.length : 0;
  const dzikirCompletedToday = pagiDone + petangDone;

  // Steps
  const stepsData = safeJsonParse('islamediaku_steps_daily', {});
  const todaySteps = stepsData[todayKey] || 0;

  // Quran
  const quranLastPage = safeJsonParse('islamediaku_quran_page_state')?.last_page || null;
  const quranLastRead = safeJsonParse('islamediaku_quran_last_read');
  const quranBookmarks = safeJsonParse('islamediaku_quran_bookmarks', []);
  const mushafBookmarks = safeJsonParse('kq_mushaf_bookmarks', []);
  const favCount = safeJsonParse('islamediaku_favorites', []).length;
  const lastTilawah = safeJsonParse('kq_last_tilawah');
  const travelFavs = safeJsonParse('islamediaku_travel_favorites', []);

  // Overall Progress
  const totalTrackerItems = Object.keys(todayTracker).length > 0 ? Object.keys(todayTracker).length : 5;
  const completedTrackerItems = Object.values(todayTracker).filter(Boolean).length;

  const totalTasks = totalMissions + totalTrackerItems + 1;
  const completedTasks = completedMissions + completedTrackerItems + (dzikirCompletedToday > 0 ? 1 : 0);
  const progressPercent = totalTasks > 0 ? Math.min(Math.round((completedTasks / totalTasks) * 100), 100) : 0;

  const encourageMessage = progressPercent === 0
    ? 'Mulai dengan satu kebaikan hari ini.'
    : progressPercent < 50
    ? 'MasyaAllah, lanjutkan rutinitas baikmu.'
    : progressPercent < 100
    ? 'Sedikit lagi, semoga istiqamah.'
    : 'Alhamdulillah, target hari ini tercapai! 🎉';

  // Collection counts
  const totalBookmarks = quranBookmarks.length + mushafBookmarks.length;
  const totalFavorites = favCount + travelFavs.length;

  // ── Catatan Syukur Handlers ──
  const handleAddGratitude = (e) => {
    e.preventDefault();
    if (!gratitudeText.trim()) return;
    const newNote = { id: Date.now(), date: gregorian, text: gratitudeText.trim() };
    const updated = [newNote, ...gratitudeNotes].slice(0, 10);
    setGratitudeNotes(updated);
    localStorage.setItem('islamediaku_gratitude_notes', JSON.stringify(updated));
    setGratitudeText('');
  };

  const handleDeleteGratitude = (id) => {
    const updated = gratitudeNotes.filter(n => n.id !== id);
    setGratitudeNotes(updated);
    localStorage.setItem('islamediaku_gratitude_notes', JSON.stringify(updated));
  };

  // ── Reset handler ──
  const handleResetData = () => {
    const keysToReset = [
      'islamediaku_daily_mission_progress',
      'islamediaku_quran_last_read',
      'islamediaku_quran_page_state',
      'islamediaku_quran_bookmarks',
      'kq_mushaf_bookmarks',
      'islamediaku_favorites',
      'kq_last_tilawah',
      'islamediaku_tracker_daily',
      'islamediaku_gratitude_notes',
      'islamediaku_steps_daily',
      'islamediaku_travel_favorites',
      'islamediaku_travel_last_audio',
      'islamediaku_dzikir_pagi_progress',
      'islamediaku_dzikir_petang_progress'
    ];
    keysToReset.forEach(k => { try { localStorage.removeItem(k); } catch { /* safe */ } });
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="ruang-saya">
      {/* ═══ PREMIUM HERO ═══ */}
      <header className="rs-hero">
        <div className="rs-hero__inner">
          <div className="rs-hero__top">
            <img
              src="/logo-icon.png"
              alt="Islamediaku"
              className="rs-hero__logo"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="rs-hero__title-wrap">
              <h1 className="rs-hero__title">Ruang Saya</h1>
              <p className="rs-hero__subtitle">{personalSubtitle}</p>
            </div>
          </div>

          <div className="rs-hero__info-row">
            <div className="rs-hero__date-card">
              <p className="rs-hero__date">📅 {gregorian}</p>
              <p className="rs-hero__hijri">{hijriStr}</p>
              {greeting?.text && (
                <p className="rs-hero__greeting">"{greeting.text}"</p>
              )}
            </div>
          </div>

          <p className="rs-hero__device-note">
            <Smartphone size={11} /> Data disimpan di perangkat ini
          </p>
        </div>
      </header>

      <main className="rs-main">
        {/* ═══ PROGRESS FOCUS CARD ═══ */}
        <section className="rs-progress-card">
          <div className="rs-progress-card__ring-wrap">
            <ProgressRing percent={progressPercent} size={120} stroke={8} />
            <div className="rs-progress-card__ring-text">
              <span className="rs-progress-card__pct">{progressPercent}%</span>
              <span className="rs-progress-card__pct-label">Selesai</span>
            </div>
          </div>
          <div className="rs-progress-card__right">
            <h2 className="rs-progress-card__title">Progress Ibadah Hari Ini</h2>
            <p className="rs-progress-card__msg">{encourageMessage}</p>
            <div className="rs-progress-card__detail">
              <span>{completedTasks} dari {totalTasks} target</span>
            </div>
            <Link to="/tracker" className="rs-progress-card__btn">
              {completedTasks > 0 ? 'Buka Tracker' : 'Mulai Tracker'}
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>

        {/* ═══ DASHBOARD SUMMARY STATS ═══ */}
        <section className="rs-section">
          <div className="rs-stats-row">
            <div className="rs-stat-card rs-stat-card--blue">
              <div className="rs-stat-card__icon"><Sun size={20} /></div>
              <div className="rs-stat-card__body">
                <span className="rs-stat-card__value">{sholatDone}/{sholatTotal}</span>
                <span className="rs-stat-card__label">Sholat Hari Ini</span>
              </div>
            </div>
            <div className="rs-stat-card rs-stat-card--emerald">
              <div className="rs-stat-card__icon"><Moon size={20} /></div>
              <div className="rs-stat-card__body">
                <span className="rs-stat-card__value">{dzikirCompletedToday > 0 ? 'Selesai' : 'Belum'}</span>
                <span className="rs-stat-card__label">Dzikir {pagiDone > 0 ? 'Pagi' : petangDone > 0 ? 'Petang' : 'Harian'}</span>
              </div>
            </div>
            <div className="rs-stat-card rs-stat-card--indigo">
              <div className="rs-stat-card__icon"><Volume2 size={20} /></div>
              <div className="rs-stat-card__body">
                <span className="rs-stat-card__value">{lastTilawah ? 'Ada' : quranLastRead ? 'Ada' : '-'}</span>
                <span className="rs-stat-card__label">Tilawah Terakhir</span>
              </div>
            </div>
            <div className="rs-stat-card rs-stat-card--green">
              <div className="rs-stat-card__icon"><Footprints size={20} /></div>
              <div className="rs-stat-card__body">
                <span className="rs-stat-card__value">{todaySteps > 0 ? todaySteps.toLocaleString('id-ID') : '-'}</span>
                <span className="rs-stat-card__label">Langkah Sehat</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ LANJUTKAN AKTIVITAS ═══ */}
        <section className="rs-section">
          <h2 className="rs-section__title">Lanjutkan Aktivitas</h2>
          <div className="rs-activity-grid">
            <Link to={quranLastRead ? `/mushaf/${quranLastRead.surahId}` : '/mushaf'} className="rs-activity-card">
              <div className="rs-activity-card__icon rs-icon--blue"><BookOpen size={24} /></div>
              <div className="rs-activity-card__body">
                <h3>Lanjut Baca Mushaf</h3>
                <p>{quranLastRead ? `Surah ${quranLastRead.surahName || 'terakhir'}` : quranLastPage ? `Halaman ${quranLastPage}` : 'Mulai membaca Al-Qur\'an'}</p>
              </div>
              <ChevronRight size={20} className="rs-activity-card__arrow" />
            </Link>

            <Link to="/tilawah" className="rs-activity-card">
              <div className="rs-activity-card__icon rs-icon--cyan"><Headphones size={24} /></div>
              <div className="rs-activity-card__body">
                <h3>Lanjut Tilawah</h3>
                <p>{lastTilawah?.name ? lastTilawah.name : 'Dengarkan lantunan Al-Qur\'an'}</p>
              </div>
              <ChevronRight size={20} className="rs-activity-card__arrow" />
            </Link>

            <Link to="/doa-dzikir" className="rs-activity-card">
              <div className="rs-activity-card__icon rs-icon--emerald"><Compass size={24} /></div>
              <div className="rs-activity-card__body">
                <h3>Lanjut Dzikir</h3>
                <p>{dzikirCompletedToday > 0 ? `${dzikirCompletedToday} dzikir selesai hari ini` : 'Baca dzikir pagi atau petang'}</p>
              </div>
              <ChevronRight size={20} className="rs-activity-card__arrow" />
            </Link>

            <Link to="/tracker" className="rs-activity-card">
              <div className="rs-activity-card__icon rs-icon--orange"><Target size={24} /></div>
              <div className="rs-activity-card__body">
                <h3>Buka Tracker</h3>
                <p>Pantau kebiasaan ibadahmu</p>
              </div>
              <ChevronRight size={20} className="rs-activity-card__arrow" />
            </Link>
          </div>
        </section>

        {/* ═══ KOLEKSI SAYA ═══ */}
        <section className="rs-section">
          <h2 className="rs-section__title">Koleksi Saya</h2>
          {(totalBookmarks > 0 || totalFavorites > 0 || gratitudeNotes.length > 0) ? (
            <div className="rs-collection-grid">
              <Link to="/mushaf" className="rs-collection-card">
                <div className="rs-collection-card__icon"><Bookmark size={20} /></div>
                <div>
                  <h3>Favorit Saya</h3>
                  <p>{totalBookmarks > 0 ? `${totalBookmarks} ayat disimpan` : 'Belum ada bookmark'}</p>
                </div>
              </Link>
              <Link to={quranLastRead ? `/mushaf/${quranLastRead.surahId}` : '/mushaf'} className="rs-collection-card">
                <div className="rs-collection-card__icon"><Clock size={20} /></div>
                <div>
                  <h3>Riwayat Baca</h3>
                  <p>{quranLastRead ? `Surah ${quranLastRead.surahName || 'terakhir'}` : 'Belum ada riwayat'}</p>
                </div>
              </Link>
              <a href="#syukur-section" className="rs-collection-card">
                <div className="rs-collection-card__icon"><Heart size={20} /></div>
                <div>
                  <h3>Catatan Syukur</h3>
                  <p>{gratitudeNotes.length > 0 ? `${gratitudeNotes.length} catatan` : 'Belum ada catatan'}</p>
                </div>
              </a>
              <Link to={`/mushaf/page/${quranLastPage || 1}`} className="rs-collection-card">
                <div className="rs-collection-card__icon"><BookOpen size={20} /></div>
                <div>
                  <h3>Mushaf Per Halaman</h3>
                  <p>Lanjutkan bacaan terakhir</p>
                </div>
              </Link>
            </div>
          ) : (
            <div className="rs-empty-state">
              <Bookmark size={36} className="rs-empty-state__icon" />
              <p>Belum ada koleksi. Simpan ayat, kajian, atau catatan agar mudah dibuka lagi.</p>
            </div>
          )}
        </section>

        {/* ═══ PREMIUM MENU CARDS ═══ */}
        <section className="rs-section">
          <h2 className="rs-section__title">Menu Personal</h2>
          <div className="rs-menu-grid">
            <Link to={`/mushaf/page/${quranLastPage || 1}`} className="rs-menu-card">
              <div className="rs-menu-card__icon rs-icon--blue"><BookOpen size={24} /></div>
              <div className="rs-menu-card__content">
                <h3>Mushaf Per Halaman</h3>
                <p>Baca seperti mushaf cetak dan lanjutkan halaman terakhir.</p>
              </div>
            </Link>

            <Link to="/tracker" className="rs-menu-card">
              <div className="rs-menu-card__icon rs-icon--green"><Target size={24} /></div>
              <div className="rs-menu-card__content">
                <h3>Target Harian</h3>
                <p>Atur kebiasaan ibadah yang ingin dijaga.</p>
              </div>
            </Link>

            <Link to="/pengaturan" className="rs-menu-card">
              <div className="rs-menu-card__icon rs-icon--purple"><Settings size={24} /></div>
              <div className="rs-menu-card__content">
                <h3>Pengaturan Ibadah</h3>
                <p>Atur Mushaf, notifikasi sholat, dan tampilan.</p>
              </div>
            </Link>

            <Link to="/mode-perjalanan" className="rs-menu-card">
              <div className="rs-menu-card__icon rs-icon--orange"><Headphones size={24} /></div>
              <div className="rs-menu-card__content">
                <h3>Mode Safar</h3>
                <p>Audio Islami dan doa safar saat perjalanan.</p>
              </div>
            </Link>

            <div className="rs-menu-card" onClick={() => document.getElementById('syukur-input')?.focus()}>
              <div className="rs-menu-card__icon rs-icon--pink"><Heart size={24} /></div>
              <div className="rs-menu-card__content">
                <h3>Catatan Syukur</h3>
                <p>Simpan catatan kebaikan dan rasa syukur harian.</p>
              </div>
            </div>

            <Link to="/tracker" className="rs-menu-card">
              <div className="rs-menu-card__icon rs-icon--lime"><CheckCircle size={24} /></div>
              <div className="rs-menu-card__content">
                <h3>Pencapaian Hari Ini</h3>
                <p>Lihat kebiasaan baik yang sudah selesai.</p>
              </div>
            </Link>
          </div>
        </section>

        {/* ═══ CATATAN SYUKUR ═══ */}
        <section className="rs-card" id="syukur-section">
          <h2 className="rs-card__title"><Heart size={20} className="rs-icon--pink" style={{ background: 'transparent' }}/> Catatan Syukur</h2>
          <p className="rs-card__subtitle">Tuliskan hal baik yang kamu syukuri hari ini.</p>

          <form onSubmit={handleAddGratitude} className="rs-syukur-form">
            <input
              id="syukur-input"
              type="text"
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              placeholder="Alhamdulillah hari ini..."
              className="rs-syukur-input"
              maxLength={100}
            />
            <button type="submit" className="rs-syukur-btn" disabled={!gratitudeText.trim()}>
              <Plus size={20} />
            </button>
          </form>

          {gratitudeNotes.length > 0 && (
            <div className="rs-syukur-list">
              {gratitudeNotes.map(note => (
                <div key={note.id} className="rs-syukur-item">
                  <div className="rs-syukur-item__content">
                    <p className="rs-syukur-item__text">{note.text}</p>
                    <span className="rs-syukur-item__date">{note.date}</span>
                  </div>
                  <button type="button" className="rs-syukur-item__del" onClick={() => handleDeleteGratitude(note.id)}>
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ═══ RESET ═══ */}
        <section className="rs-card rs-card--reset">
          <button
            type="button"
            className="rs-reset-trigger"
            onClick={() => setShowResetConfirm(!showResetConfirm)}
          >
            <Trash2 size={18} />
            <span>Reset Data Lokal Ruang Saya</span>
          </button>
          {showResetConfirm && (
            <div className="rs-reset-confirm">
              <p>Semua data lokal (tracker, catatan syukur, bookmark, progress) akan dihapus. Tindakan ini tidak bisa dibatalkan.</p>
              <div className="rs-reset-confirm__actions">
                <button className="rs-reset-confirm__btn rs-reset-confirm__btn--danger" onClick={handleResetData}>
                  Ya, Hapus Semua
                </button>
                <button className="rs-reset-confirm__btn rs-reset-confirm__btn--cancel" onClick={() => setShowResetConfirm(false)}>
                  Batal
                </button>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
