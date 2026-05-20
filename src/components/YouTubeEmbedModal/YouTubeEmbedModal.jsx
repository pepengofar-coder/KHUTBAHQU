import { useEffect } from 'react';
import { X } from 'lucide-react';
import './YouTubeEmbedModal.css';

export default function YouTubeEmbedModal({ isOpen, onClose, videoUrl, title }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !videoUrl) return null;

  return (
    <div className="youtube-modal-overlay" onClick={onClose}>
      <div className="youtube-modal-content" onClick={e => e.stopPropagation()}>
        <div className="youtube-modal-header">
          <h3 className="youtube-modal-title">{title || 'Video Kajian'}</h3>
          <button className="youtube-modal-close" onClick={onClose} aria-label="Tutup video">
            <X size={24} />
          </button>
        </div>
        <div className="youtube-modal-body">
          <div className="youtube-iframe-container">
            <iframe
              src={videoUrl}
              title={title || 'YouTube video player'}
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
