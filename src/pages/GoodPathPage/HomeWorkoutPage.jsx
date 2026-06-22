import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import {
  SAFETY_DISCLAIMER, CATEGORIES, WEEKLY_PLAN,
  WORKOUT_PROGRAMS, EXERCISES, buildWorkoutFlow,
  getWorkoutProgress, saveWorkoutCompletion, getWorkoutFavorites, toggleWorkoutFavorite,
  getLastWorkout, saveLastWorkout, clearLastWorkout
} from '../../data/homeWorkoutData';
import {
  ChevronLeft, Play, Pause, RotateCcw, Heart, Clock, Flame, Target,
  CheckCircle2, Circle, AlertTriangle, ChevronRight, SkipForward, Trophy, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './HomeWorkoutPage.css';

export default function HomeWorkoutPage() {
  useSEO({
    title: 'Home Workout — Olahraga di Rumah | Islamediaku',
    description: 'Latihan terstruktur dari pemanasan, latihan inti, hingga pendinginan yang bisa dilakukan di rumah.',
    path: '/good-path/home-workout'
  });

  const navigate = useNavigate();

  // Filters
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');

  // UI States
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('countdown');
  const timerRef = useRef(null);

  // Favorites & Progress
  const [favorites, setFavorites] = useState(getWorkoutFavorites);
  const [progress, setProgress] = useState(getWorkoutProgress);
  const [lastWorkout, setLastWorkout] = useState(getLastWorkout);

  // Build workout flow
  const workoutFlow = useMemo(() => {
    if (!selectedProgram) return [];
    return buildWorkoutFlow(selectedProgram);
  }, [selectedProgram]);

  const currentStep = workoutFlow[currentStepIndex] || null;

  // Filtered programs
  const filteredPrograms = useMemo(() => {
    return WORKOUT_PROGRAMS.filter(p => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (activeDifficulty !== 'all' && p.difficulty !== activeDifficulty) return false;
      return true;
    });
  }, [activeCategory, activeDifficulty]);

  // Weekly progress dots
  const weekProgress = useMemo(() => {
    const today = new Date();
    const dots = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const done = progress.some(p => p.date === dateStr);
      dots.push({ date: dateStr, done, dayName: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()] });
    }
    return dots;
  }, [progress]);

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (timerMode === 'countdown') {
            if (prev <= 1) { setTimerRunning(false); return 0; }
            return prev - 1;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerMode]);

  const startTimer = useCallback((seconds) => {
    setTimerSeconds(seconds || 0);
    setTimerMode(seconds ? 'countdown' : 'stopwatch');
    setTimerRunning(true);
  }, []);

  const pauseTimer = useCallback(() => setTimerRunning(false), []);
  const resetTimer = useCallback(() => { setTimerRunning(false); setTimerSeconds(0); }, []);

  const formatTimer = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Workout actions
  const startWorkout = (program) => {
    setSelectedProgram(program);
    setCurrentStepIndex(0);
    setCompletedSteps({});
    setIsWorkoutActive(true);
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  const continueLastWorkout = () => {
    if (!lastWorkout) return;
    const program = WORKOUT_PROGRAMS.find(p => p.id === lastWorkout.programId);
    if (program) {
      setSelectedProgram(program);
      setCurrentStepIndex(lastWorkout.stepIndex || 0);
      setCompletedSteps({});
      setIsWorkoutActive(true);
    }
  };

  const markStepDone = (idx) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: true }));
    saveLastWorkout(selectedProgram.id, idx);
    if (idx < workoutFlow.length - 1) setCurrentStepIndex(idx + 1);
  };

  const finishWorkout = () => {
    saveWorkoutCompletion(selectedProgram.id, selectedProgram.titleId, selectedProgram.durationMinutes);
    clearLastWorkout();
    setProgress(getWorkoutProgress());
    setIsWorkoutActive(false);
    setSelectedProgram(null);
    setLastWorkout(null);
  };

  const exitWorkout = () => {
    if (Object.keys(completedSteps).length > 0) {
      saveLastWorkout(selectedProgram.id, currentStepIndex);
      setLastWorkout(getLastWorkout());
    }
    setIsWorkoutActive(false);
    setSelectedProgram(null);
    setTimerRunning(false);
  };

  const handleToggleFavorite = (programId) => {
    const newFavs = toggleWorkoutFavorite(programId);
    setFavorites([...newFavs]);
  };

  const getDifficultyColor = (d) => {
    if (d === 'Easy') return '#10b981';
    if (d === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  const getPhaseLabel = (phase) => {
    if (phase === 'warmup') return '🔥 Pemanasan';
    if (phase === 'main') return '💪 Latihan Inti';
    return '🧘 Pendinginan';
  };

  const getPhaseColor = (phase) => {
    if (phase === 'warmup') return { bg: '#f59e0b22', color: '#d97706' };
    if (phase === 'main') return { bg: '#6366f122', color: '#4f46e5' };
    return { bg: '#10b98122', color: '#059669' };
  };

  // ============ RENDER: Active Workout Mode ============
  if (isWorkoutActive && selectedProgram) {
    const completedCount = Object.keys(completedSteps).length;
    const totalSteps = workoutFlow.length;
    const progressPercent = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

    return (
      <div className="hw-page">
        <header className="hw-active-header">
          <div className="container">
            <div className="hw-active-header__top">
              <button onClick={exitWorkout} className="hw-back-btn" aria-label="Keluar">
                <ChevronLeft size={20} />
              </button>
              <div className="hw-active-header__info">
                <h1 className="hw-active-header__title">{selectedProgram.titleId}</h1>
                <p className="hw-active-header__progress">{completedCount}/{totalSteps} langkah selesai</p>
              </div>
              {completedCount === totalSteps && (
                <motion.button 
                  onClick={finishWorkout} 
                  className="hw-finish-btn"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Trophy size={16} /> Selesai!
                </motion.button>
              )}
            </div>
            <div className="hw-progress-bar">
              <motion.div 
                className="hw-progress-bar__fill" 
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </header>

        {/* Timer Section */}
        <section className="hw-timer-section container">
          <div className="hw-timer-card">
            <div className="hw-timer-display">{formatTimer(timerSeconds)}</div>
            <div className="hw-timer-controls">
              {!timerRunning ? (
                <>
                  <button onClick={() => startTimer(currentStep?.duration || 30)} className="hw-timer-btn hw-timer-btn--play" title="Timer">
                    <Play size={20} fill="currentColor" />
                  </button>
                  <button onClick={() => startTimer(0)} className="hw-timer-btn hw-timer-btn--stopwatch" title="Stopwatch">
                    <Clock size={16} />
                  </button>
                </>
              ) : (
                <button onClick={pauseTimer} className="hw-timer-btn hw-timer-btn--pause">
                  <Pause size={20} fill="currentColor" />
                </button>
              )}
              <button onClick={resetTimer} className="hw-timer-btn hw-timer-btn--reset">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Current Step Detail with Silhouette */}
        <AnimatePresence mode="wait">
          {currentStep && (
            <motion.section 
              className="hw-current-step container"
              key={currentStepIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Silhouette Image */}
              <div className="hw-step-image-wrap">
                <img 
                  src={currentStep.image} 
                  alt={currentStep.nameId || currentStep.name}
                  className="hw-step-image"
                  loading="lazy"
                />
              </div>
              
              <div className="hw-step-phase-badge" style={getPhaseColor(currentStep.phase)}>
                {getPhaseLabel(currentStep.phase)}
              </div>
              <h2 className="hw-step-name">{currentStep.nameId || currentStep.name}</h2>
              <p className="hw-step-instruction">{currentStep.instruction}</p>
              
              {/* Muscles targeted */}
              {currentStep.muscles && (
                <div className="hw-step-muscles">
                  {currentStep.muscles.map(m => (
                    <span key={m} className="hw-step-muscle-tag">{m}</span>
                  ))}
                </div>
              )}
              
              <div className="hw-step-meta-grid">
                {currentStep.reps && (
                  <div className="hw-step-meta-item">
                    <Target size={14} />
                    <span>{currentStep.reps} repetisi {currentStep.sets ? `× ${currentStep.sets} set` : ''}</span>
                  </div>
                )}
                {currentStep.duration && (
                  <div className="hw-step-meta-item">
                    <Clock size={14} />
                    <span>{currentStep.duration} detik {currentStep.sets ? `× ${currentStep.sets} set` : ''}</span>
                  </div>
                )}
                {currentStep.rest && (
                  <div className="hw-step-meta-item">
                    <span>⏸️ Istirahat {currentStep.rest}s antar set</span>
                  </div>
                )}
              </div>

              {currentStep.lowImpact && <p className="hw-step-alt">💡 Alternatif ringan: {currentStep.lowImpact}</p>}
              {currentStep.note && <p className="hw-step-alt">📝 {currentStep.note}</p>}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Exercise Checklist */}
        <section className="hw-checklist container">
          <h3 className="hw-checklist-title">Checklist Latihan</h3>
          <div className="hw-checklist-list">
            {workoutFlow.map((step, idx) => {
              const isDone = completedSteps[idx];
              const isCurrent = idx === currentStepIndex;
              const phaseChanged = idx === 0 || step.phase !== workoutFlow[idx - 1]?.phase;
              return (
                <div key={`${step.id}-${idx}`}>
                  {phaseChanged && <div className="hw-phase-divider">{getPhaseLabel(step.phase)}</div>}
                  <button
                    className={`hw-checklist-item ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      if (!isDone) markStepDone(idx);
                    }}
                  >
                    <img src={step.image} alt="" className="hw-checklist-item__thumb" loading="lazy" />
                    {isDone ? <CheckCircle2 size={18} className="hw-check-icon--done" /> : <Circle size={18} className="hw-check-icon" />}
                    <span className="hw-checklist-item__name">{step.nameId || step.name}</span>
                    {step.duration && <span className="hw-checklist-item__meta">{step.duration}s</span>}
                    {step.reps && <span className="hw-checklist-item__meta">×{step.reps}</span>}
                    {isCurrent && <ChevronRight size={14} className="hw-checklist-item__current" />}
                  </button>
                </div>
              );
            })}
          </div>
          {completedCount < totalSteps && currentStepIndex < totalSteps - 1 && (
            <motion.button 
              onClick={() => markStepDone(currentStepIndex)} 
              className="hw-next-step-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Selesai & Lanjut <SkipForward size={16} />
            </motion.button>
          )}
          {completedCount === totalSteps && (
            <motion.button 
              onClick={finishWorkout} 
              className="hw-finish-workout-btn"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <Trophy size={18} /> Latihan Selesai — Simpan Progress
            </motion.button>
          )}
        </section>
      </div>
    );
  }

  // ============ RENDER: Program List / Home ============
  return (
    <div className="hw-page">
      {/* Header with Hero Image */}
      <header className="hw-header">
        <div className="hw-header__hero-bg">
          <img src="/images/workout/hero.png" alt="" className="hw-header__hero-img" />
          <div className="hw-header__hero-overlay" />
        </div>
        <div className="container hw-header__content">
          <button onClick={() => navigate('/good-path', { state: { from: '/good-path/home-workout' } })} className="hw-back-btn" aria-label="Kembali">
            <ChevronLeft size={20} />
          </button>
          <div className="hw-header__text">
            <h1 className="hw-header__title">🏋️ Home Workout</h1>
            <p className="hw-header__subtitle">Latihan terstruktur di rumah — pemanasan, latihan inti, pendinginan.</p>
          </div>
        </div>
      </header>

      {/* Safety Disclaimer */}
      <div className="container hw-disclaimer">
        <div className="hw-disclaimer-card">
          <AlertTriangle size={18} className="hw-disclaimer-icon" />
          <p className="hw-disclaimer-text">{SAFETY_DISCLAIMER}</p>
        </div>
      </div>

      {/* Weekly Progress */}
      <section className="container hw-weekly-progress">
        <h3 className="hw-section-title"><Calendar size={16} /> Progress Minggu Ini</h3>
        <div className="hw-week-dots">
          {weekProgress.map(d => (
            <div key={d.date} className={`hw-week-dot ${d.done ? 'done' : ''}`}>
              <div className="hw-week-dot__circle">{d.done ? '✓' : ''}</div>
              <span className="hw-week-dot__label">{d.dayName}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Continue Last Workout */}
      {lastWorkout && (() => {
        const prog = WORKOUT_PROGRAMS.find(p => p.id === lastWorkout.programId);
        return prog ? (
          <section className="container hw-continue">
            <button className="hw-continue-card" onClick={continueLastWorkout}>
              <img src={prog.image} alt="" className="hw-continue-card__thumb" />
              <div className="hw-continue-card__info">
                <span className="hw-continue-card__badge">▶ Lanjutkan</span>
                <h3>{prog.titleId}</h3>
                <p>Langkah {lastWorkout.stepIndex + 1} dari {buildWorkoutFlow(prog).length}</p>
              </div>
              <ChevronRight size={20} />
            </button>
          </section>
        ) : null;
      })()}

      {/* Weekly Plan */}
      <section className="container hw-weekly-section">
        <h3 className="hw-section-title"><Calendar size={16} /> Jadwal Mingguan</h3>
        <div className="hw-weekly-grid">
          {WEEKLY_PLAN.map(day => (
            <div key={day.day} className={`hw-weekly-card ${day.rest ? 'rest' : ''}`}>
              <span className="hw-weekly-card__emoji">{day.emoji}</span>
              <strong className="hw-weekly-card__day">{day.day}</strong>
              <span className="hw-weekly-card__focus">{day.focus}</span>
              {day.programId && (
                <button className="hw-weekly-card__btn" onClick={() => {
                  const p = WORKOUT_PROGRAMS.find(pr => pr.id === day.programId);
                  if (p) setSelectedProgram(p);
                }}>Lihat</button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Filter Chips */}
      <section className="container hw-filters">
        <h3 className="hw-section-title">Kategori</h3>
        <div className="hw-filter-chips">
          <button className={`hw-chip ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>Semua</button>
          {CATEGORIES.map(c => (
            <button key={c.id} className={`hw-chip ${activeCategory === c.id ? 'active' : ''}`} onClick={() => setActiveCategory(c.id)}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
        <div className="hw-filter-chips" style={{ marginTop: '8px' }}>
          {['all', 'Easy', 'Medium', 'Hard'].map(d => (
            <button key={d} className={`hw-chip hw-chip--diff ${activeDifficulty === d ? 'active' : ''}`} onClick={() => setActiveDifficulty(d)}
              style={d !== 'all' ? { borderColor: getDifficultyColor(d) + '44' } : {}}>
              {d === 'all' ? 'Semua Level' : d}
            </button>
          ))}
        </div>
      </section>

      {/* Program Cards with Silhouette */}
      <section className="container hw-programs">
        {filteredPrograms.length === 0 ? (
          <div className="hw-empty">Tidak ada program yang sesuai filter.</div>
        ) : (
          <div className="hw-programs-grid">
            {filteredPrograms.map((program, i) => {
              const isFav = favorites.includes(program.id);
              return (
                <motion.div 
                  key={program.id} 
                  className="hw-program-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  {/* Silhouette Header */}
                  <div className="hw-program-card__image-wrap">
                    <img src={program.image} alt={program.titleId} className="hw-program-card__image" loading="lazy" />
                    <div className="hw-program-card__image-overlay" />
                    <button className={`hw-fav-btn ${isFav ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); handleToggleFavorite(program.id); }} aria-label="Favorit">
                      <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  <div className="hw-program-card__body">
                    <div className="hw-program-card__badges">
                      <span className="hw-badge" style={{ background: getDifficultyColor(program.difficulty) + '22', color: getDifficultyColor(program.difficulty) }}>
                        {program.difficulty}
                      </span>
                      <span className="hw-badge hw-badge--outline"><Clock size={12} /> {program.durationMinutes} menit</span>
                    </div>
                    <h3 className="hw-program-card__title">{program.titleId}</h3>
                    <p className="hw-program-card__subtitle">{program.title}</p>
                    <div className="hw-program-card__meta">
                      <span><Target size={12} /> {program.targetArea}</span>
                      <span><Flame size={12} /> {program.calorieEstimate}</span>
                    </div>
                    <div className="hw-program-card__actions">
                      <button className="hw-start-btn" onClick={() => startWorkout(program)}>
                        <Play size={14} fill="currentColor" /> Mulai
                      </button>
                      <button className="hw-detail-btn" onClick={() => setSelectedProgram(program)}>
                        Detail
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Program Detail Modal */}
      <AnimatePresence>
        {selectedProgram && !isWorkoutActive && (
          <motion.div 
            className="hw-modal-overlay" 
            onClick={() => setSelectedProgram(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="hw-modal" 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            >
              <div className="hw-modal__image-wrap">
                <img src={selectedProgram.image} alt={selectedProgram.titleId} className="hw-modal__image" />
                <div className="hw-modal__image-overlay" />
              </div>
              <div className="hw-modal__header">
                <div>
                  <h2>{selectedProgram.titleId}</h2>
                  <p>{selectedProgram.title} • {selectedProgram.durationMinutes} menit</p>
                </div>
                <button onClick={() => setSelectedProgram(null)} className="hw-modal__close">✕</button>
              </div>
              <div className="hw-modal__body">
                <div className="hw-modal__badges">
                  <span className="hw-badge" style={{ background: getDifficultyColor(selectedProgram.difficulty) + '22', color: getDifficultyColor(selectedProgram.difficulty) }}>{selectedProgram.difficulty}</span>
                  <span className="hw-badge hw-badge--outline"><Target size={12} /> {selectedProgram.targetArea}</span>
                  <span className="hw-badge hw-badge--outline"><Flame size={12} /> {selectedProgram.calorieEstimate}</span>
                </div>

                <div className="hw-modal__safety"><AlertTriangle size={14} /> {selectedProgram.safetyTip}</div>

                {/* Flow Preview with images */}
                {['warmup', 'main', 'cooldown'].map(phase => {
                  const steps = workoutFlow.filter(s => s.phase === phase);
                  if (steps.length === 0) return null;
                  return (
                    <div key={phase} className="hw-modal__phase">
                      <h4>{getPhaseLabel(phase)}</h4>
                      <div className="hw-modal__steps">
                        {steps.map((s, i) => (
                          <div key={`${s.id}-${i}`} className="hw-modal__step-item">
                            <img src={s.image} alt="" className="hw-modal__step-thumb" loading="lazy" />
                            <div className="hw-modal__step-info">
                              <strong>{s.nameId || s.name}</strong>
                              {s.muscles && <span className="hw-modal__step-muscles">{s.muscles.join(', ')}</span>}
                              {s.reps && <span className="hw-modal__step-detail">{s.reps} reps {s.sets ? `× ${s.sets} set` : ''}</span>}
                              {s.duration && <span className="hw-modal__step-detail">{s.duration}s {s.sets ? `× ${s.sets} set` : ''}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <button className="hw-modal__start-btn" onClick={() => startWorkout(selectedProgram)}>
                  <Play size={16} fill="currentColor" /> Mulai Latihan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {progress.length > 0 && (
        <section className="container hw-history">
          <h3 className="hw-section-title"><Trophy size={16} /> Riwayat Latihan</h3>
          <div className="hw-history-list">
            {progress.slice(-5).reverse().map((p, i) => (
              <div key={i} className="hw-history-item">
                <span className="hw-history-item__date">{p.date}</span>
                <span className="hw-history-item__name">{p.programTitle}</span>
                <span className="hw-history-item__dur">{p.durationMin} min</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
