import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useSEO } from '../../utils/seo';
import { syncAllData, getSyncStatus } from '../../lib/syncService';
import {
  User, BookOpen, CheckSquare, Star, Headphones,
  ChevronRight, Activity, Heart, LogOut, Edit3,
  Check, X, RefreshCw, Cloud, CloudOff,
  Palette, MapPin, Shield
} from 'lucide-react';
import './RuangUserPage.css';

export default function RuangUserPage() {
  useSEO({
    title: 'Ruang User | Islamediaku',
    description: 'Dashboard pribadi untuk memantau aktivitas ibadah, progres Al-Qur\'an, dan konten favorit.',
    path: '/ruang-user',
    robots: 'noindex, follow'
  });

  const { user, profile, logout, updateDisplayName, isEmailConfirmed } = useAuth();
  const { appTheme } = useApp();
  const navigate = useNavigate();

  // Edit name state
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState(null);

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncStatusLoaded, setSyncStatusLoaded] = useState(false);

  // Display name from profile or auth metadata
  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pengguna';

  // Load sync status on mount
  useState(() => {
    if (user) {
      getSyncStatus(user.id).then(s => {
        setSyncStatus(s);
        setSyncStatusLoaded(true);
      });
    }
  });

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
      const todayCompleted = todayData ? Object.values(todayData).filter(v => v === true).length : 0;
      return { totalDays: days, todayCompleted };
    } catch { return { totalDays: 0, todayCompleted: 0 }; }
  }, []);

  // Mission progress
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

  // Prayer city
  const prayerCity = useMemo(() => {
    return localStorage.getItem('kq_prayer_city') || 'Jakarta';
  }, []);

  // Theme names
  const THEME_NAMES = { default: 'Islamediaku', sakura: 'Sakura', cold: 'Cold', midnight: 'Midnight', sajadah: 'Sajadah' };

  // Handlers
  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/');
  }, [logout, navigate]);

  const handleStartEdit = useCallback(() => {
    setNewName(displayName);
    setEditingName(true);
    setNameError(null);
  }, [displayName]);

  const handleSaveName = useCallback(async () => {
    if (!newName.trim()) return;
    setNameLoading(true);
    setNameError(null);
    try {
      await updateDisplayName(newName.trim());
      setEditingName(false);
    } catch (err) {
      setNameError(err.message || 'Gagal memperbarui nama.');
    } finally {
      setNameLoading(false);
    }
  }, [newName, updateDisplayName]);

  const handleSync = useCallback(async () => {
    if (!user) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const result = await syncAllData(user.id);
      setSyncResult(result);
      // Refresh sync status
      const s = await getSyncStatus(user.id);
      setSyncStatus(s);
    } catch {
      setSyncResult({ success: false });
    } finally {
      setSyncing(false);
    }
  }, [user]);

  return (
    <div className="ruang-user">
      <header className="ruang-user__header">
        <div className="container">
          <h1 className="ruang-user__header-title">Ruang User</h1>
          <p className="ruang-user__header-sub">Dashboard ibadah dan aktivitas kamu</p>
        </div>
      </header>

      <main className="container ruang-user__main">

        {/* A. Profile Card */}
        <div className="ruang-user__profile">
          <div className="ruang-user__avatar">
            <span className="ruang-user__avatar-letter">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ruang-user__profile-info">
            {editingName ? (
              <div className="ruang-user__edit-name">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="ruang-user__edit-input"
                  autoFocus
                  maxLength={50}
                />
                <div className="ruang-user__edit-actions">
                  <button onClick={handleSaveName} disabled={nameLoading} className="ruang-user__edit-btn save">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditingName(false)} className="ruang-user__edit-btn cancel">
                    <X size={14} />
                  </button>
                </div>
                {nameError && <p className="ruang-user__edit-error">{nameError}</p>}
              </div>
            ) : (
              <>
                <div className="ruang-user__name-row">
                  <p className="ruang-user__profile-name">{displayName}</p>
                  <button className="ruang-user__name-edit" onClick={handleStartEdit} title="Edit nama">
                    <Edit3 size={13} />
                  </button>
                </div>
                <p className="ruang-user__profile-email">{user?.email}</p>
                <span className={`ruang-user__profile-badge ${isEmailConfirmed ? 'verified' : 'unverified'}`}>
                  {isEmailConfirmed ? '✓ Terverifikasi' : '⏳ Belum Dikonfirmasi'}
                </span>
              </>
            )}
          </div>
          <button className="ruang-user__logout-btn" onClick={handleLogout} title="Keluar">
            <LogOut size={16} />
          </button>
        </div>

        {/* B. Statistik Ringkasan */}
        <section>
          <h2 className="ruang-user__section-title">Aktivitas Ibadah</h2>
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

        {/* C. Al-Qur'an */}
        <section>
          <h2 className="ruang-user__section-title">Al-Qur'an</h2>
          <div className="ruang-user__group">
            {lastQuranRead ? (
              <Link to={`/mushaf/${lastQuranRead.surahId}#ayah-${lastQuranRead.ayahNumber}`} className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(0,71,255,0.1)' }}>
                  <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="ruang-user__item-content">
                  <strong>Terakhir Dibaca</strong>
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
            <Link to="/mushaf" className="ruang-user__item">
              <div className="ruang-user__item-icon" style={{ background: 'rgba(0,71,255,0.1)' }}>
                <Star size={18} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="ruang-user__item-content">
                <strong>Bookmark Mushaf</strong>
                <p>{bookmarkCount > 0 ? `${bookmarkCount} ayat ditandai` : 'Belum ada bookmark'}</p>
              </div>
              <ChevronRight size={18} className="ruang-user__item-right" />
            </Link>
          </div>
        </section>

        {/* D. Kajian & Mode Perjalanan */}
        <section>
          <h2 className="ruang-user__section-title">Kajian & Tilawah</h2>
          <div className="ruang-user__group">
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
            <Link to="/favorit" className="ruang-user__item">
              <div className="ruang-user__item-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
                <Heart size={18} style={{ color: '#d97706' }} />
              </div>
              <div className="ruang-user__item-content">
                <strong>Konten Favorit</strong>
                <p>{favCount > 0 ? `${favCount} item tersimpan` : 'Belum ada favorit'}</p>
              </div>
              <ChevronRight size={18} className="ruang-user__item-right" />
            </Link>
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
          </div>
        </section>

        {/* E. Preferensi */}
        <section>
          <h2 className="ruang-user__section-title">Preferensi</h2>
          <div className="ruang-user__group">
            <div className="ruang-user__item">
              <div className="ruang-user__item-icon" style={{ background: 'rgba(99,102,241,0.1)' }}>
                <Palette size={18} style={{ color: '#6366f1' }} />
              </div>
              <div className="ruang-user__item-content">
                <strong>Tema Aktif</strong>
                <p>{THEME_NAMES[appTheme] || 'Islamediaku'}</p>
              </div>
            </div>
            <div className="ruang-user__divider" />
            <div className="ruang-user__item">
              <div className="ruang-user__item-icon" style={{ background: 'rgba(132,204,22,0.1)' }}>
                <MapPin size={18} style={{ color: '#65a30d' }} />
              </div>
              <div className="ruang-user__item-content">
                <strong>Lokasi Sholat</strong>
                <p>{prayerCity}</p>
              </div>
            </div>
            <div className="ruang-user__divider" />
            <div className="ruang-user__item">
              <div className="ruang-user__item-icon" style={{ background: 'rgba(0,71,255,0.1)' }}>
                <Shield size={18} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="ruang-user__item-content">
                <strong>Status Akun</strong>
                <p>{isEmailConfirmed ? 'Email terverifikasi' : 'Menunggu konfirmasi email'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* F. Data Sync Status */}
        <section>
          <h2 className="ruang-user__section-title">Sinkronisasi Data</h2>
          <div className="ruang-user__sync-card">
            <div className="ruang-user__sync-header">
              {syncStatusLoaded && syncStatus?.synced ? (
                <>
                  <Cloud size={20} className="ruang-user__sync-icon synced" />
                  <div>
                    <strong>Data Tersinkronisasi</strong>
                    <p>Terakhir: {syncStatus.lastSync?.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </>
              ) : (
                <>
                  <CloudOff size={20} className="ruang-user__sync-icon not-synced" />
                  <div>
                    <strong>Data Lokal</strong>
                    <p>Data disimpan di perangkat ini. Sinkronkan untuk menyimpan ke cloud.</p>
                  </div>
                </>
              )}
            </div>

            <div className="ruang-user__sync-info">
              <p>Sinkronisasi mencakup:</p>
              <ul>
                <li>Tema & preferensi</li>
                <li>Riwayat bacaan Al-Qur'an</li>
                <li>Bookmark Mushaf</li>
                <li>Ringkasan tracker ibadah</li>
              </ul>
              <p className="ruang-user__sync-note">Data lokal tidak akan dihapus.</p>
            </div>

            <button
              className={`ruang-user__sync-btn ${syncing ? 'syncing' : ''}`}
              onClick={handleSync}
              disabled={syncing}
            >
              <RefreshCw size={16} className={syncing ? 'ruang-user__spin' : ''} />
              {syncing ? 'Menyinkronkan...' : 'Sinkronkan Data Lokal'}
            </button>

            {syncResult && (
              <div className={`ruang-user__sync-result ${syncResult.success ? 'success' : 'error'}`}>
                {syncResult.success
                  ? '✓ Data berhasil disinkronkan ke cloud.'
                  : '✕ Gagal menyinkronkan sebagian data. Coba lagi nanti.'}
              </div>
            )}
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
          </div>
        </section>

      </main>
    </div>
  );
}
