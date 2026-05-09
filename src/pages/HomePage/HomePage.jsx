import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import HeroSection from '../../components/HeroSection/HeroSection';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';
import ThemeSection from '../../components/ThemeSection/ThemeSection';
import HijriCalendarWidget from '../../components/HijriCalendarWidget/HijriCalendarWidget';
import PrayerTimes from '../../components/PrayerTimes/PrayerTimes';
import WeatherWidget from '../../components/WeatherWidget/WeatherWidget';
import './HomePage.css';

export default function HomePage() {
  const { allKhutbah } = useApp();
  const featured = allKhutbah.slice(0, 3);
  const weekly = allKhutbah.filter(k => k.type === 'khutbah-jumat').slice(0, 2);

  return (
    <div className="home-page">
      <HeroSection />

      {/* Widget Section: Waktu Sholat & Cuaca */}
      <section className="home-widgets container" style={{ paddingTop: 'var(--sp-10)', paddingBottom: 'var(--sp-4)' }}>
        <PrayerTimes />
        <WeatherWidget />
      </section>

      <section className="home-featured container">
        <div className="section__header">
          <div>
            <h2 className="section__title">⭐ Khutbah Pilihan</h2>
            <p className="section__subtitle">Materi terbaik yang kami rekomendasikan</p>
          </div>
          <Link to="/khutbah" className="btn btn--outline btn--sm">Lihat Semua →</Link>
        </div>
        <div className="home-featured__grid">
          {featured.map(k => <KhutbahCard key={k.id} khutbah={k} />)}
        </div>
      </section>

      <ThemeSection />

      <section className="home-calendar container">
        <div className="section__header">
          <div>
            <h2 className="section__title">📅 Kalender Hijriah</h2>
            <p className="section__subtitle">Tanggal Hijriah hari ini dan peristiwa Islam terdekat</p>
          </div>
          <Link to="/kalender-hijriah" className="btn btn--outline btn--sm">Selengkapnya →</Link>
        </div>
        <HijriCalendarWidget maxEvents={3} />
      </section>

      <section className="home-weekly container">
        <div className="section__header">
          <h2 className="section__title">🕌 Khutbah Minggu Ini</h2>
        </div>
        <div className="home-weekly__grid">
          {weekly.map(k => <KhutbahCard key={k.id} khutbah={k} />)}
        </div>
      </section>
    </div>
  );
}
