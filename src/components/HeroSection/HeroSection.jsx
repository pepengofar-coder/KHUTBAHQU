import { Link } from 'react-router-dom';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero islamic-pattern">
      <div className="hero__inner">
        <span className="hero__badge">🕌 Platform Khutbah Islam Terlengkap</span>
        <h1 className="hero__title">Teks Khutbah Jumat, Kultum, dan Tausiyah Islam Siap Pakai</h1>
        <p className="hero__subtitle">
          Koleksi materi khutbah Jumat lengkap, kultum Ramadhan, tausiyah singkat, dan rekomendasi tema dakwah berdasarkan kalender Hijriah — siap pakai untuk khatib, dai, ustaz, dan pengurus masjid.
        </p>
        <div className="hero__cta">
          <Link to="/khutbah" className="btn btn--primary btn--lg">📚 Jelajahi Khutbah</Link>
          <Link to="/khutbah?type=khutbah-jumat" className="btn btn--gold btn--lg">🕌 Khutbah Jumat</Link>
          <Link to="/kalender-hijriah" className="btn btn--outline btn--lg">📅 Kalender Hijriah</Link>
        </div>
        <p className="hero__arabic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
      </div>
    </section>
  );
}
