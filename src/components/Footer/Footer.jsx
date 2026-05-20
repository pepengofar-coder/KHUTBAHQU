import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <h3><img src="/logo-icon.png" alt="" width={24} height={24} style={{verticalAlign: 'middle', marginRight: '8px', borderRadius: '4px'}} />Islamediaku</h3>
          <p>Platform materi khutbah Islam siap pakai untuk khatib, pendakwah, dan umat muslim.</p>
        </div>
        <div className="footer__col">
          <h4>Menu</h4>
          <Link to="/khutbah">Khutbah Jumat</Link>
          <Link to="/kalender-hijriah">Kalender Hijriah</Link>
          <Link to="/favorit">Favorit</Link>
          <Link to="/tentang">Tentang</Link>
        </div>
        <div className="footer__col">
          <h4>Kategori</h4>
          <Link to="/khutbah?cat=akhlak">Akhlak</Link>
          <Link to="/khutbah?cat=ibadah">Ibadah</Link>
          <Link to="/khutbah?cat=family">Keluarga</Link>
          <Link to="/khutbah?cat=taqwa">Taqwa</Link>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2026 Islamediaku. Semua konten disusun untuk kebaikan umat.</p>
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
