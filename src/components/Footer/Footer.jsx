import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <h3>
            <img 
              src="/logo-icon.png" 
              alt="" 
              width={24} 
              height={24} 
              style={{verticalAlign: 'middle', marginRight: '8px', borderRadius: '4px'}} 
            />
            Islamediaku
          </h3>
          <p>Platform Islami harian untuk Qur’an, doa, jadwal sholat, tilawah, artikel edukasi, dan tracker ibadah.</p>
        </div>
        <div className="footer__menu">
          <Link to="/tentang">Tentang</Link>
          <Link to="/artikel">Artikel</Link>
          <Link to="/sholat">Jadwal Sholat</Link>
          <Link to="/mushaf">Mushaf</Link>
          <Link to="/doa-dzikir">Doa & Dzikir</Link>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Islamediaku. Semua konten disusun untuk kebaikan umat.</p>
        <p style={{ marginTop: '8px', fontSize: '0.9em', color: 'var(--color-text-muted)' }}>
          Aplikasi oleh Amirudin Abu Ziyadhmaeda
        </p>
        <p style={{ marginTop: '4px', fontSize: '0.8em', color: 'var(--color-text-muted)', opacity: 0.6 }}>
          UI Build: f84cac1-polished
        </p>
      </div>
    </footer>
  );
}
