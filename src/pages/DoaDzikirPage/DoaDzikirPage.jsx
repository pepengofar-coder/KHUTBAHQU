import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import { DOA_CATEGORIES, DOA_DZIKIR_DATA } from '../../data/doaDzikir';
import { DZIKIR_PAGI_PETANG_DATA } from '../../data/dzikirPagiPetang';
import VariedFeatureCard from '../../components/VariedFeatureCard/VariedFeatureCard';
import { Sun, Moon, BookOpen, RotateCcw, ChevronDown, ChevronUp, CheckCircle2, Circle, Copy, Check, ChevronLeft } from 'lucide-react';
import './DoaDzikirPage.css';

const CATEGORY_COLORS = {
  pagi: 'blue',
  petang: 'lavender',
  'setelah-shalat': 'emerald',
  harian: 'mint',
  tidur: 'cyan',
  masjid: 'gold',
  rezeki: 'lime',
  ilmu: 'cream',
  perlindungan: 'rose',
};

// Local storage keys for Tracker sync
const STORAGE_DZIKIR_PAGI = 'islamediaku_dzikir_pagi_progress';
const STORAGE_DZIKIR_PETANG = 'islamediaku_dzikir_petang_progress';
const STORAGE_DZIKIR_DATE = 'islamediaku_dzikir_daily_date';

function getToday() {
  return new Date().toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' });
}

function safeJsonParse(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export default function DoaDzikirPage() {
  useSEO({
    title: "Kumpulan Doa & Dzikir Harian Lengkap - Islamediaku",
    description: "Kumpulan doa harian, dzikir pagi petang, dan wirid setelah sholat lengkap dengan terjemahan di Islamediaku.",
    path: '/doa-dzikir'
  });

  const [activeCat, setActiveCat] = useState('pagi');
  const isDzikirPP = activeCat === 'pagi' || activeCat === 'petang';
  
  // Dzikir PP Sub Tab: 'pagi', 'petang', or 'semua'
  const [subTab, setSubTab] = useState(activeCat);
  useEffect(() => {
    if (activeCat === 'pagi' || activeCat === 'petang') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubTab(activeCat);
    }
  }, [activeCat]);

  // Date check for daily reset
  useEffect(() => {
    const storedDate = localStorage.getItem(STORAGE_DZIKIR_DATE);
    const today = getToday();
    if (storedDate !== today) {
      localStorage.setItem(STORAGE_DZIKIR_PAGI, JSON.stringify({ completed: {}, counts: {} }));
      localStorage.setItem(STORAGE_DZIKIR_PETANG, JSON.stringify({ completed: {}, counts: {} }));
      localStorage.setItem(STORAGE_DZIKIR_DATE, today);
    }
  }, []);

  // Load state
  const [progressDataPagi, setProgressDataPagi] = useState(() => safeJsonParse(STORAGE_DZIKIR_PAGI, { completed: {}, counts: {} }));
  const [progressDataPetang, setProgressDataPetang] = useState(() => safeJsonParse(STORAGE_DZIKIR_PETANG, { completed: {}, counts: {} }));

  // Non-Dzikir PP State (Doa Harian dll)
  const [completedOther, setCompletedOther] = useState(() => safeJsonParse('imk_doa_other_progress', {}));

  const [copiedId, setCopiedId] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const cardRefs = useRef({});

  // Get current working data
  const currentProgress = subTab === 'petang' ? progressDataPetang : progressDataPagi;
  const setProgress = subTab === 'petang' ? setProgressDataPetang : setProgressDataPagi;
  const storageKey = subTab === 'petang' ? STORAGE_DZIKIR_PETANG : STORAGE_DZIKIR_PAGI;

  // Persist currentProgress
  useEffect(() => {
    if (isDzikirPP && subTab !== 'semua') {
      localStorage.setItem(storageKey, JSON.stringify(currentProgress));
    }
  }, [currentProgress, storageKey, isDzikirPP, subTab]);

  // Persist other
  useEffect(() => {
    localStorage.setItem('imk_doa_other_progress', JSON.stringify(completedOther));
  }, [completedOther]);

  // Filter Dzikir PP Items
  const itemsPP = useMemo(() => {
    if (subTab === 'semua') return DZIKIR_PAGI_PETANG_DATA;
    return DZIKIR_PAGI_PETANG_DATA.filter(d => d.section === subTab || d.section === 'pagi_petang');
  }, [subTab]);

  // Filter Other Doa
  const itemsOther = useMemo(() => DOA_DZIKIR_DATA.filter(d => d.category === activeCat), [activeCat]);

  // Derived Progress
  const completedPPCount = itemsPP.filter(d => currentProgress.completed[d.id]).length;
  const totalPPCount = itemsPP.length;
  const progressPct = totalPPCount > 0 ? Math.round((completedPPCount / totalPPCount) * 100) : 0;

  // Toggle done for PP
  const toggleDonePP = useCallback((id, maxCount) => {
    if (subTab === 'semua') return; // Read-only mode for 'semua'
    
    if (navigator.vibrate) navigator.vibrate(15);
    
    setProgress(prev => {
      const isDone = !prev.completed[id];
      return {
        ...prev,
        completed: { ...prev.completed, [id]: isDone },
        counts: { ...prev.counts, [id]: isDone ? maxCount : 0 }
      };
    });
  }, [setProgress, subTab]);

  // Increment counter for PP
  const incrementPP = useCallback((id, max) => {
    if (subTab === 'semua') return;
    if (navigator.vibrate) navigator.vibrate(15);

    setProgress(prev => {
      const cur = (prev.counts[id] || 0) + 1;
      const clamped = Math.min(cur, max);
      const isDone = clamped >= max;
      
      return {
        ...prev,
        counts: { ...prev.counts, [id]: clamped },
        completed: { ...prev.completed, [id]: isDone }
      };
    });
  }, [setProgress, subTab]);

  const resetProgressPP = useCallback(() => {
    if (subTab === 'semua') return;
    if (window.confirm(`Reset progress Dzikir ${subTab === 'pagi' ? 'Pagi' : 'Petang'} hari ini?`)) {
      setProgress({ completed: {}, counts: {} });
    }
  }, [setProgress, subTab]);

  // Sync with Tracker when 100% completed
  useEffect(() => {
    if (subTab !== 'semua' && totalPPCount > 0 && completedPPCount === totalPPCount) {
      try {
        const d = new Date();
        const offset = d.getTimezoneOffset();
        const localD = new Date(d.getTime() - (offset * 60 * 1000));
        const todayStr = localD.toISOString().split('T')[0];

        const trackerData = safeJsonParse('islamediaku_tracker_daily', {});
        const trackerKey = subTab === 'pagi' ? 'dzikir_pagi' : 'dzikir_petang';
        
        if (!trackerData[todayStr] || !trackerData[todayStr][trackerKey]) {
          const nextTracker = {
            ...trackerData,
            [todayStr]: {
              ...(trackerData[todayStr] || {}),
              [trackerKey]: true
            }
          };
          localStorage.setItem('islamediaku_tracker_daily', JSON.stringify(nextTracker));
        }
      } catch (e) {
        console.error('Failed to sync tracker', e);
      }
    }
  }, [completedPPCount, totalPPCount, subTab]);

  // Copy handler
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="doa-page container">
      {/* Top Header */}
      <div className="doa-page__header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button className="page-back-btn" onClick={handleBack} aria-label="Kembali">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Doa & Dzikir Harian</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Kumpulan doa shahih & dzikir pagi petang terverifikasi</p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="doa-cats-grid">
        {DOA_CATEGORIES.map(c => {
          // Adjust count display
          let itemCount;
          if (c.id === 'pagi') itemCount = DZIKIR_PAGI_PETANG_DATA.filter(d => d.section === 'pagi' || d.section === 'pagi_petang').length;
          else if (c.id === 'petang') itemCount = DZIKIR_PAGI_PETANG_DATA.filter(d => d.section === 'petang' || d.section === 'pagi_petang').length;
          else itemCount = DOA_DZIKIR_DATA.filter(d => d.category === c.id).length;

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

      {isDzikirPP ? (
        <div className="dzikir-pp-section">
          {/* Header & Tabs */}
          <div className="dzikir-pp-header">
            <h1 className="dzikir-pp-title">Dzikir Pagi & Petang</h1>
            <p className="dzikir-pp-timing">
              Pagi: Setelah Subuh hingga terbit matahari.<br />
              Petang: Setelah Ashar hingga terbenam matahari.
            </p>

            <div className="dzikir-pp-tabs">
              <button 
                className={`dzikir-pp-tab ${subTab === 'pagi' ? 'active' : ''}`}
                onClick={() => setSubTab('pagi')}
              >
                <Sun size={16} /> Pagi
              </button>
              <button 
                className={`dzikir-pp-tab ${subTab === 'petang' ? 'active' : ''}`}
                onClick={() => setSubTab('petang')}
              >
                <Moon size={16} /> Petang
              </button>
              <button 
                className={`dzikir-pp-tab ${subTab === 'semua' ? 'active' : ''}`}
                onClick={() => setSubTab('semua')}
              >
                <BookOpen size={16} /> Semua
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          {subTab !== 'semua' && (
            <div className="dzikir-pp-progress-card">
              <div className="dzikir-pp-progress-info">
                <div>
                  <h3>Progress {subTab === 'pagi' ? 'Pagi' : 'Petang'}</h3>
                  <p>{completedPPCount} dari {totalPPCount} selesai</p>
                </div>
                <span className="dzikir-pp-pct">{progressPct}%</span>
              </div>
              <div className="dzikir-pp-progress-bar">
                <div className="dzikir-pp-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              {completedPPCount > 0 && (
                <button className="dzikir-pp-reset-btn" onClick={resetProgressPP}>
                  <RotateCcw size={14} /> Reset Hari Ini
                </button>
              )}
            </div>
          )}

          {/* Dzikir List */}
          <div className="doa-list">
            {itemsPP.map((d, i) => {
              const isDone = subTab === 'semua' ? false : currentProgress.completed[d.id];
              const count = subTab === 'semua' ? 0 : (currentProgress.counts[d.id] || 0);
              const isExpanded = expandedCard === d.id;

              return (
                <div 
                  key={d.id} 
                  ref={el => cardRefs.current[d.id] = el}
                  className={`doa-card doa-card--matsurat ${isDone ? 'doa-card--done' : ''}`}
                  style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
                >
                  <div className="doa-card__top">
                    <span className="doa-card__num">{i + 1}</span>
                    <h3 className="doa-card__title">{d.title}</h3>
                    
                    <div className="doa-card__badges">
                      <span className="doa-card__badge-timing">{d.timing}</span>
                      <span className="doa-card__badge-count">{d.countText}</span>
                    </div>
                  </div>

                  <div className="doa-card__arabic doa-card__arabic--large">
                    {d.arabic}
                  </div>

                  {d.translation && (
                    <div className={`doa-card__translation-wrapper ${isExpanded ? 'expanded' : ''}`}>
                      <p className="doa-card__translation">{d.translation}</p>
                      {d.translation.length > 150 && (
                        <button 
                          className="doa-card__expand" 
                          onClick={() => setExpandedCard(isExpanded ? null : d.id)}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          {isExpanded ? 'Tutup terjemahan' : 'Baca terjemahan'}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="doa-card__footer dzikir-pp-footer">
                    <span className="doa-card__reference">📚 {d.reference}</span>
                    
                    <div className="dzikir-pp-actions">
                      <button 
                        className="dzikir-pp-action-btn"
                        onClick={() => handleCopy(`${d.arabic}\n\nArtinya:\n${d.translation}`, d.id)}
                        aria-label="Copy"
                      >
                        {copiedId === d.id ? <Check size={16} /> : <Copy size={16} />}
                      </button>

                      {subTab !== 'semua' && (
                        <div className="dzikir-pp-interactive">
                          {d.count > 1 ? (
                            <button 
                              className={`dzikir-pp-counter-btn ${count >= d.count ? 'done' : ''}`}
                              onClick={() => incrementPP(d.id, d.count)}
                              disabled={count >= d.count}
                            >
                              {count >= d.count ? <CheckCircle2 size={18} /> : count} / {d.count}
                            </button>
                          ) : (
                            <button 
                              className={`dzikir-pp-check-btn ${isDone ? 'done' : ''}`}
                              onClick={() => toggleDonePP(d.id, d.count)}
                            >
                              {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                              <span>{isDone ? 'Selesai' : 'Tandai'}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Source Attribution Card */}
          <div className="dzikir-pp-source-card">
            <h4>Sumber Referensi:</h4>
            <p><strong>Almanhaj</strong> - Dzikir Pagi Dan Petang</p>
            <p>Oleh Al-Ustadz Yazid bin ‘Abdul Qadir Jawas</p>
            <a href="https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html" target="_blank" rel="noopener noreferrer">
              Lihat artikel asli di almanhaj.or.id
            </a>
          </div>
        </div>
      ) : (
        /* Legacy Doa Harian UI (Non-Dzikir PP) */
        <div className="doa-other-section">
          <div className="doa-page__header">
            <h1 className="doa-page__title">
              {DOA_CATEGORIES.find(c => c.id === activeCat)?.label || 'Doa Harian'}
            </h1>
            <p className="doa-page__sub">Koleksi doa dari Hishnul Muslim</p>
          </div>

          <div className="doa-list">
            {itemsOther.map((d, i) => {
              const isDone = completedOther[d.id];
              return (
                <div key={d.id} className={`doa-card ${isDone ? 'doa-card--done' : ''}`}>
                  <div className="doa-card__top">
                    <span className="doa-card__num">{i + 1}</span>
                    <h3 className="doa-card__title">{d.title}</h3>
                    <button
                      className={`doa-card__check ${isDone ? 'checked' : ''}`}
                      onClick={() => setCompletedOther(p => ({ ...p, [d.id]: !p[d.id] }))}
                    >
                      {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                  </div>
                  <div className="doa-card__arabic">{d.arabic}</div>
                  {d.latin && <p className="doa-card__latin">{d.latin}</p>}
                  {d.translation && <p className="doa-card__translation">{d.translation}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail Informasi Fitur (SEO & User Info) */}
      <section className="feature-info-section">
        <div className="feature-info-card">
          <h2>Kumpulan Doa & Dzikir Pagi Petang Sesuai Sunnah</h2>
          <p>Tingkatkan kualitas ibadah harian Anda dengan membaca dzikir pagi dan petang secara teratur, dilengkapi fitur counter interaktif dan progress tracker harian.</p>
          <div className="feature-benefits-list">
            <div className="feature-benefit-item">
              <span className="benefit-icon">🤲</span>
              <div>
                <h4>Doa Harian Terlengkap</h4>
                <p>Akses berbagai pilihan doa sehari-hari dari Hishnul Muslim untuk setiap aktivitas Anda.</p>
              </div>
            </div>
            <div className="feature-benefit-item">
              <span className="benefit-icon">🌅</span>
              <div>
                <h4>Dzikir Pagi & Petang</h4>
                <p>Panduan dzikir pagi dan petang terstruktur sesuai sunnah dengan penghitung ketukan jari.</p>
              </div>
            </div>
            <div className="feature-benefit-item">
              <span className="benefit-icon">✍️</span>
              <div>
                <h4>Transliterasi & Terjemahan</h4>
                <p>Dilengkapi teks arab yang jelas, tulisan latin, dan terjemahan Indonesia untuk memahami makna.</p>
              </div>
            </div>
          </div>
          <div className="feature-info-ctas">
            <Link to="/tasbih" className="btn btn--primary">Hitung Dzikir dengan Tasbih</Link>
            <Link to="/" className="btn btn--outline">Kembali ke Beranda</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
