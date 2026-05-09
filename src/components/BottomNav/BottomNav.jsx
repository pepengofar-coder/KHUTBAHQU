import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './BottomNav.css';

export default function BottomNav({ hidden = false }) {
  const { bookmarks } = useApp();
  return (
    <nav className={`bottom-nav${hidden?' hidden':''}`} aria-label="Navigasi mobile">
      <div className="bottom-nav__inner">
        <NavLink to="/" end className={({isActive})=>`bottom-nav__item${isActive?' active':''}`}>
          <span className="bottom-nav__icon">🏠</span><span className="bottom-nav__label">Home</span>
        </NavLink>
        <NavLink to="/khutbah" className={({isActive})=>`bottom-nav__item${isActive?' active':''}`}>
          <span className="bottom-nav__icon">🔍</span><span className="bottom-nav__label">Cari</span>
        </NavLink>
        <NavLink to="/kontribusi" className={({isActive})=>`bottom-nav__item${isActive?' active':''}`}>
          <span className="bottom-nav__icon">📤</span><span className="bottom-nav__label">Kirim</span>
        </NavLink>
        <NavLink to="/kalender-hijriah" className={({isActive})=>`bottom-nav__item${isActive?' active':''}`}>
          <span className="bottom-nav__icon">📅</span><span className="bottom-nav__label">Kalender</span>
        </NavLink>
        <NavLink to="/favorit" className={({isActive})=>`bottom-nav__item${isActive?' active':''}`}>
          <span className="bottom-nav__icon">⭐</span><span className="bottom-nav__label">Favorit</span>
          {bookmarks.length > 0 && <span className="bottom-nav__badge">{bookmarks.length}</span>}
        </NavLink>
      </div>
    </nav>
  );
}
