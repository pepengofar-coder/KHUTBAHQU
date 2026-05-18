import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { PremiumProvider } from './context/PremiumContext';
import Navbar from './components/Navbar/Navbar';
import BottomNav from './components/BottomNav/BottomNav';
import Footer from './components/Footer/Footer';
import PageLoader from './components/PageLoader/PageLoader';
import PageTransition from './components/PageTransition/PageTransition';
import OfflineBanner from './components/OfflineBanner/OfflineBanner';
import { useAdzanAlarm } from './hooks/useAdzanAlarm';

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
const SholatPage = lazy(() => import('./pages/SholatPage/SholatPage'));
const QiblaPage = lazy(() => import('./pages/QiblaPage/QiblaPage'));
const DoaDzikirPage = lazy(() => import('./pages/DoaDzikirPage/DoaDzikirPage'));
const TasbihPage = lazy(() => import('./pages/TasbihPage/TasbihPage'));
const TrackerPage = lazy(() => import('./pages/TrackerPage/TrackerPage'));
const PremiumPage = lazy(() => import('./pages/PremiumPage/PremiumPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage/SettingsPage'));
const AuthPage = lazy(() => import('./pages/AuthPage/AuthPage'));
const AccountPage = lazy(() => import('./pages/AccountPage/AccountPage'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sholat" element={<SholatPage />} />
          <Route path="/mushaf" element={<MushafPage />} />
          <Route path="/kiblat" element={<QiblaPage />} />
          <Route path="/kalender-hijriah" element={<HijriCalendarPage />} />
          <Route path="/doa-dzikir" element={<DoaDzikirPage />} />
          <Route path="/tasbih" element={<TasbihPage />} />
          <Route path="/khutbah" element={<CatalogPage />} />
          <Route path="/khutbah/:slug" element={<DetailPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/favorit" element={<FavoritesPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/pengaturan" element={<SettingsPage />} />
          <Route path="/kontribusi" element={<SubmitPage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin280292" element={<AdminPage />} />
        </Routes>
      </PageTransition>
    </Suspense>
  );
}

function AppLayout() {
  useAdzanAlarm(); // Initialize global alarm
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
    <AuthProvider>
      <PremiumProvider>
        <AppProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </AppProvider>
      </PremiumProvider>
    </AuthProvider>
  );
}
