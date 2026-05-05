import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import SplashScreen from './components/SplashScreen/SplashScreen';
import BottomNav from './components/BottomNav/BottomNav';
import HomePage from './pages/HomePage/HomePage';
import ReadingPage from './pages/ReadingPage/ReadingPage';
import BookmarksPage from './pages/BookmarksPage/BookmarksPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';

function AppLayout() {
  const location = useLocation();
  const isReading = location.pathname.startsWith('/baca/');

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/baca/:id" element={<ReadingPage />} />
        <Route path="/tersimpan" element={<BookmarksPage />} />
        <Route path="/pengaturan" element={<SettingsPage />} />
      </Routes>
      {!isReading && <BottomNav />}
    </>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <AppProvider>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
