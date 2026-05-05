import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './BottomNav.css';

export default function BottomNav({ hidden = false }) {
  const { bookmarks } = useApp();

  return (
    <nav className={`bottom-nav${hidden ? ' hidden' : ''}`} aria-label="Navigasi utama">
      <div className="bottom-nav__inner">
        <NavLink
          to="/"
          className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}
          id="nav-home"
        >
          <span className="bottom-nav__icon">🏠</span>
          <span className="bottom-nav__label">Home</span>
        </NavLink>

        <NavLink
          to="/tersimpan"
          className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}
          id="nav-bookmarks"
        >
          <span className="bottom-nav__icon">🔖</span>
          <span className="bottom-nav__label">Tersimpan</span>
          {bookmarks.length > 0 && (
            <span className="bottom-nav__badge">{bookmarks.length}</span>
          )}
        </NavLink>

        <NavLink
          to="/pengaturan"
          className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}
          id="nav-settings"
        >
          <span className="bottom-nav__icon">⚙️</span>
          <span className="bottom-nav__label">Pengaturan</span>
        </NavLink>
      </div>
    </nav>
  );
}
