import { useState, useEffect, useCallback } from 'react';
import { useSEO } from '../../utils/seo';
import './TasbihPage.css';

const PRESETS = [33, 99, 1000];

export default function TasbihPage() {
  useSEO({ title: 'Tasbih Digital — Counter Dzikir | KhutbahQu', description: 'Tasbih digital untuk menghitung dzikir Anda. Target 33, 99, atau custom. Simpan progress otomatis.', path: '/tasbih' });

  const [count, setCount] = useState(() => {
    try { return parseInt(localStorage.getItem('kq_tasbih_count') || '0'); } catch { return 0; }
  });
  const [target, setTarget] = useState(() => {
    try { return parseInt(localStorage.getItem('kq_tasbih_target') || '33'); } catch { return 33; }
  });
  const [customTarget, setCustomTarget] = useState('');
  const [pulse, setPulse] = useState(false);

  useEffect(() => { localStorage.setItem('kq_tasbih_count', count); }, [count]);
  useEffect(() => { localStorage.setItem('kq_tasbih_target', target); }, [target]);

  const tap = useCallback(() => {
    setCount(c => c + 1);
    setPulse(true);
    setTimeout(() => setPulse(false), 200);
    if (navigator.vibrate) navigator.vibrate(15);
  }, []);

  const reset = () => { if (window.confirm('Reset counter?')) setCount(0); };
  const progress = target > 0 ? Math.min((count / target) * 100, 100) : 0;
  const completed = count >= target && target > 0;

  return (
    <div className="tasbih-page container">
      <div className="tasbih-page__header">
        <h1 className="tasbih-page__title">Tasbih Digital</h1>
      </div>

      {/* Presets */}
      <div className="tasbih-presets">
        {PRESETS.map(p => (
          <button key={p} className={`tasbih-preset${target === p ? ' active' : ''}`} onClick={() => { setTarget(p); setCount(0); }}>
            {p}×
          </button>
        ))}
        <div className="tasbih-custom">
          <input type="number" placeholder="Custom" value={customTarget} onChange={e => setCustomTarget(e.target.value)} className="tasbih-custom__input" min="1" />
          <button className="tasbih-custom__btn" onClick={() => { const v = parseInt(customTarget); if (v > 0) { setTarget(v); setCount(0); setCustomTarget(''); } }}>Set</button>
        </div>
      </div>

      {/* Counter */}
      <div className="tasbih-counter">
        <svg className="tasbih-ring" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="var(--color-border-light)" strokeWidth="6" />
          <circle cx="100" cy="100" r="90" fill="none" stroke="var(--color-primary)" strokeWidth="6" strokeDasharray={`${2 * Math.PI * 90}`} strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`} strokeLinecap="round" transform="rotate(-90 100 100)" style={{ transition: 'stroke-dashoffset .4s var(--ease-spring)' }} />
        </svg>
        <button className={`tasbih-tap${pulse ? ' pulse' : ''}${completed ? ' done' : ''}`} onClick={tap} aria-label="Tap untuk menghitung">
          <span className="tasbih-tap__count">{count}</span>
          <span className="tasbih-tap__target">/ {target}</span>
        </button>
      </div>

      {completed && <div className="tasbih-complete">🎉 Alhamdulillah, target tercapai!</div>}

      {/* Controls */}
      <div className="tasbih-controls">
        <button className="tasbih-ctrl" onClick={() => setCount(c => Math.max(0, c - 1))}>−1</button>
        <button className="tasbih-ctrl tasbih-ctrl--reset" onClick={reset}>Reset</button>
      </div>

      <p className="tasbih-tip">Tap lingkaran besar untuk menghitung. Progress tersimpan otomatis.</p>
    </div>
  );
}
