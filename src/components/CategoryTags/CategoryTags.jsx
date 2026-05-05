import { useApp } from '../../context/AppContext';
import './CategoryTags.css';

export default function CategoryTags() {
  const { categories, activeCategory, setActiveCategory } = useApp();

  const handleCategoryClick = (categoryId) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null); // deselect
    } else {
      setActiveCategory(categoryId);
    }
  };

  return (
    <div className="category-tags">
      <p className="category-tags__label">Kategori Cepat:</p>
      <div className="category-tags__list" role="listbox" aria-label="Filter kategori">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tag${activeCategory === cat.id ? ' active' : ''}`}
            onClick={() => handleCategoryClick(cat.id)}
            role="option"
            aria-selected={activeCategory === cat.id}
            id={`cat-${cat.id}`}
          >
            <span className="category-tag__icon" aria-hidden="true">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
