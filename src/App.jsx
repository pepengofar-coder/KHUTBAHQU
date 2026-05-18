import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar/Navbar';
import BottomNav from './components/BottomNav/BottomNav';
import Footer from './components/Footer/Footer';
import PageLoader from './components/PageLoader/PageLoader';
import PageTransition from './components/PageTransition/PageTransition';
import OfflineBanner from './components/OfflineBanner/OfflineBanner';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage/CatalogPage'));
const DetailPage = lazy(() => import('./pages/ReadingPage/ReadingPage'));
const HijriCalendarPage = lazy(() => import('./pages/HijriCalendarPage/HijriCalendarPage'));
const MushafPage = lazy(() => import('./pages/MushafPage/MushafPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage/FavoritesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage/AboutPage'));
const MimbarMode = lazy(() => import('./pages/MimbarMode/MimbarMode'));
const AdminPage = lazy(() => import('./pages/AdminPage/AdminPage'));
const SubmitPage = lazy(() => import('./pages/SubmitPage/SubmitPage'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/khutbah" element={<CatalogPage />} />
          <Route path="/khutbah/:slug" element={<DetailPage />} />
          <Route path="/mushaf" element={<MushafPage />} />
          <Route path="/kalender-hijriah" element={<HijriCalendarPage />} />
          <Route path="/favorit" element={<FavoritesPage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/admin280292" element={<AdminPage />} />
          <Route path="/kontribusi" element={<SubmitPage />} />
        </Routes>
      </PageTransition>
    </Suspense>
  );
}

function AppLayout() {
  const location = useLocation();
  const isMimbar = location.pathname === '/mimbar';
  const isDetail = location.pathname.startsWith('/khutbah/') && location.pathname.split('/').length === 3;
  const isAdmin = location.pathname === '/admin280292';

  if (isMimbar) return (
    <Suspense fallback={<PageLoader />}>
      <MimbarMode />
    </Suspense>
  );

  return (
    <>
      <OfflineBanner />
      {(!isAdmin) && <Navbar />}
      <main style={{ flex: 1 }}>
        <AnimatedRoutes />
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
