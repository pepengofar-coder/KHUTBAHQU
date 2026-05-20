import { Link } from 'react-router-dom';
import { BookMarked } from 'lucide-react';
import './SurahCard.css';

export default function SurahCard({ surah, isFavorite, lastReadAyah }) {
  const isMakkiyah = surah.revelation_place === 'makkah';

  return (
    <Link to={`/mushaf/${surah.id}`} className="surah-card">
      <div className="surah-card__number-wrap">
        <div className="surah-card__number-bg"></div>
        <span className="surah-card__number">{surah.id}</span>
      </div>

      <div className="surah-card__info">
        <h3 className="surah-card__latin">{surah.name_simple}</h3>
        <p className="surah-card__meaning">{surah.translated_name.name}</p>
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
