import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import { getRecitersWithJuz30, getJuz30PlaylistByReciter, JUZ_30_SURAH_IDS, SURAH_NAMES } from '../../services/mp3QuranApi';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Search, RefreshCw, Volume2, Loader, BookOpen, AlertCircle } from 'lucide-react';
import './Murottal30JuzPage.css';

export default function Murottal30JuzPage() {
  useSEO({
    title: 'Murottal Juz 30 per Surah - Islamediaku',
    description: 'Dengarkan murottal Juz 30 Al-Qur\'an dari qari internasional pilihan dengan pemutar audio lengkap, auto-next, dan pencarian cepat.',
    path: '/murottal-30-juz'
  });

  const navigate = useNavigate();

  // API Data States
  const [reciters, setReciters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selection & Playlist States
  const [selectedReciterId, setSelectedReciterId] = useState(null);
  const [selectedMoshafId, setSelectedMoshafId] = useState(null);
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [playlistLoading, setPlaylistLoading] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'hafs' | 'murattal' | 'complete'

  // Audio Playback States
  const [currentSurahId, setCurrentSurahId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioBuffering, setAudioBuffering] = useState(false);

  // Audio Reference
  const audioRef = useRef(new Audio());

  // Load Reciters on Mount
  const loadReciters = async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecitersWithJuz30(refresh);
      setReciters(data);

      if (data.length > 0) {
        // Fallback to Mishary Alafasy or first reciter
        const defaultReciter = data.find(r => 
          r.reciterName.toLowerCase().includes('mishary') || 
          r.reciterName.toLowerCase().includes('afasy')
        ) || data[0];
        
        setSelectedReciterId(defaultReciter.reciterId);
        if (defaultReciter.moshafs.length > 0) {
          setSelectedMoshafId(defaultReciter.moshafs[0].moshafId);
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
    
    // Cleanup audio on unmount
    return () => {
      const audio = audioRef.current;
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Fetch playlist when reciter/moshaf changes
  useEffect(() => {
    if (!selectedReciterId || !selectedMoshafId) return;

    const fetchPlaylist = async () => {
      setPlaylistLoading(true);
      try {
        const playlist = await getJuz30PlaylistByReciter(selectedReciterId, selectedMoshafId);
        setPlaylistInfo(playlist);
        
        // Don't auto-reset current surah if it's already playing from the same qari
        if (playlist && playlist.playlist.length > 0) {
          const firstSurah = playlist.playlist[0].surahId;
          setCurrentSurahId(prev => (prev && playlist.playlist.some(s => s.surahId === prev) ? prev : firstSurah));
        }
      } catch (err) {
        console.error('Failed to build playlist:', err);
      } finally {
        setPlaylistLoading(false);
      }
    };

    fetchPlaylist();
  }, [selectedReciterId, selectedMoshafId]);

  // Audio Event Listeners Setup
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioBuffering(false);
    };
    const onWaiting = () => setAudioBuffering(true);
    const onPlaying = () => {
      setAudioBuffering(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => handleNext();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [playlistInfo, currentSurahId]);

  // Synchronize playing states
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
        console.warn('Playback failed or interrupted:', err);
        setIsPlaying(false);
      });
    }
  }, [activeTrack]);

  // Filters calculation
  const filteredReciters = useMemo(() => {
    return reciters.filter(reciter => {
      // 1. Search filter
      const matchesSearch = reciter.reciterName.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Type/Rewaya filter
      if (filterType === 'all') return true;
      
      return reciter.moshafs.some(moshaf => {
        if (filterType === 'hafs') {
          return moshaf.rewayaName.toLowerCase().includes('hafs') || 
                 moshaf.moshafName.toLowerCase().includes('hafs');
        }
        if (filterType === 'murattal') {
          return moshaf.moshafName.toLowerCase().includes('murattal') || 
                 moshaf.moshafName.toLowerCase().includes('مرتل');
        }
        if (filterType === 'complete') {
          // Has all 37 surahs of Juz 30
          const intersect = moshaf.availableSurahIds.filter(id => JUZ_30_SURAH_IDS.includes(id));
          return intersect.length === JUZ_30_SURAH_IDS.length;
        }
        return true;
      });
    });
  }, [reciters, searchQuery, filterType]);

  // Selected Reciter reference
  const selectedReciter = useMemo(() => {
    return reciters.find(r => r.reciterId === selectedReciterId) || null;
  }, [reciters, selectedReciterId]);

  // Control Actions
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (!playlistInfo || playlistInfo.playlist.length === 0) return;
    const currentIndex = playlistInfo.playlist.findIndex(s => s.surahId === currentSurahId);
    if (currentIndex > 0) {
      setCurrentSurahId(playlistInfo.playlist[currentIndex - 1].surahId);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (!playlistInfo || playlistInfo.playlist.length === 0) return;
    const currentIndex = playlistInfo.playlist.findIndex(s => s.surahId === currentSurahId);
    if (currentIndex < playlistInfo.playlist.length - 1) {
      setCurrentSurahId(playlistInfo.playlist[currentIndex + 1].surahId);
      setIsPlaying(true);
    } else {
      // Loop back to start or stop
      setIsPlaying(false);
      audioRef.current.currentTime = 0;
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const selectSurah = (surahId) => {
    setCurrentSurahId(surahId);
    setIsPlaying(true);
  };

  const formatTime = (timeSecs) => {
    if (isNaN(timeSecs)) return '00:00';
    const m = Math.floor(timeSecs / 60);
    const s = Math.floor(timeSecs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Quick refresh
  const handleRefresh = () => {
    loadReciters(true);
  };

  return (
    <div className="murottal-juz-page container">
      {/* Header */}
      <header className="murottal-header flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            className="btn-back p-2 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-border)] transition-colors"
            onClick={() => navigate('/')} 
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)]">Murottal Juz 30</h1>
            <p className="text-xs text-[var(--color-text-muted)]">Dengarkan lantunan Juz Amma per Surah dari Qari pilihan</p>
          </div>
        </div>
        
        <button 
          onClick={handleRefresh}
          className="refresh-btn p-2 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all flex items-center gap-1.5 text-xs font-semibold"
          title="Segarkan data qari"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
        
        {/* Left Side: Qari & Settings */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          
          {/* Search and Filters Box */}
          <div className="controls-box p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">Pengaturan Qari</h3>
            
            {/* Search */}
            <div className="search-qari relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
              <input
                type="text"
                placeholder="Cari nama Qari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl text-xs focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)] transition-all"
              />
            </div>

            {/* Filter Chips */}
            <div className="filter-chips flex flex-wrap gap-1.5 mb-4">
              {[
                { id: 'all', label: 'Semua Qari' },
                { id: 'hafs', label: 'Hafs' },
                { id: 'murattal', label: 'Murottal' },
                { id: 'complete', label: 'Lengkap Juz 30' }
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => setFilterType(chip.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    filterType === chip.id
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-border)]/50'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Qari Dropdown Selector */}
            <div className="qari-selector flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                Pilih Qari ({filteredReciters.length})
              </label>
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
                className="w-full p-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
                disabled={loading || filteredReciters.length === 0}
              >
                {filteredReciters.map(r => (
                  <option key={r.reciterId} value={r.reciterId}>
                    {r.reciterName}
                  </option>
                ))}
                {filteredReciters.length === 0 && <option value="">Qari tidak ditemukan</option>}
              </select>
            </div>

            {/* Moshaf/Riwayat Selection */}
            {selectedReciter && selectedReciter.moshafs.length > 1 && (
              <div className="moshaf-selector flex flex-col gap-1.5 mt-3">
                <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Pilih Riwayat / Jenis Moshaf
                </label>
                <select
                  value={selectedMoshafId || ''}
                  onChange={(e) => setSelectedMoshafId(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-primary)] focus:outline-none"
                >
                  {selectedReciter.moshafs.map(m => (
                    <option key={m.moshafId} value={m.moshafId}>
                      {m.rewayaName} ({m.moshafName})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Quick Info Box */}
          <div className="info-box p-4 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex gap-3">
            <BookOpen size={20} className="text-[var(--color-primary)] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-[var(--color-text-primary)] mb-1">Murottal Non-Streaming</h4>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
                Islamediaku memutar langsung file audio per Surah berkualitas tinggi dari server MP3Quran.net, bukan siaran langsung radio. Hemat kuota dan dapat dijeda secara mandiri.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Playlist */}
        <div className="lg:col-span-2">
          
          {loading || playlistLoading ? (
            <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
              <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-[var(--color-text-muted)] font-medium gap-3">
                <Loader className="animate-spin text-[var(--color-primary)]" size={32} />
                <span>Memuat data dan playlist audio Qari...</span>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-center text-xs">
              <AlertCircle className="text-[var(--color-error)] mx-auto mb-3" size={36} />
              <p className="text-[var(--color-error)] font-bold mb-3">{error}</p>
              <button 
                onClick={() => loadReciters()}
                className="btn btn--outline text-xs px-4 py-2 rounded-xl"
              >
                Coba Lagi
              </button>
            </div>
          ) : !playlistInfo || playlistInfo.playlist.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)]">
              Tidak ada surah Juz 30 yang tersedia untuk Qari dan riwayat yang dipilih.
            </div>
          ) : (
            <div className="playlist-box rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden shadow-sm">
              <div className="playlist-header p-4 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Daftar Surah Juz 30
                  </h3>
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)] mt-1">
                    {playlistInfo.reciterName} • <span className="text-[var(--color-primary)]">{playlistInfo.rewayaName}</span>
                  </h4>
                </div>
                <span className="text-[10px] font-bold bg-[var(--color-primary-light)] text-[var(--color-primary)] px-2.5 py-1 rounded-md">
                  {playlistInfo.playlist.length} Surah
                </span>
              </div>

              {/* Surah List */}
              <div className="surah-list divide-y divide-[var(--color-border)] max-h-[500px] overflow-y-auto">
                {playlistInfo.playlist.map((surah) => {
                  const isActive = surah.surahId === currentSurahId;
                  return (
                    <div 
                      key={surah.surahId}
                      onClick={() => selectSurah(surah.surahId)}
                      className={`playlist-item p-3.5 flex items-center justify-between cursor-pointer hover:bg-[var(--color-border)]/20 transition-all ${
                        isActive ? 'bg-[var(--color-primary-light)]/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`surah-number w-8 h-8 rounded-xl flex items-center justify-center border text-[11px] font-bold transition-all ${
                          isActive 
                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' 
                            : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] border-[var(--color-border)]'
                        }`}>
                          {surah.surahId}
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold transition-all ${
                            isActive ? 'text-[var(--color-primary)] font-extrabold' : 'text-[var(--color-text-primary)]'
                          }`}>
                            {surah.surahName}
                          </h4>
                          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                            Surat Ke-{surah.surahId}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isActive && isPlaying ? (
                          <span className="flex gap-0.5 items-end h-3">
                            <span className="w-0.5 bg-[var(--color-primary)] rounded-full animate-[bounce_0.8s_infinite] h-2"></span>
                            <span className="w-0.5 bg-[var(--color-primary)] rounded-full animate-[bounce_0.8s_infinite_0.2s] h-3"></span>
                            <span className="w-0.5 bg-[var(--color-primary)] rounded-full animate-[bounce_0.8s_infinite_0.4s] h-1.5"></span>
                          </span>
                        ) : (
                          <div className={`p-1.5 rounded-full border transition-all ${
                            isActive 
                              ? 'text-[var(--color-primary)] border-[var(--color-primary)] bg-white shadow-sm' 
                              : 'text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                          }`}>
                            <Play size={12} fill={isActive ? 'currentColor' : 'none'} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Floating Bottom Audio Player Bar */}
      {activeTrack && playlistInfo && (
        <div className="floating-player-bar fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] shadow-xl p-4 transition-all">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Info Track */}
            <div className="player-track-info flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <BookOpen size={20} />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                  {activeTrack.surahName}
                </h4>
                <p className="text-[10px] text-[var(--color-text-muted)] truncate">
                  Qari: {playlistInfo.reciterName} ({playlistInfo.rewayaName})
                </p>
              </div>
              {audioBuffering && (
                <Loader className="animate-spin text-[var(--color-primary)] shrink-0 ml-1" size={14} />
              )}
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrev}
                className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                disabled={playlistInfo.playlist.findIndex(s => s.surahId === currentSurahId) === 0}
                title="Sebelumnya"
              >
                <SkipBack size={18} />
              </button>

              <button 
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:scale-105 active:scale-95 shadow-md transition-all"
                title={isPlaying ? 'Jeda' : 'Putar'}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="translate-x-0.5" fill="currentColor" />}
              </button>

              <button 
                onClick={handleNext}
                className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                disabled={playlistInfo.playlist.findIndex(s => s.surahId === currentSurahId) === playlistInfo.playlist.length - 1}
                title="Berikutnya"
              >
                <SkipForward size={18} />
              </button>
            </div>

            {/* Seek Slider Progress */}
            <div className="player-progress-bar flex items-center gap-2.5 w-full md:flex-1 md:max-w-md">
              <span className="text-[9px] font-bold text-[var(--color-text-muted)] w-8 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="player-slider flex-1 h-1 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
              <span className="text-[9px] font-bold text-[var(--color-text-muted)] w-8">
                {formatTime(duration)}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
