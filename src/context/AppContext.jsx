import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { khutbahList as initialKhutbahList, categories } from '../data/khutbahData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [khutbahList, setKhutbahList] = useState(initialKhutbahList);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [fontSize, setFontSize] = useState(1); // multiplier: 0.85, 1, 1.15, 1.3
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('khutbahqu_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem('khutbahqu_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = useCallback((khutbahId) => {
    setBookmarks(prev => {
      if (prev.includes(khutbahId)) {
        return prev.filter(id => id !== khutbahId);
      }
      return [...prev, khutbahId];
    });
  }, []);

  const isBookmarked = useCallback((khutbahId) => {
    return bookmarks.includes(khutbahId);
  }, [bookmarks]);

  const filteredKhutbah = khutbahList.filter(k => {
    const matchesSearch = searchQuery === '' ||
      k.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !activeCategory || k.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const bookmarkedKhutbah = khutbahList.filter(k => bookmarks.includes(k.id));

  const fontSizeOptions = [
    { label: 'Kecil', value: 0.85 },
    { label: 'Normal', value: 1 },
    { label: 'Besar', value: 1.15 },
    { label: 'Sangat Besar', value: 1.3 },
  ];

  const cycleFontSize = useCallback(() => {
    setFontSize(prev => {
      const currentIdx = fontSizeOptions.findIndex(o => o.value === prev);
      const nextIdx = (currentIdx + 1) % fontSizeOptions.length;
      return fontSizeOptions[nextIdx].value;
    });
  }, []);

  const value = {
    khutbahList,
    categories,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    filteredKhutbah,
    bookmarks,
    bookmarkedKhutbah,
    toggleBookmark,
    isBookmarked,
    fontSize,
    setFontSize,
    cycleFontSize,
    fontSizeOptions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
