import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useSEO } from '../../utils/seo';
import { DOA_CATEGORIES, DOA_DZIKIR_DATA } from '../../data/doaDzikir';
import VariedFeatureCard from '../../components/VariedFeatureCard/VariedFeatureCard';
import { Sun, Moon, BookOpen, RotateCcw, ChevronDown, ChevronUp, CheckCircle2, Circle, Eye, EyeOff } from 'lucide-react';
import './DoaDzikirPage.css';

const CATEGORY_COLORS = {
  pagi: 'blue',
  petang: 'lavender',
  harian: 'mint',
  tidur: 'cyan',
  masjid: 'gold',
  rezeki: 'lime',
  ilmu: 'cream',
  perlindungan: 'rose',
};

const MATSURAT_CATS = ['pagi', 'petang'];
const STORAGE_PROGRESS = 'imk_dzikir_progress';
const STORAGE_COUNTS = 'imk_dzikir_counts';
const STORAGE_LAST_READ = 'imk_dzikir_lastread';
const STORAGE_SHOW_LATIN = 'imk_dzikir_latin';
const STORAGE_SHOW_TRANS = 'imk_dzikir_trans';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}

export default function DoaDzikirPage() {
  useSEO({
    title: "Doa & Dzikir — Al-Ma'tsurat Sughro, Dzikir Pagi Petang | Islamediaku",
    description: "Baca Al-Ma'tsurat Sughro lengkap: dzikir pagi setelah Subuh dan dzikir petang setelah Ashar. Dengan counter, progress tracking, dan tampilan nyaman.",
    path: '/doa-dzikir'
  });

  const [activeCat, setActiveCat] = useState('pagi');
  const isMatsurat = MATSURAT_CATS.includes(activeCat);

  // Progress state (per day + per category)
  const sessionKey = getToday() + '_' + activeCat;
  const [completed, setCompleted] = useState(() => loadJSON(STORAGE_PROGRESS, {}));
  const [counts, setCounts] = useState(() => loadJSON(STORAGE_COUNTS, {}));
  const [lastRead, setLastRead] = useState(() => loadJSON(STORAGE_LAST_READ, {}));

  // UI toggles
  const [showLatin, setShowLatin] = useState(() => localStorage.getItem(STORAGE_SHOW_LATIN) !== '0');
  const [showTrans, setShowTrans] = useState(() => localStorage.getItem(STORAGE_SHOW_TRANS) !== '0');
  const [expandedCard, setExpandedCard] = useState(null);

  // Refs for scroll
  const cardRefs = useRef({});
  const listRef = useRef(null);
  const hasScrolled = useRef(false);

  // Items for active category
  const items = useMemo(() => DOA_DZIKIR_DATA.filter(d => d.category === activeCat), [activeCat]);
  const doneToday = useMemo(() => completed[sessionKey] || {}, [completed, sessionKey]);
  const countsToday = counts[sessionKey] || {};
  const doneCount = Object.values(doneToday).filter(Boolean).length;
  const totalItems = items.length;
  const progress = totalItems > 0 ? Math.round((doneCount / totalItems) * 100) : 0;

  // Persist progress
  useEffect(() => { localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(completed)); }, [completed]);
  useEffect(() => { localStorage.setItem(STORAGE_COUNTS, JSON.stringify(counts)); }, [counts]);
  useEffect(() => { localStorage.setItem(STORAGE_LAST_READ, JSON.stringify(lastRead)); }, [lastRead]);
  useEffect(() => { localStorage.setItem(STORAGE_SHOW_LATIN, showLatin ? '1' : '0'); }, [showLatin]);
  useEffect(() => { localStorage.setItem(STORAGE_SHOW_TRANS, showTrans ? '1' : '0'); }, [showTrans]);

  // Scroll to last read on category change
  useEffect(() => {
    hasScrolled.current = false;
  }, [activeCat]);

  useEffect(() => {
    if (!isMatsurat || hasScrolled.current) return;
    const lastId = lastRead[activeCat];
    if (lastId && cardRefs.current[lastId]) {
      setTimeout(() => {
        cardRefs.current[lastId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      hasScrolled.current = true;
    }
  }, [activeCat, isMatsurat, lastRead]);

  // Toggle done
  const toggleDone = useCallback((id) => {
    setCompleted(prev => {
      const s = prev[sessionKey] || {};
      return { ...prev, [sessionKey]: { ...s, [id]: !s[id] } };
    });
    setLastRead(prev => ({ ...prev, [activeCat]: id }));
  }, [sessionKey, activeCat]);

  // Increment counter
  const increment = useCallback((id, max) => {
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(15);

    setCounts(prev => {
      const s = prev[sessionKey] || {};
      const cur = (s[id] || 0) + 1;
      const clamped = Math.min(cur, max);
      return { ...prev, [sessionKey]: { ...s, [id]: clamped } };
    });

    // Auto-complete when counter reaches max
    setCounts(prev => {
      const s = prev[sessionKey] || {};
      const cur = s[id] || 0;
      if (cur >= max) {
        setCompleted(p => {
          const ps = p[sessionKey] || {};
          return { ...p, [sessionKey]: { ...ps, [id]: true } };
        });
      }
      return prev;
    });

    setLastRead(prev => ({ ...prev, [activeCat]: id }));
  }, [sessionKey, activeCat]);

  // Reset counter for single item
  const resetItemCounter = useCallback((id) => {
    setCounts(prev => {
      const s = prev[sessionKey] || {};
      return { ...prev, [sessionKey]: { ...s, [id]: 0 } };
    });
    setCompleted(prev => {
      const s = prev[sessionKey] || {};
      return { ...prev, [sessionKey]: { ...s, [id]: false } };
    });
  }, [sessionKey]);

  // Reset all progress for current category
  const resetProgress = useCallback(() => {
    setCompleted(prev => ({ ...prev, [sessionKey]: {} }));
    setCounts(prev => ({ ...prev, [sessionKey]: {} }));
  }, [sessionKey]);

  // Scroll to continue reading
  const scrollToLastRead = useCallback(() => {
    const lastId = lastRead[activeCat];
    // Find first undone item
    const firstUndone = items.find(d => !doneToday[d.id]);
    const targetId = firstUndone?.id || lastId;
    if (targetId && cardRefs.current[targetId]) {
      cardRefs.current[targetId].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeCat, lastRead, items, doneToday]);

  const isPagi = activeCat === 'pagi';

  return (
    <div className="doa-page container">

      {/* Category Cards Grid */}
      <div className="doa-cats-grid">
        {DOA_CATEGORIES.map(c => {
          const itemCount = DOA_DZIKIR_DATA.filter(d => d.category === c.id).length;
          return (
            <VariedFeatureCard
              key={c.id}
              title={c.label}
              subtitle={`${itemCount} Bacaan`}
              icon={c.icon}
              colorVariant={CATEGORY_COLORS[c.id] || 'blue'}
              active={activeCat === c.id}
              onClick={() => setActiveCat(c.id)}
              layoutVariant="grid-card"
            />
          );
        })}
      </div>

      {/* Al-Ma'tsurat Summary Card */}
      {isMatsurat && (
        <div className={`matsurat-hero ${isPagi ? 'matsurat-hero--pagi' : 'matsurat-hero--petang'}`}>
          <div className="matsurat-hero__badge">
            {isPagi ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isPagi ? 'Pagi' : 'Petang'}</span>
          </div>

          <h1 className="matsurat-hero__title">Al-Ma'tsurat Sughro</h1>
          <p className="matsurat-hero__timing">
            {isPagi ? 'Dibaca setelah sholat Subuh' : 'Dibaca setelah sholat Ashar'}
          </p>

          {/* Version selector */}
          <div className="matsurat-version">
            <button className="matsurat-version__btn active">Sughro</button>
            <button className="matsurat-version__btn disabled" disabled>
              Kubro <span className="matsurat-version__soon">Segera</span>
            </button>
          </div>

          {/* Progress */}
          <div className="matsurat-hero__progress">
            <div className="matsurat-hero__progress-bar">
              <div className="matsurat-hero__progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="matsurat-hero__progress-info">
              <span>{doneCount}/{totalItems} bacaan</span>
              <span className="matsurat-hero__pct">{progress}%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="matsurat-hero__actions">
            <button className="matsurat-hero__continue" onClick={scrollToLastRead}>
              <BookOpen size={16} />
              {doneCount > 0 ? 'Lanjutkan Bacaan' : 'Mulai Membaca'}
            </button>
            {doneCount > 0 && (
              <button className="matsurat-hero__reset" onClick={resetProgress}>
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toggles for Ma'tsurat */}
      {isMatsurat && (
        <div className="matsurat-toggles">
          <button
            className={`matsurat-toggle ${showLatin ? 'active' : ''}`}
            onClick={() => setShowLatin(p => !p)}
          >
            {showLatin ? <Eye size={14} /> : <EyeOff size={14} />}
            Latin
          </button>
          <button
            className={`matsurat-toggle ${showTrans ? 'active' : ''}`}
            onClick={() => setShowTrans(p => !p)}
          >
            {showTrans ? <Eye size={14} /> : <EyeOff size={14} />}
            Terjemahan
          </button>
        </div>
      )}

      {/* Non-matsurat header */}
      {!isMatsurat && (
        <div className="doa-page__header">
          <h1 className="doa-page__title">
            {DOA_CATEGORIES.find(c => c.id === activeCat)?.label || 'Doa & Dzikir'}
          </h1>
          <p className="doa-page__sub">Koleksi doa dari Hishnul Muslim</p>
        </div>
      )}

      {/* Progress for non-matsurat */}
      {!isMatsurat && items.length > 0 && (
        <div className="doa-progress">
          <div className="doa-progress__bar">
            <div className="doa-progress__fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="doa-progress__text">{doneCount}/{totalItems} selesai</span>
        </div>
      )}

      {/* Cards */}
      <div className="doa-list" ref={listRef}>
        {items.map((d, i) => {
          const isDone = doneToday[d.id];
          const count = countsToday[d.id] || 0;
          const hasLatin = d.latin && d.latin.trim();
          const hasTrans = d.translation && d.translation.trim();
          const isExpanded = expandedCard === d.id;

          return (
            <div
              key={d.id}
              ref={el => cardRefs.current[d.id] = el}
              className={`doa-card${isDone ? ' doa-card--done' : ''}${isMatsurat ? ' doa-card--matsurat' : ''}`}
              style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
            >
              {/* Card header */}
              <div className="doa-card__top">
                <span className="doa-card__num">{i + 1}</span>
                <h3 className="doa-card__title">{d.title}</h3>
                {d.repetition > 1 && (
                  <span className="doa-card__rep-badge">{d.repetition}×</span>
                )}
                <button
                  className={`doa-card__check${isDone ? ' checked' : ''}`}
                  onClick={() => toggleDone(d.id)}
                  aria-label="Tandai selesai"
                >
                  {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
              </div>

              {/* Arabic text */}
              <div
                className={`doa-card__arabic ${isMatsurat ? 'doa-card__arabic--large' : ''}`}
                onClick={() => isMatsurat && setExpandedCard(isExpanded ? null : d.id)}
              >
                {d.arabic}
              </div>

              {/* Expand toggle for long cards */}
              {isMatsurat && d.arabic.length > 200 && (
                <button
                  className="doa-card__expand"
                  onClick={() => setExpandedCard(isExpanded ? null : d.id)}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {isExpanded ? 'Tutup' : 'Lihat selengkapnya'}
                </button>
              )}

              {/* Latin */}
              {hasLatin && showLatin && (
                <p className="doa-card__latin">{d.latin}</p>
              )}

              {/* Translation */}
              {hasTrans && showTrans && (
                <p className="doa-card__translation">{d.translation}</p>
              )}

              {/* Footer */}
              <div className="doa-card__footer">
                <span className="doa-card__source">📚 {d.source}</span>

                {/* Counter */}
                {d.repetition > 1 && (
                  <div className="doa-card__counter">
                    <button
                      className={`doa-card__counter-btn ${count >= d.repetition ? 'complete' : ''}`}
                      onClick={() => count < d.repetition && increment(d.id, d.repetition)}
                      disabled={count >= d.repetition}
                    >
                      <svg className="doa-card__counter-ring" width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.15" />
                        <circle
                          cx="20" cy="20" r="17"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${(count / d.repetition) * 106.8} 106.8`}
                          strokeLinecap="round"
                          transform="rotate(-90 20 20)"
                          className="doa-card__counter-progress"
                        />
                      </svg>
                      <span className="doa-card__counter-text">{count}</span>
                    </button>
                    {count > 0 && count < d.repetition && (
                      <button className="doa-card__counter-reset" onClick={() => resetItemCounter(d.id)} aria-label="Reset">
                        <RotateCcw size={12} />
                      </button>
                    )}
                  </div>
                )}

                {d.repetition === 1 && !isDone && (
                  <span className="doa-card__rep">1×</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="doa-disclaimer">
        <p>⚠️ Konten dzikir bersumber dari Al-Ma'tsurat Sughro & Hishnul Muslim.</p>
        <p>Verifikasi oleh ustaz/editor dianjurkan sebelum dijadikan rujukan resmi.</p>
      </div>
    </div>
  );
}
