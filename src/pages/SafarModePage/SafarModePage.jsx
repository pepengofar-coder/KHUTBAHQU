import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  X, ChevronRight, AlertCircle, Volume2, Check
} from 'lucide-react';

// New Components
import SafarStatusBar from './components/SafarStatusBar';
import QuickSafarGuide from './components/QuickSafarGuide';
import BekalSafarmuGrid from './components/BekalSafarmuGrid';
import EssentialDuasList from './components/EssentialDuasList';

import './SafarModePage.css';

export default function SafarModePage() {
  useSEO({
    title: "Mode Safar - Islamediaku",
    description: "Pendamping perjalanan Islami premium. Dengarkan tilawah, pelajari panduan jamak & qashar, serta baca doa safar.",
    path: '/mode-perjalanan'
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    playing, activeRadio,
    currentTrack, sleepTimer,
    playTrack, changeSleepTimer,
    activeYoutubeTrack, youtubeMinimized
  } = useTilawahAudio();

  // Local states
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [kajianData, setKajianData] = useState([]);
  const [mp3QuranRadios, setMp3QuranRadios] = useState([]);
  const [selectedKajianTheme, setSelectedKajianTheme] = useState(() => {
    try { return localStorage.getItem('islamediaku_kajian_selected_theme') || 'Semua'; } catch { return 'Semua'; }
  });

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('islamediaku_travel_favorites')) || []; } catch { return []; }
  });

  const hourlyRecommendations = useMemo(() => getHourlyRecommendations(), []);
  const fullRecommendations = useMemo(() => getFullValidRecommendations(), []);
  
  const kajianRecommendations = useMemo(() => {
    return getKajianRecommendations(kajianData, selectedKajianTheme);
  }, [kajianData, selectedKajianTheme]);

  const lastPlayed = useMemo(() => {
    if (currentTrack) return currentTrack;
    try { return JSON.parse(localStorage.getItem('islamediaku_travel_last_audio')) || null; } catch { return null; }
  }, [currentTrack]);

  const [toastMessage, setToastMessage] = useState('');
  const [toastActive, setToastActive] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setToastActive(true);
    setTimeout(() => setToastActive(false), 3000);
  }, []);

  useEffect(() => {
    const handleSleepTimerEnd = () => showToast("Audio dihentikan sesuai sleep timer. 😴");
    window.addEventListener('imk-sleep-timer-end', handleSleepTimerEnd);
    return () => window.removeEventListener('imk-sleep-timer-end', handleSleepTimerEnd);
  }, [showToast]);

  const toggleFav = useCallback((id, e) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('islamediaku_travel_favorites', JSON.stringify(next));
      showToast(prev.includes(id) ? "Dihapus dari Favorit Safar." : "Disimpan ke Favorit Safar! ❤️");
      return next;
    });
  }, [showToast]);

  useEffect(() => {
    const fetchKajian = async () => {
      try {
        const res = await fetch('/api/kajian/youtube');
        const data = await res.json();
        let fetchedData = [];
        if (data.success !== false && data.items && data.items.length > 0) {
          fetchedData = data.items;
        }
        const combined = [...fetchedData, ...KAJIAN_RINGAN_VIDEOS];
        const unique = Array.from(new Map(combined.map(item => [item.videoId, item])).values());
        setKajianData(unique);
      } catch (err) {
        setKajianData(KAJIAN_RINGAN_VIDEOS);
      }
    };
    fetchKajian();

    const fetchRadios = async () => {
      try {
        const res = await fetch('https://mp3quran.net/api/v3/radios?language=ind');
        const data = await res.json();
        if (data && data.radios) {
          const formatted = data.radios.slice(0, 15).map(r => ({
            id: `radio-mp3quran-${r.id}`, type: 'radio', title: r.name,
            subtitle: 'Siaran Radio MP3Quran', playlistIds: ['radio-dakwah'],
            sourceName: 'MP3Quran.net API', sourceUrl: 'https://mp3quran.net',
            apiProvider: 'MP3Quran', audioUrl: r.url, isLive: true, isVerified: true,
            enabled: true, attribution: 'Sumber: MP3Quran.net', notes: 'Siaran streaming 24 jam.'
          }));
          setMp3QuranRadios(formatted);
        }
      } catch (err) {}
    };
    fetchRadios();
  }, []);

  const isFav = useCallback((id) => favorites.includes(id), [favorites]);

  const handlePlayItem = useCallback((track, playlistTracks = []) => {
    if (track.type === 'kajian_youtube' && track.embedUrl) {
      playTrack(track, playlistTracks);
      if (user) {
        trackUserActivity(user.id, 'kajian', 'open_kajian', {
          videoId: track.videoId, title: track.title,
          sourceName: track.sourceName, watchUrl: track.watchUrl
        });
      }
      return;
    }

    if (!track.enabled && !track.audioUrl) {
      if (track.sourceUrl) {
        window.open(track.sourceUrl, '_blank', 'noopener,noreferrer');
        showToast(`Membuka link resmi ${track.sourceName}...`);
      } else {
        showToast("Audio belum tersedia saat ini.");
      }
      return;
    }

    if (track.route) {
      navigate(track.route);
      return;
    }

    playTrack(track, playlistTracks);
    showToast(`Memutar: ${track.title}`);
  }, [playTrack, navigate, showToast, user]);

  const handlePlayAll = useCallback((playlistId) => {
    const tracks = getPlaylistItems(playlistId).filter(t => t.enabled);
    if (tracks.length === 0) return showToast("Tidak ada audio terverifikasi di playlist ini.");
    handlePlayItem(tracks[0], tracks);
  }, [handlePlayItem, showToast]);

  const desktopSheetRef = useRef(null);
  const mobileSheetRef = useRef(null);
  
  const handleOpenPlaylist = useCallback((id) => {
    setSelectedPlaylistId(id);
    requestAnimationFrame(() => {
      if (desktopSheetRef.current) desktopSheetRef.current.scrollTop = 0;
      if (mobileSheetRef.current) mobileSheetRef.current.scrollTop = 0;
    });
  }, []);

  const selectedPlaylist = useMemo(() => {
    if (!selectedPlaylistId) return null;
    return getPlaylistById(selectedPlaylistId);
  }, [selectedPlaylistId]);

  const selectedPlaylistTracks = useMemo(() => {
    if (!selectedPlaylistId) return [];
    let tracks = getPlaylistItems(selectedPlaylistId);
    
    if (selectedPlaylistId === 'kajian-ringan' && kajianData.length > 0) tracks = [...kajianData, ...tracks];
    if (selectedPlaylistId === 'radio-dakwah' && mp3QuranRadios.length > 0) tracks = [...tracks, ...mp3QuranRadios];
    
    if (selectedPlaylistId === 'tilawah-pilihan') {
      const now = new Date();
      const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
      tracks = [...tracks].sort((a, b) => {
        const hashA = [...a.id].reduce((acc, char) => acc + char.charCodeAt(0), 0) + dayOfYear;
        const hashB = [...b.id].reduce((acc, char) => acc + char.charCodeAt(0), 0) + dayOfYear;
        return ((Math.sin(hashA) * 10000) % 1) - ((Math.sin(hashB) * 10000) % 1);
      });
    }
    return tracks;
  }, [selectedPlaylistId, kajianData, mp3QuranRadios]);

  const getSleepTimerLabel = (val) => val === 'off' ? 'Off' : `${val} Menit`;
  const isAudioOrYoutube = playing || activeRadio || (activeYoutubeTrack && youtubeMinimized);

  const renderPlaylistDetail = () => {
    if (!selectedPlaylist) return null;
    return (
      <>
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

        <div className="sheet-body sheet-content">
          {selectedPlaylist.id === 'kajian-ringan' ? (
            <>
              <div style={{ padding: '0 1.25rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--color-primary-surface)', border: '1px solid var(--color-primary-light, #bae6fd)', color: 'var(--color-primary-dark, #0369a1)', padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} /> Sumber: Masjid Al-Irsyad TV / YouTube
                </div>
              </div>
              <div className="kajian-themes-scroll">
                {['Semua', 'Aqidah', 'Akhlak', 'Fiqih', 'Keluarga', 'Motivasi Iman', 'Qur\'an', 'Sholat', 'Sedekah', 'Remaja', 'Kajian Singkat'].map(theme => (
                  <button key={theme} className={`kajian-theme-chip ${selectedKajianTheme === theme ? 'active' : ''}`}
                    onClick={() => { setSelectedKajianTheme(theme); try { localStorage.setItem('islamediaku_kajian_selected_theme', theme); } catch (e) {} }}>
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
                      <div key={track.id} className={`recommendation-card ${isActive ? 'active' : ''}`} onClick={() => handlePlayItem(track, kajianRecommendations)}>
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
              ) : (
                <div className="kajian-empty-state">
                  <AlertCircle size={24} className="kajian-empty-icon" />
                  <p>Belum ada kajian.</p>
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
                    <div key={track.id} className={`track-item ${isActive ? 'active' : ''} ${!track.enabled && !track.audioUrl && !track.route ? 'disabled' : ''}`} onClick={() => handlePlayItem(track, selectedPlaylistTracks)}>
                      <div className="track-number-box">
                        {isPlayingThis ? <div className="track-playing-waves"><span/><span/><span/></div> : <span className="track-type-icon">{track.type === 'radio' ? '📻' : track.type === 'doa' ? '🤲' : '🔊'}</span>}
                      </div>
                      <div className="track-meta">
                        <span className="track-title-row"><strong className="track-title">{track.title}</strong>{track.isVerified && <span className="verified-badge">✓</span>}</span>
                        <p className="track-qari">{track.subtitle}</p>
                      </div>
                      <div className="track-end-actions">
                        {(track.enabled || track.type === 'kajian_youtube') && (
                          <button className={`track-fav-btn ${isItemFavorited ? 'active' : ''}`} onClick={(e) => toggleFav(track.id, e)}>
                            <Heart size={16} fill={isItemFavorited ? 'currentColor' : 'none'} />
                          </button>
                        )}
                        <button className="track-play-indicator">
                          {track.type === 'kajian_youtube' ? <span className="badge-open" style={{background: '#ea4335', color: '#fff'}}>PUTAR</span> : !track.enabled && !track.audioUrl && !track.route ? <span className="badge-unavailable">N/A</span> : track.route ? <span className="badge-open">BUKA</span> : isPlayingThis ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={`travel-mode-page ${isAudioOrYoutube ? 'media-player-active' : ''} bg-[#06111F] text-slate-200 min-h-screen pb-24`}>
      <div className={`travel-toast ${toastActive ? 'active' : ''}`}>{toastMessage}</div>

      <div className="max-w-5xl mx-auto px-4 pt-6 md:pt-8 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        <div className="flex-1 w-full">
          
          {/* 1. Status Bar */}
          <SafarStatusBar />

          {/* 2. Quick Safar Guide */}
          <QuickSafarGuide />

          {/* 3. Bekal Safarmu (Hero Section) */}
          <BekalSafarmuGrid />

          {/* 4. Essential Duas */}
          <EssentialDuasList />

          {/* 5. Travel Audio & Playlists */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-blue-400">🎧</span> Audio & Playlist Safar
            </h2>
            
            {/* Lanjut Dengarkan */}
            {lastPlayed && (
              <div className="mb-6 bg-slate-800/80 rounded-2xl p-4 border border-blue-900/50 shadow-lg flex items-center gap-4 hover:border-blue-500/50 transition-all cursor-pointer" onClick={() => handlePlayItem(lastPlayed)}>
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-inner shrink-0">
                  <Volume2 size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase block mb-0.5">LANJUT DENGARKAN</span>
                  <h3 className="font-bold text-white truncate">{lastPlayed.title || lastPlayed.name}</h3>
                  <p className="text-xs text-slate-400 truncate">{lastPlayed.subtitle || 'Islamediaku Audio'}</p>
                </div>
                <button className="h-10 w-10 rounded-full bg-blue-900/40 text-blue-400 flex items-center justify-center shrink-0">
                  {playing && activeRadio?.id === lastPlayed.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PLAYLISTS.map(p => {
                const tracks = getPlaylistItems(p.id);
                const colorMap = {
                  'tenang-perjalanan': 'blue', 'tilawah-pilihan': 'cyan',
                  'murottal-juz-amma': 'emerald', 'dzikir-doa': 'rose',
                  'kajian-ringan': 'lavender', 'radio-quran-live': 'mint',
                };
                return (
                  <VariedFeatureCard
                    key={p.id} title={p.title} subtitle={`${tracks.length} Audio • ${p.subtitle}`}
                    icon={p.icon} colorVariant={colorMap[p.id] || 'blue'}
                    onClick={() => handleOpenPlaylist(p.id)} layoutVariant="playlist-card"
                  />
                );
              })}
            </div>
          </section>

          {/* 6. Sleep Timer */}
          <section className="mb-8">
            <div className="bg-slate-800/80 rounded-2xl p-5 md:p-6 text-white shadow-lg border border-slate-700 flex items-center justify-between cursor-pointer hover:border-slate-500 transition-all" onClick={() => setShowSleepModal(true)}>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center">
                  <Clock size={24} className="text-slate-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Sleep Timer Safar</h3>
                  <p className="text-sm text-slate-400 mt-1">Hentikan audio otomatis agar hemat baterai</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold bg-slate-900 px-3 py-1.5 rounded-lg text-emerald-400">
                  {getSleepTimerLabel(sleepTimer)}
                </span>
                <ChevronRight size={20} className="text-slate-500" />
              </div>
            </div>
          </section>

        </div>

        {/* Desktop Sidebar Audio Player/List */}
        <div className="hidden md:block w-full md:w-96 shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
          <aside className="bg-slate-900 rounded-2xl shadow-xl border border-slate-700 h-full flex flex-col overflow-hidden" ref={desktopSheetRef}>
            {selectedPlaylist ? renderPlaylistDetail() : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
                <Play size={48} className="mb-4 opacity-20" />
                <h3 className="font-bold text-slate-300 text-lg mb-2">Pilih Audio Safar</h3>
                <p className="text-sm">Silakan pilih Radio Dakwah, Kajian, atau Tilawah dari daftar untuk mulai memutar.</p>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {selectedPlaylist && (
        <div className="md:hidden fixed inset-0 z-[60] bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedPlaylistId(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl h-[85vh] flex flex-col shadow-2xl border-t border-slate-700" onClick={(e) => e.stopPropagation()} ref={mobileSheetRef}>
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto my-3" onClick={() => setSelectedPlaylistId(null)} />
            {renderPlaylistDetail()}
          </div>
        </div>
      )}

      {/* Sleep Timer Modal */}
      {showSleepModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm" onClick={() => setShowSleepModal(false)}>
          <div className="bg-slate-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Sleep Timer</h3>
              <button onClick={() => setShowSleepModal(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-4 space-y-2">
              {['off', '15', '30', '45', '60'].map(val => (
                <button
                  key={val}
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-medium transition-colors ${sleepTimer === val ? 'bg-indigo-900/50 text-indigo-400 ring-1 ring-indigo-500/50' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  onClick={() => {
                    changeSleepTimer(val); setShowSleepModal(false);
                    showToast(val === 'off' ? 'Sleep timer dimatikan' : `Sleep timer disetel ${val} menit`);
                  }}
                >
                  {val === 'off' ? 'Mati' : `${val} Menit`}
                  {sleepTimer === val && <Check size={20} className="text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
