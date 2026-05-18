import { Link, useLocation } from 'react-router-dom';
import { useTilawahAudio } from '../../context/TilawahContext';
import { Play, Pause, X, ExternalLink, Loader2 } from 'lucide-react';
import './GlobalMiniTilawahPlayer.css';

export default function GlobalMiniTilawahPlayer() {
  const { 
    activeRadio, playing, audioLoading, isStopped, 
    togglePlay, stopAudio 
  } = useTilawahAudio();
  const location = useLocation();

  if (isStopped || !activeRadio) return null;

  // Hide on /tilawah since it already has a full player
  const isTilawahPage = location.pathname === '/tilawah';
  if (isTilawahPage) return null;

  return (
    <div className="global-mini-tilawah">
      <div className="gmt-inner">
        <div className="gmt-info">
          {playing ? (
            <div className="gmt-live-badge">
              <span className="gmt-wave"><span/><span/><span/></span>
              LIVE
            </div>
          ) : (
            <div className="gmt-live-badge gmt-live-badge--paused">PAUSED</div>
          )}
          <div className="gmt-text">
            <span className="gmt-name">{activeRadio.name}</span>
          </div>
        </div>

        <div className="gmt-controls">
          <Link to="/tilawah" className="gmt-btn gmt-btn--link" title="Buka Tilawah">
            <ExternalLink size={18} />
          </Link>
          <button className="gmt-btn gmt-btn--play" onClick={togglePlay} aria-label={playing ? 'Jeda' : 'Putar'}>
            {audioLoading ? <Loader2 size={20} className="gmt-spin" /> : playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button className="gmt-btn gmt-btn--close" onClick={stopAudio} aria-label="Tutup">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
