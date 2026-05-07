import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { khutbahList as staticKhutbah, CATEGORIES, TYPES } from '../data/khutbahData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Local Khutbah State
  const [localKhutbahs, setLocalKhutbahs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kq_local_khutbahs') || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('kq_local_khutbahs', JSON.stringify(localKhutbahs)); }, [localKhutbahs]);

  const allKhutbah = [...staticKhutbah, ...localKhutbahs.filter(k => k.status === 'published' || !k.status)];
  const adminKhutbah = [...staticKhutbah.map(k => ({...k, status: 'published', isStatic: true})), ...localKhutbahs];

  const addSubmission = useCallback((data, status = 'review') => {
    const newK = { ...data, id: Date.now(), status, createdAt: new Date().toISOString().split('T')[0] };
    setLocalKhutbahs(p => [newK, ...p]);
  }, []);

  const updateKhutbah = useCallback((id, updates) => {
    setLocalKhutbahs(p => p.map(k => k.id === id ? { ...k, ...updates } : k));
  }, []);

  const deleteKhutbah = useCallback(id => {
    setLocalKhutbahs(p => p.filter(k => k.id !== id));
  }, []);

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    const s = localStorage.getItem('kq_dark');
    if (s !== null) return s === '1';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('kq_dark', darkMode ? '1' : '0');
  }, [darkMode]);
  const toggleDark = useCallback(() => setDarkMode(p => !p), []);

  // Font size
  const FONT_OPTS = [
    { label: 'Kecil', value: 0.85 },
    { label: 'Normal', value: 1 },
    { label: 'Besar', value: 1.15 },
    { label: 'Sangat Besar', value: 1.3 },
  ];
  const [fontSize, setFontSize] = useState(1);
  const cycleFontSize = useCallback(() => {
    setFontSize(p => {
      const i = FONT_OPTS.findIndex(o => o.value === p);
      return FONT_OPTS[(i + 1) % FONT_OPTS.length].value;
    });
  }, []);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kq_bm') || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('kq_bm', JSON.stringify(bookmarks)); }, [bookmarks]);
  const toggleBookmark = useCallback(id => {
    setBookmarks(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }, []);
  const isBookmarked = useCallback(id => bookmarks.includes(id), [bookmarks]);

  // Recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kq_rv') || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('kq_rv', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  const addRecentlyViewed = useCallback(id => {
    setRecentlyViewed(p => [id, ...p.filter(x => x !== id)].slice(0, 8));
  }, []);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [activeDuration, setActiveDuration] = useState(null);

  const filteredKhutbah = allKhutbah.filter(k => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = k.title.toLowerCase().includes(q)
        || k.summary.toLowerCase().includes(q)
        || (k.tags || []).some(t => t.includes(q));
      if (!match) return false;
    }
    if (activeCategory && k.category !== activeCategory) return false;
    if (activeType && k.type !== activeType) return false;
    if (activeDuration) {
      if (activeDuration === 'short' && k.duration > 8) return false;
      if (activeDuration === 'medium' && (k.duration < 9 || k.duration > 12)) return false;
      if (activeDuration === 'long' && k.duration < 13) return false;
    }
    return true;
  });

  const bookmarkedKhutbah = allKhutbah.filter(k => bookmarks.includes(k.id));
  const recentKhutbah = recentlyViewed.map(id => allKhutbah.find(k => k.id === id)).filter(Boolean);
  const getKhutbahBySlug = useCallback(slug => allKhutbah.find(k => k.slug === slug), [allKhutbah]);
  const getRelated = useCallback((k, n = 3) =>
    allKhutbah.filter(x => x.id !== k.id && (x.category === k.category || (x.tags && k.tags && x.tags.some(t => k.tags.includes(t))))).slice(0, n)
  , [allKhutbah]);

  // Utilities
  const copyText = useCallback(async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
  }, []);
  const shareWhatsApp = useCallback((k) => {
    const url = `${window.location.origin}/khutbah/${k.slug}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(`📖 ${k.title}\n${k.summary}\n\n${url}`)}`);
  }, []);

  return (
    <AppContext.Provider value={{
      darkMode, toggleDark,
      fontSize, setFontSize, cycleFontSize, fontSizeOptions: FONT_OPTS,
      bookmarks, bookmarkedKhutbah, toggleBookmark, isBookmarked,
      recentlyViewed, recentKhutbah, addRecentlyViewed,
      searchQuery, setSearchQuery,
      activeCategory, setActiveCategory,
      activeType, setActiveType,
      activeDuration, setActiveDuration,
      allKhutbah, filteredKhutbah, adminKhutbah,
      getKhutbahBySlug, getRelated,
      categories: CATEGORIES, types: TYPES,
      addSubmission, updateKhutbah, deleteKhutbah,
      copyText, shareWhatsApp,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
