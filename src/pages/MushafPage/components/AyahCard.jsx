import { useState } from 'react';
import { Bookmark, Share2, CheckCircle } from 'lucide-react';
import './AyahCard.css';

export default function AyahCard({ 
  ayah, 
  surahId,
  isTarget, 
  isBookmarked,
  isLastRead,
  focusMode, 
  arabicFontSize, 
  translationFontSize,
  showTranslation,
  onBookmark,
  onMarkLastRead
}) {
  const [copied, setCopied] = useState(false);
  const ayahNum = ayah.verse_key.split(':')[1];

  const handleShare = async () => {
    const text = `${ayah.arabic}\n\n"${ayah.translation.replace(/<[^>]*>?/gm, '')}"\n(QS. ${surahId}:${ayahNum})`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QS. ${surahId}:${ayahNum}`,
          text: text
        });
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      id={`ayah-${ayahNum}`} 
      className={`ayah-card ${isTarget ? 'ayah-card--target' : ''} ${focusMode ? 'ayah-card--focus' : ''}`}
    >
      <div className="ayah-card__header">
        <div className="ayah-card__number">{ayahNum}</div>
        
        {!focusMode && (
          <div className="ayah-card__actions">
            <button 
              className={`ayah-btn ${isLastRead ? 'ayah-btn--active' : ''}`}
              onClick={() => onMarkLastRead(ayah.verse_key)}
              title="Tandai Terakhir Dibaca"
            >
              <CheckCircle size={18} />
              <span className="ayah-btn__label">Terakhir Dibaca</span>
            </button>
            <button 
              className={`ayah-btn ${isBookmarked ? 'ayah-btn--active' : ''}`}
              onClick={() => onBookmark(ayah.verse_key)}
              title="Bookmark Ayat"
            >
              <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button className="ayah-btn" onClick={handleShare} title="Bagikan">
              <Share2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div 
        className="ayah-card__arabic" 
        style={{ fontSize: `${arabicFontSize}px`, lineHeight: 1.8 }}
      >
        {ayah.arabic}
      </div>

      {(!focusMode && showTranslation) && (
        <div 
          className="ayah-card__translation" 
          style={{ fontSize: `${translationFontSize}px` }}
          dangerouslySetInnerHTML={{ __html: ayah.translation }}
        />
      )}
      
      {copied && <div className="ayah-card__toast">Disalin ke clipboard!</div>}
    </div>
  );
}
