import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Compass, User, Search, ChevronLeft } from 'lucide-react';

export default function SafarNavbar() {
  const navigate = useNavigate();
  const [safarActive, setSafarActive] = useState(true);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleToggleSafar = () => {
    setSafarActive(false);
    // Smooth transition back to home
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Prayer', path: '/sholat' },
    { label: 'Mushaf', path: '/mushaf' },
    { label: 'Du’a & Dhikr', path: '/doa-dzikir' },
    { label: 'Khutbah', path: '/khutbah' },
    { label: 'Murotal 30 Juz', path: '/murottal-30-juz' },
    { label: 'More', path: '/pengaturan' },
  ];

  return (
    <header className="safar-nav">
      <div className="safar-nav__inner">
        {/* Back Button & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="page-back-btn" onClick={handleBack} aria-label="Kembali" style={{ width: '34px', height: '34px', margin: 0, color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            <ChevronLeft size={18} />
          </button>
          <div className="safar-nav__brand" onClick={() => navigate('/')}>
            <img src="/logo-icon.png" alt="Islamediaku" className="safar-nav__logo" />
            <span className="safar-nav__title">Islamediaku</span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="safar-nav__menu">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `safar-nav__link${isActive ? ' safar-nav__link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section: Toggle & Actions */}
        <div className="safar-nav__actions">
          {/* Mode Safar Active Toggle */}
          <div className="safar-nav__toggle-container">
            <span className="safar-nav__toggle-label">Mode Safar</span>
            <button
              onClick={handleToggleSafar}
              className={`safar-nav__toggle-switch ${safarActive ? 'safar-nav__toggle-switch--active' : ''}`}
              aria-label="Toggle Mode Safar"
            >
              <div className="safar-nav__toggle-knob">
                {safarActive && <Compass className="w-3.5 h-3.5 text-teal-500 animate-spin-slow" />}
              </div>
            </button>
          </div>

          {/* Quick Icons */}
          <button className="safar-nav__icon-btn" aria-label="Search" onClick={() => navigate('/khutbah')}>
            <Search size={18} />
          </button>
          <button className="safar-nav__icon-btn" aria-label="Profile" onClick={() => navigate('/ruang-saya')}>
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
