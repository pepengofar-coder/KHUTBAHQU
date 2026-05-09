import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Navbar.css';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/khutbah', label: 'Khutbah Jumat' },
  { to: '/mushaf', label: 'Mushaf Al-Qur\'an' },
  { to: '/kalender-hijriah', label: 'Kalender Hijriah' },
  { to: '/favorit', label: 'Favorit' },
  { to: '/kontribusi', label: '📤 Kirim Khutbah' },
  { to: '/tentang', label: 'Tentang' },
];

export default function Navbar() {
  const { darkMode, toggleDark } = useApp();
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__logo">
          <img src="/logo.png" alt="KhutbahQu Logo" className="navbar__logo-img" />
        </NavLink>
        <nav className="navbar__links" aria-label="Navigasi utama">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({isActive}) => `navbar__link${isActive?' active':''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="navbar__actions">
          <button className="navbar__dark-btn" onClick={toggleDark} aria-label="Toggle dark mode" title={darkMode?'Mode terang':'Mode gelap'}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
