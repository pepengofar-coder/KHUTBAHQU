import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSEO } from '../../utils/seo';
import {
  User, BookOpen, CheckSquare, Star, Headphones,
  ChevronRight, Activity, Heart, LogIn
} from 'lucide-react';
import './RuangUserPage.css';

export default function RuangUserPage() {
  useSEO({
    title: 'Ruang User | Islamediaku',
    description: 'Dashboard pribadi untuk memantau aktivitas ibadah, progres Al-Qur\'an, dan konten favorit.',
    path: '/ruang-user',
    robots: 'noindex, follow'
  });

  const { user, loading: authLoading } = useAuth();
  const isGuest = !user;

  // Last Quran read from localStorage
  const lastQuranRead = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('islamediaku_quran_last_read'));
      if (stored && stored.surahId) return stored;
      return null;
    } catch { return null; }
  }, []);

  // Last tilawah
  const lastTilawah = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('kq_last_tilawah'));
    } catch { return null; }
  }, []);

  // Tracker summary from localStorage
  const trackerStats = useMemo(() => {
    try {
      const trackerData = JSON.parse(localStorage.getItem('islamediaku_tracker_daily'));
      if (!trackerData) return { totalDays: 0, todayCompleted: 0 };

      const days = Object.keys(trackerData).length;
      const today = new Date();
      const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const todayData = trackerData[todayKey];
      const todayCompleted = todayData
        ? Object.values(todayData).filter(v => v === true).length
        : 0;

      return { totalDays: days, todayCompleted };
    } catch { return { totalDays: 0, todayCompleted: 0 }; }
  }, []);

  // Mission progress
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const missionProgress = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('islamediaku_daily_mission_progress'));
      const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; })();
      if (stored && stored.date === todayStr) {
        const done = stored.data.filter(m => m.done).length;
        return { done, total: stored.data.length };
      }
      return { done: 0, total: 4 };
    } catch { return { done: 0, total: 4 }; }
  }, []);

  // Favorites count
  const favCount = useMemo(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('islamediaku_favorites'));
      return Array.isArray(favs) ? favs.length : 0;
    } catch { return 0; }
  }, []);

  // Bookmarks count
  const bookmarkCount = useMemo(() => {
    try {
      const bm = JSON.parse(localStorage.getItem('kq_mushaf_bookmarks'));
      return Array.isArray(bm) ? bm.length : 0;
    } catch { return 0; }
  }, []);

  return (
    <div className="ruang-user">
      <header className="ruang-user__header">
        <div className="container">
          <h1 className="ruang-user__header-title">Ruang User</h1>
          <p className="ruang-user__header-sub">Dashboard ibadah dan aktivitas kamu</p>
        </div>
      </header>

      <main className="container ruang-user__main">

        {/* Profile Card */}
        <div className="ruang-user__profile">
          <div className="ruang-user__avatar">
            <User size={28} className="ruang-user__avatar-icon" />
          </div>
          <div className="ruang-user__profile-info">
            {authLoading ? (
              <p className="ruang-user__profile-name">Memuat...</p>
            ) : isGuest ? (
              <>
                <p className="ruang-user__profile-name">Tamu</p>
                <p className="ruang-user__profile-email">Belum masuk ke akun</p>
                <span className="ruang-user__profile-badge">Mode Tamu</span>
              </>
            ) : (
              <>
                <p className="ruang-user__profile-name">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pengguna'}
                </p>
                <p className="ruang-user__profile-email">{user.email}</p>
                <span className="ruang-user__profile-badge">Anggota</span>
              </>
            )}
          </div>
          {isGuest && !authLoading && (
            <div className="ruang-user__profile-actions">
              <Link to="/login" className="ruang-user__login-btn">
                <LogIn size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Masuk
              </Link>
            </div>
          )}
        </div>

        {/* Statistik Singkat */}
        <section>
          <h2 className="ruang-user__section-title">Ringkasan</h2>
          <div className="ruang-user__stats">
            <div className="ruang-user__stat-card">
              <span className="ruang-user__stat-num">{missionProgress.done}/{missionProgress.total}</span>
              <span className="ruang-user__stat-label">Misi Hari Ini</span>
            </div>
            <div className="ruang-user__stat-card">
              <span className="ruang-user__stat-num">{trackerStats.todayCompleted}</span>
              <span className="ruang-user__stat-label">Ibadah Tercatat</span>
            </div>
            <div className="ruang-user__stat-card">
              <span className="ruang-user__stat-num">{bookmarkCount}</span>
              <span className="ruang-user__stat-label">Bookmark Mushaf</span>
            </div>
            <div className="ruang-user__stat-card">
              <span className="ruang-user__stat-num">{favCount}</span>
              <span className="ruang-user__stat-label">Konten Favorit</span>
            </div>
          </div>
        </section>

        {/* Aktivitas Terakhir */}
        <section>
          <h2 className="ruang-user__section-title">Aktivitas Terakhir</h2>
          <div className="ruang-user__group">
            {lastQuranRead ? (
              <Link to={`/mushaf/${lastQuranRead.surahId}#ayah-${lastQuranRead.ayahNumber}`} className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(0,71,255,0.1)' }}>
                  <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="ruang-user__item-content">
                  <strong>Al-Qur'an Terakhir</strong>
                  <p>Surah {lastQuranRead.surahName || lastQuranRead.surahId} Ayat {lastQuranRead.ayahNumber}</p>
                </div>
                <ChevronRight size={18} className="ruang-user__item-right" />
              </Link>
            ) : (
              <div className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(0,71,255,0.1)' }}>
                  <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="ruang-user__item-content">
                  <strong>Al-Qur'an</strong>
                  <p>Belum ada riwayat bacaan</p>
                </div>
              </div>
            )}

            <div className="ruang-user__divider" />

            {lastTilawah ? (
              <Link to="/tilawah" className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(249,115,22,0.1)' }}>
                  <Headphones size={18} style={{ color: '#ea580c' }} />
                </div>
                <div className="ruang-user__item-content">
                  <strong>Tilawah Terakhir</strong>
                  <p>{lastTilawah.name || 'Channel terakhir'}</p>
                </div>
                <ChevronRight size={18} className="ruang-user__item-right" />
              </Link>
            ) : (
              <div className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(249,115,22,0.1)' }}>
                  <Headphones size={18} style={{ color: '#ea580c' }} />
                </div>
                <div className="ruang-user__item-content">
                  <strong>Tilawah</strong>
                  <p>Belum ada riwayat tilawah</p>
                </div>
              </div>
            )}

            <div className="ruang-user__divider" />

            <Link to="/tracker" className="ruang-user__item">
              <div className="ruang-user__item-icon" style={{ background: 'rgba(132,204,22,0.1)' }}>
                <CheckSquare size={18} style={{ color: '#65a30d' }} />
              </div>
              <div className="ruang-user__item-content">
                <strong>Tracker Ibadah</strong>
                <p>{trackerStats.totalDays > 0 ? `${trackerStats.totalDays} hari tercatat` : 'Mulai pantau ibadah harian'}</p>
              </div>
              <ChevronRight size={18} className="ruang-user__item-right" />
            </Link>

            <div className="ruang-user__divider" />

            <Link to="/favorit" className="ruang-user__item">
              <div className="ruang-user__item-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
                <Star size={18} style={{ color: '#d97706' }} />
              </div>
              <div className="ruang-user__item-content">
                <strong>Konten Favorit</strong>
                <p>{favCount > 0 ? `${favCount} item tersimpan` : 'Belum ada favorit'}</p>
              </div>
              <ChevronRight size={18} className="ruang-user__item-right" />
            </Link>
          </div>
        </section>

        {/* Kajian Favorit — placeholder for future */}
        <section>
          <h2 className="ruang-user__section-title">Kajian Favorit</h2>
          <div className="ruang-user__placeholder">
            <Heart size={28} className="ruang-user__placeholder-icon" />
            <p>Fitur kajian favorit akan segera hadir. Nantikan pembaruan berikutnya!</p>
          </div>
        </section>

        {/* Quick links */}
        <section>
          <h2 className="ruang-user__section-title">Pintasan</h2>
          <div className="ruang-user__group">
            <Link to="/pengaturan" className="ruang-user__item">
              <div className="ruang-user__item-icon" style={{ background: 'rgba(99,102,241,0.1)' }}>
                <Activity size={18} style={{ color: '#6366f1' }} />
              </div>
              <div className="ruang-user__item-content">
                <strong>Pengaturan</strong>
                <p>Kelola tema, data, dan preferensi</p>
              </div>
              <ChevronRight size={18} className="ruang-user__item-right" />
            </Link>
            {!isGuest && (
              <>
                <div className="ruang-user__divider" />
                <Link to="/account" className="ruang-user__item">
                  <div className="ruang-user__item-icon" style={{ background: 'rgba(0,71,255,0.1)' }}>
                    <User size={18} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div className="ruang-user__item-content">
                    <strong>Kelola Akun</strong>
                    <p>Ubah profil dan keamanan</p>
                  </div>
                  <ChevronRight size={18} className="ruang-user__item-right" />
                </Link>
              </>
            )}
          </div>
        </section>

        <div className="ruang-user__footer">
          <p>Data lokal disimpan di perangkat ini.</p>
          <p>Sinkronisasi cloud akan hadir segera.</p>
        </div>

      </main>
    </div>
  );
}
