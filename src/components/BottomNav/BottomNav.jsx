import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

const TABS = [
  { to: '/', end: true, label: 'Home', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> },
  { to: '/sholat', label: 'Sholat', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { to: '/mushaf', label: 'Mushaf', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> },
  { to: '/kalender-hijriah', label: 'Kalender', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> },
];

const MORE_ITEMS = [
  { to: '/kiblat', label: 'Kiblat', icon: '🧭' },
  { to: '/doa-dzikir', label: 'Doa & Dzikir', icon: '🤲' },
  { to: '/tasbih', label: 'Tasbih', icon: '📿' },
  { to: '/khutbah', label: 'Khutbah', icon: '🕌' },
  { to: '/tracker', label: 'Tracker Ibadah', icon: '✅' },
  { to: '/favorit', label: 'Favorit', icon: '⭐' },
  { to: '/premium', label: 'Premium', icon: '👑' },
  { to: '/kontribusi', label: 'Kirim Khutbah', icon: '📤' },
  { to: '/tentang', label: 'Tentang', icon: 'ℹ️' },
  { to: '/pengaturan', label: 'Pengaturan', icon: '⚙️' },
];

export default function BottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const location = useLocation();

  // Check if any "more" route is active
  const moreActive = MORE_ITEMS.some(m => location.pathname === m.to || location.pathname.startsWith(m.to + '/'));

  return (
    <>
      <nav className="btm-nav" aria-label="Navigasi mobile">
        <div className="btm-nav__inner">
          {TABS.map(t => (
            <NavLink key={t.to} to={t.to} end={t.end} className={({isActive}) => `btm-nav__item${isActive ? ' active' : ''}`}>
              <span className="btm-nav__icon">{t.icon}</span>
              <span className="btm-nav__label">{t.label}</span>
            </NavLink>
          ))}
          <button
            className={`btm-nav__item btm-nav__more-btn${moreActive ? ' active' : ''}`}
            onClick={() => setSheetOpen(true)}
            aria-label="Menu lainnya"
          >
            <span className="btm-nav__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </span>
            <span className="btm-nav__label">Lainnya</span>
          </button>
        </div>
      </nav>

      {/* More Sheet */}
      {sheetOpen && <div className="more-sheet__backdrop" onClick={() => setSheetOpen(false)} />}
      <div className={`more-sheet${sheetOpen ? ' open' : ''}`}>
        <div className="more-sheet__handle" onClick={() => setSheetOpen(false)}><span /></div>
        <h3 className="more-sheet__title">Menu Lainnya</h3>
        <div className="more-sheet__grid">
          {MORE_ITEMS.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({isActive}) => `more-sheet__item${isActive ? ' active' : ''}`}
              onClick={() => setSheetOpen(false)}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="more-sheet__item-icon">{item.icon}</span>
              <span className="more-sheet__item-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
