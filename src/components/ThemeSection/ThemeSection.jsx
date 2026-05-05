import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './ThemeSection.css';

export default function ThemeSection() {
  const { categories } = useApp();
  const nav = useNavigate();
  return (
    <section className="themes">
      <div className="container">
        <div className="section__header">
          <div>
            <h2 className="section__title">📂 Tema Populer</h2>
            <p className="section__subtitle">Cari khutbah berdasarkan tema yang Anda butuhkan</p>
          </div>
        </div>
        <div className="themes__grid">
          {categories.map(c => (
            <button key={c.id} className="theme-chip" onClick={() => nav(`/khutbah?cat=${c.id}`)}>
              <span className="theme-chip__icon">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
