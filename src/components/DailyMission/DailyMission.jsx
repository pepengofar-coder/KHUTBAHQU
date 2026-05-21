import { Link } from 'react-router-dom';
import useDailyMission from '../../hooks/useDailyMission';
import { Target, Check, ChevronRight, BookOpen, Sparkles } from 'lucide-react';
import './DailyMission.css';

export default function DailyMission() {
  const {
    missions,
    toggleMission,
    completedCount,
    totalCount,
    progressPercent,
    allCompleted,
    motivationMessage,
  } = useDailyMission();

  return (
    <section className="dm-section container">
      <div className={`dm-card${allCompleted ? ' dm-card--complete' : ''}`}>
        {/* ─── Header ─── */}
        <div className="dm-header">
          <div className="dm-header__left">
            <div className="dm-header__icon-wrap">
              <Target size={18} />
            </div>
            <div>
              <h2 className="dm-header__title">Misi Ibadah Hari Ini</h2>
              <p className="dm-header__motivation">{motivationMessage}</p>
            </div>
          </div>
          <div className="dm-header__progress-badge">
            <span className="dm-header__count">{completedCount}</span>
            <span className="dm-header__sep">/</span>
            <span className="dm-header__total">{totalCount}</span>
          </div>
        </div>

        {/* ─── Progress Bar ─── */}
        <div className="dm-progress">
          <div className="dm-progress__track">
            <div
              className="dm-progress__fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="dm-progress__pct">{progressPercent}%</span>
        </div>

        {/* ─── Mission List ─── */}
        <div className="dm-list">
          {missions.map(m => (
            <label
              key={m.id}
              className={`dm-item${m.done ? ' dm-item--done' : ''}`}
            >
              <div className="dm-item__left">
                <div className="dm-item__checkbox-wrap">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={m.done}
                    onChange={() => toggleMission(m.id)}
                    aria-label={m.label}
                  />
                  <div className="dm-item__checkbox">
                    {m.done && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
                <span className="dm-item__icon">{m.icon}</span>
                <div className="dm-item__text">
                  <span className="dm-item__label">{m.label}</span>
                  {m.subtitle && (
                    <span className="dm-item__subtitle">{m.subtitle}</span>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* ─── Actions ─── */}
        <div className="dm-actions">
          <Link to="/tracker" className="dm-actions__primary">
            <Target size={14} />
            Buka Tracker
            <ChevronRight size={14} />
          </Link>
          <div className="dm-actions__secondary">
            <Link to="/doa-dzikir" className="dm-actions__pill">
              <Sparkles size={13} />
              Dzikir
            </Link>
            <Link to="/mushaf" className="dm-actions__pill">
              <BookOpen size={13} />
              Mushaf
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
