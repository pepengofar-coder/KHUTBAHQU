import { useState, useEffect, useCallback, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { House, Clock, BookOpen, CalendarDays, Compass, Heart, CircleDot, Mic, CheckSquare, Star, Info, Settings, MoreHorizontal, Download, Headphones, Car } from 'lucide-react';
import { App as CapacitorApp } from '@capacitor/app';
import VariedFeatureCard from '../VariedFeatureCard/VariedFeatureCard';
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
      { to: '/kiblat', label: 'Kiblat', icon: Compass, color: 'blue', desc: 'Kompas penunjuk arah kiblat' },
      { to: '/doa-dzikir', label: 'Doa & Dzikir', icon: Heart, color: 'rose', desc: 'Koleksi doa & dzikir pagi petang' },
      { to: '/tasbih', label: 'Tasbih', icon: CircleDot, color: 'indigo', desc: 'Counter dzikir & tasbih digital' },
      { to: '/tracker', label: 'Tracker Ibadah', icon: CheckSquare, color: 'lime', desc: 'Catat dan pantau amal harian' },
    ],
  },
  {
    title: "Al-Qur'an",
    items: [
      { to: '/mushaf', label: 'Mushaf', icon: BookOpen, color: 'blue', desc: 'Membaca mushaf & tafsir' },
      { to: '/tilawah', label: 'Tilawah Live', icon: Headphones, color: 'orange', desc: 'Stasiun audio murottal 24 jam' },
      { to: '/mode-perjalanan', label: 'Mode Perjalanan', icon: Car, color: 'lime', desc: 'Audio penenang selama perjalanan' },
    ],
  },
  {
    title: 'Aplikasi',
    items: [
      { to: '/khutbah', label: 'Khutbah', icon: Mic, color: 'green', desc: 'Teks khutbah & kultum pilihan' },
      { to: '/favorit', label: 'Favorit', icon: Star, color: 'amber', desc: 'Daftar konten yang Anda simpan' },
      { to: '/pengaturan', label: 'Pengaturan', icon: Settings, color: 'indigo', desc: 'Kelola preferensi & mode aplikasi' },
      { to: '/tentang', label: 'Tentang', icon: Info, color: 'blue', desc: 'Mengenal aplikasi Islamediaku' },
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSheetOpen(false);
    }
  }, [location.pathname, sheetOpen]);

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
      } catch {
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
              {section.items.map((item) => {
                const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                return (
                  <VariedFeatureCard
                    key={item.to + item.label}
                    title={item.label}
                    subtitle={item.desc}
                    icon={item.icon}
                    to={item.isExternal ? undefined : item.to}
                    href={item.isExternal ? item.to : undefined}
                    isExternal={item.isExternal}
                    colorVariant={item.color || 'blue'}
                    active={isActive}
                    onClick={() => setSheetOpen(false)}
                    layoutVariant="list-row"
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
