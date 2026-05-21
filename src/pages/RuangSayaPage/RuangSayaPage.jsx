import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import { getHijriDateString } from '../../data/hijriData';
import { getLocalizedGreeting } from '../../utils/dailyGreeting';
import {
  Target, BookOpen, Headphones, Heart, ChevronRight,
  Star, Settings, Trash2, Download, Bookmark,
  CheckSquare, Compass, Smartphone, Clock
} from 'lucide-react';
import './RuangSayaPage.css';

// ── Safe localStorage reader ──
function safeJsonParse(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export default function RuangSayaPage() {
  useSEO({
    title: 'Ruang Saya | Islamediaku',
    description: 'Tempat menyimpan progres ibadah, bacaan, dan kebiasaan baikmu.',
    path: '/ruang-saya',
    robots: 'noindex, follow',
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // ── Date & Greeting ──
  const now = useMemo(() => new Date(), []);
  const gregorian = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hijriStr = useMemo(() => getHijriDateString(now), [now]);
  const greeting = useMemo(() => {
    const locale = typeof localStorage !== 'undefined' ? (localStorage.getItem('islamediaku_locale') || 'id') : 'id';
    return getLocalizedGreeting(locale);
  }, []);

  // ── LocalStorage data reads ──
  const todayDateStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }, []);

  const missions = useMemo(() => {
    const stored = safeJsonParse('islamediaku_daily_mission_progress');
    if (stored && stored.date === todayDateStr) return stored.data;
    return null;
  }, [todayDateStr]);

  const completedMissions = missions ? missions.filter(m => m.done).length : 0;
  const totalMissions = missions ? missions.length : 4;

  const quranLastRead = useMemo(() => {
    const d = safeJsonParse('islamediaku_quran_last_read');
    return d?.surahId ? d : null;
  }, []);

  const quranLastPage = useMemo(() => {
    const d = safeJsonParse('islamediaku_quran_page_state');
    return d?.last_page || null;
  }, []);

  const bookmarkCount = useMemo(() => {
    const b = safeJsonParse('kq_mushaf_bookmarks', []);
    return Array.isArray(b) ? b.length : 0;
  }, []);

  const favCount = useMemo(() => {
    const f = safeJsonParse('islamediaku_favorites', []);
    return Array.isArray(f) ? f.length : 0;
  }, []);

  const lastTilawah = useMemo(() => safeJsonParse('kq_last_tilawah'), []);

  const prayerCity = useMemo(() => {
    try { return localStorage.getItem('kq_prayer_city') || 'Jakarta'; } catch { return 'Jakarta'; }
  }, []);

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
    ];
    keysToReset.forEach(k => { try { localStorage.removeItem(k); } catch { /* safe */ } });
    setShowResetConfirm(false);
    window.location.reload();
  };

  const apkUrl = import.meta.env.VITE_APK_URL || import.meta.env.NEXT_PUBLIC_APK_URL || null;

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
              <Smartphone size={11} /> Data disimpan di perangkat ini.
            </p>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="rs-grid">

          {/* ═══ RINGKASAN HARI INI ═══ */}
          <section className="rs-card rs-grid-span-full">
            <h2 className="rs-card__title"><Target size={16} /> Ringkasan Hari Ini</h2>
            <div className="rs-summary-grid">
              <div className={`rs-summary-item ${completedMissions >= totalMissions && missions ? 'rs-summary-item--done' : ''}`}>
                <span className="rs-summary-item__icon">🎯</span>
                <span className="rs-summary-item__label">Misi Ibadah</span>
                <span className="rs-summary-item__value">
                  {missions ? `${completedMissions}/${totalMissions}` : 'Belum mulai'}
                </span>
              </div>
              <div className="rs-summary-item">
                <span className="rs-summary-item__icon">🕌</span>
                <span className="rs-summary-item__label">Lokasi Sholat</span>
                <span className="rs-summary-item__value">{prayerCity}</span>
              </div>
              <div className="rs-summary-item">
                <span className="rs-summary-item__icon">📖</span>
                <span className="rs-summary-item__label">Mushaf</span>
                <span className="rs-summary-item__value">
                  {quranLastRead ? `QS ${quranLastRead.surahName || quranLastRead.surahId}` : 'Belum dibaca'}
                </span>
              </div>
              <div className="rs-summary-item">
                <span className="rs-summary-item__icon">🎧</span>
                <span className="rs-summary-item__label">Tilawah</span>
                <span className="rs-summary-item__value">
                  {lastTilawah ? (lastTilawah.name || 'Terakhir diputar') : 'Belum ada'}
                </span>
              </div>
              <div className="rs-summary-item">
                <span className="rs-summary-item__icon">🔖</span>
                <span className="rs-summary-item__label">Bookmark</span>
                <span className="rs-summary-item__value">{bookmarkCount} ayat</span>
              </div>
              <div className="rs-summary-item">
                <span className="rs-summary-item__icon">❤️</span>
                <span className="rs-summary-item__label">Favorit</span>
                <span className="rs-summary-item__value">{favCount} item</span>
              </div>
            </div>
          </section>

          {/* ═══ LANJUTKAN ═══ */}
          <section className="rs-card">
            <h2 className="rs-card__title"><CheckSquare size={16} /> Lanjutkan</h2>
            <div className="rs-shortcuts">
              <Link
                to={quranLastRead ? `/mushaf/${quranLastRead.surahId}` : '/mushaf'}
                className="rs-shortcut"
              >
                <span className="rs-shortcut__icon rs-shortcut__icon--blue"><BookOpen size={18} /></span>
                Mushaf
              </Link>
              <Link to="/tilawah" className="rs-shortcut">
                <span className="rs-shortcut__icon rs-shortcut__icon--orange"><Headphones size={18} /></span>
                Tilawah
              </Link>
              <Link to="/doa-dzikir" className="rs-shortcut">
                <span className="rs-shortcut__icon rs-shortcut__icon--purple"><Heart size={18} /></span>
                Dzikir
              </Link>
              <Link to="/tracker" className="rs-shortcut">
                <span className="rs-shortcut__icon rs-shortcut__icon--green"><Compass size={18} /></span>
                Tracker
              </Link>
            </div>
          </section>

          {/* ═══ FAVORIT & BOOKMARK ═══ */}
          <section className="rs-card">
            <h2 className="rs-card__title"><Star size={16} /> Favorit & Bookmark</h2>
            {(bookmarkCount > 0 || favCount > 0) ? (
              <div className="rs-fav-stats">
                {bookmarkCount > 0 && (
                  <Link to="/mushaf" className="rs-fav-stat">
                    <Bookmark size={16} style={{ color: '#0047FF' }} />
                    {bookmarkCount} bookmark
                  </Link>
                )}
                {favCount > 0 && (
                  <Link to="/favorit" className="rs-fav-stat">
                    <Star size={16} style={{ color: '#d97706' }} />
                    {favCount} favorit
                  </Link>
                )}
              </div>
            ) : (
              <p className="rs-card__empty">
                Belum ada favorit. Simpan ayat, kajian, atau materi yang ingin kamu baca lagi.
              </p>
            )}
          </section>

          {/* ═══ MUSHAF PER HALAMAN ═══ */}
          <section className="rs-card rs-grid-span-full">
            <h2 className="rs-card__title"><BookOpen size={16} /> Mushaf Per Halaman</h2>
            <Link
              to={quranLastPage ? `/mushaf/page/${quranLastPage}` : '/mushaf/page/1'}
              className="rs-mushaf-card"
            >
              <div className="rs-mushaf-card__icon">
                <BookOpen size={24} />
              </div>
              <div className="rs-mushaf-card__content">
                <p className="rs-mushaf-card__title">
                  {quranLastPage ? `Lanjut Hal. ${quranLastPage}` : 'Mulai Baca'}
                </p>
                <p className="rs-mushaf-card__desc">
                  Baca Al-Qur'an per halaman seperti mushaf cetak
                </p>
              </div>
              <ChevronRight size={20} className="rs-mushaf-card__arrow" />
            </Link>
          </section>

          {/* ═══ PENGATURAN CEPAT ═══ */}
          <section className="rs-card rs-grid-span-full">
            <h2 className="rs-card__title"><Settings size={16} /> Pengaturan Cepat</h2>
            <div className="rs-settings-list">
              <Link to="/pengaturan" className="rs-settings-item">
                <Settings size={18} />
                <span>Pengaturan Aplikasi</span>
                <ChevronRight size={16} />
              </Link>
              <div className="rs-settings-divider" />
              <Link to="/sholat" className="rs-settings-item">
                <Clock size={18} />
                <span>Jadwal Sholat ({prayerCity})</span>
                <ChevronRight size={16} />
              </Link>
              <div className="rs-settings-divider" />
              <button
                type="button"
                className="rs-settings-item"
                onClick={() => setShowResetConfirm(!showResetConfirm)}
              >
                <Trash2 size={18} style={{ color: '#dc2626' }} />
                <span style={{ color: '#dc2626' }}>Reset Data Lokal</span>
              </button>
              {showResetConfirm && (
                <div className="rs-reset-confirm">
                  <p>Semua data lokal (bookmark, progress, riwayat baca) akan dihapus. Tindakan ini tidak bisa dibatalkan.</p>
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
              {apkUrl && (
                <>
                  <div className="rs-settings-divider" />
                  <a href={apkUrl} className="rs-settings-item" target="_blank" rel="noopener noreferrer">
                    <Download size={18} />
                    <span>Download APK</span>
                    <ChevronRight size={16} />
                  </a>
                </>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
