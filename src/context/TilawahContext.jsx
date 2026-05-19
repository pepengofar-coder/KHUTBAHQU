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
  
  const [playing, setPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isStopped, setIsStopped] = useState(true);

  const audioRef = useRef(null);
  const retryRef = useRef(null);

  // Fetch data
  useEffect(() => {
    let c = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        let res;
        try { res = await fetch('/api/mp3quran/radios'); } catch { res = await fetch('https://mp3quran.net/api/v3/radios?language=id'); }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (c) return;
        
        const radiosList = (data?.radios || []).map(r => ({
          ...r,
          url: r.url?.replace(/^http:\/\//i, 'https://')
        }));
        
        setRadios(radiosList);
        const lastId = getLastChannel();
        const found = radiosList.find(r => r.id === lastId);
        setActiveId(found ? lastId : (radiosList[0]?.id || null));
      } catch (err) { if (!c) setError('Gagal memuat daftar radio.'); console.error(err); }
      finally { if (!c) setLoading(false); }
    })();
    return () => { c = true; };
  }, []);

  const activeRadio = useMemo(() => radios.find(r => r.id === activeId) || null, [radios, activeId]);

  const playChannel = useCallback((radio) => {
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

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !activeRadio) return;
    if (playing) { 
      audioRef.current.pause(); 
      setPlaying(false); 
    } else { 
      setIsStopped(false);
      setAudioLoading(true); 
      setAudioError(false); 
      if (!audioRef.current.src || audioRef.current.src !== activeRadio.url) {
        audioRef.current.src = activeRadio.url; 
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

  const handlePlaying = () => { setAudioLoading(false); setAudioError(false); };
  const handleWaiting = () => { setAudioLoading(true); };
  const handleError = () => {
    setAudioLoading(false); 
    setAudioError(true); 
    setPlaying(false);
    setIsStopped(true); // Stop auto-retries in Capacitor to prevent memory loops/crashes
    clearTimeout(retryRef.current);
  };


  useEffect(() => () => clearTimeout(retryRef.current), []);

  const value = {
    radios, loading, error, favorites, activeId, activeRadio,
    playing, audioLoading, audioError, isStopped,
    playChannel, togglePlay, skipChannel, stopAudio, toggleFavorite
  };

  return (
    <TilawahContext.Provider value={value}>
      {children}
      <audio 
        ref={audioRef} 
        onPlaying={handlePlaying} 
        onWaiting={handleWaiting} 
        onError={handleError} 
        onEnded={() => skipChannel(1)} 
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
