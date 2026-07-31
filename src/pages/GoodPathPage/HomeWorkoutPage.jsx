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
  CheckCircle2, Circle, AlertTriangle, ChevronRight, SkipForward, Trophy, Calendar,
  Zap, Timer, Volume2, VolumeX, X, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './HomeWorkoutPage.css';

// ---- Web Audio API Beep (no external files needed) ----
function playBeep(freq = 880, duration = 0.18, count = 1) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + duration);
      osc.start(ctx.currentTime + i * 0.25);
      osc.stop(ctx.currentTime + i * 0.25 + duration);
    }
  } catch (e) { /* silent fallback */ }
}

function playFinishSound() { playBeep(1046, 0.15, 3); }
function playTickSound() { playBeep(660, 0.08, 1); }

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
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('countdown');
  const [timerTotal, setTimerTotal] = useState(0);
  const timerRef = useRef(null);

  // Elapsed time & calories
  const [elapsedTime, setElapsedTime] = useState(0);
  const elapsedRef = useRef(null);

  // Favorites & Progress
  const [favorites, setFavorites] = useState(getWorkoutFavorites);
  const [progress, setProgress] = useState(getWorkoutProgress);
  const [lastWorkout, setLastWorkout] = useState(getLastWorkout);

  // Touch swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const stepRef = useRef(null);
  const checklistRef = useRef(null);

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
      const isToday = i === 0;
      dots.push({ date: dateStr, done, isToday, dayName: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()] });
    }
    return dots;
  }, [progress]);

  // Today's day name for weekly plan highlight
  const todayDayName = useMemo(() => {
    return ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()];
  }, []);

  // Estimated calories burned
  const caloriesBurned = useMemo(() => {
    if (!workoutFlow.length) return 0;
    return Object.keys(completedSteps).reduce((sum, idx) => {
      const step = workoutFlow[parseInt(idx)];
      return sum + (step?.calories || 2);
    }, 0);
  }, [completedSteps, workoutFlow]);

  // ---- Timer logic ----
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (timerMode === 'countdown') {
            if (prev <= 1) {
              setTimerRunning(false);
              if (soundEnabled) playFinishSound();
              return 0;
            }
            if (prev <= 4 && prev > 1 && soundEnabled) playTickSound();
            return prev - 1;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerMode, soundEnabled]);

  // Elapsed time tracker
  useEffect(() => {
    if (isWorkoutActive) {
      elapsedRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(elapsedRef.current);
  }, [isWorkoutActive]);

  // Auto-start timer when step changes (if step has duration)
  useEffect(() => {
    if (isWorkoutActive && currentStep?.duration && !completedSteps[currentStepIndex]) {
      setTimerTotal(currentStep.duration);
      setTimerSeconds(currentStep.duration);
      setTimerMode('countdown');
      setTimerRunning(true);
    }
  }, [currentStepIndex, isWorkoutActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll checklist to current step
  useEffect(() => {
    if (checklistRef.current && isWorkoutActive) {
      const currentItem = checklistRef.current.querySelector('.hw-checklist-item.current');
      if (currentItem) {
        currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentStepIndex, isWorkoutActive]);

  const startTimer = useCallback((seconds) => {
    setTimerTotal(seconds || 0);
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

  // Timer progress (0 to 1)
  const timerProgress = timerMode === 'countdown' && timerTotal > 0
    ? (timerTotal - timerSeconds) / timerTotal
    : 0;

  // ---- Workout actions ----
  const startWorkout = (program) => {
    setSelectedProgram(program);
    setCurrentStepIndex(0);
    setCompletedSteps({});
    setIsWorkoutActive(true);
    setTimerSeconds(0);
    setTimerRunning(false);
    setElapsedTime(0);
    setShowCelebration(false);
  };

  const continueLastWorkout = () => {
    if (!lastWorkout) return;
    const program = WORKOUT_PROGRAMS.find(p => p.id === lastWorkout.programId);
    if (program) {
      setSelectedProgram(program);
      setCurrentStepIndex(lastWorkout.stepIndex || 0);
      setCompletedSteps({});
      setIsWorkoutActive(true);
      setElapsedTime(0);
    }
  };

  const markStepDone = (idx) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: true }));
    saveLastWorkout(selectedProgram.id, idx);
    if (soundEnabled) playBeep(520, 0.1, 1);
    if (idx < workoutFlow.length - 1) {
      setCurrentStepIndex(idx + 1);
      setTimerRunning(false);
    }
  };

  const finishWorkout = () => {
    saveWorkoutCompletion(selectedProgram.id, selectedProgram.titleId, selectedProgram.durationMinutes);
    clearLastWorkout();
    setProgress(getWorkoutProgress());
    setShowCelebration(true);
    if (soundEnabled) playFinishSound();
    setTimeout(() => {
      setShowCelebration(false);
      setIsWorkoutActive(false);
      setSelectedProgram(null);
      setLastWorkout(null);
    }, 3000);
  };

  const handleExitWorkout = () => {
    if (Object.keys(completedSteps).length > 0) {
      setShowExitConfirm(true);
    } else {
      exitWorkout();
    }
  };

  const exitWorkout = () => {
    if (Object.keys(completedSteps).length > 0) {
      saveLastWorkout(selectedProgram.id, currentStepIndex);
      setLastWorkout(getLastWorkout());
    }
    setIsWorkoutActive(false);
    setSelectedProgram(null);
    setTimerRunning(false);
    setShowExitConfirm(false);
  };

  const handleToggleFavorite = (programId) => {
    const newFavs = toggleWorkoutFavorite(programId);
    setFavorites([...newFavs]);
  };

  // ---- Swipe handlers ----
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0 && currentStepIndex < workoutFlow.length - 1) {
        // swipe left → next
        if (!completedSteps[currentStepIndex]) markStepDone(currentStepIndex);
        else setCurrentStepIndex(prev => Math.min(prev + 1, workoutFlow.length - 1));
      } else if (diff < 0 && currentStepIndex > 0) {
        // swipe right → prev
        setCurrentStepIndex(prev => Math.max(prev - 1, 0));
      }
    }
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
    if (phase === 'warmup') return { bg: '#f59e0b22', color: '#d97706', border: '#f59e0b44' };
    if (phase === 'main') return { bg: '#6366f122', color: '#4f46e5', border: '#6366f144' };
    return { bg: '#10b98122', color: '#059669', border: '#10b98144' };
  };

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f0f0f0" width="100" height="100" rx="8"/><text x="50" y="54" text-anchor="middle" fill="%23999" font-size="30">🏋️</text></svg>');
  };

  // ---- Circular timer SVG ----
  const TIMER_RADIUS = 54;
  const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;
  const timerStrokeDashoffset = TIMER_CIRCUMFERENCE * (1 - timerProgress);

  // ============ RENDER: Celebration Overlay ============
  if (showCelebration) {
    return (
      <div className="hw-page">
        <motion.div
          className="hw-celebration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="hw-celebration__confetti">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="hw-confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  background: ['#10B981', '#F59E0B', '#6366F1', '#EC4899', '#06B6D4', '#F97316'][i % 6],
                  width: `${6 + Math.random() * 8}px`,
                  height: `${6 + Math.random() * 8}px`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 50,
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 720 - 360,
                  x: Math.random() * 100 - 50,
                }}
                transition={{ duration: 2 + Math.random() * 1.5, delay: Math.random() * 0.5, ease: 'easeOut' }}
              />
            ))}
          </div>
          <motion.div
            className="hw-celebration__content"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
          >
            <Trophy size={48} className="hw-celebration__trophy" />
            <h2>Latihan Selesai! 🎉</h2>
            <p>Luar biasa! Kamu telah menyelesaikan <strong>{selectedProgram?.titleId}</strong></p>
            <div className="hw-celebration__stats">
              <div className="hw-celebration__stat">
                <Clock size={16} />
                <span>{formatTimer(elapsedTime)}</span>
                <small>Durasi</small>
              </div>
              <div className="hw-celebration__stat">
                <Flame size={16} />
                <span>~{caloriesBurned}</span>
                <small>Kalori</small>
              </div>
              <div className="hw-celebration__stat">
                <Zap size={16} />
                <span>{workoutFlow.length}</span>
                <small>Gerakan</small>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ============ RENDER: Active Workout Mode ============
  if (isWorkoutActive && selectedProgram) {
    const completedCount = Object.keys(completedSteps).length;
    const totalSteps = workoutFlow.length;
    const progressPercent = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

    return (
      <div className="hw-page hw-page--active">
        {/* Exit Confirm Dialog */}
        <AnimatePresence>
          {showExitConfirm && (
            <motion.div
              className="hw-exit-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitConfirm(false)}
            >
              <motion.div
                className="hw-exit-dialog"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
              >
                <AlertTriangle size={32} className="hw-exit-dialog__icon" />
                <h3>Keluar dari Latihan?</h3>
                <p>Progress kamu akan disimpan dan bisa dilanjutkan nanti.</p>
                <div className="hw-exit-dialog__actions">
                  <button className="hw-exit-dialog__btn hw-exit-dialog__btn--cancel" onClick={() => setShowExitConfirm(false)}>
                    Lanjutkan Latihan
                  </button>
                  <button className="hw-exit-dialog__btn hw-exit-dialog__btn--exit" onClick={exitWorkout}>
                    Keluar & Simpan
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="hw-active-header">
          <div className="container">
            <div className="hw-active-header__top">
              <button onClick={handleExitWorkout} className="hw-back-btn hw-back-btn--active" aria-label="Keluar">
                <ChevronLeft size={20} />
              </button>
              <div className="hw-active-header__info">
                <h1 className="hw-active-header__title">{selectedProgram.titleId}</h1>
                <div className="hw-active-header__meta">
                  <span><Clock size={12} /> {formatTimer(elapsedTime)}</span>
                  <span><Flame size={12} /> ~{caloriesBurned} kal</span>
                  <span>{completedCount}/{totalSteps} langkah</span>
                </div>
              </div>
              <button
                className="hw-sound-toggle"
                onClick={() => setSoundEnabled(prev => !prev)}
                aria-label={soundEnabled ? 'Matikan suara' : 'Nyalakan suara'}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
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

        {/* Circular Timer Section */}
        <section className="hw-timer-section container">
          <div className="hw-timer-card hw-timer-card--circular">
            <div className="hw-timer-ring-wrap">
              <svg className="hw-timer-ring" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={TIMER_RADIUS} fill="none" stroke="var(--color-bg-alt)" strokeWidth="6" />
                {timerMode === 'countdown' && timerTotal > 0 && (
                  <motion.circle
                    cx="60" cy="60" r={TIMER_RADIUS}
                    fill="none"
                    stroke="url(#timerGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={TIMER_CIRCUMFERENCE}
                    animate={{ strokeDashoffset: timerStrokeDashoffset }}
                    transition={{ duration: 0.3 }}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                  />
                )}
                <defs>
                  <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-primary)" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="hw-timer-ring__inner">
                <span className="hw-timer-display">{formatTimer(timerSeconds)}</span>
                <span className="hw-timer-mode-label">
                  {timerMode === 'countdown' ? 'Countdown' : 'Stopwatch'}
                </span>
              </div>
            </div>
            <div className="hw-timer-controls">
              {!timerRunning ? (
                <>
                  <button onClick={() => startTimer(currentStep?.duration || 30)} className="hw-timer-btn hw-timer-btn--play" title="Timer">
                    <Play size={20} fill="currentColor" />
                  </button>
                  <button onClick={() => startTimer(0)} className="hw-timer-btn hw-timer-btn--stopwatch" title="Stopwatch">
                    <Timer size={16} />
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

        {/* Current Step Detail with Swipe */}
        <AnimatePresence mode="wait">
          {currentStep && (
            <motion.section
              className="hw-current-step container"
              key={currentStepIndex}
              ref={stepRef}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Step Counter */}
              <div className="hw-step-counter">
                <span>Langkah {currentStepIndex + 1} / {workoutFlow.length}</span>
                <div className="hw-step-counter__dots">
                  {workoutFlow.map((_, i) => (
                    <span
                      key={i}
                      className={`hw-step-dot ${i === currentStepIndex ? 'active' : ''} ${completedSteps[i] ? 'done' : ''}`}
                    />
                  ))}
                </div>
              </div>

              {/* Silhouette Image */}
              <div className="hw-step-image-wrap" style={{ borderColor: getPhaseColor(currentStep.phase).border }}>
                <img
                  src={currentStep.image}
                  alt={currentStep.nameId || currentStep.name}
                  className="hw-step-image"
                  loading="lazy"
                  onError={handleImageError}
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

              {/* Swipe hint */}
              <div className="hw-swipe-hint">
                <ChevronLeft size={12} /> Geser untuk navigasi <ChevronRight size={12} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Exercise Checklist */}
        <section className="hw-checklist container" ref={checklistRef}>
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
                    <img src={step.image} alt="" className="hw-checklist-item__thumb" loading="lazy" onError={handleImageError} />
                    {isDone ? <CheckCircle2 size={18} className="hw-check-icon--done" /> : <Circle size={18} className="hw-check-icon" />}
                    <span className={`hw-checklist-item__name ${isDone ? 'hw-checklist-item__name--done' : ''}`}>{step.nameId || step.name}</span>
                    {step.duration && <span className="hw-checklist-item__meta">{step.duration}s</span>}
                    {step.reps && <span className="hw-checklist-item__meta">×{step.reps}</span>}
                    {isCurrent && <ChevronRight size={14} className="hw-checklist-item__current" />}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Fixed Bottom Action Bar */}
        <div className="hw-fixed-bottom">
          <div className="container hw-fixed-bottom__inner">
            {completedCount < totalSteps && currentStepIndex < totalSteps - 1 ? (
              <motion.button
                onClick={() => markStepDone(currentStepIndex)}
                className="hw-next-step-btn"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
              >
                <CheckCircle2 size={18} /> Selesai & Lanjut <SkipForward size={16} />
              </motion.button>
            ) : completedCount === totalSteps ? (
              <motion.button
                onClick={finishWorkout}
                className="hw-finish-workout-btn"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <Trophy size={18} /> Latihan Selesai — Simpan Progress
              </motion.button>
            ) : (
              <motion.button
                onClick={() => markStepDone(currentStepIndex)}
                className="hw-next-step-btn"
                whileTap={{ scale: 0.97 }}
              >
                <CheckCircle2 size={18} /> Tandai Selesai
              </motion.button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============ RENDER: Program List / Home ============
  return (
    <div className="hw-page">
      {/* Header with Hero Image */}
      <header className="hw-header">
        <div className="hw-header__hero-bg">
          <img src="/images/workout/hero.png" alt="" className="hw-header__hero-img" onError={handleImageError} />
          <div className="hw-header__hero-overlay" />
        </div>
        <div className="container hw-header__content">
          <button onClick={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate('/good-path');
            }
          }} className="hw-back-btn" aria-label="Kembali">
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
            <div key={d.date} className={`hw-week-dot ${d.done ? 'done' : ''} ${d.isToday ? 'today' : ''}`}>
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
              <img src={prog.image} alt="" className="hw-continue-card__thumb" onError={handleImageError} />
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
            <div key={day.day} className={`hw-weekly-card ${day.rest ? 'rest' : ''} ${day.day === todayDayName ? 'hw-weekly-card--today' : ''}`}>
              <span className="hw-weekly-card__emoji">{day.emoji}</span>
              <strong className="hw-weekly-card__day">{day.day}</strong>
              <span className="hw-weekly-card__focus">{day.focus}</span>
              {day.day === todayDayName && <span className="hw-weekly-card__today-badge">Hari ini</span>}
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
                    <img src={program.image} alt={program.titleId} className="hw-program-card__image" loading="lazy" onError={handleImageError} />
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
                <img src={selectedProgram.image} alt={selectedProgram.titleId} className="hw-modal__image" onError={handleImageError} />
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
                            <img src={s.image} alt="" className="hw-modal__step-thumb" loading="lazy" onError={handleImageError} />
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
