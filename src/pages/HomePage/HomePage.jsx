import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useSEO, JsonLd, SITE_URL, SITE_NAME } from '../../utils/seo';
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

  useSEO({
    title: 'KhutbahQu - Teks Khutbah Jumat, Kultum, dan Tausiyah Islam Siap Pakai',
    description: 'Kumpulan teks khutbah Jumat, kultum Ramadhan, tausiyah Islam, dan rekomendasi tema dakwah berdasarkan kalender Hijriah. Siap pakai untuk khatib, dai, ustaz, dan pengurus masjid.',
    path: '/',
  });

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Platform materi khutbah Islam siap pakai — khutbah Jumat, kultum, tausiyah, dan rekomendasi tema dakwah berdasarkan kalender Hijriah.',
    inLanguage: 'id-ID',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/khutbah?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'KhutbahQu menyediakan koleksi teks khutbah Jumat, kultum, tausiyah, dan materi dakwah Islam siap pakai untuk khatib, dai, ustaz, dan pengurus masjid.',
  };

  return (
    <div className="home-page">
      <JsonLd data={websiteSchema} />
      <JsonLd data={orgSchema} />

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
            <p className="section__subtitle">Materi khutbah Jumat terbaik yang kami rekomendasikan</p>
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

      {/* SEO: Deskripsi singkat website untuk crawlers */}
      <section className="home-seo-text container">
        <div className="home-seo-text__inner">
          <h2 className="home-seo-text__title">Tentang KhutbahQu</h2>
          <p>
            <strong>KhutbahQu</strong> adalah platform materi khutbah Islam siap pakai yang menyediakan koleksi lengkap
            teks khutbah Jumat, kultum Ramadhan, tausiyah singkat, dan materi dakwah untuk berbagai momen Islami.
            Dirancang khusus untuk membantu khatib, dai, ustaz, dan pengurus masjid dalam menyiapkan materi dakwah berkualitas.
          </p>
          <p>
            Tersedia lebih dari <strong>{allKhutbah.length} naskah</strong> dalam berbagai kategori seperti akhlak, ibadah,
            keluarga, takwa, tauhid, dan banyak lagi. Setiap materi dilengkapi dengan dalil Al-Qur'an dan hadis shahih,
            serta disusun dalam format yang mudah dibaca langsung di atas mimbar dengan fitur <em>Mode Mimbar</em>.
          </p>
          <p>
            KhutbahQu juga menyediakan <Link to="/kalender-hijriah">kalender Hijriah</Link> interaktif untuk
            membantu menemukan tema khutbah yang relevan berdasarkan momen Islam penting seperti Ramadhan, Dzulhijjah,
            Muharram, dan hari-hari besar Islam lainnya.
          </p>
        </div>
      </section>
    </div>
  );
}
