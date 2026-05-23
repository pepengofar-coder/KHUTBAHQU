import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import { useTilawahAudio } from '../../context/TilawahContext';
import { PLAYLISTS, getPlaylistItems, getPlaylistById } from '../../data/travelAudioContent';
import { KAJIAN_RINGAN_VIDEOS } from '../../data/kajianRinganVideos';
import VariedFeatureCard from '../../components/VariedFeatureCard/VariedFeatureCard';
import { trackUserActivity } from '../../lib/syncService';
import { useAuth } from '../../context/AuthContext';
import { getHourlyRecommendations, getFullValidRecommendations } from '../../lib/travelTilawahRecommendations';
import { getKajianRecommendations } from '../../lib/kajianRecommendations';
import { 
  Play, Pause, Clock, Heart, 
  Copy, Check, Volume2, X, ChevronRight,
  AlertCircle
} from 'lucide-react';
import PrayerTimes from '../../components/PrayerTimes/PrayerTimes';
import './TravelModePage.css';

export default function TravelModePage() {
  useSEO({
    title: "Mode Perjalanan — Pendamping Audio Islami Safar | Islamediaku",
    description: "Pendamping perjalanan Islami audio-first. Dengarkan tilawah Al-Qur'an merdu, kajian ringan sunnah, doa safar, dan radio islami penyejuk perjalanan Anda.",
    path: '/mode-perjalanan'
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    playing, activeRadio,
    currentTrack, sleepTimer,
    playTrack, changeSleepTimer
  } = useTilawahAudio();

  // Local states
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [kajianData, setKajianData] = useState([]);
  const [mp3QuranRadios, setMp3QuranRadios] = useState([]);
  const [selectedKajianTheme, setSelectedKajianTheme] = useState(() => {
    try {
      return localStorage.getItem('islamediaku_kajian_selected_theme') || 'Semua';
    } catch {
      return 'Semua';
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('islamediaku_travel_favorites')) || [];
    } catch {
      return [];
    }
  });

  const hourlyRecommendations = useMemo(() => getHourlyRecommendations(), []);
  const fullRecommendations = useMemo(() => getFullValidRecommendations(), []);
  
  const kajianRecommendations = useMemo(() => {
    return getKajianRecommendations(kajianData, selectedKajianTheme);
  }, [kajianData, selectedKajianTheme]);

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

  // Fetch YouTube Kajian
  useEffect(() => {
    const fetchKajian = async () => {
      try {
        const res = await fetch('/api/kajian/youtube');
        const data = await res.json();
        
        let fetchedData = [];
        if (data.success !== false && data.items && data.items.length > 0) {
          fetchedData = data.items;
        }

        // Combine static curated list with fetched data
        const combined = [...fetchedData, ...KAJIAN_RINGAN_VIDEOS];
        
        // Remove duplicates by videoId
        const unique = Array.from(new Map(combined.map(item => [item.videoId, item])).values());
        
        setKajianData(unique);
      } catch (err) {
        console.error("Failed to fetch kajian", err);
        setKajianData(KAJIAN_RINGAN_VIDEOS);
      }
    };
    fetchKajian();

    // Fetch MP3Quran Radios
    const fetchRadios = async () => {
      try {
        const res = await fetch('https://mp3quran.net/api/v3/radios?language=ind');
        const data = await res.json();
        if (data && data.radios) {
          const formatted = data.radios.slice(0, 15).map(r => ({
            id: `radio-mp3quran-${r.id}`,
            type: 'radio',
            title: r.name,
            subtitle: 'Siaran Radio MP3Quran',
            playlistIds: ['radio-dakwah'],
            sourceName: 'MP3Quran.net API',
            sourceUrl: 'https://mp3quran.net',
            apiProvider: 'MP3Quran',
            audioUrl: r.url,
            isLive: true,
            isVerified: true,
            enabled: true,
            attribution: 'Sumber: MP3Quran.net',
            duration: null,
            notes: 'Siaran streaming 24 jam.'
          }));
          setMp3QuranRadios(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch MP3Quran radios", err);
      }
    };
    fetchRadios();
  }, []);

  // Check if item is favorited
  const isFav = useCallback((id) => favorites.includes(id), [favorites]);

  // Handle Play track safely
  const handlePlayItem = useCallback((track, playlistTracks = []) => {
    if (track.type === 'kajian_youtube' && track.embedUrl) {
      playTrack(track, playlistTracks);
      if (user) {
        trackUserActivity(user.id, 'kajian', 'open_kajian', {
          videoId: track.videoId,
          title: track.title,
          sourceName: track.sourceName,
          watchUrl: track.watchUrl
        });
      }
      return;
    }

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
  }, [playTrack, navigate, showToast, user]);

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
    let tracks = getPlaylistItems(selectedPlaylistId);
    
    // Inject YouTube Kajian dynamically
    if (selectedPlaylistId === 'kajian-ringan' && kajianData.length > 0) {
      tracks = [...kajianData, ...tracks];
    }

    // Inject MP3Quran Radios
    if (selectedPlaylistId === 'radio-dakwah' && mp3QuranRadios.length > 0) {
      tracks = [...tracks, ...mp3QuranRadios];
    }
    
    // Daily deterministic sort for Tilawah Pilihan
    if (selectedPlaylistId === 'tilawah-pilihan') {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      tracks = [...tracks].sort((a, b) => {
        const hashA = [...a.id].reduce((acc, char) => acc + char.charCodeAt(0), 0) + dayOfYear;
        const hashB = [...b.id].reduce((acc, char) => acc + char.charCodeAt(0), 0) + dayOfYear;
        // Deterministic pseudo-random sorting
        const pseudoA = (Math.sin(hashA) * 10000) % 1;
        const pseudoB = (Math.sin(hashB) * 10000) % 1;
        return pseudoA - pseudoB;
      });
    }
    
    return tracks;
  }, [selectedPlaylistId, kajianData, mp3QuranRadios]);

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

  // Convert minutes to nice label
  const getSleepTimerLabel = (val) => {
    if (val === 'off') return 'Off';
    return `${val} Menit`;
  };

  const isAudioOrYoutube = playing || activeRadio || (activeYoutubeTrack && youtubeMinimized);

  return (
    <div className={`travel-mode-page ${isAudioOrYoutube ? 'media-player-active' : ''}`}>
      {/* Toast Alert */}
      <div className={`travel-toast ${toastActive ? 'active' : ''}`}>
        {toastMessage}
      </div>

      {/* Page Header & Dashboard */}
      <header className="travel-header container">
        <div className="travel-hero-desktop-grid">
          {/* Left Column: Hero & Actions */}
          <div className="travel-hero-content">
            <div className="travel-brand">
              <span className="travel-hero-badge">AUDIO ISLAMI</span>
              <h1 className="travel-title">Mode Perjalanan</h1>
              <p className="travel-subtitle">Temani perjalananmu dengan tilawah, kajian ringan, doa safar, dan audio Islami.</p>
            </div>
            
            <div className="travel-chips-container">
              <button className="travel-chip" onClick={() => handleOpenPlaylist('tilawah-pilihan')}>Tilawah</button>
              <button className="travel-chip" onClick={() => handleOpenPlaylist('kajian-ringan')}>Kajian</button>
              <a href="#doa-safar-card" className="travel-chip">Doa Safar</a>
              <button className="travel-chip" onClick={() => handleOpenPlaylist('radio-dakwah')}>Radio Dakwah</button>
              <Link to="/sholat" className="travel-chip">Jadwal Sholat</Link>
            </div>

            {/* Safety Banner */}
            <div className="travel-safety-badge" role="alert">
              <AlertCircle className="safety-icon" size={16} />
              <span>Gunakan audio dengan aman. Jika sedang mengemudi, atur playlist sebelum berangkat atau saat berhenti.</span>
            </div>
          </div>
          
          {/* Right Column: Prayer Times Dashboard */}
          <div className="travel-hero-widget">
            <PrayerTimes />
          </div>
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

      {/* Hourly Tilawah Recommendations */}
      {hourlyRecommendations.length > 0 && (
        <section className="travel-recommendations container">
          <h2 className="travel-section-title">Rekomendasi Tilawah</h2>
          <p className="travel-section-subtitle mb-4 text-xs opacity-80">Berubah setiap jam untuk menemani perjalanan Anda.</p>
          <div className="recommendations-list">
            {hourlyRecommendations.map((track) => {
              const isActive = activeRadio?.id === track.id;
              const isPlayingThis = isActive && playing;
              return (
                <div 
                  key={track.id} 
                  className={`recommendation-card ${isActive ? 'active' : ''}`}
                  onClick={() => handlePlayItem(track, fullRecommendations)}
                >
                  <div className="rec-icon-box">
                    {isPlayingThis ? (
                      <div className="track-playing-waves"><span/><span/><span/></div>
                    ) : (
                      <Play size={16} fill="currentColor" />
                    )}
                  </div>
                  <div className="rec-info">
                    <strong className="rec-title">{track.title}</strong>
                    <span className="rec-subtitle">{track.subtitle}</span>
                  </div>
                  {track.isVerified && <span className="verified-badge">✓</span>}
                </div>
              );
            })}
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

            <div className="sheet-actions" style={{ display: 'flex', gap: '8px', padding: '0 1.25rem', marginBottom: '1rem' }}>
              <button className="sheet-play-all" onClick={() => handlePlayAll(selectedPlaylist.id)} style={{ flex: 1, justifyContent: 'center' }}>
                <Play size={16} fill="currentColor" style={{marginRight: 6}} /> Putar {selectedPlaylist.id === 'radio-dakwah' ? 'Radio' : 'Semua'}
              </button>
              {selectedPlaylist.id === 'radio-dakwah' && (
                <button className="sheet-secondary-action" onClick={() => window.open('https://mp3quran.net', '_blank')} style={{ background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-pill)', padding: '0 16px', color: 'var(--color-text)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  Buka Sumber
                </button>
              )}
            </div>

            <div className="sheet-body">
              {selectedPlaylist.id === 'kajian-ringan' ? (
                <>
                  <div style={{ padding: '0 1.25rem', marginBottom: '1rem' }}>
                    <div style={{ background: 'var(--color-primary-surface)', border: '1px solid var(--color-primary-light, #bae6fd)', color: 'var(--color-primary-dark, #0369a1)', padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={18} />
                      Sumber: Masjid Al-Irsyad TV / YouTube
                    </div>
                  </div>

                  <div className="kajian-themes-scroll">
                    {['Semua', 'Aqidah', 'Akhlak', 'Fiqih', 'Keluarga', 'Motivasi Iman', 'Qur\'an', 'Sholat', 'Sedekah', 'Remaja', 'Kajian Singkat'].map(theme => (
                      <button
                        key={theme}
                        className={`kajian-theme-chip ${selectedKajianTheme === theme ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedKajianTheme(theme);
                          try { localStorage.setItem('islamediaku_kajian_selected_theme', theme); } catch {}
                        }}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>

                  {kajianRecommendations.length > 0 ? (
                    <div className="recommendations-list">
                      {kajianRecommendations.slice(0, 5).map((track) => {
                        const isActive = (activeRadio?.id === track.id);
                        const isPlayingThis = playing && activeRadio?.id === track.id;
                        
                        return (
                          <div 
                            key={track.id} 
                            className={`recommendation-card ${isActive ? 'active' : ''}`}
                            onClick={() => handlePlayItem(track, kajianRecommendations)}
                          >
                            <div className="rec-icon-box">
                              <img src={track.thumbnail} alt={track.title} className="rec-thumbnail" />
                              <div className="rec-play-overlay">
                                {isPlayingThis ? <div className="rec-wave"><span/><span/><span/></div> : <Play size={16} fill="currentColor" />}
                              </div>
                            </div>
                            <div className="rec-info">
                              <span className="rec-title">{track.title}</span>
                              <div className="rec-meta">
                                <span className="rec-source">{track.channelTitle}</span>
                                {track.isShort && <span className="rec-badge-short">Shorts</span>}
                              </div>
                            </div>
                            <button className="rec-fav-btn" onClick={(e) => toggleFav(track.id, e)} aria-label="Favorit">
                              <Heart size={18} fill={isFav(track.id) ? "currentColor" : "none"} className={isFav(track.id) ? "heart-active" : "heart-inactive"} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : kajianData.length === 0 ? (
                    <div className="kajian-empty-state">
                      <AlertCircle size={24} className="kajian-empty-icon" style={{ color: '#ef4444' }} />
                      <p>Kajian Ringan belum dikurasi.</p>
                      <button 
                        className="btn-primary mt-3" 
                        onClick={() => window.open('https://www.youtube.com/@masjidalirsyadtv', '_blank')}
                      >
                        Buka Channel Resmi
                      </button>
                    </div>
                  ) : (
                    <div className="kajian-empty-state">
                      <AlertCircle size={24} className="kajian-empty-icon" />
                      <p>Belum ada kajian untuk tema ini.</p>
                    </div>
                  )}
                </>
              ) : (
                <>
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
                            {(track.enabled || track.type === 'kajian_youtube') && (
                              <button 
                                className={`track-fav-btn ${isItemFavorited ? 'active' : ''}`}
                                onClick={(e) => toggleFav(track.id, e)}
                              >
                                <Heart size={16} fill={isItemFavorited ? 'currentColor' : 'none'} />
                              </button>
                            )}
                            <button className="track-play-indicator">
                              {track.type === 'kajian_youtube' ? (
                                <span className="badge-open" style={{background: '#ea4335', color: '#fff', border: 'none'}}>PUTAR</span>
                              ) : !track.enabled && !track.audioUrl && !track.route ? (
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
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sleep Timer Modal */}
      {showSleepModal && (
        <div className="sleep-modal-overlay" onClick={() => setShowSleepModal(false)}>
          <div className="sleep-modal" onClick={e => e.stopPropagation()}>
            <div className="sleep-modal-header">
              <h3>Sleep Timer</h3>
              <button className="close-btn" onClick={() => setShowSleepModal(false)}><X size={24} /></button>
            </div>
            <div className="sleep-options">
              {['off', '15', '30', '45', '60'].map(val => (
                <button
                  key={val}
                  className={`sleep-option ${sleepTimer === val ? 'active' : ''}`}
                  onClick={() => {
                    changeSleepTimer(val);
                    setShowSleepModal(false);
                    showToast(val === 'off' ? 'Sleep timer dimatikan' : `Sleep timer disetel ${val} menit`);
                  }}
                >
                  {val === 'off' ? 'Mati' : `${val} Menit`}
                  {sleepTimer === val && <Check size={18} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
