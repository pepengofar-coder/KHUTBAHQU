import { Link } from 'react-router-dom';
import { BookMarked } from 'lucide-react';
import './SurahCard.css';

export default function SurahCard({ surah, isFavorite, lastReadAyah, mushafMode = 'ayah' }) {
  const isMakkiyah = surah.revelation_place === 'makkah';
  const startPage = surah.pages ? surah.pages[0] : 1;
  const targetPath = mushafMode === 'page' ? `/mushaf/page/${startPage}` : `/mushaf/${surah.id}`;

  return (
    <Link to={targetPath} className={`surah-card ${mushafMode === 'page' ? 'surah-card--page-mode' : ''}`}>
      <div className="surah-card__number-wrap">
        <div className="surah-card__number-bg"></div>
        <span className="surah-card__number">{surah.id}</span>
      </div>

      <div className="surah-card__info">
        <h3 className="surah-card__latin">{surah.name_simple}</h3>
        <p className="surah-card__meaning">{surah.translated_name.name}</p>
        {mushafMode === 'page' && (
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', background: 'var(--color-primary-surface)', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginTop: '4px' }}>
            Hal. {startPage}
          </span>
        )}
      </div>

      <div className="surah-card__meta">
        <h2 className="surah-card__arabic">{surah.name_arabic}</h2>
        <div className="surah-card__stats">
          <span>{surah.verses_count} Ayat</span>
          <span className="surah-card__dot">•</span>
          <span>{isMakkiyah ? 'Makkiyah' : 'Madaniyah'}</span>
        </div>
      </div>
      
      {(isFavorite || lastReadAyah) && (
        <div className="surah-card__badges">
          {isFavorite && <BookMarked size={16} className="text-royal-blue" />}
        </div>
      )}
    </Link>
  );
}
