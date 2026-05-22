import { useEffect } from 'react';
import { X, Minimize2 } from 'lucide-react';
import { useTilawahAudio } from '../../context/TilawahContext';
import './YouTubeEmbedModal.css';

export default function YouTubeEmbedModal() {
  const {
    activeYoutubeTrack,
    youtubeMinimized,
    setActiveYoutubeTrack,
    setYoutubeMinimized
  } = useTilawahAudio();

  const isOpen = !!activeYoutubeTrack;

  useEffect(() => {
    // When open and not minimized, prevent body scroll
    if (isOpen && !youtubeMinimized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, youtubeMinimized]);

  if (!isOpen) return null;

  const handleClose = () => {
    setActiveYoutubeTrack(null);
    setYoutubeMinimized(false);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    setYoutubeMinimized(true);
  };

  return (
    <div 
      className={`youtube-modal-overlay ${youtubeMinimized ? 'minimized-hidden' : ''}`} 
      onClick={handleClose}
    >
      <div className="youtube-modal-content" onClick={e => e.stopPropagation()}>
        <div className="youtube-modal-header">
          <h3 className="youtube-modal-title">{activeYoutubeTrack.title || 'Video Kajian'}</h3>
          <div className="youtube-modal-actions">
            <button className="youtube-modal-action-btn" onClick={handleMinimize} aria-label="Minimize video">
              <Minimize2 size={20} />
            </button>
            <button className="youtube-modal-action-btn" onClick={handleClose} aria-label="Tutup video">
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="youtube-modal-body">
          <div className="youtube-iframe-container">
            <iframe
              src={activeYoutubeTrack.embedUrl}
              title={activeYoutubeTrack.title || 'YouTube video player'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
