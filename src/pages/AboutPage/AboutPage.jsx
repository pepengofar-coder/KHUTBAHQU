import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '48px 16px 80px', maxWidth: 720 }}>
      <h1 className="section__title" style={{ textAlign: 'center', marginBottom: 8 }}>📖 Tentang KhutbahQu</h1>
      <p className="section__subtitle" style={{ textAlign: 'center', marginBottom: 32 }}>
        Platform materi khutbah Islam siap pakai untuk khatib, pendakwah, dan umat muslim.
      </p>

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, marginBottom: 12 }}>🎯 Misi Kami</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          KhutbahQu hadir untuk memudahkan khatib dan pendakwah dalam menemukan, membaca, dan menyampaikan materi khutbah Islam yang berkualitas. Kami menyediakan koleksi khutbah Jumat, kultum, tausiyah, serta informasi kalender Hijriah agar setiap momen Islami dapat dimanfaatkan dengan baik.
        </p>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, marginBottom: 12 }}>✨ Fitur Utama</h2>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2 }}>
          <li>📚 Koleksi 12+ materi khutbah siap pakai</li>
          <li>🔍 Pencarian dan filter berdasarkan kategori, tipe, dan durasi</li>
          <li>📅 Kalender Hijriah dengan countdown peristiwa Islam</li>
          <li>🎤 Mode Mimbar untuk membaca di atas mimbar</li>
          <li>⭐ Simpan favorit dan riwayat baca</li>
          <li>💬 Bagikan ke WhatsApp dan salin teks</li>
          <li>🌙 Mode gelap untuk kenyamanan membaca</li>
          <li>📱 Responsif untuk mobile dan desktop</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/khutbah" className="btn btn--primary btn--lg">Jelajahi Khutbah →</Link>
      </div>
    </div>
  );
}
