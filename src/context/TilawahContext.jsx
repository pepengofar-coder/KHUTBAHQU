/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';

const STORAGE_KEY_LAST = 'imk_tilawah_last';
const STORAGE_KEY_FAV = 'imk_tilawah_fav';

function getFavorites() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_FAV)) || []; }
  catch { return []; }
}
function saveFavorites(favs) { localStorage.setItem(STORAGE_KEY_FAV, JSON.stringify(favs)); }
function getLastChannel() {
  try { return parseInt(localStorage.getItem(STORAGE_KEY_LAST)) || null; }
  catch { return null; }
}

const TilawahContext = createContext();

export function TilawahProvider({ children }) {
  const [radios, setRadios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [favorites, setFavorites] = useState(getFavorites);
  const [activeId, setActiveId] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null); // Extended: Current travel track

  const [playing, setPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isStopped, setIsStopped] = useState(true);

  // Extended Queue and Progress states
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sleepTimer, setSleepTimer] = useState(() => {
    try { return localStorage.getItem('islamediaku_audio_sleep_timer') || 'off'; }
    catch { return 'off'; }
  });

  const audioRef = useRef(null);
  const retryRef = useRef(null);

  // Fetch data
  useEffect(() => {
    let c = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        let res;
        try { 
          res = await fetch('/api/mp3quran/radios'); 
          if (!res.ok) throw new Error(`Proxy failed with ${res.status}`);
        } catch { 
          res = await fetch('https://mp3quran.net/api/v3/radios?language=id'); 
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (c) return;
        
        const radiosList = (data?.radios || [])
          .map(r => ({
            ...r,
            url: r.url?.replace(/^http:\/\//i, 'https://')
          }))
          .filter(r => r.url); // Ensure valid stream URL
        
        setRadios(radiosList);
        const lastId = getLastChannel();
        const found = radiosList.find(r => r.id === lastId);
        setActiveId(found ? lastId : (radiosList[0]?.id || null));
      } catch (err) { if (!c) setError('Gagal memuat daftar radio.'); console.error(err); }
      finally { if (!c) setLoading(false); }
    })();
    return () => { c = true; };
  }, []);

  // Extended activeRadio: returns currentTrack if playing in Travel Mode
  const activeRadio = useMemo(() => {
    if (currentTrack) return currentTrack;
    return radios.find(r => r.id === activeId) || null;
  }, [radios, activeId, currentTrack]);

  const playChannel = useCallback((radio) => {
    if (!radio || !radio.url) {
      setAudioError(true);
      return;
    }
    setCurrentTrack(null); // Clear travel track
    setQueue([]);
    setQueueIndex(-1);
    setActiveId(radio.id); 
    setPlaying(true); 
    setAudioError(false); 
    setAudioLoading(true);
    setIsStopped(false);
    localStorage.setItem(STORAGE_KEY_LAST, String(radio.id));
    if (audioRef.current) { 
      audioRef.current.src = radio.url; 
      audioRef.current.load(); 
      audioRef.current.play().catch(() => { setAudioError(true); setPlaying(false); setAudioLoading(false); }); 
    }
  }, []);

  const playTrack = useCallback((track, playlistQueue = []) => {
    if (!track) return;
    const url = track.audioUrl || track.url;
    if (!url) {
      setAudioError(true);
      return;
    }
    
    setCurrentTrack(track);
    setAudioError(false);
    setAudioLoading(true);
    setIsStopped(false);
    setPlaying(true);

    if (playlistQueue.length > 0) {
      setQueue(playlistQueue);
      const idx = playlistQueue.findIndex(item => item.id === track.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else {
      setQueue([track]);
      setQueueIndex(0);
    }

    // Save to travel last played localStorage
    try {
      localStorage.setItem('islamediaku_travel_last_audio', JSON.stringify(track));
    } catch (e) {
      console.warn(e);
    }

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
      audioRef.current.play().catch((err) => {
        console.warn('Audio play failed:', err);
        setAudioError(true);
        setPlaying(false);
        setAudioLoading(false);
      });
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !activeRadio) {
      return;
    }
    const url = activeRadio.audioUrl || activeRadio.url;
    if (!url) {
      setAudioError(true);
      return;
    }
    if (playing) { 
      audioRef.current.pause(); 
      setPlaying(false); 
    } else { 
      setIsStopped(false);
      setAudioLoading(true); 
      setAudioError(false); 
      if (!audioRef.current.src || !audioRef.current.src.includes(url)) {
        audioRef.current.src = url; 
        audioRef.current.load();
      }
      audioRef.current.play().catch(() => { setAudioError(true); setPlaying(false); setAudioLoading(false); }); 
      setPlaying(true); 
    }
  }, [playing, activeRadio]);

  const skipChannel = useCallback((dir) => {
    if (!radios.length) return;
    const idx = radios.findIndex(r => r.id === activeId);
    let next = idx + dir;
    if (next < 0) next = radios.length - 1;
    if (next >= radios.length) next = 0;
    playChannel(radios[next]);
  }, [radios, activeId, playChannel]);

  const nextTrack = useCallback(() => {
    if (queue.length === 0 || queueIndex === -1) {
      if (!currentTrack) {
        skipChannel(1);
      }
      return;
    }
    let nextIdx = queueIndex + 1;
    if (nextIdx >= queue.length) nextIdx = 0;
    const track = queue[nextIdx];
    if (track) {
      playTrack(track, queue);
    }
  }, [queue, queueIndex, currentTrack, skipChannel, playTrack]);

  const prevTrack = useCallback(() => {
    if (queue.length === 0 || queueIndex === -1) {
      if (!currentTrack) {
        skipChannel(-1);
      }
      return;
    }
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) prevIdx = queue.length - 1;
    const track = queue[prevIdx];
    if (track) {
      playTrack(track, queue);
    }
  }, [queue, queueIndex, currentTrack, skipChannel, playTrack]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setPlaying(false);
    setAudioLoading(false);
    setIsStopped(true);
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => { 
      const n = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]; 
      saveFavorites(n); 
      return n; 
    });
  }, []);

  const seek = useCallback((time) => {
    if (audioRef.current && isFinite(time)) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const changeSleepTimer = useCallback((val) => {
    setSleepTimer(val);
    try {
      localStorage.setItem('islamediaku_audio_sleep_timer', val);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handlePlaying = () => { setAudioLoading(false); setAudioError(false); };
  const handleWaiting = () => { setAudioLoading(true); };
  const handleError = () => {
    setAudioLoading(false); 
    setAudioError(true); 
    setPlaying(false);
    setIsStopped(true);
    clearTimeout(retryRef.current);
  };

  const handleEnded = () => {
    if (currentTrack && queue.length > 0) {
      nextTrack();
    } else {
      skipChannel(1);
    }
  };

  // Sleep Timer trigger effect
  useEffect(() => {
    if (!playing || sleepTimer === 'off') return;
    const ms = Number(sleepTimer) * 60 * 1000;
    const timer = setTimeout(() => {
      stopAudio();
      window.dispatchEvent(new CustomEvent('imk-sleep-timer-end'));
    }, ms);
    return () => clearTimeout(timer);
  }, [playing, sleepTimer, stopAudio]);

  useEffect(() => () => clearTimeout(retryRef.current), []);

  const value = {
    radios, loading, error, favorites, activeId, activeRadio,
    playing, audioLoading, audioError, isStopped,
    playChannel, togglePlay, skipChannel, stopAudio, toggleFavorite,
    // Extended features
    currentTrack, queue, queueIndex, currentTime, duration, sleepTimer,
    playTrack, nextTrack, prevTrack, seek, changeSleepTimer
  };

  return (
    <TilawahContext.Provider value={value}>
      {children}
      <audio 
        ref={audioRef} 
        onPlaying={handlePlaying} 
        onWaiting={handleWaiting} 
        onError={handleError} 
        onEnded={handleEnded} 
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onDurationChange={(e) => {
          if (e.target.duration && !isNaN(e.target.duration)) {
            setDuration(e.target.duration);
          }
        }}
        preload="none" 
      />
    </TilawahContext.Provider>
  );
}

export function useTilawahAudio() {
  const context = useContext(TilawahContext);
  if (!context) {
    throw new Error('useTilawahAudio must be used within a TilawahProvider');
  }
  return context;
}
