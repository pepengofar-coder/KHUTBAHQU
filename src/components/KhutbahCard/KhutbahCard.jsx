import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './KhutbahCard.css';

export default function KhutbahCard({ khutbah }) {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark, categories } = useApp();

  const bookmarked = isBookmarked(khutbah.id);
  const category = categories.find(c => c.id === khutbah.category);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    toggleBookmark(khutbah.id);
  };

  return (
    <article
      className="khutbah-card"
      onClick={() => navigate(`/baca/${khutbah.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/baca/${khutbah.id}`)}
      id={`khutbah-card-${khutbah.id}`}
    >
      <div className="khutbah-card__header">
        <h3 className="khutbah-card__title">{khutbah.title}</h3>
        <button
          className={`khutbah-card__bookmark${bookmarked ? ' bookmarked' : ''}`}
          onClick={handleBookmarkClick}
          aria-label={bookmarked ? 'Hapus bookmark' : 'Simpan bookmark'}
        >
          {bookmarked ? '🔖' : '🏷️'}
        </button>
      </div>

      <div className="khutbah-card__meta">
        {category && (
          <span className="khutbah-card__category-badge">
            {category.icon} {category.label}
          </span>
        )}
        <span className="khutbah-card__source">{khutbah.source}</span>
        <span className="khutbah-card__dot" aria-hidden="true" />
        <span className="khutbah-card__time">
          ⏳ {khutbah.readTime} Min
        </span>
      </div>
    </article>
  );
}
