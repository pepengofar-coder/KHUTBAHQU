import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function PageModeView() {
  return (
    <div className="rsm-page-mode">
      <div className="rsm-page-container">
        <BookOpen size={48} className="rsm-page-placeholder-icon" />
        <h2 className="rsm-page-placeholder-title">Mushaf Per Halaman</h2>
        <p className="rsm-page-placeholder-text">
          Mushaf per halaman sedang disiapkan. Data halaman Al-Qur'an akan dihubungkan ke sumber yang valid.
        </p>
        <Link to="/mushaf" className="rsm-page-placeholder-btn">
          Buka Mushaf Biasa
        </Link>
      </div>
    </div>
  );
}
