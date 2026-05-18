import { useApp } from '../../context/AppContext';
import { useSEO } from '../../utils/seo';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';

export default function FavoritesPage() {
  const { bookmarkedKhutbah, recentKhutbah } = useApp();

  useSEO({
    title: 'Favorit Saya — Khutbah Tersimpan | KhutbahQu',
    description: 'Daftar khutbah Jumat, kultum, dan tausiyah yang Anda simpan di KhutbahQu.',
    path: '/favorit',
    robots: 'noindex, follow', // User-specific page
  });
  return (
    <div className="container" style={{ padding: '32px 16px 80px' }}>
      <div className="section__header"><div>
        <h1 className="section__title">⭐ Favorit</h1>
        <p className="section__subtitle">Khutbah yang Anda simpan</p>
      </div></div>

      {recentKhutbah.length > 0 && <>
        <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 600, marginBottom: 12, color: 'var(--color-text-muted)' }}>🕐 Terakhir Dibaca</h2>
        <div style={{ display: 'grid', gap: 12, marginBottom: 32 }}>
          {recentKhutbah.slice(0, 4).map(k => <KhutbahCard key={k.id} khutbah={k} compact />)}
        </div>
      </>}

      <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 600, marginBottom: 12 }}>⭐ Tersimpan ({bookmarkedKhutbah.length})</h2>
      {bookmarkedKhutbah.length > 0 ? (
        <div style={{ display: 'grid', gap: 16 }}>
          {bookmarkedKhutbah.map(k => <KhutbahCard key={k.id} khutbah={k} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 16px', color: 'var(--color-text-muted)' }}>
          <p style={{ fontSize: 48, opacity: .4 }}>⭐</p>
          <p style={{ fontWeight: 600, marginTop: 8 }}>Belum ada favorit</p>
          <p style={{ fontSize: 'var(--fs-sm)', marginTop: 4 }}>Tap ikon ★ pada khutbah untuk menyimpannya</p>
        </div>
      )}
    </div>
  );
}
