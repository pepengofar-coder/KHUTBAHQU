import { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Navbar.css';

const LINKS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/khutbah', label: 'Khutbah Jumat', icon: '📚' },
  { to: '/mushaf', label: 'Mushaf Al-Qur\'an', icon: '📖' },
  { to: '/kalender-hijriah', label: 'Kalender Hijriah', icon: '📅' },
  { to: '/favorit', label: 'Favorit', icon: '⭐' },
  { to: '/kontribusi', label: 'Kirim Khutbah', icon: '📤' },
  { to: '/tentang', label: 'Tentang', icon: 'ℹ️' },
];

export default function Navbar() {
  const { darkMode, toggleDark } = useApp();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const toggleMenu = useCallback(() => setMenuOpen(p => !p), []);

  return (
    <>
      <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}${menuOpen ? ' navbar--menu-open' : ''}`}>
        <div className="navbar__inner">
          <NavLink to="/" className="navbar__logo">
            <img src="/logo.png" alt="KhutbahQu Logo" className="navbar__logo-img" />
          </NavLink>

          <nav className="navbar__links" aria-label="Navigasi utama">
            {LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({isActive}) => `navbar__link${isActive ? ' active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar__actions">
            <button
              className="navbar__dark-btn"
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              title={darkMode ? 'Mode terang' : 'Mode gelap'}
            >
              <span className="navbar__dark-icon">{darkMode ? '☀️' : '🌙'}</span>
            </button>
            <button
              className="navbar__hamburger"
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
            >
              <span className="navbar__hamburger-line" />
              <span className="navbar__hamburger-line" />
              <span className="navbar__hamburger-line" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sheet Menu */}
      <div className={`mobile-menu-overlay${menuOpen ? ' active' : ''}`} onClick={toggleMenu} aria-hidden="true" />
      <nav className={`mobile-menu${menuOpen ? ' active' : ''}`} aria-label="Menu mobile">
        <div className="mobile-menu__header">
          <span className="mobile-menu__title">Menu</span>
          <button className="mobile-menu__close" onClick={toggleMenu} aria-label="Tutup menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="mobile-menu__links">
          {LINKS.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({isActive}) => `mobile-menu__link${isActive ? ' active' : ''}`}
              onClick={toggleMenu}
              style={{ animationDelay: menuOpen ? `${i * 50 + 80}ms` : '0ms' }}
            >
              <span className="mobile-menu__link-icon">{l.icon}</span>
              <span className="mobile-menu__link-label">{l.label}</span>
              <svg className="mobile-menu__link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </NavLink>
          ))}
        </div>
        <div className="mobile-menu__footer">
          <button className="mobile-menu__dark-toggle" onClick={toggleDark}>
            <span>{darkMode ? '☀️' : '🌙'}</span>
            <span>{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
