import { useState, useCallback } from 'react';
import { useSEO } from '../../utils/seo';
import { DOA_CATEGORIES, DOA_DZIKIR_DATA } from '../../data/doaDzikir';
import './DoaDzikirPage.css';

export default function DoaDzikirPage() {
  useSEO({ title: 'Doa & Dzikir Harian — Dzikir Pagi, Petang, dan Doa Islam | Islamediaku', description: 'Koleksi dzikir pagi, dzikir petang, doa harian, doa tidur, doa masjid, dan doa Islam lainnya dari Hishnul Muslim. Lengkap dengan teks Arab, latin, terjemahan, dan sumber.', path: '/doa-dzikir' });

  const [activeCat, setActiveCat] = useState('pagi');
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kq_dzikir_done') || '{}'); } catch { return {}; }
  });
  const [counts, setCounts] = useState({});

  const items = DOA_DZIKIR_DATA.filter(d => d.category === activeCat);
  const cat = DOA_CATEGORIES.find(c => c.id === activeCat);
  const sessionKey = new Date().toISOString().split('T')[0] + '_' + activeCat;

  const toggleDone = useCallback((id) => {
    setCompleted(prev => {
      const next = { ...prev, [sessionKey]: { ...(prev[sessionKey] || {}), [id]: !(prev[sessionKey]?.[id]) } };
      localStorage.setItem('kq_dzikir_done', JSON.stringify(next));
      return next;
    });
  }, [sessionKey]);

  const increment = useCallback((id, max) => {
    setCounts(prev => {
      const cur = (prev[id] || 0) + 1;
      return { ...prev, [id]: Math.min(cur, max) };
    });
  }, []);

  const doneToday = completed[sessionKey] || {};
  const totalItems = items.length;
  const doneCount = Object.values(doneToday).filter(Boolean).length;
  const progress = totalItems > 0 ? Math.round((doneCount / totalItems) * 100) : 0;

  return (
    <div className="doa-page container">
      <div className="doa-page__header">
        <h1 className="doa-page__title">Doa & Dzikir</h1>
        <p className="doa-page__sub">Koleksi doa dan dzikir harian dari Hishnul Muslim</p>
      </div>

      {/* Category Filter */}
      <div className="doa-cats">
        {DOA_CATEGORIES.map(c => (
          <button key={c.id} className={`doa-cats__btn${activeCat === c.id ? ' active' : ''}`} onClick={() => setActiveCat(c.id)}>
            <span className="doa-cats__icon">{c.icon}</span>
            <span className="doa-cats__label">{c.label}</span>
          </button>
        ))}
      </div>

      {/* Progress */}
      {(activeCat === 'pagi' || activeCat === 'petang') && (
        <div className="doa-progress">
          <div className="doa-progress__bar">
            <div className="doa-progress__fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="doa-progress__text">{doneCount}/{totalItems} selesai</span>
        </div>
      )}

      {/* Cards */}
      <div className="doa-list">
        {items.map((d, i) => {
          const isDone = doneToday[d.id];
          const count = counts[d.id] || 0;
          return (
            <div key={d.id} className={`doa-card${isDone ? ' doa-card--done' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="doa-card__top">
                <span className="doa-card__num">{i + 1}</span>
                <h3 className="doa-card__title">{d.title}</h3>
                <button className={`doa-card__check${isDone ? ' checked' : ''}`} onClick={() => toggleDone(d.id)} aria-label="Tandai selesai">
                  {isDone ? '✓' : '○'}
                </button>
              </div>
              <div className="doa-card__arabic">{d.arabic}</div>
              {d.latin && <p className="doa-card__latin">{d.latin}</p>}
              <p className="doa-card__translation">{d.translation}</p>
              <div className="doa-card__footer">
                <span className="doa-card__source">📚 {d.source}</span>
                {d.repetition > 1 && (
                  <div className="doa-card__counter">
                    <button className="doa-card__counter-btn" onClick={() => increment(d.id, d.repetition)}>
                      {count}/{d.repetition}×
                    </button>
                  </div>
                )}
                {d.repetition === 1 && <span className="doa-card__rep">1×</span>}
              </div>
            </div>
          );
        })}
      </div>

      <p className="doa-disclaimer">
        ⚠️ Teks doa dan dzikir bersumber dari Hishnul Muslim oleh Sa'id bin Ali bin Wahf Al-Qahthani.
        Verifikasi lebih lanjut oleh ustaz/editor dianjurkan sebelum dijadikan rujukan resmi.
      </p>
    </div>
  );
}
