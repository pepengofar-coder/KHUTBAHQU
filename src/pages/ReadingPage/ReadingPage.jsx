import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';
import './ReadingPage.css';

export default function DetailPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { getKhutbahBySlug, getRelated, isBookmarked, toggleBookmark, addRecentlyViewed,
    fontSize, cycleFontSize, fontSizeOptions, copyText, shareWhatsApp, categories, types } = useApp();

  const k = getKhutbahBySlug(slug);
  const bm = k ? isBookmarked(k.id) : false;
  const related = k ? getRelated(k) : [];
  const cat = k && categories.find(c => c.id === k.category);
  const tp = k && types.find(t => t.id === k.type);

  const [barsHidden, setBarsHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastY = useRef(0);

  useEffect(() => { if (k) { addRecentlyViewed(k.id); window.scrollTo(0, 0); } }, [slug]);

  const onScroll = useCallback(() => {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0) setProgress((y / h) * 100);
      if (y > 120) setBarsHidden(y > lastY.current + 10 ? true : y < lastY.current - 10 ? false : barsHidden);
      else setBarsHidden(false);
      lastY.current = y;
    });
  }, [barsHidden]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  if (!k) return (
    <div className="detail"><div className="detail__404">
      <p style={{fontSize:48}}>📖</p><p><strong>Khutbah tidak ditemukan</strong></p>
      <Link to="/khutbah" className="btn btn--primary">Kembali ke Katalog</Link>
    </div></div>
  );

  const fLabel = fontSizeOptions.find(o => o.value === fontSize)?.label || 'M';
  const fBadge = fontSize === 0.85 ? 'S' : fontSize === 1 ? 'M' : fontSize === 1.15 ? 'L' : 'XL';

  const renderBlock = (b, i) => {
    const fs = { fontSize: `calc(var(--fs-base) * ${fontSize})` };
    const fsAr = { fontSize: `calc(var(--fs-2xl) * ${fontSize})` };
    switch (b.type) {
      case 'opening': return <div key={i} className="detail__opening" style={{ fontSize: `calc(var(--fs-xl) * ${fontSize})` }}>{b.text}</div>;
      case 'paragraph': return <p key={i} className="detail__p" style={fs}>{b.text}</p>;
      case 'quran': return (
        <div key={i} className="detail__quran">
          <p className="detail__quran-ar" style={fsAr}>{b.arabic}</p>
          <p className="detail__quran-tr" style={fs}>{b.translation}</p>
          <p className="detail__quran-ref">{b.ref}</p>
        </div>);
      case 'hadith': return (
        <div key={i} className="detail__hadith">
          <p className="detail__hadith-ar" style={{ fontSize: `calc(var(--fs-xl) * ${fontSize})` }}>{b.arabic}</p>
          <p className="detail__hadith-tr" style={fs}>{b.translation}</p>
          <p className="detail__hadith-ref">{b.ref}</p>
        </div>);
      default: return null;
    }
  };

  const getAllText = () => {
    let t = k.title + '\n\n';
    [...k.firstKhutbah, ...k.secondKhutbah].forEach(b => {
      if (b.text) t += b.text + '\n\n';
      if (b.arabic) t += b.arabic + '\n';
      if (b.translation) t += b.translation + '\n\n';
    });
    if (k.dua) t += k.dua + '\n';
    return t;
  };

  return (
    <div className="detail">
      <div className="detail__progress" style={{ width: `${progress}%` }} />
      <header className={`detail__topbar${barsHidden ? ' hidden' : ''}`}>
        <div className="detail__topbar-inner">
          <button className="detail__back" onClick={() => nav(-1)}>‹ Kembali</button>
          <div className="detail__toolbar">
            <button className="detail__tool-btn" onClick={cycleFontSize} title={`Font: ${fLabel}`}>
              Aa<span className="detail__tool-badge">{fBadge}</span>
            </button>
            <button className={`detail__tool-btn${bm?' active':''}`} onClick={() => toggleBookmark(k.id)}>{bm?'★':'☆'}</button>
            <button className="detail__tool-btn" onClick={() => copyText(getAllText())} title="Salin teks">📋</button>
            <button className="detail__tool-btn" onClick={() => shareWhatsApp(k)} title="Bagikan">💬</button>
            <button className="detail__tool-btn" onClick={() => window.print()} title="Cetak">🖨</button>
            <Link to={`/mimbar?slug=${k.slug}`} className="detail__tool-btn" title="Mode Mimbar">🎤</Link>
          </div>
        </div>
      </header>

      <article className="detail__content">
        <div className="detail__header">
          <h1 className="detail__title" style={{fontSize:`calc(var(--fs-2xl) * ${fontSize})`}}>{k.title}</h1>
          <p className="detail__info">{k.summary}</p>
          <div className="detail__badges">
            {cat && <span className="badge badge--primary">{cat.icon} {cat.label}</span>}
            {tp && <span className="badge badge--gold">{tp.label}</span>}
            <span className="badge" style={{background:'var(--color-bg-alt)'}}>⏱ {k.duration} menit</span>
            <span className="badge" style={{background:'var(--color-bg-alt)'}}>{k.occasion}</span>
          </div>
        </div>

        {k.firstKhutbah.length > 0 && <>
          <h2 className="detail__section-label">Khutbah Pertama</h2>
          <div className="detail__body">{k.firstKhutbah.map(renderBlock)}</div>
        </>}

        {k.secondKhutbah.length > 0 && <>
          <h2 className="detail__section-label">Khutbah Kedua</h2>
          <div className="detail__body">{k.secondKhutbah.map(renderBlock)}</div>
        </>}

        {k.dua && <>
          <h2 className="detail__section-label">Doa Penutup</h2>
          <div className="detail__dua" style={{fontSize:`calc(var(--fs-xl) * ${fontSize})`}}>{k.dua}</div>
        </>}

        {k.references.length > 0 && (
          <div className="detail__refs" style={{marginTop:'var(--sp-6)'}}>
            <h3>📚 Referensi</h3>
            <ul>{k.references.map((r, i) => <li key={i}>• {r}</li>)}</ul>
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="detail__related container">
          <h2 className="section__title">📖 Khutbah Terkait</h2>
          <div className="detail__related-grid" style={{marginTop:'var(--sp-4)'}}>
            {related.map(r => <KhutbahCard key={r.id} khutbah={r} compact />)}
          </div>
        </section>
      )}
    </div>
  );
}
