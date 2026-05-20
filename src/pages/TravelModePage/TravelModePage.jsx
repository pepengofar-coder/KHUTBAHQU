import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import { useTilawahAudio } from '../../context/TilawahContext';
import { PLAYLISTS, getPlaylistItems, getPlaylistById } from '../../data/travelAudioContent';
import VariedFeatureCard from '../../components/VariedFeatureCard/VariedFeatureCard';
import { 
  Car, Play, Pause, Clock, Heart, 
  Copy, Check, Volume2, X, ChevronRight,
  AlertCircle
} from 'lucide-react';
import './TravelModePage.css';

export default function TravelModePage() {
  useSEO({
    title: "Mode Perjalanan — Pendamping Audio Islami Safar | Islamediaku",
    description: "Pendamping perjalanan Islami audio-first. Dengarkan tilawah Al-Qur'an merdu, kajian ringan sunnah, doa safar, dan radio islami penyejuk perjalanan Anda.",
    path: '/mode-perjalanan'
  });

  const navigate = useNavigate();

  const {
    playing, audioLoading, activeRadio,
    currentTrack, currentTime, duration, sleepTimer,
    playTrack, togglePlay, stopAudio, nextTrack, prevTrack, seek, changeSleepTimer
  } = useTilawahAudio();

  // Local states
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('islamediaku_travel_favorites')) || [];
    } catch {
      return [];
    }
  });

  // Derived state: last active played audio track
  const lastPlayed = useMemo(() => {
    if (currentTrack) return currentTrack;
    try {
      return JSON.parse(localStorage.getItem('islamediaku_travel_last_audio')) || null;
    } catch {
      return null;
    }
  }, [currentTrack]);

  const [copied, setCopied] = useState(false);
  const [doaRead, setDoaRead] = useState(() => {
    try {
      return localStorage.getItem('islamediaku_doa_safar_read') === 'true';
    } catch {
      return false;
    }
  });

  const [toastMessage, setToastMessage] = useState('');
  const [toastActive, setToastActive] = useState(false);

  // Show Toast Helper
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setToastActive(true);
    setTimeout(() => setToastActive(false), 3000);
  }, []);

  // Monitor Sleep Timer Termination
  useEffect(() => {
    const handleSleepTimerEnd = () => {
      showToast("Audio dihentikan sesuai sleep timer. 😴");
    };

    window.addEventListener('imk-sleep-timer-end', handleSleepTimerEnd);
    return () => window.removeEventListener('imk-sleep-timer-end', handleSleepTimerEnd);
  }, [showToast]);

  // Toggle Favorite
  const toggleFav = useCallback((id, e) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('islamediaku_travel_favorites', JSON.stringify(next));
      showToast(prev.includes(id) ? "Dihapus dari Favorit Safar." : "Disimpan ke Favorit Safar! ❤️");
      return next;
    });
  }, [showToast]);

  // Check if item is favorited
  const isFav = useCallback((id) => favorites.includes(id), [favorites]);

  // Handle Play track safely
  const handlePlayItem = useCallback((track, playlistTracks = []) => {
    if (!track.enabled && !track.audioUrl) {
      if (track.sourceUrl) {
        // Safe external redirect for YouTube or web links
        window.open(track.sourceUrl, '_blank', 'noopener,noreferrer');
        showToast(`Membuka link resmi ${track.sourceName}...`);
      } else {
        showToast("Audio belum tersedia saat ini.");
      }
      return;
    }

    if (track.route) {
      // Redirect internally
      navigate(track.route);
      return;
    }

    playTrack(track, playlistTracks);
    showToast(`Memutar: ${track.title}`);
  }, [playTrack, navigate, showToast]);

  // Handle Play All Playlist
  const handlePlayAll = useCallback((playlistId) => {
    const tracks = getPlaylistItems(playlistId).filter(t => t.enabled);
    if (tracks.length === 0) {
      showToast("Tidak ada audio terverifikasi di playlist ini.");
      return;
    }
    handlePlayItem(tracks[0], tracks);
  }, [handlePlayItem, showToast]);

  // Open Playlist detail bottom sheet
  const handleOpenPlaylist = useCallback((id) => {
    setSelectedPlaylistId(id);
  }, []);

  const selectedPlaylist = useMemo(() => {
    if (!selectedPlaylistId) return null;
    return getPlaylistById(selectedPlaylistId);
  }, [selectedPlaylistId]);

  const selectedPlaylistTracks = useMemo(() => {
    if (!selectedPlaylistId) return [];
    return getPlaylistItems(selectedPlaylistId);
  }, [selectedPlaylistId]);

  // Doa Safar copy handler
  const handleCopyDoa = useCallback(() => {
    const text = `Doa Safar (Perjalanan):\n\nاللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا Lَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنا لَمُنْقَلِبُونَ\n\nArtinya:\n"Allah Maha Besar (3x). Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami." (HR. Muslim no. 1342)\n\nShared via Islamediaku`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast("Doa Safar disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [showToast]);

  const handleToggleDoaRead = useCallback(() => {
    setDoaRead(prev => {
      const next = !prev;
      localStorage.setItem('islamediaku_doa_safar_read', String(next));
      showToast(next ? "Safar berkah, doa telah dibaca! 🤲" : "Status doa dibatalkan.");
      return next;
    });
  }, [showToast]);

  // Time format helper (s -> mm:ss)
  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Convert minutes to nice label
  const getSleepTimerLabel = (val) => {
    if (val === 'off') return 'Off';
    return `${val} Menit`;
  };

  return (
    <div className="travel-mode-page">
      {/* Toast Alert */}
      <div className={`travel-toast ${toastActive ? 'active' : ''}`}>
        {toastMessage}
      </div>

      {/* Page Header */}
      <header className="travel-header container">
        <div className="travel-brand">
          <Car className="travel-brand-icon animate-bounce" size={28} />
          <div>
            <h1 className="travel-title">Mode Perjalanan</h1>
            <p className="travel-subtitle">Spotify-like Islamic Audio Companion</p>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="travel-safety-badge" role="alert">
          <AlertCircle className="safety-icon" size={16} />
          <span>Gunakan audio dengan aman. Jika sedang mengemudi, atur playlist sebelum berangkat atau saat berhenti.</span>
        </div>
      </header>

      {/* Travel Essentials Shortcuts */}
      <section className="travel-essentials container">
        <h2 className="travel-section-title">Bekal Safarmu</h2>
        <div className="travel-shortcuts-grid">
          <a href="#doa-safar-card" className="shortcut-card shortcut-card--rose">
            <span className="shortcut-emoji">🤲</span>
            <strong>Doa Safar</strong>
            <p>Hadits Shahih</p>
          </a>
          <Link to="/sholat" className="shortcut-card shortcut-card--blue">
            <span className="shortcut-emoji">🕌</span>
            <strong>Waktu Sholat</strong>
            <p>Jadwal Realtime</p>
          </Link>
          <Link to="/kiblat" className="shortcut-card shortcut-card--indigo">
            <span className="shortcut-emoji">🧭</span>
            <strong>Arah Kiblat</strong>
            <p>Kompas Kiblat</p>
          </Link>
        </div>
      </section>

      {/* Continue Listening Section */}
      {lastPlayed && (
        <section className="continue-listening container">
          <h2 className="travel-section-title">Lanjut Dengarkan</h2>
          <div className="continue-card" onClick={() => handlePlayItem(lastPlayed)}>
            <div className="continue-cover" style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}>
              <Volume2 className="continue-wave-icon" size={24} />
            </div>
            <div className="continue-details">
              <span className="continue-badge">{lastPlayed.isLive ? 'LIVE RADIO' : lastPlayed.type?.toUpperCase() || 'AUDIO'}</span>
              <h3 className="continue-title">{lastPlayed.title || lastPlayed.name}</h3>
              <p className="continue-subtitle">{lastPlayed.subtitle || 'Islamediaku Premium Audio'}</p>
              <p className="continue-attribution">{lastPlayed.attribution || 'Sumber Terverifikasi'}</p>
            </div>
            <button className="continue-play-btn" aria-label="Lanjutkan">
              {playing && activeRadio?.id === lastPlayed.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
          </div>
        </section>
      )}

      {/* Playlists Grid */}
      <section className="travel-playlists container">
        <h2 className="travel-section-title font-bold">Playlist Perjalanan</h2>
        <div className="playlists-grid">
          {PLAYLISTS.map(p => {
            const tracks = getPlaylistItems(p.id);
            const countStr = `${tracks.length} Audio`;
            const colorMap = {
              'tenang-perjalanan': 'blue',
              'tilawah-pilihan': 'cyan',
              'murottal-juz-amma': 'emerald',
              'dzikir-doa': 'rose',
              'kajian-ringan': 'lavender',
              'radio-quran-live': 'mint',
            };
            return (
              <VariedFeatureCard
                key={p.id}
                title={p.title}
                subtitle={`${countStr} • ${p.subtitle}`}
                icon={p.icon}
                colorVariant={colorMap[p.id] || 'blue'}
                onClick={() => handleOpenPlaylist(p.id)}
                layoutVariant="playlist-card"
              />
            );
          })}
        </div>
      </section>

      {/* Doa Safar Essential Card */}
      <section id="doa-safar-card" className="doa-safar-section container">
        <h2 className="travel-section-title">Essential Safar</h2>
        <div className={`doa-card ${doaRead ? 'doa-card--read' : ''}`}>
          <div className="doa-card-header">
            <span className="doa-badge">DOA BEPERGIAN</span>
            <div className="doa-card-actions">
              <button className="doa-action-btn" onClick={handleCopyDoa} title="Salin Doa">
                {copied ? <Check size={18} className="text-lime" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
          <div className="doa-card-body">
            <h3 className="doa-arabic">اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنا لَمُنْقَلِبُونَ</h3>
            <p className="doa-transliteration">"Allahu Akbar, Allahu Akbar, Allahu Akbar. Subhaanal-ladzii sakh-khara lanaa haadzaa wa maa kunnaa lahu muqriniin. Wa innaa ilaa Rabbinaa lamunqalibuun."</p>
            <p className="doa-translation">Artinya: "Allah Maha Besar, Allah Maha Besar, Allah Maha Besar. Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami." (HR. Muslim)</p>
          </div>
          <div className="doa-card-footer">
            <button 
              className={`doa-read-toggle ${doaRead ? 'active' : ''}`}
              onClick={handleToggleDoaRead}
            >
              {doaRead ? '✓ Sudah Dibaca' : 'Tandai Sudah Dibaca'}
            </button>
          </div>
        </div>
      </section>

      {/* Sleep Timer Settings */}
      <section className="sleep-timer-shortcut container">
        <div className="sleep-shortcut-card" onClick={() => setShowSleepModal(true)}>
          <Clock className="sleep-icon" size={20} />
          <div>
            <strong>Sleep Timer Safar</strong>
            <p>Hentikan audio otomatis agar hemat baterai: <span className="text-lime font-bold">{getSleepTimerLabel(sleepTimer)}</span></p>
          </div>
          <ChevronRight size={18} className="ml-auto" />
        </div>
      </section>

      {/* Interactive Active Player (Bottom Sticky bar if track is loaded) */}
      {activeRadio && !currentTrack?.route && (
        <div className="travel-player-bar">
          <div className="tpb-inner">
            <div className="tpb-track-info">
              <span className="tpb-badge">{activeRadio.isLive ? 'LIVE' : activeRadio.type?.toUpperCase() || 'TILAWAH'}</span>
              <div className="tpb-titles">
                <span className="tpb-title">{activeRadio.title || activeRadio.name}</span>
                <span className="tpb-subtitle">{activeRadio.subtitle || activeRadio.sourceName}</span>
              </div>
            </div>

            {/* Timings Progress (Only for non-live tracks) */}
            {!activeRadio.isLive && duration > 0 && (
              <div className="tpb-progress-container">
                <span className="time-label">{formatTime(currentTime)}</span>
                <input 
                  type="range" 
                  className="tpb-slider" 
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={(e) => seek(Number(e.target.value))}
                />
                <span className="time-label">{formatTime(duration)}</span>
              </div>
            )}

            <div className="tpb-controls">
              {!activeRadio.isLive && (
                <button className="tpb-control-btn tpb-prev" onClick={prevTrack} aria-label="Sebelumnya">
                  ⏮️
                </button>
              )}
              <button 
                className="tpb-play-btn" 
                onClick={togglePlay}
                aria-label={playing ? 'Jeda' : 'Putar'}
              >
                {audioLoading ? <span className="tpb-spinner">⌛</span> : playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              </button>
              {!activeRadio.isLive && (
                <button className="tpb-control-btn tpb-next" onClick={nextTrack} aria-label="Berikutnya">
                  ⏭️
                </button>
              )}
              <button className="tpb-control-btn tpb-close" onClick={stopAudio} title="Hentikan Audio">
                <X size={18} />
              </button>
            </div>
            
            {/* Direct attribution label */}
            <div className="tpb-attribution">
              {activeRadio.attribution || 'Sumber Resmi Islamediaku'}
            </div>
          </div>
        </div>
      )}

      {/* Playlist Details Bottom Sheet */}
      {selectedPlaylist && (
        <div className="playlist-sheet-backdrop" onClick={() => setSelectedPlaylistId(null)}>
          <div className="playlist-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" onClick={() => setSelectedPlaylistId(null)}><span /></div>
            
            <div className="sheet-header">
              <span className="sheet-icon">{selectedPlaylist.icon}</span>
              <div>
                <h3 className="sheet-title">{selectedPlaylist.title}</h3>
                <p className="sheet-desc">{selectedPlaylist.subtitle}</p>
              </div>
              <button className="sheet-close" onClick={() => setSelectedPlaylistId(null)}><X size={20} /></button>
            </div>

            <div className="sheet-actions">
              <button className="sheet-play-all" onClick={() => handlePlayAll(selectedPlaylist.id)}>
                <Play size={16} fill="currentColor" style={{marginRight: 6}} /> Putar Rekomendasi
              </button>
            </div>

            <div className="sheet-body">
              <h4 className="sheet-tracks-heading">Daftar Audio</h4>
              <div className="sheet-tracks-list">
                {selectedPlaylistTracks.map((track) => {
                  const isActive = activeRadio?.id === track.id;
                  const isPlayingThis = isActive && playing;
                  const isItemFavorited = isFav(track.id);

                  return (
                    <div 
                      key={track.id} 
                      className={`track-item ${isActive ? 'active' : ''} ${!track.enabled && !track.audioUrl && !track.route ? 'disabled' : ''}`}
                      onClick={() => handlePlayItem(track, selectedPlaylistTracks)}
                    >
                      <div className="track-number-box">
                        {isPlayingThis ? (
                          <div className="track-playing-waves"><span/><span/><span/></div>
                        ) : (
                          <span className="track-type-icon">
                            {track.type === 'radio' ? '📻' : track.type === 'doa' ? '🤲' : '🔊'}
                          </span>
                        )}
                      </div>

                      <div className="track-meta">
                        <span className="track-title-row">
                          <strong className="track-title">{track.title}</strong>
                          {track.isVerified && <span className="verified-badge" title="Sumber Terverifikasi">✓ Verified</span>}
                        </span>
                        <p className="track-qari">{track.subtitle}</p>
                        <span className="track-source-attribution">
                          {track.attribution}
                        </span>
                      </div>

                      <div className="track-end-actions">
                        {/* Favorite button */}
                        {track.enabled && (
                          <button 
                            className={`track-fav-btn ${isItemFavorited ? 'active' : ''}`}
                            onClick={(e) => toggleFav(track.id, e)}
                          >
                            <Heart size={16} fill={isItemFavorited ? 'currentColor' : 'none'} />
                          </button>
                        )}

                        {/* Control Indicator */}
                        <button className="track-play-indicator">
                          {!track.enabled && !track.audioUrl && !track.route ? (
                            <span className="badge-unavailable" title="Audio Belum Tersedia">N/A</span>
                          ) : track.route ? (
                            <span className="badge-open">BUKA</span>
                          ) : isPlayingThis ? (
                            <Pause size={14} fill="currentColor" />
                          ) : (
                            <Play size={14} fill="currentColor" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sleep Timer Settings Dialog */}
      {showSleepModal && (
        <div className="sleep-modal-backdrop" onClick={() => setShowSleepModal(false)}>
          <div className="sleep-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="sleep-modal-title">Atur Sleep Timer Safar</h3>
            <p className="sleep-modal-desc">Audio akan berhenti otomatis ketika waktu habis untuk menghemat konsumsi baterai ponsel Anda di perjalanan.</p>
            
            <div className="sleep-options">
              {[
                { value: 'off', label: 'Matikan Timer (Off)' },
                { value: '15', label: '15 Menit' },
                { value: '30', label: '30 Menit' },
                { value: '60', label: '60 Menit' },
              ].map((opt) => (
                <button 
                  key={opt.value} 
                  className={`sleep-option-btn ${sleepTimer === opt.value ? 'active' : ''}`}
                  onClick={() => {
                    changeSleepTimer(opt.value);
                    setShowSleepModal(false);
                    showToast(`Sleep timer diatur ke: ${opt.label}`);
                  }}
                >
                  {opt.label}
                  {sleepTimer === opt.value && <span className="lime-dot" />}
                </button>
              ))}
            </div>

            <button className="sleep-modal-close" onClick={() => setShowSleepModal(false)}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}
