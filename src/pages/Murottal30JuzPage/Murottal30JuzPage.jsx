/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import {
  getRecitersWithJuz30, getRecitersWithComplete114, getJuz30PlaylistByReciter,
  getJuzPlaylist, JUZ_MAP, ALL_SURAH_NAMES
} from '../../services/mp3QuranApi';
import {
  ArrowLeft, Play, Pause, SkipBack, SkipForward, Search,
  Loader, AlertCircle, Repeat, Repeat1, BookOpen
} from 'lucide-react';
import './Murottal30JuzPage.css';

const LS_KEY = 'islamediaku_murottal_state';

function loadSavedState() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

function saveState(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ ...state, timestamp: Date.now() })); }
  catch (e) { console.warn('Failed to save murottal state', e); }
}

export default function Murottal30JuzPage() {
  useSEO({
    title: 'Murottal 30 Juz Al-Qur\'an - Islamediaku',
    description: 'Dengarkan murottal Al-Qur\'an lengkap 30 Juz dari qari internasional pilihan dengan pemutar audio, auto-next, Juz navigation, dan mode repeat.',
    path: '/murottal-30-juz'
  });

  const navigate = useNavigate();
  const savedState = useMemo(() => loadSavedState(), []);

  // Mode: 'juz30' (Juz Amma only) or 'full30' (all 30 Juz)
  const [mode, setMode] = useState(savedState?.mode || 'juz30');

  // API Data States
  const [reciters, setReciters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selection & Playlist States
  const [selectedReciterId, setSelectedReciterId] = useState(savedState?.reciterId || null);
  const [selectedMoshafId, setSelectedMoshafId] = useState(savedState?.moshafId || null);
  const [selectedJuz, setSelectedJuz] = useState(savedState?.juz || 30);
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [playlistLoading, setPlaylistLoading] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Playback States
  const [currentSurahId, setCurrentSurahId] = useState(savedState?.surahId || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioBuffering, setAudioBuffering] = useState(false);
  const [repeatMode, setRepeatMode] = useState(savedState?.repeat || 'none');

  // Refs
  const audioRef = useRef(new Audio());
  const handleNextRef = useRef();
  const juzScrollerRef = useRef(null);

  // Load Reciters
  const loadReciters = async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = mode === 'full30'
        ? await getRecitersWithComplete114(refresh)
        : await getRecitersWithJuz30(refresh);
      setReciters(data);

      if (data.length > 0 && !selectedReciterId) {
        const defaultReciter = data.find(r =>
          r.reciterName.toLowerCase().includes('mishary') ||
          r.reciterName.toLowerCase().includes('afasy')
        ) || data[0];
        setSelectedReciterId(defaultReciter.reciterId);
        if (defaultReciter.moshafs.length > 0) {
          setSelectedMoshafId(defaultReciter.moshafs[0].moshafId);
        }
      } else if (data.length > 0 && selectedReciterId) {
        const exists = data.find(r => r.reciterId === selectedReciterId);
        if (!exists) {
          setSelectedReciterId(data[0].reciterId);
          setSelectedMoshafId(data[0].moshafs[0]?.moshafId || null);
        }
      }
    } catch (err) {
      console.error('Failed to load Qaris:', err);
      setError('Gagal memuat daftar Qari. Silakan periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReciters();
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Fetch playlist when reciter/moshaf/juz changes
  useEffect(() => {
    if (!selectedReciterId || !selectedMoshafId) return;

    const fetchPlaylist = async () => {
      setPlaylistLoading(true);
      try {
        let playlist;
        if (mode === 'full30') {
          playlist = await getJuzPlaylist(selectedReciterId, selectedMoshafId, selectedJuz);
        } else {
          playlist = await getJuz30PlaylistByReciter(selectedReciterId, selectedMoshafId);
        }
        setPlaylistInfo(playlist);

        if (playlist && playlist.playlist.length > 0) {
          const firstSurah = playlist.playlist[0].surahId;
          setCurrentSurahId(prev =>
            (prev && playlist.playlist.some(s => s.surahId === prev) ? prev : firstSurah)
          );
        }
      } catch (err) {
        console.error('Failed to build playlist:', err);
      } finally {
        setPlaylistLoading(false);
      }
    };

    fetchPlaylist();
  }, [selectedReciterId, selectedMoshafId, selectedJuz, mode]);

  // Save state on changes
  useEffect(() => {
    if (selectedReciterId && selectedMoshafId) {
      saveState({
        mode, reciterId: selectedReciterId, moshafId: selectedMoshafId,
        juz: selectedJuz, surahId: currentSurahId, repeat: repeatMode
      });
    }
  }, [mode, selectedReciterId, selectedMoshafId, selectedJuz, currentSurahId, repeatMode]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => { setDuration(audio.duration || 0); setAudioBuffering(false); };
    const onWaiting = () => setAudioBuffering(true);
    const onPlaying = () => { setAudioBuffering(false); setIsPlaying(true); };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => handleNextRef.current && handleNextRef.current();
    const onError = () => { setAudioBuffering(false); setIsPlaying(false); };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Active track
  const activeTrack = useMemo(() => {
    if (!playlistInfo || !currentSurahId) return null;
    return playlistInfo.playlist.find(s => s.surahId === currentSurahId);
  }, [playlistInfo, currentSurahId]);

  // Play audio when track changes
  useEffect(() => {
    if (!activeTrack) return;
    const audio = audioRef.current;
    const isSameSrc = audio.src === activeTrack.audioUrl;
    if (!isSameSrc) {
      audio.src = activeTrack.audioUrl;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
    }
    if (isPlaying) {
      audio.play().catch(err => {
        console.warn('Playback failed:', err);
        setIsPlaying(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrack]);

  // Filtered reciters
  const filteredReciters = useMemo(() => {
    return reciters.filter(r =>
      r.reciterName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reciters, searchQuery]);

  const selectedReciter = useMemo(() =>
    reciters.find(r => r.reciterId === selectedReciterId) || null
  , [reciters, selectedReciterId]);

  // Auto-scroll active juz pill into view
  useEffect(() => {
    if (mode !== 'full30' || !juzScrollerRef.current) return;
    const activePill = juzScrollerRef.current.querySelector('.juz-pill.active');
    if (activePill) {
      activePill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedJuz, mode]);

  // Controls
  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handlePrev = useCallback(() => {
    if (!playlistInfo || playlistInfo.playlist.length === 0) return;
    const idx = playlistInfo.playlist.findIndex(s => s.surahId === currentSurahId);
    if (idx > 0) {
      setCurrentSurahId(playlistInfo.playlist[idx - 1].surahId);
      setIsPlaying(true);
    }
  }, [playlistInfo, currentSurahId]);

  const handleNext = useCallback(() => {
    if (!playlistInfo || playlistInfo.playlist.length === 0) return;
    const idx = playlistInfo.playlist.findIndex(s => s.surahId === currentSurahId);

    if (repeatMode === 'surah') {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }

    if (idx < playlistInfo.playlist.length - 1) {
      setCurrentSurahId(playlistInfo.playlist[idx + 1].surahId);
      setIsPlaying(true);
    } else {
      if (repeatMode === 'juz') {
        setCurrentSurahId(playlistInfo.playlist[0].surahId);
        setIsPlaying(true);
      } else if (mode === 'full30' && selectedJuz < 30) {
        setSelectedJuz(prev => prev + 1);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
        audioRef.current.currentTime = 0;
      }
    }
  }, [playlistInfo, currentSurahId, repeatMode, mode, selectedJuz]);

  useEffect(() => {
    handleNextRef.current = handleNext;
  });

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const selectSurah = (surahId) => {
    setCurrentSurahId(surahId);
    setIsPlaying(true);
  };

  const cycleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'surah';
      if (prev === 'surah') return 'juz';
      return 'none';
    });
  };

  const formatTime = (t) => {
    if (isNaN(t)) return '00:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentJuzInfo = useMemo(() =>
    JUZ_MAP.find(j => j.juz === selectedJuz) || JUZ_MAP[29]
  , [selectedJuz]);

  const handleResume = () => {
    if (savedState?.surahId && playlistInfo) {
      const exists = playlistInfo.playlist.some(s => s.surahId === savedState.surahId);
      if (exists) {
        setCurrentSurahId(savedState.surahId);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="murottal-page container">

      {/* ─── Header ─── */}
      <header className="murottal-header">
        <button
          className="murottal-header__back"
          onClick={() => navigate('/')}
          aria-label="Kembali ke Beranda"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="murottal-header__title">
            {mode === 'full30' ? 'Murottal 30 Juz' : 'Murottal Juz Amma'}
          </h1>
          <p className="murottal-header__subtitle">
            {mode === 'full30'
              ? `Juz ${selectedJuz} — ${ALL_SURAH_NAMES[currentJuzInfo.startSurah]} s/d ${ALL_SURAH_NAMES[currentJuzInfo.endSurah]}`
              : 'Juz 30 • Surat An-Naba s/d An-Nas'}
          </p>
        </div>
      </header>

      {/* ─── Mode Toggle ─── */}
      <div className="murottal-mode-toggle">
        <button
          className={`murottal-mode-btn ${mode === 'juz30' ? 'active' : ''}`}
          onClick={() => { setMode('juz30'); setSelectedJuz(30); setReciters([]); setSelectedReciterId(null); }}
        >
          Juz Amma
        </button>
        <button
          className={`murottal-mode-btn ${mode === 'full30' ? 'active' : ''}`}
          onClick={() => { setMode('full30'); setSelectedJuz(1); setReciters([]); setSelectedReciterId(null); }}
        >
          30 Juz Lengkap
        </button>
      </div>

      {/* ─── Resume Card ─── */}
      {savedState && savedState.surahId && savedState.reciterId && !isPlaying && (
        <div className="murottal-resume" onClick={handleResume} role="button" tabIndex={0}>
          <div className="murottal-resume__icon">
            <Play size={18} fill="currentColor" />
          </div>
          <div>
            <div className="murottal-resume__label">Lanjutkan</div>
            <p className="murottal-resume__text">
              {ALL_SURAH_NAMES[savedState.surahId] || `Surat ${savedState.surahId}`} — Juz {savedState.juz}
            </p>
          </div>
        </div>
      )}

      {/* ─── Qari Bar ─── */}
      <div className="qari-bar">
        <div className="qari-bar__search">
          <Search className="qari-bar__search-icon" size={15} />
          <input
            type="text"
            placeholder="Cari Qari..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="qari-bar__search-input"
          />
        </div>
        <select
          value={selectedReciterId || ''}
          onChange={(e) => {
            const id = parseInt(e.target.value, 10);
            setSelectedReciterId(id);
            const rec = reciters.find(r => r.reciterId === id);
            if (rec && rec.moshafs.length > 0) {
              setSelectedMoshafId(rec.moshafs[0].moshafId);
            }
          }}
          className="qari-bar__select"
          disabled={loading || filteredReciters.length === 0}
        >
          {filteredReciters.map(r => (
            <option key={r.reciterId} value={r.reciterId}>
              {r.reciterName}
            </option>
          ))}
          {filteredReciters.length === 0 && <option value="">Qari tidak ditemukan</option>}
        </select>

        {selectedReciter && selectedReciter.moshafs.length > 1 && (
          <select
            value={selectedMoshafId || ''}
            onChange={(e) => setSelectedMoshafId(parseInt(e.target.value, 10))}
            className="qari-bar__select qari-bar__moshaf"
          >
            {selectedReciter.moshafs.map(m => (
              <option key={m.moshafId} value={m.moshafId}>
                {m.rewayaName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ─── Juz Navigation (horizontal scroll) ─── */}
      {mode === 'full30' && (
        <div className="juz-scroller" ref={juzScrollerRef}>
          {JUZ_MAP.map(j => (
            <button
              key={j.juz}
              className={`juz-pill ${selectedJuz === j.juz ? 'active' : ''}`}
              onClick={() => setSelectedJuz(j.juz)}
            >
              Juz {j.juz}
            </button>
          ))}
        </div>
      )}

      {/* ─── Playlist ─── */}
      {loading || playlistLoading ? (
        <div className="murottal-status">
          <Loader className="animate-spin" size={28} style={{ color: 'var(--color-primary)' }} />
          <span>Memuat playlist...</span>
        </div>
      ) : error ? (
        <div className="murottal-status">
          <AlertCircle size={32} style={{ color: 'var(--color-error)' }} />
          <p style={{ color: 'var(--color-error)', fontWeight: 600 }}>{error}</p>
          <button onClick={() => loadReciters()} className="btn btn--outline btn--sm">
            Coba Lagi
          </button>
        </div>
      ) : !playlistInfo || playlistInfo.playlist.length === 0 ? (
        <div className="murottal-status">
          Tidak ada surah tersedia untuk Qari ini.
        </div>
      ) : (
        <div className="playlist-box">
          <div className="playlist-header">
            <div>
              <div className="playlist-header__title">
                {mode === 'full30' ? `Juz ${selectedJuz}` : 'Juz 30 (Juz Amma)'}
              </div>
              <div className="playlist-header__qari">
                {playlistInfo.reciterName} • <span>{playlistInfo.rewayaName}</span>
              </div>
            </div>
            <span className="playlist-header__count">
              {playlistInfo.playlist.length} Surah
            </span>
          </div>

          <div className="surah-list">
            {playlistInfo.playlist.map((surah) => {
              const isActive = surah.surahId === currentSurahId;
              const isCurrentlyPlaying = isActive && isPlaying;
              return (
                <div
                  key={surah.surahId}
                  onClick={() => selectSurah(surah.surahId)}
                  className={`surah-item ${isActive ? 'active' : ''}`}
                >
                  <div className="surah-item__left">
                    <div className="surah-item__number">{surah.surahId}</div>
                    <span className="surah-item__name">{surah.surahName}</span>
                  </div>

                  <div className="surah-item__play">
                    {isCurrentlyPlaying ? (
                      <div className="wave-bars">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <Play size={13} fill={isActive ? 'currentColor' : 'none'} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Floating Player Bar ─── */}
      {activeTrack && playlistInfo && (
        <div className="floating-player">
          <div className="floating-player__inner">

            {/* Main row: info + controls */}
            <div className="floating-player__main">
              <div className="floating-player__info">
                <div className="floating-player__icon">
                  {audioBuffering
                    ? <Loader className="animate-spin" size={18} />
                    : <BookOpen size={18} />
                  }
                </div>
                <div className="floating-player__meta">
                  <div className="floating-player__track">{activeTrack.surahName}</div>
                  <div className="floating-player__artist">
                    {playlistInfo.reciterName} • {mode === 'full30' ? `Juz ${selectedJuz}` : 'Juz 30'}
                  </div>
                </div>
              </div>

              <div className="floating-player__controls">
                <button
                  className={`fp-btn fp-btn--repeat ${repeatMode !== 'none' ? 'active' : ''}`}
                  onClick={cycleRepeat}
                  title={repeatMode === 'none' ? 'Repeat Off' : repeatMode === 'surah' ? 'Repeat Surah' : 'Repeat Juz'}
                >
                  {repeatMode === 'surah' ? <Repeat1 size={15} /> : <Repeat size={15} />}
                </button>

                <button
                  className="fp-btn"
                  onClick={handlePrev}
                  disabled={playlistInfo.playlist.findIndex(s => s.surahId === currentSurahId) === 0}
                  title="Sebelumnya"
                >
                  <SkipBack size={17} />
                </button>

                <button
                  className="fp-btn fp-btn--play"
                  onClick={handlePlayPause}
                  title={isPlaying ? 'Jeda' : 'Putar'}
                >
                  {isPlaying
                    ? <Pause size={17} fill="currentColor" />
                    : <Play size={17} fill="currentColor" style={{ marginLeft: 2 }} />
                  }
                </button>

                <button
                  className="fp-btn"
                  onClick={handleNext}
                  disabled={
                    playlistInfo.playlist.findIndex(s => s.surahId === currentSurahId) === playlistInfo.playlist.length - 1
                    && repeatMode === 'none'
                    && !(mode === 'full30' && selectedJuz < 30)
                  }
                  title="Berikutnya"
                >
                  <SkipForward size={17} />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="floating-player__progress">
              <span className="fp-time">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="fp-slider"
              />
              <span className="fp-time">{formatTime(duration)}</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
