import { useSEO } from '../../utils/seo';
import './PremiumPage.css';

const FEATURES = [
  { icon: '🚫', title: 'Tanpa Iklan', desc: 'Nikmati pengalaman bebas iklan sepenuhnya.' },
  { icon: '🎨', title: 'Tema Eksklusif', desc: 'Akses koleksi tema premium dengan tampilan mewah.' },
  { icon: '🎧', title: 'Audio Murottal', desc: 'Dengarkan Al-Quran dari qari terbaik dunia.' },
  { icon: '📖', title: 'Khutbah Premium', desc: 'Akses koleksi khutbah eksklusif dari ulama terkemuka.' },
  { icon: '🔍', title: 'Mode Fokus Mushaf', desc: 'Mode baca tanpa gangguan dengan tampilan khusus.' },
  { icon: '☁️', title: 'Backup Lintas Perangkat', desc: 'Sinkronkan favorit, bookmark, dan progress Anda.' },
  { icon: '📊', title: 'Tracker Ibadah Lanjutan', desc: 'Statistik ibadah mingguan, bulanan, dan tahunan.' },
  { icon: '🎬', title: 'Konten Video/Kajian', desc: 'Video kajian pilihan dari ustaz dan ulama.' },
];

export default function PremiumPage() {
  useSEO({ title: 'KhutbahQu Premium — Fitur Eksklusif | KhutbahQu', description: 'Tingkatkan pengalaman Islami Anda dengan KhutbahQu Premium: tanpa iklan, audio murottal, tema eksklusif, dan banyak lagi.', path: '/premium' });

  return (
    <div className="premium-page container">
      <div className="premium-hero">
        <span className="premium-hero__badge">👑 Premium</span>
        <h1 className="premium-hero__title">KhutbahQu Premium</h1>
        <p className="premium-hero__sub">Tingkatkan pengalaman Islami Anda dengan fitur eksklusif</p>
      </div>

      <div className="premium-features">
        {FEATURES.map((f, i) => (
          <div key={i} className="premium-feat" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="premium-feat__icon">{f.icon}</span>
            <div>
              <h3 className="premium-feat__title">{f.title}</h3>
              <p className="premium-feat__desc">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="premium-plans">
        <div className="premium-plan">
          <div className="premium-plan__name">Bulanan</div>
          <div className="premium-plan__price">Rp 29.000<span>/bulan</span></div>
          <ul className="premium-plan__list">
            <li>✅ Semua fitur premium</li>
            <li>✅ Batalkan kapan saja</li>
          </ul>
          <button className="btn btn--outline btn--lg premium-plan__btn" disabled>Segera Hadir</button>
        </div>
        <div className="premium-plan premium-plan--best">
          <div className="premium-plan__badge">Terbaik</div>
          <div className="premium-plan__name">Tahunan</div>
          <div className="premium-plan__price">Rp 199.000<span>/tahun</span></div>
          <div className="premium-plan__save">Hemat 43%</div>
          <ul className="premium-plan__list">
            <li>✅ Semua fitur premium</li>
            <li>✅ Prioritas support</li>
            <li>✅ Akses fitur baru duluan</li>
          </ul>
          <button className="btn btn--primary btn--lg premium-plan__btn" disabled>Segera Hadir</button>
        </div>
      </div>

      <p className="premium-note">💡 Fitur premium sedang dalam pengembangan. Anda akan diberitahu saat sudah tersedia.</p>
    </div>
  );
}
