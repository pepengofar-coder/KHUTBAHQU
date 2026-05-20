import { useState, useEffect, useCallback, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { House, Clock, BookOpen, CalendarDays, Compass, Heart, CircleDot, Mic, Radio, CheckSquare, Star, Upload, Info, Settings, MoreHorizontal, Download, Headphones } from 'lucide-react';
import { App as CapacitorApp } from '@capacitor/app';
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
      { to: '/kiblat', label: 'Kiblat', icon: Compass, color: 'blue' },
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
    title: 'Aplikasi',
    items: [
      { to: '/khutbah', label: 'Khutbah', icon: Mic, color: 'green' },
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
  const navigate = useNavigate();

  const moreActive = ALL_MORE_ITEMS.some(m => location.pathname === m.to || location.pathname.startsWith(m.to + '/'));

  // Compute dynamic MORE sections
  const sections = useMemo(() => {
    const s = [...MORE_SECTIONS];
    const apkUrl = import.meta.env.VITE_APK_URL || import.meta.env.NEXT_PUBLIC_APK_URL;
    if (apkUrl) {
      s[2] = {
        ...s[2],
        items: [
          ...s[2].items,
          { to: apkUrl, label: 'Download APK', icon: Download, color: 'green', isExternal: true }
        ]
      };
    }
    return s;
  }, []);

  // Close sheet automatically when route changes
  useEffect(() => {
    if (sheetOpen) {
      setSheetOpen(false);
    }
  }, [location.pathname]);

  const openSheet = useCallback(() => {
    setSheetOpen(true);
    window.history.pushState({ sheetOpen: true }, '');
  }, []);

  const dismissSheet = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSheetOpen(false);
    if (window.history.state?.sheetOpen) {
      window.history.back();
    }
  }, []);

  // Capacitor hardware back button and browser popstate handling
  useEffect(() => {
    const handlePopState = () => {
      setSheetOpen(false);
    };
    window.addEventListener('popstate', handlePopState);

    let backListener = null;
    const setupCapacitor = async () => {
      try {
        backListener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            CapacitorApp.minimizeApp();
          }
        });
      } catch (e) {
        // Not in Capacitor environment, ignore
      }
    };
    setupCapacitor();

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (backListener) {
        backListener.remove().catch(() => {});
      }
    };
  }, []);

  return (
    <>
      <nav className="btm-nav" aria-label="Navigasi mobile">
        <div className="btm-nav__inner">
          {TABS.map(t => {
            const IconComp = t.icon;
            return (
              <NavLink 
                key={t.to} 
                to={t.to} 
                end={t.end} 
                className={({isActive}) => `btm-nav__item${isActive ? ' active' : ''}`} 
                onClick={(e) => {
                  if (sheetOpen) {
                    e.preventDefault();
                    // Replace dummy state and navigate to prevent history junk
                    navigate(t.to, { replace: true });
                  }
                }}
              >
                <span className="btm-nav__icon"><IconComp size={24} strokeWidth={2} /></span>
                <span className="btm-nav__label">{t.label}</span>
              </NavLink>
            );
          })}
          <button
            className={`btm-nav__item btm-nav__more-btn${moreActive || sheetOpen ? ' active' : ''}`}
            onClick={sheetOpen ? dismissSheet : openSheet}
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
      {sheetOpen && <div className="more-sheet__backdrop" onClick={dismissSheet} />}
      <div className={`more-sheet${sheetOpen ? ' open' : ''}`}>
        <div className="more-sheet__handle" onClick={dismissSheet}><span /></div>
        <h3 className="more-sheet__title">Menu Lainnya</h3>
        
        {sections.map((section, si) => (
          <div key={section.title} className="more-sheet__section" style={{ animationDelay: `${si * 60}ms` }}>
            <h4 className="more-sheet__section-title">{section.title}</h4>
            <div className="more-sheet__section-list">
              {section.items.map((item) => (
                item.isExternal ? (
                  <a
                    key={item.label}
                    href={item.to}
                    className="more-sheet__row"
                    onClick={() => setSheetOpen(false)}
                  >
                    <FeatureIcon icon={item.icon} colorMode={item.color} className="sm" />
                    <span className="more-sheet__row-label">{item.label}</span>
                  </a>
                ) : (
                  <NavLink
                    key={item.to + item.label}
                    to={item.to}
                    replace={true}
                    className={({isActive}) => `more-sheet__row${isActive ? ' active' : ''}`}
                    onClick={() => setSheetOpen(false)}
                  >
                    <FeatureIcon icon={item.icon} colorMode={item.color} className="sm" />
                    <span className="more-sheet__row-label">{item.label}</span>
                  </NavLink>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
