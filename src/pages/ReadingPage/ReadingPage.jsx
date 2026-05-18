import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { usePremium } from '../../context/PremiumContext';
import { FEATURES } from '../../config/premium';
import { useSEO, JsonLd, SITE_URL } from '../../utils/seo';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';
import { MUK_LENGKAP, MUK_KHUTBAH_2, DUA_PENUTUP, khutbahIntroTemplates, secondKhutbahIntroTemplates, closingDuaTemplates } from '../../data/parts/header.js';
import './ReadingPage.css';

// Simple string hashing for deterministic pseudo-randomness
const hashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
const getTemplate = (id, templates) => templates[Math.abs(hashCode(id.toString())) % templates.length];

export default function DetailPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { getKhutbahBySlug, getRelated, isBookmarked, toggleBookmark, addRecentlyViewed,
    fontSize, cycleFontSize, fontSizeOptions, copyText, shareWhatsApp, categories, types } = useApp();
  const { hasPremiumFeature } = usePremium();

  const k = getKhutbahBySlug(slug);
  const bm = k ? isBookmarked(k.id) : false;
  const related = k ? getRelated(k) : [];
  const cat = k && categories.find(c => c.id === k.category);
  const tp = k && types.find(t => t.id === k.type);

  // Dynamic SEO for detail page
  const typeLabel = tp ? tp.label : 'Khutbah';
  useSEO({
    title: k ? `${k.title} — ${typeLabel} | Islamediaku` : 'Khutbah Tidak Ditemukan | Islamediaku',
    description: k ? `${k.summary} Teks ${typeLabel.toLowerCase()} siap pakai lengkap dengan dalil Al-Qur'an dan hadis.` : 'Halaman khutbah tidak ditemukan.',
    path: k ? `/khutbah/${k.slug}` : '/khutbah',
    type: 'article',
  });

  const [barsHidden, setBarsHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastY = useRef(0);

  useEffect(() => { if (k) { addRecentlyViewed(k.id); window.scrollTo(0, 0); } }, [slug, k, addRecentlyViewed]);

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

  const handleDownloadPDF = () => {
    if (hasPremiumFeature(FEATURES.PDF_DOWNLOAD)) {
      alert("Memulai download PDF... (Fitur PDF Generator akan segera diimplementasikan)");
      window.print(); // As a fallback for now
    } else {
      if (window.confirm("Download PDF Khutbah adalah fitur Premium. Upgrade sekarang untuk mengunduh naskah ini?")) {
        nav('/premium');
      }
    }
  };

  if (!k) return (
    <div className="detail"><div className="detail__404">
      <p style={{fontSize:48}}>📖</p><p><strong>Khutbah tidak ditemukan</strong></p>
      <Link to="/khutbah" className="btn btn--primary">Kembali ke Katalog</Link>
    </div></div>
  );

  // Article JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: k.title,
    description: k.summary,
    url: `${SITE_URL}/khutbah/${k.slug}`,
    datePublished: k.createdAt,
    dateModified: k.createdAt,
    author: {
      '@type': 'Organization',
      name: 'Islamediaku Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Islamediaku',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/khutbah/${k.slug}`,
    },
    articleSection: cat ? cat.label : 'Khutbah Islam',
    inLanguage: 'id-ID',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Khutbah', item: `${SITE_URL}/khutbah` },
      { '@type': 'ListItem', position: 3, name: k.title, item: `${SITE_URL}/khutbah/${k.slug}` },
    ],
  };

  const fLabel = fontSizeOptions.find(o => o.value === fontSize)?.label || 'M';
  const fBadge = fontSize === 0.85 ? 'S' : fontSize === 1 ? 'M' : fontSize === 1.15 ? 'L' : 'XL';

  // Dynamic replacements
  const renderBlock = (b, i, section) => {
    const fs = { fontSize: `calc(var(--fs-base) * ${fontSize})` };
    const fsAr = { fontSize: `calc(var(--fs-2xl) * ${fontSize})` };
    
    let text = b.text;
    if (b.type === 'opening') {
      if (section === 1 && text === MUK_LENGKAP) text = getTemplate(k.id, khutbahIntroTemplates);
      if (section === 2 && text === MUK_KHUTBAH_2) text = getTemplate(k.id, secondKhutbahIntroTemplates);
    }

    switch (b.type) {
      case 'opening': return <div key={i} className="detail__opening" style={{ fontSize: `calc(var(--fs-xl) * ${fontSize})` }}>{text}</div>;
      case 'paragraph': return <p key={i} className="detail__p" style={fs}>{text}</p>;
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

  const currentDua = k.dua === DUA_PENUTUP ? getTemplate(k.id, closingDuaTemplates) : k.dua;

  const getAllText = () => {
    let t = k.title + '\n\n';
    k.firstKhutbah.forEach(b => {
      let text = b.text;
      if (b.type === 'opening' && text === MUK_LENGKAP) text = getTemplate(k.id, khutbahIntroTemplates);
      if (text) t += text + '\n\n';
      if (b.arabic) t += b.arabic + '\n';
      if (b.translation) t += b.translation + '\n\n';
    });
    k.secondKhutbah.forEach(b => {
      let text = b.text;
      if (b.type === 'opening' && text === MUK_KHUTBAH_2) text = getTemplate(k.id, secondKhutbahIntroTemplates);
      if (text) t += text + '\n\n';
      if (b.arabic) t += b.arabic + '\n';
      if (b.translation) t += b.translation + '\n\n';
    });
    if (currentDua) {
      t += "Marilah kita menundukkan kepala dan hati sejenak, berdoa kepada Allah subhanahu wa ta'ala, memohon ampunan, hidayah, dan pertolongan-Nya. Sebelumnya marilah kita bershalawat kepada Nabi Muhammad shallallahu 'alaihi wasallam sebagaimana perintah Allah:\n";
      t += "اِنَّ اللّٰهَ وَمَلٰۤىِٕكَتَهٗ يُصَلُّوْنَ عَلَى النَّبِيِّۗ يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوْا صَلُّوْا عَلَيْهِ وَسَلِّمُوْا تَسْلِيْمًا\n\n";
      t += currentDua + '\n';
    }
    return t;
  };

  return (
    <div className="detail">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

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
            <button className="detail__tool-btn" onClick={handleDownloadPDF} title="Download PDF">📄</button>
            <button className="detail__tool-btn" onClick={() => window.print()} title="Cetak">🖨</button>
            <Link to={`/mimbar?slug=${k.slug}`} className="detail__tool-btn" title="Mode Mimbar">🎤</Link>
          </div>
        </div>
      </header>

      <article className="detail__content">
        {/* Breadcrumb navigation */}
        <nav className="detail__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Beranda</Link>
          <span className="detail__breadcrumb-sep">›</span>
          <Link to="/khutbah">Khutbah</Link>
          {cat && <>
            <span className="detail__breadcrumb-sep">›</span>
            <Link to={`/khutbah?cat=${cat.id}`}>{cat.label}</Link>
          </>}
          <span className="detail__breadcrumb-sep">›</span>
          <span className="detail__breadcrumb-current">{k.title}</span>
        </nav>

        <div className="detail__header">
          <h1 className="detail__title" style={{fontSize:`calc(var(--fs-2xl) * ${fontSize})`}}>{k.title}</h1>
          <p className="detail__info">{k.summary}</p>
          <div className="detail__badges">
            {cat && <span className="badge badge--primary">{cat.label}</span>}
            {tp && <span className="badge badge--gold">{tp.label}</span>}
            <span className="badge" style={{background:'var(--color-bg-alt)'}}>⏱ {k.duration} menit</span>
            <span className="badge" style={{background:'var(--color-bg-alt)'}}>{k.occasion}</span>
            {k.contributorName && <span className="badge badge--primary">👤 Oleh: {k.contributorName}</span>}
          </div>
        </div>

        {k.firstKhutbah.length > 0 && <>
          <h2 className="detail__section-label">Khutbah Pertama</h2>
          <div className="detail__body">{k.firstKhutbah.map((b,i) => renderBlock(b, i, 1))}</div>
        </>}

        {k.secondKhutbah.length > 0 && <>
          <h2 className="detail__section-label">Khutbah Kedua</h2>
          <div className="detail__body">{k.secondKhutbah.map((b,i) => renderBlock(b, i, 2))}</div>
        </>}

        {currentDua && <>
          <h2 className="detail__section-label">Doa Penutup</h2>
          <div className="detail__body">
            <p className="detail__p" style={{ fontSize: `calc(var(--fs-base) * ${fontSize})` }}>Marilah kita menundukkan kepala dan hati sejenak, berdoa kepada Allah subhanahu wa ta'ala, memohon ampunan, hidayah, dan pertolongan-Nya. Sebelumnya marilah kita bershalawat kepada Nabi Muhammad shallallahu 'alaihi wasallam sebagaimana perintah Allah:</p>
            <div className="detail__quran">
              <p className="detail__quran-ar" style={{ fontSize: `calc(var(--fs-2xl) * ${fontSize})` }}>اِنَّ اللّٰهَ وَمَلٰۤىِٕكَتَهٗ يُصَلُّوْنَ عَلَى النَّبِيِّۗ يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوْا صَلُّوْا عَلَيْهِ وَسَلِّمُوْا تَسْلِيْمًا</p>
              <p className="detail__quran-tr" style={{ fontSize: `calc(var(--fs-base) * ${fontSize})` }}>"Sesungguhnya Allah dan para malaikat-Nya bershalawat untuk Nabi. Wahai orang-orang yang beriman! Bershalawatlah kamu untuk Nabi dan ucapkanlah salam dengan penuh penghormatan kepadanya."</p>
              <p className="detail__quran-ref">QS. Al-Ahzab: 56</p>
            </div>
          </div>
          <div className="detail__dua" style={{fontSize:`calc(var(--fs-xl) * ${fontSize})`}}>{currentDua}</div>
        </>}

        {k.references && k.references.length > 0 && (
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
