import { useState, useMemo } from 'react';
import { useSEO } from '../../utils/seo';
import { useTilawahAudio } from '../../context/TilawahContext';
import { Search, Loader2, Play, Pause, SkipBack, SkipForward, AlertTriangle } from 'lucide-react';
import './TilawahPage.css';

export default function TilawahPage() {
  useSEO({ title: "Tilawah Live — Radio Al-Qur'an 24 Jam | Islamediaku", description: "Dengarkan tilawah Al-Qur'an live dari berbagai qari dunia.", path: '/tilawah' });

  const {
    radios, loading, error, favorites, activeId, activeRadio,
    playing, audioLoading, audioError,
    playChannel, togglePlay, skipChannel, toggleFavorite
  } = useTilawahAudio();

  const [search, setSearch] = useState('');
  const [showFavOnly, setShowFavOnly] = useState(false);

  const filteredRadios = useMemo(() => {
    let list = radios;
    if (showFavOnly) list = list.filter(r => favorites.includes(r.id));
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(r => r.name.toLowerCase().includes(q)); }
    return list;
  }, [radios, search, favorites, showFavOnly]);

  return (
    <div className="tilawah-page">
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
                <button className="tilawah-now__skip" onClick={() => skipChannel(-1)} aria-label="Sebelumnya"><SkipBack size={24} fill="currentColor" /></button>
                <button className={`tilawah-now__play ${audioLoading ? 'loading' : ''} ${audioError ? 'error' : ''}`} disabled={!activeRadio.url} onClick={togglePlay} aria-label={playing ? 'Jeda' : 'Putar Tilawah'}>
                  {audioLoading ? <Loader2 size={24} className="tilawah-now__spinner" /> : audioError ? <AlertTriangle size={24} /> : playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                <button className="tilawah-now__skip" onClick={() => skipChannel(1)} aria-label="Berikutnya"><SkipForward size={24} fill="currentColor" /></button>
              </div>
              {audioError && <p className="tilawah-now__error">Stream belum tersedia, coba saluran lain.</p>}
              <button className={`tilawah-now__fav ${favorites.includes(activeRadio.id) ? 'active' : ''}`} onClick={() => toggleFavorite(activeRadio.id)}>{favorites.includes(activeRadio.id) ? '❤️' : '🤍'}</button>
            </div>
          )}
        </div>
      </section>
      <section className="tilawah-list container">
        <div className="tilawah-list__toolbar">
          <div className="tilawah-list__search">
            <Search className="tilawah-list__search-icon" size={18} />
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
    </div>
  );
}
