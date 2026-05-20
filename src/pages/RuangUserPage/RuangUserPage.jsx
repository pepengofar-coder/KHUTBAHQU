import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useSEO } from '../../utils/seo';
import {
  loadDailyTargets, saveDailyTargets, DEFAULT_TARGETS,
  loadDailyNote, saveDailyNote, deleteDailyNote,
  getRecentActivity, uploadAvatar, removeAvatar,
  syncAllData, getSyncStatus,
} from '../../lib/syncService';
import {
  BookOpen, CheckSquare, Star, Headphones,
  ChevronRight, Heart, LogOut, Edit3,
  Check, X, RefreshCw, Cloud, CloudOff,
  Palette, MapPin, Shield, Camera, Trash2,
  Car, Compass, Clock, Loader2,
  FileText, Target, TrendingUp, Settings
} from 'lucide-react';
import './RuangUserPage.css';

const THEME_NAMES = { default: 'Islamediaku', sakura: 'Sakura', cold: 'Cold', midnight: 'Midnight', sajadah: 'Sajadah' };

export default function RuangUserPage() {
  useSEO({
    title: 'Ruang User | Islamediaku',
    description: 'Dashboard pribadi untuk memantau aktivitas ibadah harian.',
    path: '/ruang-user',
    robots: 'noindex, follow'
  });

  const { user, profile, logout, updateDisplayName, isEmailConfirmed, refreshProfile } = useAuth();
  const { appTheme } = useApp();
  const navigate = useNavigate();

  // ── Profile editing ──
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState(null);

  // ── Avatar ──
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const fileInputRef = useRef(null);

  // ── Daily targets ──
  const [targets, setTargets] = useState(DEFAULT_TARGETS);
  const [completed, setCompleted] = useState([]);
  const [targetsLoaded, setTargetsLoaded] = useState(false);

  // ── Daily note ──
  const [noteContent, setNoteContent] = useState('');
  const [noteUpdatedAt, setNoteUpdatedAt] = useState(null);
  const [noteLoaded, setNoteLoaded] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteDeleting, setNoteDeleting] = useState(false);

  // ── Recent activity ──
  const [recentActivity, setRecentActivity] = useState([]);

  // ── Sync ──
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);

  // Derived
  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pengguna';
  const avatarUrl = profile?.avatar_url || null;
  const progress = targets.length ? Math.round((completed.length / targets.length) * 100) : 0;

  // ── Load dashboard data on mount ──
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [tResult, nResult, aResult, sResult] = await Promise.all([
        loadDailyTargets(user.id),
        loadDailyNote(user.id),
        getRecentActivity(user.id, 10),
        getSyncStatus(user.id),
      ]);
      if (tResult.success && tResult.data) {
        setTargets(tResult.data.targets || DEFAULT_TARGETS);
        setCompleted(tResult.data.completed || []);
      }
      setTargetsLoaded(true);
      if (nResult.success && nResult.data) {
        setNoteContent(nResult.data.content || '');
        setNoteUpdatedAt(nResult.data.updatedAt);
      }
      setNoteLoaded(true);
      setRecentActivity(aResult.data || []);
      setSyncStatus(sResult);
    };
    load();
  }, [user]);

  // ── localStorage reads ──
  const quranLastRead = useMemo(() => {
    try { const d = JSON.parse(localStorage.getItem('islamediaku_quran_last_read')); return d?.surahId ? d : null; } catch { return null; }
  }, []);
  const quranLastPage = useMemo(() => {
    try { const d = JSON.parse(localStorage.getItem('islamediaku_quran_page_state')); return d?.last_page ? d.last_page : null; } catch { return null; }
  }, []);
  const bookmarkCount = useMemo(() => {
    try { const b = JSON.parse(localStorage.getItem('kq_mushaf_bookmarks')); return Array.isArray(b) ? b.length : 0; } catch { return 0; }
  }, []);
  const favCount = useMemo(() => {
    try { const f = JSON.parse(localStorage.getItem('islamediaku_favorites')); return Array.isArray(f) ? f.length : 0; } catch { return 0; }
  }, []);
  const lastTilawah = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('kq_last_tilawah')); } catch { return null; }
  }, []);
  const prayerCity = useMemo(() => localStorage.getItem('kq_prayer_city') || 'Jakarta', []);

  // ── Handlers ──
  const handleLogout = useCallback(async () => { await logout(); navigate('/'); }, [logout, navigate]);

  const handleStartEdit = useCallback(() => {
    setNewName(displayName); setEditingName(true); setNameError(null);
  }, [displayName]);

  const handleSaveName = useCallback(async () => {
    if (!newName.trim()) return;
    setNameLoading(true); setNameError(null);
    try { await updateDisplayName(newName.trim()); setEditingName(false); }
    catch (e) { setNameError(e.message || 'Gagal.'); }
    finally { setNameLoading(false); }
  }, [newName, updateDisplayName]);

  const handleAvatarUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarLoading(true); setAvatarError(null);
    const result = await uploadAvatar(user.id, file);
    if (result.success) { await refreshProfile(); }
    else { setAvatarError(result.error); }
    setAvatarLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [user, refreshProfile]);

  const handleAvatarRemove = useCallback(async () => {
    if (!user) return;
    setAvatarLoading(true); setAvatarError(null);
    const result = await removeAvatar(user.id);
    if (result.success) { await refreshProfile(); }
    else { setAvatarError(result.error); }
    setAvatarLoading(false);
  }, [user, refreshProfile]);

  const toggleTarget = useCallback(async (targetId) => {
    const next = completed.includes(targetId) ? completed.filter(id => id !== targetId) : [...completed, targetId];
    setCompleted(next);
    if (user) await saveDailyTargets(user.id, targets, next);
  }, [completed, targets, user]);

  const handleNoteSave = useCallback(async () => {
    if (!user) return;
    setNoteSaving(true);
    await saveDailyNote(user.id, noteContent);
    setNoteUpdatedAt(new Date().toISOString());
    setNoteSaving(false);
  }, [user, noteContent]);

  const handleNoteDelete = useCallback(async () => {
    if (!user || !window.confirm('Hapus catatan hari ini?')) return;
    setNoteDeleting(true);
    await deleteDailyNote(user.id);
    setNoteContent(''); setNoteUpdatedAt(null);
    setNoteDeleting(false);
  }, [user]);

  const handleSync = useCallback(async () => {
    if (!user) return;
    setSyncing(true); setSyncResult(null);
    try {
      const result = await syncAllData(user.id);
      setSyncResult(result);
      setSyncStatus(await getSyncStatus(user.id));
    } catch { setSyncResult({ success: false }); }
    finally { setSyncing(false); }
  }, [user]);

  // ── Motivational message ──
  const motivMsg = useMemo(() => {
    if (progress >= 100) return 'Alhamdulillah, semua target hari ini selesai! 🎉';
    if (progress >= 75) return 'MasyaAllah, hampir selesai. Terus semangat!';
    if (progress >= 50) return `MasyaAllah, ${completed.length} dari ${targets.length} target selesai.`;
    if (progress > 0) return 'Langkah awal sudah baik. Lanjutkan! 💪';
    return 'Bismillah, mulai hari dengan niat baik.';
  }, [progress, completed.length, targets.length]);

  // ── Activity label formatter ──
  const formatActivity = useCallback((act) => {
    const labels = {
      mushaf: '📖', sholat: '🕌', dzikir: '📿', tilawah: '🎧',
      tracker: '✅', travel: '🚗', theme: '🎨', kajian: '📚', general: '⭐',
    };
    const icon = labels[act.feature] || labels[act.activity_type] || '⭐';
    const desc = act.activity_data?.description || act.activity_type || act.activityType || '';
    return { icon, desc };
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
        <div className="ru-grid">

          {/* ═══ PROFILE CARD ═══ */}
          <section className="ru-card ru-card--profile ru-grid-span-full">
            <div className="ruang-user__profile">
              <div className="ruang-user__avatar" onClick={() => fileInputRef.current?.click()} title="Ganti foto">
                {avatarLoading ? (
                  <Loader2 size={22} className="ruang-user__spin" style={{ color: 'var(--color-accent)' }} />
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="ruang-user__avatar-img" />
                ) : (
                  <span className="ruang-user__avatar-letter">{displayName.charAt(0).toUpperCase()}</span>
                )}
                <span className="ruang-user__avatar-overlay"><Camera size={14} /></span>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleAvatarUpload} />
              </div>
              <div className="ruang-user__profile-info">
                {editingName ? (
                  <div className="ruang-user__edit-name">
                    <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="ruang-user__edit-input" autoFocus maxLength={50} />
                    <div className="ruang-user__edit-actions">
                      <button onClick={handleSaveName} disabled={nameLoading} className="ruang-user__edit-btn save"><Check size={14} /></button>
                      <button onClick={() => setEditingName(false)} className="ruang-user__edit-btn cancel"><X size={14} /></button>
                    </div>
                    {nameError && <p className="ruang-user__edit-error">{nameError}</p>}
                  </div>
                ) : (
                  <>
                    <div className="ruang-user__name-row">
                      <p className="ruang-user__profile-name">{displayName}</p>
                      <button className="ruang-user__name-edit" onClick={handleStartEdit}><Edit3 size={13} /></button>
                    </div>
                    <p className="ruang-user__profile-email">{user?.email}</p>
                    <div className="ruang-user__profile-meta">
                      <span className={`ruang-user__profile-badge ${isEmailConfirmed ? 'verified' : 'unverified'}`}>
                        {isEmailConfirmed ? '✓ Terverifikasi' : '⏳ Belum Dikonfirmasi'}
                      </span>
                      <span className="ruang-user__profile-theme">🎨 {THEME_NAMES[appTheme] || 'Islamediaku'}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="ruang-user__profile-actions">
                {avatarUrl && (
                  <button className="ruang-user__avatar-remove" onClick={handleAvatarRemove} title="Hapus foto"><Trash2 size={13} /></button>
                )}
                <button className="ruang-user__logout-btn" onClick={handleLogout} title="Keluar"><LogOut size={16} /></button>
              </div>
            </div>
            {avatarError && <p className="ru-card__error">{avatarError}</p>}
          </section>

          {/* ═══ TARGET HARI INI ═══ */}
          <section className="ru-card ru-card--targets">
            <h2 className="ru-card__title"><Target size={16} /> Target Hari Ini</h2>
            {!targetsLoaded ? (
              <div className="ru-card__loading"><Loader2 size={20} className="ruang-user__spin" /></div>
            ) : (
              <div className="ru-targets">
                {targets.map((t) => {
                  const done = completed.includes(t.id);
                  return (
                    <label key={t.id} className={`ru-target ${done ? 'done' : ''}`}>
                      <input type="checkbox" checked={done} onChange={() => toggleTarget(t.id)} />
                      <span className="ru-target__icon">{t.icon}</span>
                      <span className="ru-target__label">{t.label}</span>
                      {done && <Check size={14} className="ru-target__check" />}
                    </label>
                  );
                })}
              </div>
            )}
          </section>

          {/* ═══ CAPAIAN HARI INI ═══ */}
          <section className="ru-card ru-card--progress">
            <h2 className="ru-card__title"><TrendingUp size={16} /> Capaian Hari Ini</h2>
            <div className="ru-progress">
              <div className="ru-progress__ring" style={{ '--progress': progress }}>
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="ru-progress__bg" />
                  <circle cx="50" cy="50" r="42" className="ru-progress__fill" strokeDasharray={`${progress * 2.64} 264`} />
                </svg>
                <span className="ru-progress__pct">{progress}%</span>
              </div>
              <div className="ru-progress__detail">
                <p className="ru-progress__count"><strong>{completed.length}</strong> / {targets.length} target</p>
                <p className="ru-progress__msg">{motivMsg}</p>
              </div>
            </div>
            <div className="ru-progress__extras">
              {quranLastRead && <span>📖 QS {quranLastRead.surahName || quranLastRead.surahId}</span>}
              {bookmarkCount > 0 && <span>🔖 {bookmarkCount} bookmark</span>}
              {favCount > 0 && <span>❤️ {favCount} favorit</span>}
            </div>
          </section>

          {/* ═══ CATATAN HARI INI ═══ */}
          <section className="ru-card ru-card--note">
            <h2 className="ru-card__title"><FileText size={16} /> Catatan Hari Ini</h2>
            {!noteLoaded ? (
              <div className="ru-card__loading"><Loader2 size={20} className="ruang-user__spin" /></div>
            ) : (
              <>
                <textarea
                  className="ru-note__textarea"
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Tulis refleksi, doa, rencana ibadah, atau hal baik hari ini…"
                  rows={4}
                />
                <div className="ru-note__actions">
                  <button className="ru-note__save" onClick={handleNoteSave} disabled={noteSaving}>
                    {noteSaving ? <Loader2 size={14} className="ruang-user__spin" /> : <Check size={14} />}
                    {noteSaving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  {noteContent && (
                    <button className="ru-note__delete" onClick={handleNoteDelete} disabled={noteDeleting}>
                      <Trash2 size={13} /> Hapus
                    </button>
                  )}
                  {noteUpdatedAt && (
                    <span className="ru-note__time">
                      Terakhir: {new Date(noteUpdatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </>
            )}
          </section>

          {/* ═══ JEJAK AKTIVITAS ═══ */}
          <section className="ru-card ru-card--activity">
            <h2 className="ru-card__title"><Clock size={16} /> Jejak Aktivitas</h2>
            {recentActivity.length > 0 ? (
              <ul className="ru-activity-list">
                {recentActivity.slice(0, 8).map((act, i) => {
                  const { icon, desc } = formatActivity(act);
                  const time = act.created_at || act.timestamp;
                  return (
                    <li key={i} className="ru-activity-item">
                      <span className="ru-activity-icon">{icon}</span>
                      <span className="ru-activity-desc">{desc || 'Aktivitas'}</span>
                      {time && <span className="ru-activity-time">{new Date(time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="ru-card__empty">Belum ada aktivitas tercatat hari ini.</p>
            )}
          </section>

          {/* ═══ AL-QUR'AN ═══ */}
          <section className="ru-card">
            <h2 className="ru-card__title"><BookOpen size={16} /> Al-Qur'an</h2>
            <div className="ruang-user__group">
              {quranLastRead ? (
                <Link to={`/mushaf/${quranLastRead.surahId}#ayah-${quranLastRead.ayahNumber}`} className="ruang-user__item">
                  <div className="ruang-user__item-icon" style={{ background: 'rgba(0,71,255,0.1)' }}><BookOpen size={18} style={{ color: 'var(--color-primary)' }} /></div>
                  <div className="ruang-user__item-content">
                    <strong>Terakhir Dibaca</strong>
                    <p>QS {quranLastRead.surahName || quranLastRead.surahId} Ayat {quranLastRead.ayahNumber}</p>
                  </div>
                  <ChevronRight size={18} className="ruang-user__item-right" />
                </Link>
              ) : (
                <div className="ruang-user__item">
                  <div className="ruang-user__item-icon" style={{ background: 'rgba(0,71,255,0.1)' }}><BookOpen size={18} style={{ color: 'var(--color-primary)' }} /></div>
                  <div className="ruang-user__item-content"><strong>Al-Qur'an</strong><p>Belum ada riwayat bacaan surah</p></div>
                </div>
              )}
              <div className="ruang-user__divider" />
              <Link to={quranLastPage ? `/mushaf/page/${quranLastPage}` : '/mushaf/page/1'} className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(0,71,255,0.1)' }}><BookOpen size={18} style={{ color: 'var(--color-primary)' }} /></div>
                <div className="ruang-user__item-content"><strong>Mushaf Per Halaman</strong><p>{quranLastPage ? `Terakhir dibaca: Hal ${quranLastPage}` : 'Mulai baca per halaman'}</p></div>
                <ChevronRight size={18} className="ruang-user__item-right" />
              </Link>
              <div className="ruang-user__divider" />
              <Link to="/mushaf" className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(0,71,255,0.1)' }}><Star size={18} style={{ color: 'var(--color-primary)' }} /></div>
                <div className="ruang-user__item-content"><strong>Bookmark</strong><p>{bookmarkCount > 0 ? `${bookmarkCount} ayat ditandai` : 'Belum ada bookmark'}</p></div>
                <ChevronRight size={18} className="ruang-user__item-right" />
              </Link>
            </div>
          </section>

          {/* ═══ SHOLAT & DZIKIR ═══ */}
          <section className="ru-card">
            <h2 className="ru-card__title"><Shield size={16} /> Sholat & Dzikir</h2>
            <div className="ruang-user__group">
              <Link to="/sholat" className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(16,185,129,0.1)' }}><MapPin size={18} style={{ color: '#059669' }} /></div>
                <div className="ruang-user__item-content"><strong>Jadwal Sholat</strong><p>{prayerCity}</p></div>
                <ChevronRight size={18} className="ruang-user__item-right" />
              </Link>
              <div className="ruang-user__divider" />
              <Link to="/doa-dzikir" className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(99,102,241,0.1)' }}><CheckSquare size={18} style={{ color: '#6366f1' }} /></div>
                <div className="ruang-user__item-content"><strong>Doa & Dzikir</strong><p>Dzikir pagi, petang, dan doa harian</p></div>
                <ChevronRight size={18} className="ruang-user__item-right" />
              </Link>
            </div>
          </section>

          {/* ═══ KAJIAN & AUDIO ═══ */}
          <section className="ru-card">
            <h2 className="ru-card__title"><Headphones size={16} /> Kajian & Audio</h2>
            <div className="ruang-user__group">
              {lastTilawah ? (
                <Link to="/tilawah" className="ruang-user__item">
                  <div className="ruang-user__item-icon" style={{ background: 'rgba(249,115,22,0.1)' }}><Headphones size={18} style={{ color: '#ea580c' }} /></div>
                  <div className="ruang-user__item-content"><strong>Tilawah Terakhir</strong><p>{lastTilawah.name || 'Channel terakhir'}</p></div>
                  <ChevronRight size={18} className="ruang-user__item-right" />
                </Link>
              ) : (
                <div className="ruang-user__item">
                  <div className="ruang-user__item-icon" style={{ background: 'rgba(249,115,22,0.1)' }}><Headphones size={18} style={{ color: '#ea580c' }} /></div>
                  <div className="ruang-user__item-content"><strong>Tilawah</strong><p>Belum ada riwayat</p></div>
                </div>
              )}
              <div className="ruang-user__divider" />
              <Link to="/favorit" className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(245,158,11,0.1)' }}><Heart size={18} style={{ color: '#d97706' }} /></div>
                <div className="ruang-user__item-content"><strong>Favorit</strong><p>{favCount > 0 ? `${favCount} item` : 'Belum ada favorit'}</p></div>
                <ChevronRight size={18} className="ruang-user__item-right" />
              </Link>
            </div>
          </section>

          {/* ═══ PERJALANAN ═══ */}
          <section className="ru-card ru-card--travel">
            <h2 className="ru-card__title"><Car size={16} /> Perjalanan</h2>
            <div className="ru-travel-grid">
              <Link to="/mode-perjalanan" className="ru-travel-btn"><Car size={18} /><span>Mode Perjalanan</span></Link>
              <Link to="/doa-dzikir" className="ru-travel-btn"><BookOpen size={18} /><span>Doa Safar</span></Link>
              <Link to="/kiblat" className="ru-travel-btn"><Compass size={18} /><span>Kiblat</span></Link>
              <Link to="/sholat" className="ru-travel-btn"><Clock size={18} /><span>Jadwal Sholat</span></Link>
            </div>
            <p className="ru-travel-safety">⚠️ Atur audio sebelum perjalanan atau saat berhenti.</p>
          </section>

          {/* ═══ PREFERENSI ═══ */}
          <section className="ru-card">
            <h2 className="ru-card__title"><Palette size={16} /> Preferensi</h2>
            <div className="ruang-user__group">
              <div className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(99,102,241,0.1)' }}><Palette size={18} style={{ color: '#6366f1' }} /></div>
                <div className="ruang-user__item-content"><strong>Tema Aktif</strong><p>{THEME_NAMES[appTheme] || 'Islamediaku'}</p></div>
              </div>
              <div className="ruang-user__divider" />
              <div className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(16,185,129,0.1)' }}><MapPin size={18} style={{ color: '#059669' }} /></div>
                <div className="ruang-user__item-content"><strong>Lokasi Sholat</strong><p>{prayerCity}</p></div>
              </div>
              <div className="ruang-user__divider" />
              <Link to="/pengaturan" className="ruang-user__item">
                <div className="ruang-user__item-icon" style={{ background: 'rgba(107,114,128,0.1)' }}><Settings size={18} style={{ color: '#6b7280' }} /></div>
                <div className="ruang-user__item-content"><strong>Pengaturan</strong><p>Kelola tema, data, dan preferensi</p></div>
                <ChevronRight size={18} className="ruang-user__item-right" />
              </Link>
            </div>
          </section>

          {/* ═══ SINKRONISASI DATA ═══ */}
          <section className="ru-card ru-card--sync">
            <h2 className="ru-card__title"><Cloud size={16} /> Sinkronisasi Data</h2>
            <div className="ruang-user__sync-header">
              {syncStatus?.synced ? (
                <><Cloud size={18} className="ruang-user__sync-icon synced" /><div><strong>Tersinkronisasi</strong><p>Terakhir: {syncStatus.lastSync?.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p></div></>
              ) : (
                <><CloudOff size={18} className="ruang-user__sync-icon not-synced" /><div><strong>Data Lokal</strong><p>Sinkronkan untuk backup ke cloud.</p></div></>
              )}
            </div>
            <button className={`ruang-user__sync-btn ${syncing ? 'syncing' : ''}`} onClick={handleSync} disabled={syncing}>
              <RefreshCw size={16} className={syncing ? 'ruang-user__spin' : ''} />
              {syncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}
            </button>
            {syncResult && (
              <div className={`ruang-user__sync-result ${syncResult.success ? 'success' : 'error'}`}>
                {syncResult.success ? '✓ Data berhasil disinkronkan.' : '✕ Gagal. Coba lagi nanti.'}
              </div>
            )}
            <p className="ru-sync-note">Data lokal tidak akan dihapus.</p>
          </section>

        </div>
      </main>
    </div>
  );
}
