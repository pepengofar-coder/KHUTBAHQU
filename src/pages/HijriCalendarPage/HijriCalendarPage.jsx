import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getHijriDateString, gregorianToHijri, getUpcomingEvents, getRecommendedThemes, HIJRI_MONTHS, HIJRI_DISCLAIMER } from '../../data/hijriData';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';

export default function HijriCalendarPage() {
  const { allKhutbah, categories } = useApp();
  const now = new Date();
  const hijri = useMemo(() => gregorianToHijri(now), []);
  const hijriStr = useMemo(() => getHijriDateString(now), []);
  const events = useMemo(() => getUpcomingEvents(now), []);
  const themes = useMemo(() => getRecommendedThemes(hijri.month), []);
  const recommended = allKhutbah.filter(k => themes.includes(k.category)).slice(0, 3);
  const greg = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container" style={{ padding: '32px 16px 80px' }}>
      <div className="section__header"><div>
        <h1 className="section__title">📅 Kalender Hijriah</h1>
        <p className="section__subtitle">Informasi tanggal Hijriah dan peristiwa Islam penting</p>
      </div></div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr', marginBottom: 32 }}>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>Hari Ini</p>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--fs-3xl)', fontWeight: 800, color: 'var(--color-primary)', margin: '8px 0' }}>{hijriStr}</p>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>{greg}</p>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)', marginTop: 8 }}>Bulan: <strong>{HIJRI_MONTHS[hijri.month - 1]}</strong></p>
        </div>
      </div>

      <h2 className="section__title" style={{ marginBottom: 16 }}>🕌 Peristiwa Islam Terdekat</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
        {events.map((e, i) => (
          <div key={i} className="card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{e.name}</span>
            <span className="badge badge--gold">{e.daysUntil === 0 ? '🎉 Hari ini!' : `${e.daysUntil} hari`}</span>
          </div>
        ))}
      </div>

      {recommended.length > 0 && <>
        <h2 className="section__title" style={{ marginBottom: 8 }}>📖 Rekomendasi Khutbah Bulan Ini</h2>
        <p className="section__subtitle" style={{ marginBottom: 16 }}>
          Berdasarkan bulan {HIJRI_MONTHS[hijri.month - 1]}, berikut tema yang relevan:
          {' '}{themes.map(t => categories.find(c => c.id === t)?.label).filter(Boolean).join(', ')}
        </p>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {recommended.map(k => <KhutbahCard key={k.id} khutbah={k} compact />)}
        </div>
      </>}

      <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic', marginTop: 32, textAlign: 'center' }}>{HIJRI_DISCLAIMER}</p>
    </div>
  );
}
