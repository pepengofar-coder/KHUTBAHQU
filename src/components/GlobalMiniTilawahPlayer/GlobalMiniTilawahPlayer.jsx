import { Link, useLocation } from 'react-router-dom';
import { useTilawahAudio } from '../../context/TilawahContext';
import { Play, Pause, X, ExternalLink, Loader2, SkipBack, SkipForward } from 'lucide-react';
import './GlobalMiniTilawahPlayer.css';

export default function GlobalMiniTilawahPlayer() {
  const { 
    activeRadio, playing, audioLoading, isStopped, 
    togglePlay, stopAudio, nextTrack, prevTrack, queue
  } = useTilawahAudio();
  const location = useLocation();

  if (isStopped || !activeRadio) return null;

  // Only hide on /tilawah since it has its own full-screen player.
  const isTilawahPage = location.pathname === '/tilawah';
  if (isTilawahPage) return null;

  return (
    <div className="global-mini-tilawah">
      <div className="gmt-inner">
        <div className="gmt-info">
          {playing ? (
            <div className="gmt-live-badge">
              <span className="gmt-wave"><span/><span/><span/></span>
              {activeRadio.isLive ? 'LIVE' : activeRadio.type?.toUpperCase() || 'AUDIO'}
            </div>
          ) : (
            <div className="gmt-live-badge gmt-live-badge--paused">PAUSED</div>
          )}
          <div className="gmt-text">
            <span className="gmt-name">{activeRadio.title || activeRadio.name}</span>
            <span className="gmt-subtitle">{activeRadio.subtitle || activeRadio.sourceName || 'Islamediaku Premium'}</span>
          </div>
        </div>

        <div className="gmt-controls">
          {!activeRadio.isLive && queue && queue.length > 1 && (
            <button className="gmt-btn" onClick={prevTrack} aria-label="Sebelumnya">
              <SkipBack size={18} fill="currentColor" />
            </button>
          )}

          <button className="gmt-btn gmt-btn--play" onClick={togglePlay} aria-label={playing ? 'Jeda' : 'Putar'}>
            {audioLoading ? <Loader2 size={18} className="gmt-spin" /> : playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>

          {!activeRadio.isLive && queue && queue.length > 1 && (
            <button className="gmt-btn" onClick={nextTrack} aria-label="Berikutnya">
              <SkipForward size={18} fill="currentColor" />
            </button>
          )}

          <Link to="/tilawah" className="gmt-btn gmt-btn--link" title="Buka Tilawah">
            <ExternalLink size={18} />
          </Link>
          <button className="gmt-btn gmt-btn--close" onClick={stopAudio} aria-label="Tutup">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
