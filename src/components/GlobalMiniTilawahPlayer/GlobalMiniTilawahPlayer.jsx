import { Link, useLocation } from 'react-router-dom';
import { useTilawahAudio } from '../../context/TilawahContext';
import { Play, Pause, X, ExternalLink, Loader2, SkipBack, SkipForward, Maximize2 } from 'lucide-react';
import './GlobalMiniTilawahPlayer.css';

export default function GlobalMiniTilawahPlayer() {
  const { 
    activeRadio, playing, audioLoading, isStopped, 
    togglePlay, stopAudio, nextTrack, prevTrack, queue,
    activeYoutubeTrack, youtubeMinimized, setYoutubeMinimized, setActiveYoutubeTrack
  } = useTilawahAudio();
  const location = useLocation();

  const isYoutube = activeYoutubeTrack && youtubeMinimized;
  const isAudio = !isStopped && activeRadio;

  if (!isYoutube && !isAudio) return null;

  // Only hide on /tilawah since it has its own full-screen player, 
  // but if it's a youtube video, we might want to keep it even on tilawah? 
  // Actually, tilawah page is for audio. We'll hide audio player on tilawah.
  const isTilawahPage = location.pathname === '/tilawah';
  if (isTilawahPage && isAudio && !isYoutube) return null;

  const currentItem = isYoutube ? activeYoutubeTrack : activeRadio;

  const handleStop = () => {
    if (isYoutube) {
      setActiveYoutubeTrack(null);
      setYoutubeMinimized(false);
    } else {
      stopAudio();
    }
  };

  const handleRestoreYoutube = () => {
    setYoutubeMinimized(false);
  };

  return (
    <div className="global-mini-tilawah">
      <div className="gmt-inner">
        <div className="gmt-info">
          {isYoutube ? (
            <div className="gmt-live-badge gmt-live-badge--youtube">
              <span className="gmt-wave"><span/><span/><span/></span>
              VIDEO
            </div>
          ) : playing ? (
            <div className="gmt-live-badge">
              <span className="gmt-wave"><span/><span/><span/></span>
              {currentItem.isLive ? 'LIVE' : currentItem.type?.toUpperCase() || 'AUDIO'}
            </div>
          ) : (
            <div className="gmt-live-badge gmt-live-badge--paused">PAUSED</div>
          )}
          <div className="gmt-text" onClick={isYoutube ? handleRestoreYoutube : undefined} style={{ cursor: isYoutube ? 'pointer' : 'default' }}>
            <span className="gmt-name">{currentItem.title || currentItem.name}</span>
            <span className="gmt-subtitle">{currentItem.subtitle || currentItem.sourceName || 'Islamediaku Premium'}</span>
          </div>
        </div>

        <div className="gmt-controls">
          {!currentItem.isLive && queue && queue.length > 1 && (
            <button className="gmt-btn" onClick={prevTrack} aria-label="Sebelumnya">
              <SkipBack size={18} fill="currentColor" />
            </button>
          )}

          {isYoutube ? (
            <button className="gmt-btn gmt-btn--play" onClick={handleRestoreYoutube} aria-label="Buka Video">
              <Maximize2 size={18} />
            </button>
          ) : (
            <button className="gmt-btn gmt-btn--play" onClick={togglePlay} aria-label={playing ? 'Jeda' : 'Putar'}>
              {audioLoading ? <Loader2 size={18} className="gmt-spin" /> : playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
          )}

          {!currentItem.isLive && queue && queue.length > 1 && (
            <button className="gmt-btn" onClick={nextTrack} aria-label="Berikutnya">
              <SkipForward size={18} fill="currentColor" />
            </button>
          )}

          {!isYoutube && (
            <Link to="/tilawah" className="gmt-btn gmt-btn--link" title="Buka Tilawah">
              <ExternalLink size={18} />
            </Link>
          )}
          
          <button className="gmt-btn gmt-btn--close" onClick={handleStop} aria-label="Tutup">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
