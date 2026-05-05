import { Link } from 'react-router-dom';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero islamic-pattern">
      <div className="hero__inner">
        <span className="hero__badge">🕌 Platform Khutbah Islam Terlengkap</span>
        <h1 className="hero__title">Temukan Materi Khutbah Islam Siap Pakai</h1>
        <p className="hero__subtitle">
          Koleksi khutbah Jumat, kultum, tausiyah, kalender Hijriah, dan rekomendasi tema berdasarkan momen Islami penting.
        </p>
        <div className="hero__cta">
          <Link to="/khutbah" className="btn btn--primary btn--lg">📚 Jelajahi Khutbah</Link>
          <Link to="/khutbah?type=khutbah-jumat" className="btn btn--gold btn--lg">🕌 Khutbah Minggu Ini</Link>
          <Link to="/kalender-hijriah" className="btn btn--outline btn--lg">📅 Kalender Hijriah</Link>
        </div>
        <p className="hero__arabic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
      </div>
    </section>
  );
}
