import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <h3>📖 KhutbahQu</h3>
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
      <div className="footer__bottom">© 2026 KhutbahQu. Semua konten disusun untuk kebaikan umat.</div>
    </footer>
  );
}
