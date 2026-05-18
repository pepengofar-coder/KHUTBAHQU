import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSEO } from '../../utils/seo';
import './TrackerPage.css';

const IBADAH_LIST = [
  { id: 'subuh', label: 'Sholat Subuh', icon: '🌙', group: 'sholat' },
  { id: 'dzuhur', label: 'Sholat Dzuhur', icon: '☀️', group: 'sholat' },
  { id: 'ashar', label: 'Sholat Ashar', icon: '🌤️', group: 'sholat' },
  { id: 'maghrib', label: 'Sholat Maghrib', icon: '🌇', group: 'sholat' },
  { id: 'isya', label: 'Sholat Isya', icon: '🌃', group: 'sholat' },
  { id: 'tilawah', label: 'Tilawah Al-Qur\'an', icon: '📖', group: 'ibadah' },
  { id: 'dzikir_pagi', label: 'Dzikir Pagi', icon: '🌅', group: 'ibadah' },
  { id: 'dzikir_petang', label: 'Dzikir Petang', icon: '🌇', group: 'ibadah' },
  { id: 'sedekah', label: 'Sedekah', icon: '💝', group: 'amal' },
  { id: 'puasa', label: 'Puasa Sunnah', icon: '🍽️', group: 'amal' },
];

function getDateKey(d = new Date()) {
  return d.toISOString().split('T')[0];
}

function loadTracker() {
  try { return JSON.parse(localStorage.getItem('kq_tracker') || '{}'); } catch { return {}; }
}
function saveTracker(data) { localStorage.setItem('kq_tracker', JSON.stringify(data)); }

export default function TrackerPage() {
  useSEO({ title: 'Tracker Ibadah Harian — Checklist Sholat & Amal | KhutbahQu', description: 'Pantau ibadah harian Anda: sholat 5 waktu, tilawah, dzikir pagi petang, sedekah, dan puasa sunnah. Dengan streak harian.', path: '/tracker' });

  const today = getDateKey();
  const [data, setData] = useState(loadTracker);

  const todayData = useMemo(() => data[today] || {}, [data, today]);
  const doneCount = IBADAH_LIST.filter(i => todayData[i.id]).length;
  const progress = Math.round((doneCount / IBADAH_LIST.length) * 100);

  // Streak calculation
  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    while (true) {
      const key = getDateKey(d);
      const dayData = data[key] || {};
      const dayDone = IBADAH_LIST.filter(i => dayData[i.id]).length;
      if (dayDone >= 5) { count++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return count;
  }, [data]);

  const toggle = useCallback((id) => {
    setData(prev => {
      const next = { ...prev, [today]: { ...(prev[today] || {}), [id]: !(prev[today]?.[id]) } };
      saveTracker(next);
      return next;
    });
  }, [today]);

  // Past 7 days mini calendar
  const past7 = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = getDateKey(d);
      const dayData = data[key] || {};
      const done = IBADAH_LIST.filter(it => dayData[it.id]).length;
      days.push({ key, label: d.toLocaleDateString('id-ID', { weekday: 'short' }), day: d.getDate(), done, total: IBADAH_LIST.length, isToday: i === 0 });
    }
    return days;
  }, [data]);

  return (
    <div className="tracker-page container">
      <div className="tracker-page__header">
        <h1 className="tracker-page__title">Tracker Ibadah</h1>
        <p className="tracker-page__date">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Stats Row */}
      <div className="tracker-stats">
        <div className="tracker-stat">
          <div className="tracker-stat__value">{doneCount}/{IBADAH_LIST.length}</div>
          <div className="tracker-stat__label">Hari Ini</div>
        </div>
        <div className="tracker-stat">
          <div className="tracker-stat__ring">
            <svg viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="var(--color-border-light)" strokeWidth="5"/>
              <circle cx="30" cy="30" r="26" fill="none" stroke="var(--color-primary)" strokeWidth="5" strokeDasharray={`${2*Math.PI*26}`} strokeDashoffset={`${2*Math.PI*26*(1-progress/100)}`} strokeLinecap="round" transform="rotate(-90 30 30)" style={{transition:'stroke-dashoffset .5s var(--ease-spring)'}}/>
            </svg>
            <span className="tracker-stat__pct">{progress}%</span>
          </div>
        </div>
        <div className="tracker-stat">
          <div className="tracker-stat__value">🔥 {streak}</div>
          <div className="tracker-stat__label">Streak</div>
        </div>
      </div>

      {/* 7 Day Calendar */}
      <div className="tracker-week">
        {past7.map(d => (
          <div key={d.key} className={`tracker-day${d.isToday ? ' tracker-day--today' : ''}${d.done === d.total ? ' tracker-day--complete' : ''}`}>
            <span className="tracker-day__label">{d.label}</span>
            <span className="tracker-day__num">{d.day}</span>
            <div className="tracker-day__dots">
              {d.done > 0 && <span className="tracker-day__dot" style={{ opacity: Math.max(0.3, d.done / d.total) }} />}
            </div>
          </div>
        ))}
      </div>

      {/* Checklist */}
      <div className="tracker-list">
        <h2 className="tracker-group__title">🕌 Sholat Wajib</h2>
        {IBADAH_LIST.filter(i => i.group === 'sholat').map(item => (
          <button key={item.id} className={`tracker-item${todayData[item.id] ? ' tracker-item--done' : ''}`} onClick={() => toggle(item.id)}>
            <span className="tracker-item__icon">{item.icon}</span>
            <span className="tracker-item__label">{item.label}</span>
            <span className={`tracker-item__check${todayData[item.id] ? ' checked' : ''}`}>
              {todayData[item.id] ? '✓' : ''}
            </span>
          </button>
        ))}

        <h2 className="tracker-group__title">📿 Ibadah Sunnah</h2>
        {IBADAH_LIST.filter(i => i.group === 'ibadah').map(item => (
          <button key={item.id} className={`tracker-item${todayData[item.id] ? ' tracker-item--done' : ''}`} onClick={() => toggle(item.id)}>
            <span className="tracker-item__icon">{item.icon}</span>
            <span className="tracker-item__label">{item.label}</span>
            <span className={`tracker-item__check${todayData[item.id] ? ' checked' : ''}`}>
              {todayData[item.id] ? '✓' : ''}
            </span>
          </button>
        ))}

        <h2 className="tracker-group__title">💝 Amal Kebaikan</h2>
        {IBADAH_LIST.filter(i => i.group === 'amal').map(item => (
          <button key={item.id} className={`tracker-item${todayData[item.id] ? ' tracker-item--done' : ''}`} onClick={() => toggle(item.id)}>
            <span className="tracker-item__icon">{item.icon}</span>
            <span className="tracker-item__label">{item.label}</span>
            <span className={`tracker-item__check${todayData[item.id] ? ' checked' : ''}`}>
              {todayData[item.id] ? '✓' : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
