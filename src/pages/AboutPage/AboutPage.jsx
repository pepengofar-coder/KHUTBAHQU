import { Link } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import { Compass, BookOpen, Heart, Headphones, CheckCircle2, Car, Activity, Sparkles } from 'lucide-react';
import './AboutPage.css';

export default function AboutPage() {
  useSEO({
    title: 'Tentang Islamediaku',
    description: 'Islamediaku adalah sahabat ibadah harian untuk sholat, Al-Qur\'an, dzikir, tilawah, dan kebiasaan baik.',
    path: '/tentang',
  });

  return (
    <div className="about-page">
      {/* Header Section */}
      <header className="about-header">
        <div className="about-brand">
          <span className="about-badge">TENTANG</span>
          <h1 className="about-title">Tentang Islamediaku</h1>
          <p className="about-subtitle">Sahabat ibadah harian untuk sholat, Al-Qur’an, dzikir, tilawah, dan kebiasaan baik.</p>
        </div>
      </header>

      <div className="about-container container">
        {/* Main Intro Card */}
        <section className="about-card main-intro-card">
          <h2 className="about-card-title">Islamediaku</h2>
          <p className="about-card-text">
            Islamediaku hadir untuk membantu umat Muslim menjalani rutinitas ibadah harian dengan lebih mudah, rapi, dan nyaman. Di dalamnya tersedia jadwal sholat, Mushaf Al-Qur’an, dzikir, tilawah, kalender Hijriah, tracker ibadah, Good Path, Mode Perjalanan, serta konten Islami pilihan.
          </p>
        </section>

        {/* Mission Card */}
        <section className="about-card mission-card">
          <h2 className="about-card-title">
            <Compass className="about-icon text-lime" size={24} />
            Misi Kami
          </h2>
          <p className="about-card-text">
            Membuat aplikasi Islami yang ringan, indah, dan mudah digunakan setiap hari, sehingga pengguna bisa lebih dekat dengan ibadah dan kebiasaan baik tanpa merasa terbebani.
          </p>
        </section>

        {/* Feature Grid */}
        <section className="about-features-section">
          <h2 className="section-title text-center mb-6">Fitur Utama</h2>
          <div className="about-feature-grid">
            <div className="about-feature-item">
              <Compass className="feature-icon" size={24} />
              <div className="feature-content">
                <h3>1. Sholat</h3>
                <p>Jadwal sholat dan pengingat waktu ibadah.</p>
              </div>
            </div>
            
            <div className="about-feature-item">
              <BookOpen className="feature-icon" size={24} />
              <div className="feature-content">
                <h3>2. Mushaf</h3>
                <p>Baca Al-Qur’an dengan tampilan yang nyaman.</p>
              </div>
            </div>

            <div className="about-feature-item">
              <Heart className="feature-icon" size={24} />
              <div className="feature-content">
                <h3>3. Dzikir & Doa</h3>
                <p>Dzikir pagi petang dan doa harian.</p>
              </div>
            </div>

            <div className="about-feature-item">
              <Headphones className="feature-icon" size={24} />
              <div className="feature-content">
                <h3>4. Tilawah</h3>
                <p>Dengarkan lantunan Al-Qur’an.</p>
              </div>
            </div>

            <div className="about-feature-item">
              <CheckCircle2 className="feature-icon" size={24} />
              <div className="feature-content">
                <h3>5. Good Path</h3>
                <p>Bangun kebiasaan baik secara bertahap.</p>
              </div>
            </div>

            <div className="about-feature-item">
              <Car className="feature-icon" size={24} />
              <div className="feature-content">
                <h3>6. Mode Perjalanan</h3>
                <p>Temani safar dengan tilawah, doa, dan kajian ringan.</p>
              </div>
            </div>

            <div className="about-feature-item">
              <Activity className="feature-icon" size={24} />
              <div className="feature-content">
                <h3>7. Tracker</h3>
                <p>Pantau ibadah dan aktivitas baik harian.</p>
              </div>
            </div>

            <div className="about-feature-item">
              <Sparkles className="feature-icon" size={24} />
              <div className="feature-content">
                <h3>8. Konten Islami</h3>
                <p>Khutbah dan materi pilihan sebagai pengingat iman.</p>
              </div>
            </div>
          </div>
        </section>

        {/* APK Note (Optional/If Exists) & Closing */}
        <section className="about-closing text-center mt-12 mb-12">
          <p className="about-closing-text mb-6">
            Islamediaku terus dikembangkan agar menjadi aplikasi Islami yang bermanfaat, ringan, dan nyaman digunakan oleh siapa saja.
          </p>
          
          <div className="about-actions flex gap-4 justify-center flex-wrap">
            <Link to="/" className="btn-primary">Mulai Jelajahi</Link>
            <Link to="/good-path" className="btn-secondary">Buka Good Path</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
