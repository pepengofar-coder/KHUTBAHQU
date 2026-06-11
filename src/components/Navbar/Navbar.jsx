import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, User, Settings, Upload, Info, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import './Navbar.css';

const DESKTOP_LINKS = [
  { to: '/', tKey: 'nav.home', end: true },
  { to: '/sholat', tKey: 'nav.prayer' },
  { to: '/mushaf', tKey: 'nav.mushaf' },
  { to: '/doa-dzikir', tKey: 'nav.dua_dhikr' },
  { to: '/tracker', tKey: 'nav.tracker' },
];

const MORE_LINKS = [
  { to: '/tilawah', tKey: 'nav.recitation' },
  { to: '/tasbih', tKey: 'nav.tasbih', fallback: 'Tasbih' },
  { to: '/kiblat', tKey: 'nav.qibla' },
  { to: '/kalender-hijriah', tKey: 'nav.calendar' },
  { to: '/khutbah', tKey: 'nav.khutbah' },
  { to: '/mode-perjalanan', tKey: 'nav.travel_mode' },
  { to: '/tentang', tKey: 'nav.about' },
  { to: '/ruang-saya', tKey: 'nav.my_space' },
  { to: '/good-path', tKey: 'nav.good_path' },
  { to: '/favorit', tKey: 'nav.favorites', fallback: 'Favorit' },
  { to: '/pengaturan', tKey: 'nav.settings' },
];

export default function Navbar() {
  const { darkMode, toggleDark } = useApp();
  const { user } = useAuth();
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMoreActive = MORE_LINKS.some(link => location.pathname === link.to);

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand">
          <img src="/logo-icon.png" alt="Islamediaku" className="nav__logo-img" width={32} height={32} />
          <span className="nav__name">Islamediaku</span>
        </NavLink>

        {/* Desktop Links */}
        <nav className="nav__links" aria-label="Navigasi desktop">
          {DESKTOP_LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({isActive}) => `nav__link${isActive ? ' active' : ''}`}>
              {t(l.tKey)}
            </NavLink>
          ))}
          
          <div className="nav__dropdown-container" ref={dropdownRef}>
            <button 
              className={`nav__link nav__dropdown-btn ${isMoreActive ? 'active' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
            >
              {t('nav.more')} <ChevronDown size={14} style={{ marginLeft: 4, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
            </button>
            
            {dropdownOpen && (
              <div className="nav__dropdown-menu">
                {MORE_LINKS.map(l => (
                  <NavLink key={l.to} to={l.to} className={({isActive}) => `nav__dropdown-item${isActive ? ' active' : ''}`}>
                    {l.tKey === t(l.tKey) && l.fallback ? l.fallback : t(l.tKey)}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="nav__actions">
          <button className="nav__dark-btn" onClick={toggleDark} title="Toggle tema" aria-label="Toggle dark mode">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            className="nav__brand-btn"
            onClick={() => navigate('/ruang-saya')}
            aria-label="Buka Ruang Saya"
            title="Ruang Saya"
          >
            <img
              src="/logo-icon.png"
              alt=""
              className="nav__brand-btn-img"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <span className="nav__brand-btn-fallback" style={{ display: 'none' }}>🕌</span>
          </button>
        </div>
      </div>
    </header>
  );
}
