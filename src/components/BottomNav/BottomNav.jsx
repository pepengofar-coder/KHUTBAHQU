import { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { House, Clock, BookOpen, CalendarDays, Compass, Heart, CircleDot, Mic, Radio, CheckSquare, Star, Upload, Info, Settings, MoreHorizontal, Download, Headphones } from 'lucide-react';
import FeatureIcon from '../FeatureIcon/FeatureIcon';
import './BottomNav.css';

const TABS = [
  { to: '/', end: true, label: 'Home', icon: House },
  { to: '/sholat', label: 'Sholat', icon: Clock },
  { to: '/mushaf', label: 'Mushaf', icon: BookOpen },
  { to: '/kalender-hijriah', label: 'Kalender', icon: CalendarDays },
];

const MORE_SECTIONS = [
  {
    title: 'Ibadah',
    items: [
      { to: '/doa-dzikir', label: 'Doa & Dzikir', icon: Heart, color: 'rose' },
      { to: '/tasbih', label: 'Tasbih', icon: CircleDot, color: 'indigo' },
      { to: '/tracker', label: 'Tracker Ibadah', icon: CheckSquare, color: 'lime' },
    ],
  },
  {
    title: "Al-Qur'an",
    items: [
      { to: '/mushaf', label: 'Mushaf', icon: BookOpen, color: 'blue' },
      { to: '/tilawah', label: 'Tilawah Live', icon: Headphones, color: 'orange' },
    ],
  },
  {
    title: 'Konten',
    items: [
      { to: '/khutbah', label: 'Khutbah', icon: Mic, color: 'green' },
      { to: '/kontribusi', label: 'Kirim Khutbah', icon: Upload, color: 'cyan' },
    ],
  },
  {
    title: 'Aplikasi',
    items: [
      { to: '/kiblat', label: 'Kiblat', icon: Compass, color: 'blue' },
      { to: '/favorit', label: 'Favorit', icon: Star, color: 'amber' },
      { to: '/pengaturan', label: 'Pengaturan', icon: Settings, color: 'indigo' },
      { to: '/tentang', label: 'Tentang', icon: Info, color: 'blue' },
    ],
  },
];

// Flatten for active checking
const ALL_MORE_ITEMS = MORE_SECTIONS.flatMap(s => s.items);

export default function BottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const location = useLocation();

  const moreActive = ALL_MORE_ITEMS.some(m => location.pathname === m.to || location.pathname.startsWith(m.to + '/'));

  // Mobile back button support
  useEffect(() => {
    const handlePopState = () => {
      if (sheetOpen) {
        setSheetOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [sheetOpen]);

  const openSheet = () => {
    setSheetOpen(true);
    // Push a dummy state so the back button has something to pop
    window.history.pushState({ moreSheetOpen: true }, '');
  };

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    // If we closed it via UI but the history state is still there, pop it
    if (window.history.state?.moreSheetOpen) {
      window.history.back();
    }
  }, []);

  return (
    <>
      <nav className="btm-nav" aria-label="Navigasi mobile">
        <div className="btm-nav__inner">
          {TABS.map(t => {
            const IconComp = t.icon;
            return (
              <NavLink key={t.to} to={t.to} end={t.end} className={({isActive}) => `btm-nav__item${isActive ? ' active' : ''}`} onClick={() => sheetOpen && closeSheet()}>
                <span className="btm-nav__icon"><IconComp size={24} strokeWidth={2} /></span>
                <span className="btm-nav__label">{t.label}</span>
              </NavLink>
            );
          })}
          <button
            className={`btm-nav__item btm-nav__more-btn${moreActive ? ' active' : ''}`}
            onClick={sheetOpen ? closeSheet : openSheet}
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
      {sheetOpen && <div className="more-sheet__backdrop" onClick={closeSheet} />}
      <div className={`more-sheet${sheetOpen ? ' open' : ''}`}>
        <div className="more-sheet__handle" onClick={closeSheet}><span /></div>
        <h3 className="more-sheet__title">Menu Lainnya</h3>
        
        {MORE_SECTIONS.map((section, si) => (
          <div key={section.title} className="more-sheet__section" style={{ animationDelay: `${si * 60}ms` }}>
            <h4 className="more-sheet__section-title">{section.title}</h4>
            <div className="more-sheet__section-list">
              {section.items.map((item) => (
                <NavLink
                  key={item.to + item.label}
                  to={item.to}
                  className={({isActive}) => `more-sheet__row${isActive ? ' active' : ''}`}
                  onClick={closeSheet}
                >
                  <FeatureIcon icon={item.icon} colorMode={item.color} className="sm" />
                  <span className="more-sheet__row-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
