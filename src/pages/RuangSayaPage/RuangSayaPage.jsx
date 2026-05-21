import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import { getHijriDateString } from '../../data/hijriData';
import { getLocalizedGreeting } from '../../utils/dailyGreeting';
import {
  Target, BookOpen, Headphones, Heart, ChevronRight,
  Star, Settings, Trash2, Smartphone, Clock,
  CheckCircle, Plus, X, ListTodo, Activity
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
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function RuangSayaPage() {
  useSEO({
    title: 'Ruang Saya | Islamediaku',
    description: 'Tempat menyimpan progres ibadah, bacaan, dan kebiasaan baikmu.',
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

  // Dzikir Progress (Pagi & Petang merged simplified)
  const dzikirPagi = safeJsonParse('islamediaku_dzikir_pagi_progress', { date: null, completed: [] });
  const dzikirPetang = safeJsonParse('islamediaku_dzikir_petang_progress', { date: null, completed: [] });
  const dzikirCompletedToday = (dzikirPagi.date === todayKey ? dzikirPagi.completed.length : 0) + 
                               (dzikirPetang.date === todayKey ? dzikirPetang.completed.length : 0);

  // Steps
  const stepsData = safeJsonParse('islamediaku_steps_daily', {});
  const todaySteps = stepsData[todayKey] || 0;
  const stepTarget = parseInt(localStorage.getItem('islamediaku_steps_target') || '5000', 10);

  // Quran
  const quranLastPage = safeJsonParse('islamediaku_quran_page_state')?.last_page || null;
  const quranLastRead = safeJsonParse('islamediaku_quran_last_read');
  const favCount = safeJsonParse('islamediaku_favorites', []).length;
  const lastTilawah = safeJsonParse('kq_last_tilawah');
  
  // Calculate Overall Today Progress
  const totalTrackerItems = Object.keys(todayTracker).length > 0 ? Object.keys(todayTracker).length : 5; // fallback denominator
  const completedTrackerItems = Object.values(todayTracker).filter(Boolean).length;
  
  const totalTasks = totalMissions + totalTrackerItems + 1; // +1 for basic dzikir assumption
  const completedTasks = completedMissions + completedTrackerItems + (dzikirCompletedToday > 0 ? 1 : 0);
  const progressPercent = totalTasks > 0 ? Math.min(Math.round((completedTasks / totalTasks) * 100), 100) : 0;

  const encourageMessage = progressPercent === 0 ? 'Mulai dengan satu kebaikan hari ini.' 
                         : progressPercent < 50 ? 'MasyaAllah, lanjutkan rutinitas baikmu.'
                         : progressPercent < 100 ? 'Sedikit lagi, semoga istiqamah.'
                         : 'Alhamdulillah, target hari ini tercapai!';

  // ── Catatan Syukur Handlers ──
  const handleAddGratitude = (e) => {
    e.preventDefault();
    if (!gratitudeText.trim()) return;
    const newNote = { id: Date.now(), date: gregorian, text: gratitudeText.trim() };
    const updated = [newNote, ...gratitudeNotes].slice(0, 10); // Keep last 10
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
      'kq_mushaf_bookmarks',
      'islamediaku_favorites',
      'kq_last_tilawah',
      'islamediaku_tracker_daily',
      'islamediaku_gratitude_notes',
      'islamediaku_steps_daily'
    ];
    keysToReset.forEach(k => { try { localStorage.removeItem(k); } catch { /* safe */ } });
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="ruang-saya">
      {/* ═══ HEADER ═══ */}
      <header className="rs-header">
        <div className="rs-header__inner container">
          <div className="rs-header__top">
            <img
              src="/logo-icon.png"
              alt="Islamediaku"
              className="rs-header__logo"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="rs-header__title-wrap">
              <h1 className="rs-header__title">Ruang Saya</h1>
              <p className="rs-header__subtitle">Tempat menyimpan progres ibadah, bacaan, dan kebiasaan baikmu.</p>
            </div>
          </div>
          <div className="rs-header__info">
            <p className="rs-header__date">📅 {gregorian} &bull; {hijriStr}</p>
            {greeting.text && (
              <p className="rs-header__greeting">"{greeting.text}"</p>
            )}
            <p className="rs-header__local-note">
              <Smartphone size={11} /> Data Ruang Saya disimpan di perangkat ini.
            </p>
          </div>
        </div>
      </header>

      <main className="container rs-main">
        <div className="rs-grid">

          {/* ═══ RINGKASAN HARI INI ═══ */}
          <section className="rs-card rs-card--highlight rs-grid-span-full">
            <div className="rs-card__header-flex">
              <h2 className="rs-card__title"><Target size={18} /> Ringkasan Ibadah Hari Ini</h2>
              <span className="rs-progress-badge">{progressPercent}% Selesai</span>
            </div>
            
            <div className="rs-summary-message">{encourageMessage}</div>

            <div className="rs-summary-bars">
              <div className="rs-bar-container">
                <div className="rs-bar-label">
                  <span>Misi & Tracker</span>
                  <span>{completedTasks}/{totalTasks}</span>
                </div>
                <div className="rs-bar-track">
                  <div className="rs-bar-fill rs-bar-fill--blue" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
              
              {todaySteps > 0 && (
                <div className="rs-bar-container mt-2">
                  <div className="rs-bar-label">
                    <span>Langkah Sehat</span>
                    <span>{todaySteps.toLocaleString('id-ID')} / {stepTarget.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="rs-bar-track">
                    <div className="rs-bar-fill rs-bar-fill--green" style={{ width: `${Math.min((todaySteps/stepTarget)*100, 100)}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="rs-quick-stats">
              <div className="rs-quick-stat">
                <span className="rs-quick-stat__val">{dzikirCompletedToday > 0 ? '✓' : '-'}</span>
                <span className="rs-quick-stat__lbl">Dzikir</span>
              </div>
              <div className="rs-quick-stat">
                <span className="rs-quick-stat__val">{quranLastRead || quranLastPage ? '✓' : '-'}</span>
                <span className="rs-quick-stat__lbl">Tilawah</span>
              </div>
            </div>
          </section>

          {/* ═══ TRACKER WIDGET ═══ */}
          <section className="rs-card">
            <h2 className="rs-card__title"><ListTodo size={16} /> Tracker Ibadah</h2>
            {totalTasks > 0 ? (
              <div className="rs-tracker-preview">
                <p>Kamu telah menyelesaikan <strong>{completedTasks}</strong> dari <strong>{totalTasks}</strong> target hari ini.</p>
                <Link to="/tracker" className="btn btn--primary rs-full-btn">Buka Tracker</Link>
              </div>
            ) : (
              <div className="rs-tracker-preview">
                <p className="rs-empty-text">Belum ada progres hari ini. Mulai isi Tracker untuk melihat ringkasanmu di sini.</p>
                <Link to="/tracker" className="btn btn--outline rs-full-btn">Mulai Tracker</Link>
              </div>
            )}
          </section>

          {/* ═══ LANGKAH SEHAT WIDGET ═══ */}
          <section className="rs-card">
            <h2 className="rs-card__title"><Activity size={16} /> Langkah Sehat</h2>
            {todaySteps > 0 ? (
              <div className="rs-tracker-preview">
                <div className="rs-step-circle">
                  <span className="rs-step-count">{todaySteps.toLocaleString('id-ID')}</span>
                  <span className="rs-step-lbl">langkah</span>
                </div>
                <Link to="/tracker?tab=langkah" className="btn btn--outline rs-full-btn">Buka Tracker</Link>
              </div>
            ) : (
              <div className="rs-tracker-preview">
                <p className="rs-empty-text">Langkah sehat belum dicatat hari ini.</p>
                <Link to="/tracker?tab=langkah" className="btn btn--outline rs-full-btn">Catat Langkah</Link>
              </div>
            )}
          </section>

          {/* ═══ PREMIUM MENU CARDS ═══ */}
          <section className="rs-grid-span-full mt-4">
            <h2 className="rs-section-title">Menu Pribadi</h2>
            <div className="rs-menu-grid">
              
              <Link to={`/mushaf/page/${quranLastPage || 1}`} className="rs-menu-card">
                <div className="rs-menu-card__icon rs-icon--blue"><BookOpen size={24} /></div>
                <div className="rs-menu-card__content">
                  <h3>Mushaf Per Halaman</h3>
                  <p>Baca seperti mushaf cetak dan lanjutkan halaman terakhir.</p>
                </div>
              </Link>

              <Link to={quranLastRead ? `/mushaf/${quranLastRead.surahId}` : '/mushaf'} className="rs-menu-card">
                <div className="rs-menu-card__icon rs-icon--cyan"><Clock size={24} /></div>
                <div className="rs-menu-card__content">
                  <h3>Riwayat Baca</h3>
                  <p>Lanjutkan bacaan Al-Qur'an dan materi terakhir.</p>
                </div>
              </Link>

              <Link to="/favorit" className="rs-menu-card">
                <div className="rs-menu-card__icon rs-icon--gold"><Star size={24} /></div>
                <div className="rs-menu-card__content">
                  <h3>Favorit Saya</h3>
                  <p>Ayat, kajian, dan materi yang kamu simpan.</p>
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

              <div className="rs-menu-card" onClick={() => document.getElementById('syukur-input').focus()}>
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

          {/* ═══ CATATAN SYUKUR WIDGET ═══ */}
          <section className="rs-card rs-grid-span-full">
            <h2 className="rs-card__title"><Heart size={16} /> Catatan Syukur</h2>
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
                <Plus size={18} />
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

          {/* ═══ RESET WIDGET ═══ */}
          <section className="rs-card rs-grid-span-full">
            <div className="rs-settings-list" style={{ marginTop: 0 }}>
              <button
                type="button"
                className="rs-settings-item"
                onClick={() => setShowResetConfirm(!showResetConfirm)}
              >
                <Trash2 size={18} style={{ color: '#dc2626' }} />
                <span style={{ color: '#dc2626' }}>Reset Data Lokal Ruang Saya</span>
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
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
