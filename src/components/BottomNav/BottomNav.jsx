import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { House, Clock, BookOpen, Compass, Heart, CircleDot, ScrollText, CheckSquare, Star, Info, Settings, MoreHorizontal, Download, Headphones, Car, User, Calendar } from 'lucide-react';
import { App as CapacitorApp } from '@capacitor/app';
import VariedFeatureCard from '../VariedFeatureCard/VariedFeatureCard';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import './BottomNav.css';

const TABS = [
  { to: '/', end: true, tKey: 'nav.home' },
  { to: '/sholat', tKey: 'nav.prayer' },
  { to: '/mushaf', tKey: 'nav.mushaf' },
  { to: '/doa-dzikir', tKey: 'nav.dua' },
];

const MORE_SECTIONS = [
  {
    tTitleKey: 'nav.prayer',
    fallbackTitle: 'Ibadah',
    items: [
      { to: '/sholat', tKey: 'nav.prayer', icon: Clock, color: 'emerald', tDescKey: 'feature.prayer' },
      { to: '/mushaf', tKey: 'nav.mushaf', icon: BookOpen, color: 'blue', tDescKey: 'feature.mushaf' },
      { to: '/doa-dzikir', tKey: 'nav.dua_dhikr', icon: Heart, color: 'rose', tDescKey: 'feature.dua' },
      { to: '/tilawah', tKey: 'feature.recitation', fallbackKey: 'Tilawah', icon: Headphones, color: 'orange', tDescKey: 'feature.recitation' },
      { to: '/kiblat', tKey: 'nav.qibla', icon: Compass, color: 'blue', tDescKey: 'feature.qibla' },
      { to: '/tasbih', tKey: 'nav.tasbih', fallbackKey: 'Tasbih', icon: CircleDot, color: 'indigo', tDescKey: 'feature.tasbih', fallbackDesc: 'Counter dzikir & tasbih digital' },
    ],
  },
  {
    tTitleKey: 'nav.my_space',
    fallbackTitle: 'Ruang Saya',
    items: [
      { to: '/ruang-saya', tKey: 'nav.my_space', icon: User, color: 'cyan', tDescKey: 'nav.my_space', fallbackDesc: 'Dashboard pribadi dan progres' },
      { to: '/good-path', tKey: 'nav.good_path', icon: Compass, color: 'emerald', tDescKey: 'feature.good_path' },
      { to: '/tracker', tKey: 'nav.tracker', icon: CheckSquare, color: 'lime', tDescKey: 'feature.tracker' },
      { to: '/favorit', tKey: 'nav.favorites', fallbackKey: 'Favorit', icon: Star, color: 'amber', tDescKey: 'feature.favorites', fallbackDesc: 'Daftar konten yang Anda simpan' },
    ],
  },
  {
    tTitleKey: 'nav.more',
    fallbackTitle: 'Konten',
    items: [
      { to: '/khutbah', tKey: 'nav.khutbah', icon: ScrollText, color: 'amber', tDescKey: 'feature.khutbah' },
      { to: '/mode-perjalanan', tKey: 'nav.travel_mode', icon: Car, color: 'lime', tDescKey: 'feature.travel' },
      { to: '/kalender-hijriah', tKey: 'nav.calendar', icon: Calendar, color: 'indigo', tDescKey: 'feature.calendar' },
    ],
  },
  {
    tTitleKey: 'nav.settings',
    fallbackTitle: 'Aplikasi',
    items: [
      { to: '/pengaturan', tKey: 'nav.settings', icon: Settings, color: 'indigo', tDescKey: 'nav.settings', fallbackDesc: 'Kelola preferensi & mode aplikasi' },
      { to: '/tentang', tKey: 'nav.about', icon: Info, color: 'blue', tDescKey: 'nav.about', fallbackDesc: 'Mengenal aplikasi Islamediaku' },
    ],
  },
];

// Flatten for active checking
const ALL_MORE_ITEMS = MORE_SECTIONS.flatMap(s => s.items);

export default function BottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();

  const moreActive = ALL_MORE_ITEMS.some(m => location.pathname === m.to || location.pathname.startsWith(m.to + '/'));

  // Compute dynamic MORE sections
  const sections = useMemo(() => {
    const s = [...MORE_SECTIONS];
    const apkUrl = import.meta.env.VITE_APK_URL || import.meta.env.NEXT_PUBLIC_APK_URL;
    if (apkUrl) {
      s[3] = {
        ...s[3],
        items: [
          ...s[3].items,
          { to: apkUrl, label: 'Download APK', icon: Download, color: 'green', isExternal: true }
        ]
      };
    }
    return s;
  }, []);

  // Close sheet automatically when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSheetOpen(false);
  }, [location.pathname]);

  const lastOpenedRef = useRef(0);

  const openSheet = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    lastOpenedRef.current = Date.now();
    setSheetOpen(true);
    window.history.pushState({ sheetOpen: true }, '');
  }, []);

  const dismissSheet = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    // Prevent immediate close from ghost click on touch devices
    if (Date.now() - lastOpenedRef.current < 350) return;
    setSheetOpen(false);
    if (window.history.state?.sheetOpen) {
      window.history.back();
    }
  }, []);

  // Safe body scroll lock when sheet is open
  useEffect(() => {
    if (sheetOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [sheetOpen]);

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

  const handleMoreClick = (e) => {
    if (sheetOpen) {
      dismissSheet(e);
    } else {
      openSheet(e);
    }
  };

  const moreSheetContent = (
    <>
      <div className={`more-sheet__backdrop glass-backdrop${sheetOpen ? ' open' : ''}`} onClick={dismissSheet} />
      <div className={`more-sheet glass-surface${sheetOpen ? ' open' : ''}`}>
        <div className="more-sheet__handle" onClick={dismissSheet}><span /></div>
        <h3 className="more-sheet__title">{t('nav.more')}</h3>
        
        {sections.map((section, si) => (
          <div key={section.tTitleKey} className="more-sheet__section" style={{ animationDelay: `${si * 60}ms` }}>
            <h4 className="more-sheet__section-title">{t(section.tTitleKey) === section.tTitleKey && section.fallbackTitle ? section.fallbackTitle : t(section.tTitleKey)}</h4>
            <div className="more-sheet__section-list">
              {section.items.map((item) => {
                const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                let label = t(item.tKey) === item.tKey && item.fallbackKey ? item.fallbackKey : t(item.tKey);
                // For features with " - ", we take the subtitle. For desc we just take the second part or whole string.
                let desc = t(item.tDescKey) === item.tDescKey && item.fallbackDesc ? item.fallbackDesc : t(item.tDescKey);
                if (desc.includes(' - ')) desc = desc.split(' - ')[1];
                if (label.includes(' - ')) label = label.split(' - ')[0];
                if (item.label === 'Download APK') { label = item.label; desc = item.label; }

                return (
                  <VariedFeatureCard
                    key={item.to + label}
                    title={label}
                    subtitle={desc}
                    icon={item.icon}
                    to={item.isExternal ? undefined : item.to}
                    href={item.isExternal ? item.to : undefined}
                    isExternal={item.isExternal}
                    colorVariant={item.color || 'blue'}
                    active={isActive}
                    onClick={(e) => {
                      if (!item.isExternal) {
                        e.preventDefault();
                        e.stopPropagation();
                        setSheetOpen(false);
                        navigate(item.to, { replace: true });
                      } else {
                        setSheetOpen(false);
                        if (window.history.state?.sheetOpen) {
                          window.history.back();
                        }
                      }
                    }}
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

  return (
    <>
      <nav className="btm-nav" aria-label="Navigasi mobile">
        <div className="btm-nav__inner">
          <NavLink to="/" end className={({isActive}) => `btm-nav__item${isActive ? ' active' : ''}`} onClick={(e) => { if (sheetOpen) { e.preventDefault(); setSheetOpen(false); navigate('/', { replace: true }); } }}>
            <span className="btm-nav__icon"><House size={24} strokeWidth={2} /></span>
            <span className="btm-nav__label">{t('nav.home')}</span>
          </NavLink>
          <NavLink to="/sholat" className={({isActive}) => `btm-nav__item${isActive ? ' active' : ''}`} onClick={(e) => { if (sheetOpen) { e.preventDefault(); setSheetOpen(false); navigate('/sholat', { replace: true }); } }}>
            <span className="btm-nav__icon"><Clock size={24} strokeWidth={2} /></span>
            <span className="btm-nav__label">{t('nav.prayer')}</span>
          </NavLink>
          <NavLink to="/mushaf" className={({isActive}) => `btm-nav__item${isActive ? ' active' : ''}`} onClick={(e) => { if (sheetOpen) { e.preventDefault(); setSheetOpen(false); navigate('/mushaf', { replace: true }); } }}>
            <span className="btm-nav__icon"><BookOpen size={24} strokeWidth={2} /></span>
            <span className="btm-nav__label">{t('nav.mushaf')}</span>
          </NavLink>
          <NavLink to="/doa-dzikir" className={({isActive}) => `btm-nav__item${isActive ? ' active' : ''}`} onClick={(e) => { if (sheetOpen) { e.preventDefault(); setSheetOpen(false); navigate('/doa-dzikir', { replace: true }); } }}>
            <span className="btm-nav__icon"><Heart size={24} strokeWidth={2} /></span>
            <span className="btm-nav__label">{t('nav.dua')}</span>
          </NavLink>
          <button
            type="button"
            className={`btm-nav__item btm-nav__more-btn${moreActive || sheetOpen ? ' active' : ''}`}
            onClick={handleMoreClick}
            aria-label="Menu lainnya"
            aria-expanded={sheetOpen}
          >
            <span className="btm-nav__icon">
              <MoreHorizontal size={24} strokeWidth={2} />
            </span>
            <span className="btm-nav__label">{t('nav.more')}</span>
          </button>
        </div>
      </nav>

      {/* More Sheet rendered via Portal to escape any transformed ancestors */}
      {createPortal(moreSheetContent, document.body)}
    </>
  );
}
