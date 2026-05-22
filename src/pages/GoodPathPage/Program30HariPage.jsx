import React from 'react';
import { useSEO } from '../../utils/seo';
import { ChevronLeft, Compass, CalendarCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Program30HariPage() {
  const navigate = useNavigate();

  useSEO({
    title: '30 Hari Lebih Baik | Good Path',
    description: 'Program 30 hari untuk membangun kebiasaan islami yang konsisten.',
    path: '/good-path/program/30-hari'
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color, #f8fafc)', paddingBottom: '80px' }}>
      <header style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #4338ca 100%)', padding: '32px 20px', color: 'white', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', marginBottom: '24px' }}>
        <div className="container" style={{ position: 'relative' }}>
          <button 
            onClick={() => navigate('/good-path')}
            style={{ position: 'absolute', top: '-10px', left: 0, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ChevronLeft size={20} />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '24px 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarCheck size={24}/> 30 Hari Lebih Baik
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, margin: 0, lineHeight: 1.5 }}>
            Program terpadu untuk merestart kebiasaan baikmu.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Compass size={48} className="text-primary" style={{ margin: '0 auto 16px', color: 'var(--color-primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-color)' }}>Segera Hadir</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Program 30 Hari Lebih Baik sedang dalam tahap pengembangan. Nantikan fitur ini untuk membantu kamu istiqamah secara terpandu.
          </p>
          <button 
            onClick={() => navigate('/good-path')}
            style={{ background: 'var(--color-primary, #4338ca)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Kembali ke Good Path
          </button>
        </div>
      </main>
    </div>
  );
}
