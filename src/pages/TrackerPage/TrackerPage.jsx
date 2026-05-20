import { useState, useMemo, useCallback } from 'react';
import { useSEO } from '../../utils/seo';
import { Target, Footprints, Plus, Trash2, HeartPulse, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import './TrackerPage.css';

const IBADAH_LIST = [
  { id: 'subuh', label: 'Sholat Subuh', icon: '🌙', group: 'sholat' },
  { id: 'dzuhur', label: 'Sholat Dzuhur', icon: '☀️', group: 'sholat' },
  { id: 'ashar', label: 'Sholat Ashar', icon: '🌤️', group: 'sholat' },
  { id: 'maghrib', label: 'Sholat Maghrib', icon: '🌇', group: 'sholat' },
  { id: 'isya', label: 'Sholat Isya', icon: '🌃', group: 'sholat' },
  { id: 'dzikir_pagi', label: 'Dzikir Pagi', icon: '🌅', group: 'sunnah' },
  { id: 'dzikir_petang', label: 'Dzikir Petang', icon: '🌇', group: 'sunnah' },
  { id: 'tilawah', label: 'Tilawah', icon: '📖', group: 'sunnah' },
  { id: 'sedekah', label: 'Sedekah', icon: '💝', group: 'sunnah' },
];

const MOTIVATIONS = [
  "Jaga tubuh sebagai amanah.",
  "Mulai hari ini dengan langkah kecil yang baik.",
  "Langkah menuju kebaikan dimulai dari niat.",
  "Sehatkan badan, kuatkan ibadah.",
  "Kebiasaan baik tumbuh dari langkah kecil yang diulang."
];

function getDateKey(d = new Date()) {
  return d.toISOString().split('T')[0];
}

// Safely load JSON from localStorage
function safeLoad(key, defaultValue) {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
  } catch (e) {
    console.error(`Error loading ${key}`, e);
  }
  return defaultValue;
}

function safeSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key}`, e);
  }
}

export default function TrackerPage() {
  useSEO({
    title: 'Tracker Ibadah & Langkah Sehat | Islamediaku',
    description: 'Pantau rutinitas ibadah dan kebiasaan baik harianmu.',
    path: '/tracker'
  });

  const today = getDateKey();
  
  // States
  const [trackerData, setTrackerData] = useState(() => safeLoad('islamediaku_tracker_daily', {}));
  const [stepTarget, setStepTarget] = useState(() => safeLoad('islamediaku_steps_target', 5000));
  const [stepsData, setStepsData] = useState(() => safeLoad('islamediaku_steps_daily', {}));
  const [activityLog, setActivityLog] = useState(() => safeLoad('islamediaku_steps_activity_log', []));
  const [motivation] = useState(() => MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);

  // Activity Form States
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDuration, setActivityDuration] = useState('');

  // Daily Checklists
  const todayTracker = useMemo(() => trackerData[today] || {}, [trackerData, today]);
  const doneCount = IBADAH_LIST.filter(i => todayTracker[i.id]).length;
  const progressPct = Math.round((doneCount / IBADAH_LIST.length) * 100);

  const toggleIbadah = useCallback((id) => {
    setTrackerData(prev => {
      const next = { ...prev, [today]: { ...(prev[today] || {}), [id]: !(prev[today]?.[id]) } };
      safeSave('islamediaku_tracker_daily', next);
      return next;
    });
  }, [today]);

  let progressMessage = "Mulai dengan satu kebaikan.";
  if (doneCount > 0 && doneCount < IBADAH_LIST.length) progressMessage = "MasyaAllah, lanjutkan kebiasaan baik hari ini.";
  if (doneCount === IBADAH_LIST.length) progressMessage = "Alhamdulillah, semua rutinitas selesai!";

  // Steps
  const todaySteps = stepsData[today] || 0;
  const stepPct = Math.min(100, Math.round((todaySteps / stepTarget) * 100));

  let stepMessage = "Mulai dengan langkah kecil";
  if (stepPct >= 50 && stepPct < 100) stepMessage = "Sedikit lagi";
  if (stepPct >= 100) stepMessage = "Target tercapai";

  const addSteps = (amount) => {
    setStepsData(prev => {
      const current = prev[today] || 0;
      const next = { ...prev, [today]: Math.max(0, current + amount) };
      safeSave('islamediaku_steps_daily', next);
      return next;
    });
  };

  const updateTarget = () => {
    const newTarget = prompt('Masukkan target langkah harian:', stepTarget);
    if (newTarget !== null && !isNaN(newTarget) && parseInt(newTarget) > 0) {
      const parsed = parseInt(newTarget);
      setStepTarget(parsed);
      safeSave('islamediaku_steps_target', parsed);
    }
  };

  // Activity Log
  const addActivity = (e) => {
    e.preventDefault();
    if (!activityTitle.trim() || !activityDuration) return;
    
    const newLog = {
      id: Date.now().toString(),
      title: activityTitle,
      duration: parseInt(activityDuration),
      date: today,
      timestamp: new Date().toISOString()
    };
    
    setActivityLog(prev => {
      const next = [newLog, ...prev].slice(0, 50); // Keep last 50
      safeSave('islamediaku_steps_activity_log', next);
      return next;
    });
    setActivityTitle('');
    setActivityDuration('');
  };

  const deleteActivity = (id) => {
    setActivityLog(prev => {
      const next = prev.filter(log => log.id !== id);
      safeSave('islamediaku_steps_activity_log', next);
      return next;
    });
  };

  return (
    <div className="tracker-page">
      {/* Header */}
      <header className="tracker-header">
        <div className="container">
          <h1 className="tracker-header__title">Tracker Ibadah</h1>
          <p className="tracker-header__subtitle">Pantau rutinitas ibadah dan kebiasaan baik harianmu.</p>
        </div>
      </header>

      <main className="container tracker-main">
        {/* Progress Summary */}
        <section className="tracker-card tracker-progress">
          <div className="tracker-progress__info">
            <h2 className="tracker-card__title">Ibadah Hari Ini</h2>
            <p className="tracker-progress__msg">{progressMessage}</p>
            <div className="tracker-progress__stats">
              <span className="tracker-progress__count">{doneCount}</span>
              <span className="tracker-progress__total">/ {IBADAH_LIST.length} selesai</span>
            </div>
          </div>
          <div className="tracker-progress__ring">
            <svg viewBox="0 0 100 100">
              <circle className="tracker-progress__bg" cx="50" cy="50" r="40" />
              <circle className="tracker-progress__value" cx="50" cy="50" r="40" 
                      style={{ strokeDasharray: `${2 * Math.PI * 40}`, strokeDashoffset: `${(2 * Math.PI * 40) * (1 - progressPct / 100)}` }} />
            </svg>
            <div className="tracker-progress__pct">{progressPct}%</div>
          </div>
        </section>

        {/* Checklist */}
        <section className="tracker-list-section">
          <h3 className="tracker-section__title">Daftar Rutinitas</h3>
          <div className="tracker-list">
            {IBADAH_LIST.map(item => {
              const isDone = todayTracker[item.id];
              return (
                <button key={item.id} className={`tracker-item ${isDone ? 'tracker-item--done' : ''}`} onClick={() => toggleIbadah(item.id)}>
                  <div className="tracker-item__icon-wrap">
                    <span className="tracker-item__emoji">{item.icon}</span>
                  </div>
                  <span className="tracker-item__label">{item.label}</span>
                  <div className="tracker-item__check">
                    {isDone ? <CheckCircle2 className="icon-checked" size={24} /> : <Circle className="icon-unchecked" size={24} />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Langkah Sehat */}
        <section className="tracker-card langkah-sehat">
          <div className="langkah-sehat__header">
            <div>
              <h2 className="tracker-card__title flex items-center gap-2">
                <Footprints size={20} className="text-primary" />
                Langkah Sehat
              </h2>
              <p className="langkah-sehat__subtitle">{stepMessage}</p>
            </div>
            <button className="langkah-sehat__edit-target" onClick={updateTarget}>
              <Target size={14} /> Edit Target
            </button>
          </div>

          <div className="langkah-sehat__stats">
            <div className="langkah-sehat__count-box">
              <span className="langkah-sehat__count">{todaySteps.toLocaleString('id-ID')}</span>
              <span className="langkah-sehat__label">Langkah</span>
            </div>
            <div className="langkah-sehat__divider"></div>
            <div className="langkah-sehat__target-box">
              <span className="langkah-sehat__target">{stepTarget.toLocaleString('id-ID')}</span>
              <span className="langkah-sehat__label">Target</span>
            </div>
          </div>

          <div className="langkah-sehat__bar-wrap">
            <div className="langkah-sehat__bar">
              <div className="langkah-sehat__bar-fill" style={{ width: `${stepPct}%` }}></div>
            </div>
            <span className="langkah-sehat__bar-text">{stepPct}%</span>
          </div>

          <div className="langkah-sehat__actions">
            <button className="btn-step btn-step--add" onClick={() => addSteps(500)}>+500</button>
            <button className="btn-step btn-step--add" onClick={() => addSteps(1000)}>+1000</button>
            <button className="btn-step btn-step--reset" onClick={() => {
              if(window.confirm('Reset langkah hari ini?')) addSteps(-todaySteps);
            }}>Reset</button>
          </div>
          {/* TODO: Future Android native step sensor integration */}
          {/* TODO: Future Health Connect / Google Fit integration */}
        </section>

        {/* Activity Log */}
        <section className="tracker-card activity-log">
          <h3 className="tracker-card__title flex items-center gap-2 mb-4">
            <HeartPulse size={20} className="text-primary" />
            Catatan Aktivitas
          </h3>
          
          <form className="activity-form" onSubmit={addActivity}>
            <input type="text" placeholder="Misal: Jalan Pagi" value={activityTitle} onChange={e => setActivityTitle(e.target.value)} required className="activity-input" />
            <div className="activity-form__row">
              <input type="number" placeholder="Menit" value={activityDuration} onChange={e => setActivityDuration(e.target.value)} required min="1" className="activity-input activity-input--num" />
              <button type="submit" className="activity-btn-submit">
                <Plus size={18} /> Tambah
              </button>
            </div>
          </form>

          <div className="activity-list">
            {activityLog.length === 0 ? (
              <p className="activity-empty">Belum ada aktivitas yang dicatat.</p>
            ) : (
              activityLog.map(log => (
                <div key={log.id} className="activity-item">
                  <div className="activity-item__info">
                    <strong className="activity-item__title">{log.title}</strong>
                    <span className="activity-item__meta">{log.duration} menit • {log.date === today ? 'Hari ini' : log.date}</span>
                  </div>
                  <button className="activity-item__del" onClick={() => deleteActivity(log.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Motivation Card */}
        <section className="motivation-card">
          <Sparkles className="motivation-icon" size={24} />
          <p className="motivation-text">"{motivation}"</p>
        </section>

      </main>
    </div>
  );
}
