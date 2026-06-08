import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Check, ChevronRight, BookOpen, Sparkles, Trophy, Quote, Clock, Heart } from 'lucide-react';
import { getDailyProgress, updateDailyMission, updateTrackerItem, TRACKER_ITEMS } from '../../utils/dailyProgress';
import useDailyMission from '../../hooks/useDailyMission';
import './SpiritualJourney.css';

const TIPS = [
  "Sholat tepat waktu adalah amalan yang paling dicintai oleh Allah SWT.",
  "Dzikir pagi & petang adalah benteng kokoh seorang muslim dari segala keburukan.",
  "Bacalah Al-Qur'an, sesungguhnya ia akan menjadi penolong di hari kiamat.",
  "Sedekah tidak akan mengurangi harta, melainkan menambah keberkahannya.",
  "Senyum manis di hadapan saudaramu adalah bernilai sedekah.",
  "Menuntut ilmu agama akan memudahkan jalan kita menuju surga-Nya."
];

export default function SpiritualJourney() {
  const {
    missions,
    toggleMission,
    completedCount: completedMissions,
    totalCount: totalMissions
  } = useDailyMission();

  // Local state for tracker progress
  const [data, setData] = useState(() => getDailyProgress());
  const [activeTab, setActiveTab] = useState('missions'); // 'missions' or 'tracker'
  const [tipIndex, setTipIndex] = useState(0);

  // Sync state if localStorage changes
  useEffect(() => {
    const handleUpdate = () => {
      setData(getDailyProgress());
    };
    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);

  const todayTracker = data.tracker || {};
  const completedTracker = useMemo(() => {
    return TRACKER_ITEMS.filter(i => todayTracker[i.id]).length;
  }, [todayTracker]);

  const totalTracker = TRACKER_ITEMS.length;

  // Calculate master progress percent
  const totalCombined = totalMissions + totalTracker;
  const completedCombined = completedMissions + completedTracker;
  const progressPercent = totalCombined > 0 ? Math.round((completedCombined / totalCombined) * 100) : 0;

  // Level Badge depending on progress
  const levelBadge = useMemo(() => {
    if (progressPercent === 100) return { title: 'Ahli Ibadah Hari Ini ✨', class: 'badge--gold' };
    if (progressPercent >= 75) return { title: 'Pencari Ridha Allah', class: 'badge--teal' };
    if (progressPercent >= 50) return { title: 'Pejuang Istiqamah', class: 'badge--blue' };
    if (progressPercent >= 25) return { title: 'Penempuh Jalan Baik', class: 'badge--indigo' };
    return { title: 'Musafir Pemula', class: 'badge--slate' };
  }, [progressPercent]);

  // Handle local tracker toggles
  const handleToggleTracker = useCallback((id) => {
    const next = updateTrackerItem(id, getDailyProgress());
    setData(next);
    // Dispatch event to update other observers
    window.dispatchEvent(new Event('storage'));
  }, []);

  const handleToggleMissionItem = useCallback((id) => {
    toggleMission(id);
    // Refresh local progress data since toggleMission updates localStorage
    setTimeout(() => {
      setData(getDailyProgress());
    }, 50);
  }, [toggleMission]);

  // Tips carousel auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="sj-section container">
      <div className="sj-card">
        {/* Glow Effects */}
        <div className="sj-card__glow-1" />
        <div className="sj-card__glow-2" />

        {/* ─── Header: Master Stats & Badges ─── */}
        <div className="sj-header">
          <div className="sj-header__title-wrap">
            <div className="sj-header__icon-box">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="sj-header__title">Perjalanan Spiritual</h2>
              <span className={`sj-header__badge ${levelBadge.class}`}>{levelBadge.title}</span>
            </div>
          </div>

          <div className="sj-header__score-box">
            <div className="sj-header__score-item">
              <span className="sj-header__score-num">{completedCombined}</span>
              <span className="sj-header__score-label">/{totalCombined} Goal</span>
            </div>
          </div>
        </div>

        {/* ─── Unified Progress Bar ─── */}
        <div className="sj-progress">
          <div className="sj-progress__track">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="sj-progress__fill"
            />
          </div>
          <span className="sj-progress__pct">{progressPercent}%</span>
        </div>

        {/* ─── Inner Subtabs: Missions vs Tracker Checklist ─── */}
        <div className="sj-tabs">
          <button
            className={`sj-tab-btn ${activeTab === 'missions' ? 'active' : ''}`}
            onClick={() => setActiveTab('missions')}
          >
            <Target size={14} /> Misi Hari Ini ({completedMissions}/{totalMissions})
          </button>
          <button
            className={`sj-tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracker')}
          >
            <Clock size={14} /> Checklist Ibadah ({completedTracker}/{totalTracker})
          </button>
        </div>

        {/* ─── Tabs Content ─── */}
        <div className="sj-content">
          <AnimatePresence mode="wait">
            {activeTab === 'missions' ? (
              <motion.div
                key="missions-content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="sj-list"
              >
                {missions.map(m => (
                  <label key={m.id} className={`sj-item ${m.done ? 'sj-item--done' : ''}`}>
                    <div className="sj-item__left">
                      <div className="sj-item__checkbox-wrap">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={m.done}
                          onChange={() => handleToggleMissionItem(m.id)}
                          aria-label={m.label}
                        />
                        <div className="sj-item__checkbox">
                          {m.done && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                      <span className="sj-item__emoji">{m.icon}</span>
                      <div className="sj-item__text">
                        <span className="sj-item__label">{m.label}</span>
                        {m.subtitle && <span className="sj-item__sub">{m.subtitle}</span>}
                      </div>
                    </div>
                  </label>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="tracker-content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="sj-grid"
              >
                {TRACKER_ITEMS.map(item => {
                  const isDone = !!todayTracker[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggleTracker(item.id)}
                      className={`sj-grid-item ${isDone ? 'active' : ''}`}
                    >
                      <span className="sj-grid-item__icon">{item.icon}</span>
                      <span className="sj-grid-item__label">{item.label}</span>
                      <div className="sj-grid-item__dot">
                        {isDone && <Check size={10} strokeWidth={3.5} />}
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Islamic Tips Carousel ─── */}
        <div className="sj-carousel">
          <div className="sj-carousel__icon">
            <Quote size={14} />
          </div>
          <div className="sj-carousel__content">
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="sj-carousel__text"
              >
                {TIPS[tipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="sj-carousel__dots">
            {TIPS.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setTipIndex(idx)}
                className={`sj-carousel__dot ${idx === tipIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* ─── Footer Action Shortcuts ─── */}
        <div className="sj-footer">
          <Link to="/tracker" className="sj-footer__link">
            Tracker Detail <ChevronRight size={14} />
          </Link>
          <div className="sj-footer__divider" />
          <Link to="/good-path" className="sj-footer__link">
            Good Path <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
