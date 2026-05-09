import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './MimbarMode.css';

export default function MimbarMode() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { getKhutbahBySlug, fontSize, cycleFontSize } = useApp();
  const slug = params.get('slug');
  const k = slug ? getKhutbahBySlug(slug) : null;

  const [dark, setDark] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [speed, setSpeed] = useState(1); // 1=slow 2=med 3=fast
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!autoScroll) return;
    const el = scrollRef.current;
    if (!el) return;
    const px = speed === 1 ? 0.5 : speed === 2 ? 1.2 : 2.5;
    const id = setInterval(() => { el.scrollTop += px; }, 30);
    return () => clearInterval(id);
  }, [autoScroll, speed]);

  if (!k) return (
    <div className="mimbar mimbar--light" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <p>Khutbah tidak ditemukan</p>
      <button className="btn btn--primary" onClick={() => nav('/khutbah')} style={{ marginTop: 16 }}>Kembali</button>
    </div>
  );

  const fs = fontSize * 1.3;
  const cls = `mimbar mimbar--${dark ? 'dark' : 'light'}`;

  const renderBlock = (b, i) => {
    switch (b.type) {
      case 'opening': return <div key={i} className="mimbar__opening" style={{ fontSize: `calc(var(--fs-xl) * ${fs})` }}>{b.text}</div>;
      case 'paragraph': return <p key={i} className="mimbar__p" style={{ fontSize: `calc(var(--fs-md) * ${fs})` }}>{b.text}</p>;
      case 'quran': return (
        <div key={i} className="mimbar__quran">
          <p className="mimbar__quran-ar" style={{ fontSize: `calc(var(--fs-2xl) * ${fs})` }}>{b.arabic}</p>
          <p style={{ fontStyle: 'italic', fontSize: `calc(var(--fs-base) * ${fs})`, opacity: .8 }}>{b.translation}</p>
          <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginTop: 8, opacity: .6 }}>{b.ref}</p>
        </div>);
      case 'hadith': return (
        <div key={i} className="mimbar__hadith">
          <p className="mimbar__hadith-ar" style={{ fontSize: `calc(var(--fs-xl) * ${fs})` }}>{b.arabic}</p>
          <p style={{ fontStyle: 'italic', fontSize: `calc(var(--fs-base) * ${fs})`, opacity: .8 }}>{b.translation}</p>
          <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginTop: 8, opacity: .6 }}>{b.ref}</p>
        </div>);
      default: return null;
    }
  };

  return (
    <div className={cls} ref={scrollRef}>
      <div className="mimbar__topbar">
        <button onClick={() => nav(-1)} title="Keluar">✕</button>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={cycleFontSize} title="Ukuran font">Aa</button>
          <button onClick={() => setDark(p => !p)} title="Toggle gelap/terang">{dark ? '☀️' : '🌙'}</button>
          <button onClick={() => setAutoScroll(p => !p)} title="Auto scroll" style={{ opacity: autoScroll ? 1 : .4 }}>▼</button>
          {autoScroll && <button onClick={() => setSpeed(p => p >= 3 ? 1 : p + 1)} title={`Kecepatan ${speed}x`}>{speed}x</button>}
        </div>
      </div>
      <div className="mimbar__content">
        <h1 className="mimbar__title" style={{ fontSize: `calc(var(--fs-3xl) * ${fs * 0.8})` }}>{k.title}</h1>
        {k.firstKhutbah.length > 0 && <>
          <p className="mimbar__label">Khutbah Pertama</p>
          {k.firstKhutbah.map(renderBlock)}
        </>}
        {k.secondKhutbah.length > 0 && <>
          <p className="mimbar__label">Khutbah Kedua</p>
          {k.secondKhutbah.map(renderBlock)}
        </>}
        {k.dua && <>
          <p className="mimbar__label">Doa</p>
          <p className="mimbar__p" style={{ fontSize: `calc(var(--fs-md) * ${fs})` }}>Marilah kita menundukkan kepala dan hati sejenak, berdoa kepada Allah subhanahu wa ta'ala, memohon ampunan, hidayah, dan pertolongan-Nya. Sebelumnya marilah kita bershalawat kepada Nabi Muhammad shallallahu 'alaihi wasallam sebagaimana perintah Allah:</p>
          <div className="mimbar__quran">
            <p className="mimbar__quran-ar" style={{ fontSize: `calc(var(--fs-2xl) * ${fs})` }}>اِنَّ اللّٰهَ وَمَلٰۤىِٕكَتَهٗ يُصَلُّوْنَ عَلَى النَّبِيِّۗ يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوْا صَلُّوْا عَلَيْهِ وَسَلِّمُوْا تَسْلِيْمًا</p>
            <p style={{ fontStyle: 'italic', fontSize: `calc(var(--fs-base) * ${fs})`, opacity: .8 }}>"Sesungguhnya Allah dan para malaikat-Nya bershalawat untuk Nabi. Wahai orang-orang yang beriman! Bershalawatlah kamu untuk Nabi dan ucapkanlah salam dengan penuh penghormatan kepadanya."</p>
            <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginTop: 8, opacity: .6 }}>QS. Al-Ahzab: 56</p>
          </div>
          <div className="mimbar__opening" style={{ fontSize: `calc(var(--fs-xl) * ${fs})`, marginTop: '1.5rem' }}>{k.dua}</div>
        </>}
      </div>
    </div>
  );
}
