import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSEO } from '../../utils/seo';
import './TilawahPage.css';

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

export default function TilawahPage() {
  useSEO({ title: "Tilawah Live — Radio Al-Qur'an 24 Jam | Islamediaku", description: "Dengarkan tilawah Al-Qur'an live dari berbagai qari dunia.", path: '/tilawah' });

  const [radios, setRadios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(getFavorites);
  const [activeId, setActiveId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const audioRef = useRef(null);
  const retryRef = useRef(null);

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
        setRadios(data.radios || []);
        const lastId = getLastChannel();
        const found = (data.radios || []).find(r => r.id === lastId);
        setActiveId(found ? lastId : (data.radios?.[0]?.id || null));
      } catch (err) { if (!c) setError('Gagal memuat daftar radio.'); console.error(err); }
      finally { if (!c) setLoading(false); }
    })();
    return () => { c = true; };
  }, []);

  const activeRadio = useMemo(() => radios.find(r => r.id === activeId) || null, [radios, activeId]);

  const filteredRadios = useMemo(() => {
    let list = radios;
    if (showFavOnly) list = list.filter(r => favorites.includes(r.id));
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(r => r.name.toLowerCase().includes(q)); }
    return list;
  }, [radios, search, favorites, showFavOnly]);

  const playChannel = useCallback((radio) => {
    setActiveId(radio.id); setPlaying(true); setAudioError(false); setAudioLoading(true);
    localStorage.setItem(STORAGE_KEY_LAST, String(radio.id));
    if (audioRef.current) { audioRef.current.src = radio.url; audioRef.current.load(); audioRef.current.play().catch(() => { setAudioError(true); setPlaying(false); setAudioLoading(false); }); }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !activeRadio) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { setAudioLoading(true); setAudioError(false); audioRef.current.src = activeRadio.url; audioRef.current.load(); audioRef.current.play().catch(() => { setAudioError(true); setPlaying(false); setAudioLoading(false); }); setPlaying(true); }
  }, [playing, activeRadio]);

  const skipChannel = useCallback((dir) => {
    if (!radios.length) return;
    const idx = radios.findIndex(r => r.id === activeId);
    let next = idx + dir;
    if (next < 0) next = radios.length - 1;
    if (next >= radios.length) next = 0;
    playChannel(radios[next]);
  }, [radios, activeId, playChannel]);

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => { const n = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]; saveFavorites(n); return n; });
  }, []);

  const handlePlaying = () => { setAudioLoading(false); setAudioError(false); };
  const handleWaiting = () => { setAudioLoading(true); };
  const handleError = () => {
    setAudioLoading(false); setAudioError(true); setPlaying(false);
    clearTimeout(retryRef.current);
    retryRef.current = setTimeout(() => { if (activeRadio && audioRef.current) { setAudioLoading(true); setAudioError(false); audioRef.current.src = activeRadio.url; audioRef.current.load(); audioRef.current.play().catch(() => { setAudioError(true); setAudioLoading(false); }); setPlaying(true); } }, 5000);
  };

  useEffect(() => () => clearTimeout(retryRef.current), []);

  return (
    <div className="tilawah-page">
      <audio ref={audioRef} onPlaying={handlePlaying} onWaiting={handleWaiting} onError={handleError} onEnded={() => skipChannel(1)} preload="none" />
      <section className="tilawah-hero">
        <div className="tilawah-hero__inner container">
          <div className="tilawah-hero__text">
            <h1 className="tilawah-hero__title">Tilawah Live</h1>
            <p className="tilawah-hero__subtitle">Dengarkan tilawah Al-Qur&apos;an dari qari pilihan dunia, 24 jam.</p>
          </div>
          {activeRadio && (
            <div className="tilawah-now">
              <div className="tilawah-now__badge"><span className="tilawah-now__dot-anim" /> LIVE</div>
              <h2 className="tilawah-now__name">{activeRadio.name}</h2>
              <div className="tilawah-now__controls">
                <button className="tilawah-now__skip" onClick={() => skipChannel(-1)} aria-label="Sebelumnya">⏮</button>
                <button className={`tilawah-now__play ${audioLoading ? 'loading' : ''} ${audioError ? 'error' : ''}`} onClick={togglePlay} aria-label={playing ? 'Jeda' : 'Putar Tilawah'}>
                  {audioLoading ? <span className="tilawah-now__spinner" /> : audioError ? '⚠️' : playing ? <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>}
                </button>
                <button className="tilawah-now__skip" onClick={() => skipChannel(1)} aria-label="Berikutnya">⏭</button>
              </div>
              {audioError && <p className="tilawah-now__error">Stream error — mencoba ulang...</p>}
              <button className={`tilawah-now__fav ${favorites.includes(activeRadio.id) ? 'active' : ''}`} onClick={() => toggleFavorite(activeRadio.id)}>{favorites.includes(activeRadio.id) ? '❤️' : '🤍'}</button>
            </div>
          )}
        </div>
      </section>
      <section className="tilawah-list container">
        <div className="tilawah-list__toolbar">
          <div className="tilawah-list__search">
            <svg className="tilawah-list__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" className="tilawah-list__input" placeholder="Cari qari atau channel..." value={search} onChange={e => setSearch(e.target.value)} id="tilawah-search" />
          </div>
          <button className={`tilawah-list__filter ${showFavOnly ? 'active' : ''}`} onClick={() => setShowFavOnly(v => !v)}>{showFavOnly ? '❤️' : '🤍'} Favorit</button>
        </div>
        {loading ? (
          <div className="tilawah-state"><div className="tilawah-state__spinner" /><p>Memuat daftar radio...</p></div>
        ) : error ? (
          <div className="tilawah-state tilawah-state--error"><span>⚠️</span><p>{error}</p><button className="btn btn--primary btn--sm" onClick={() => window.location.reload()}>Coba Lagi</button></div>
        ) : filteredRadios.length === 0 ? (
          <div className="tilawah-state"><span>📻</span><p>{showFavOnly ? 'Belum ada channel favorit.' : 'Channel tidak ditemukan.'}</p></div>
        ) : (
          <>
            <p className="tilawah-list__count">{filteredRadios.length} channel tersedia</p>
            <div className="tilawah-grid">
              {filteredRadios.map(radio => {
                const isActive = radio.id === activeId;
                const isFav = favorites.includes(radio.id);
                return (
                  <div key={radio.id} className={`tilawah-card ${isActive ? 'tilawah-card--active' : ''}`} onClick={() => playChannel(radio)} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') playChannel(radio); }}>
                    <div className="tilawah-card__avatar">{radio.name.charAt(0).toUpperCase()}</div>
                    <div className="tilawah-card__info">
                      <span className="tilawah-card__name">{radio.name}</span>
                      {isActive && playing && <span className="tilawah-card__live"><span className="tilawah-card__bars"><span/><span/><span/></span>Sedang diputar</span>}
                    </div>
                    <button className={`tilawah-card__fav ${isFav ? 'active' : ''}`} onClick={e => { e.stopPropagation(); toggleFavorite(radio.id); }} aria-label={isFav ? 'Hapus favorit' : 'Tambah favorit'}>{isFav ? '❤️' : '🤍'}</button>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <p className="tilawah-attribution">Audio source: <a href="https://mp3quran.net" target="_blank" rel="noopener noreferrer">MP3Quran.net</a></p>
      </section>
      {activeRadio && (playing || audioLoading) && (
        <div className="tilawah-mini">
          <div className="tilawah-mini__inner container">
            <div className="tilawah-mini__info"><span className="tilawah-mini__dot" /><span className="tilawah-mini__name">{activeRadio.name}</span></div>
            <div className="tilawah-mini__controls">
              <button className="tilawah-mini__btn" onClick={() => skipChannel(-1)} aria-label="Sebelumnya">⏮</button>
              <button className="tilawah-mini__btn tilawah-mini__btn--main" onClick={togglePlay} aria-label={playing ? 'Jeda' : 'Putar'}>
                {audioLoading ? <span className="tilawah-mini__spinner" /> : playing ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>}
              </button>
              <button className="tilawah-mini__btn" onClick={() => skipChannel(1)} aria-label="Berikutnya">⏭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
