import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { House, Clock, BookOpen, CalendarDays, Compass, Heart, CircleDot, Mic, Radio, CheckSquare, Star, Crown, Upload, Info, Settings, MoreHorizontal } from 'lucide-react';
import FeatureIcon from '../FeatureIcon/FeatureIcon';
import './BottomNav.css';

const TABS = [
  { to: '/', end: true, label: 'Home', icon: House },
  { to: '/sholat', label: 'Sholat', icon: Clock },
  { to: '/mushaf', label: 'Mushaf', icon: BookOpen },
  { to: '/kalender-hijriah', label: 'Kalender', icon: CalendarDays },
];

const MORE_ITEMS = [
  { to: '/kiblat', label: 'Kiblat', icon: Compass, color: 'blue' },
  { to: '/doa-dzikir', label: 'Doa & Dzikir', icon: Heart, color: 'rose' },
  { to: '/tasbih', label: 'Tasbih', icon: CircleDot, color: 'indigo' },
  { to: '/khutbah', label: 'Khutbah', icon: Mic, color: 'green' },
  { to: '/tracker', label: 'Tracker Ibadah', icon: CheckSquare, color: 'lime' },
  { to: '/tilawah', label: 'Tilawah Live', icon: Radio, color: 'orange' },
  { to: '/favorit', label: 'Favorit', icon: Star, color: 'amber' },
  { to: '/premium', label: 'Premium (Soon)', icon: Crown, color: 'amber' },
  { to: '/kontribusi', label: 'Kirim Khutbah', icon: Upload, color: 'cyan' },
  { to: '/tentang', label: 'Tentang', icon: Info, color: 'blue' },
  { to: '/pengaturan', label: 'Pengaturan', icon: Settings, color: 'indigo' },
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
          {TABS.map(t => {
            const IconComp = t.icon;
            return (
              <NavLink key={t.to} to={t.to} end={t.end} className={({isActive}) => `btm-nav__item${isActive ? ' active' : ''}`}>
                <span className="btm-nav__icon"><IconComp size={24} strokeWidth={2} /></span>
                <span className="btm-nav__label">{t.label}</span>
              </NavLink>
            );
          })}
          <button
            className={`btm-nav__item btm-nav__more-btn${moreActive ? ' active' : ''}`}
            onClick={() => setSheetOpen(true)}
            aria-label="Menu lainnya"
          >
            <span className="btm-nav__icon">
              <MoreHorizontal size={24} strokeWidth={2} />
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
              <FeatureIcon icon={item.icon} colorMode={item.color} className="sm" />
              <span className="more-sheet__item-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
