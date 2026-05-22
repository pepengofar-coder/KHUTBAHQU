import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, User, Settings, Upload, Info, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const DESKTOP_LINKS = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/sholat', label: 'Sholat' },
  { to: '/mushaf', label: 'Mushaf' },
  { to: '/doa-dzikir', label: 'Doa & Dzikir' },
  { to: '/khutbah', label: 'Khutbah' },
  { to: '/tracker', label: 'Tracker' },
];

const MORE_LINKS = [
  { to: '/ruang-saya', label: 'Ruang Saya' },
  { to: '/good-path', label: 'Good Path' },
  { to: '/kiblat', label: 'Kiblat' },
  { to: '/kalender-hijriah', label: 'Kalender' },
  { to: '/tilawah', label: 'Tilawah' },
  { to: '/favorit', label: 'Favorit' },
  { to: '/tasbih', label: 'Tasbih' },
  { to: '/pengaturan', label: 'Pengaturan' },
  { to: '/tentang', label: 'Tentang' },
];

export default function Navbar() {
  const { darkMode, toggleDark } = useApp();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    setMenuOpen(false);
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
              {l.label}
            </NavLink>
          ))}
          
          <div className="nav__dropdown-container" ref={dropdownRef}>
            <button 
              className={`nav__link nav__dropdown-btn ${isMoreActive ? 'active' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
            >
              Lainnya <ChevronDown size={14} style={{ marginLeft: 4, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
            </button>
            
            {dropdownOpen && (
              <div className="nav__dropdown-menu">
                {MORE_LINKS.map(l => (
                  <NavLink key={l.to} to={l.to} className={({isActive}) => `nav__dropdown-item${isActive ? ' active' : ''}`}>
                    {l.label}
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

          <button className={`nav__hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      {menuOpen && <div className="nav__overlay" onClick={() => setMenuOpen(false)} />}
      <div className={`nav__sheet${menuOpen ? ' open' : ''}`}>
        {[...DESKTOP_LINKS, ...MORE_LINKS.slice(0, 4)].map((l, i) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({isActive}) => `nav__sheet-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)} style={{ animationDelay: `${i * 30}ms` }}>
            {l.label}
          </NavLink>
        ))}
        <div className="nav__sheet-divider" />
        <NavLink to="/pengaturan" className="nav__sheet-link" onClick={() => setMenuOpen(false)}>
          <Settings size={18} style={{marginRight: 8, color: 'var(--color-text-muted)'}} /> Pengaturan
        </NavLink>
        <NavLink to="/kontribusi" className="nav__sheet-link" onClick={() => setMenuOpen(false)}>
          <Upload size={18} style={{marginRight: 8, color: 'var(--color-text-muted)'}} /> Kirim Khutbah
        </NavLink>
        <NavLink to="/tentang" className="nav__sheet-link" onClick={() => setMenuOpen(false)}>
          <Info size={18} style={{marginRight: 8, color: 'var(--color-text-muted)'}} /> Tentang
        </NavLink>
      </div>
    </header>
  );
}
