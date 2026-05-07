import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar/Navbar';
import BottomNav from './components/BottomNav/BottomNav';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import DetailPage from './pages/ReadingPage/ReadingPage';
import HijriCalendarPage from './pages/HijriCalendarPage/HijriCalendarPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import AboutPage from './pages/AboutPage/AboutPage';
import MimbarMode from './pages/MimbarMode/MimbarMode';
import AdminPage from './pages/AdminPage/AdminPage';
import SubmitPage from './pages/SubmitPage/SubmitPage';

function AppLayout() {
  const location = useLocation();
  const isMimbar = location.pathname === '/mimbar';
  const isDetail = location.pathname.startsWith('/khutbah/') && location.pathname.split('/').length === 3;
  const isAdmin = location.pathname === '/admin280292';

  if (isMimbar) return <MimbarMode />;

  return (
    <>
      {(!isAdmin) && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/khutbah" element={<CatalogPage />} />
          <Route path="/khutbah/:slug" element={<DetailPage />} />
          <Route path="/kalender-hijriah" element={<HijriCalendarPage />} />
          <Route path="/favorit" element={<FavoritesPage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/admin280292" element={<AdminPage />} />
          <Route path="/kontribusi" element={<SubmitPage />} />
        </Routes>
      </main>
      {!isDetail && <Footer />}
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
