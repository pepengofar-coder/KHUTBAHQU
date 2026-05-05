import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import './ReadingPage.css';

export default function ReadingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { khutbahList, isBookmarked, toggleBookmark, fontSize, cycleFontSize, fontSizeOptions } = useApp();

  const khutbah = khutbahList.find(k => k.id === parseInt(id));
  const bookmarked = khutbah ? isBookmarked(khutbah.id) : false;

  // Scroll state for auto-hiding bars
  const [barsHidden, setBarsHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Update progress
        if (docHeight > 0) {
          setScrollProgress((currentScrollY / docHeight) * 100);
        }

        // Auto-hide bars when scrolling down past threshold
        if (currentScrollY > 120) {
          if (currentScrollY > lastScrollY.current + 10) {
            setBarsHidden(true);
          } else if (currentScrollY < lastScrollY.current - 10) {
            setBarsHidden(false);
          }
        } else {
          setBarsHidden(false);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.scrollTo(0, 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Get current font size label
  const currentFontLabel = fontSizeOptions.find(o => o.value === fontSize)?.label || 'Normal';

  if (!khutbah) {
    return (
      <div className="reading-page">
        <div className="reading-notfound">
          <div className="reading-notfound__icon">📖</div>
          <p className="reading-notfound__text">Khutbah tidak ditemukan</p>
          <button className="reading-notfound__back" onClick={() => navigate('/')}>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const { content } = khutbah;

  const renderBodyBlock = (block, index) => {
    const scaledStyle = {
      fontSize: `calc(var(--fs-base) * ${fontSize})`,
    };

    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className="reading-paragraph" style={scaledStyle}>
            {block.text}
          </p>
        );

      case 'quran':
        return (
          <div key={index} className="reading-quran">
            <p
              className="reading-quran__arabic"
              style={{ fontSize: `calc(var(--fs-2xl) * ${fontSize})` }}
            >
              {block.arabic}
            </p>
            <p className="reading-quran__translation" style={scaledStyle}>
              {block.translation}
            </p>
            <p className="reading-quran__reference">{block.reference}</p>
          </div>
        );

      case 'hadith':
        return (
          <div key={index} className="reading-hadith">
            <p
              className="reading-hadith__arabic"
              style={{ fontSize: `calc(var(--fs-xl) * ${fontSize})` }}
            >
              {block.arabic}
            </p>
            <p className="reading-hadith__translation" style={scaledStyle}>
              {block.translation}
            </p>
            <p className="reading-hadith__reference">{block.reference}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="reading-page">
      {/* Scroll progress */}
      <div
        className="reading-progress"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Top bar — auto-hides on scroll */}
      <header className={`reading-topbar${barsHidden ? ' hidden' : ''}`}>
        <div className="reading-topbar__inner">
          <button
            className="reading-topbar__back"
            onClick={() => navigate(-1)}
            id="btn-back"
          >
            <span className="reading-topbar__back-icon">‹</span>
            Kembali
          </button>

          <div className="reading-topbar__actions">
            <button
              className="reading-topbar__btn"
              onClick={cycleFontSize}
              aria-label={`Ubah ukuran font: ${currentFontLabel}`}
              title={`Ukuran: ${currentFontLabel}`}
              id="btn-font-size"
            >
              Aa
              <span className="reading-topbar__font-badge">
                {fontSize === 0.85 ? 'S' : fontSize === 1 ? 'M' : fontSize === 1.15 ? 'L' : 'XL'}
              </span>
            </button>

            <button
              className={`reading-topbar__btn${bookmarked ? ' bookmarked' : ''}`}
              onClick={() => toggleBookmark(khutbah.id)}
              aria-label={bookmarked ? 'Hapus bookmark' : 'Simpan bookmark'}
              id="btn-bookmark"
            >
              {bookmarked ? '🔖' : '🏷️'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="reading-content">
        {/* Header */}
        <div className="reading-header">
          <h1
            className="reading-header__title"
            style={{ fontSize: `calc(var(--fs-xl) * ${fontSize})` }}
          >
            {khutbah.title}
          </h1>
          <p className="reading-header__author">Oleh: {khutbah.author}</p>
          <p className="reading-header__source">Sumber: {khutbah.source}</p>
        </div>

        {/* Body */}
        <div className="reading-body">
          {/* Mukaddimah / Opening */}
          {content.opening && (
            <div
              className="reading-arabic-block"
              style={{ fontSize: `calc(var(--fs-xl) * ${fontSize})` }}
            >
              {content.opening}
            </div>
          )}

          {/* Content blocks */}
          {content.body.map((block, index) => renderBodyBlock(block, index))}

          {/* Closing */}
          {content.closing && (
            <div
              className="reading-arabic-block"
              style={{ fontSize: `calc(var(--fs-xl) * ${fontSize})` }}
            >
              {content.closing}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
