import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import { 
  getHabits, 
  getHabitProgress, 
  toggleHabitProgress, 
  getTodayKey,
  saveCustomHabits,
  getCustomHabits,
  saveDisabledHabits,
  getDisabledHabits
} from '../../utils/goodPathData';
import { CheckCircle2, Circle, Plus, Compass, ChevronLeft, X, Flame, Award, BookOpen, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HabitDetailSheet from '../../components/HabitDetailSheet/HabitDetailSheet';
import HijrahGuide from './components/HijrahGuide';
import './GoodPathPage.css';

export default function GoodPathPage() {
  useSEO({
    title: 'Good Path & Panduan Hijrah - Islamediaku',
    description: 'Sistem pembiasaan dan perbaikan diri islami secara konsisten.',
    path: '/good-path'
  });

  const [habits, setHabits] = useState([]);
  const [progress, setProgress] = useState({});
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker' | 'guide'

  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/ruang-saya');
    }
  };

  // Form states for Custom Habit
  const [customTitle, setCustomTitle] = useState('');
  const [customIcon, setCustomIcon] = useState('🌟');
  const [customCategory] = useState('Lainnya');
  const [customPurpose, setCustomPurpose] = useState('');

  const today = getTodayKey();

  const loadData = () => {
    setHabits(getHabits().filter(h => h.enabled));
    setProgress(getHabitProgress());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleToggle = (e, habitId) => {
    e.stopPropagation();
    const newProgress = toggleHabitProgress(habitId, today);
    setProgress({...newProgress});
  };

  const handleOpenDetail = (habit) => {
    setSelectedHabit(habit);
  };

  const handleCloseDetail = () => {
    setSelectedHabit(null);
    loadData();
  };

  // Custom Habit Handlers
  const handleSaveCustomHabit = (e) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newHabit = {
      id: 'gp-custom-' + Date.now(),
      title: customTitle,
      category: customCategory,
      priority: 'Opsional',
      icon: customIcon,
      defaultEnabled: true,
      frequency: 'Setiap hari',
      description: 'Kebiasaan custom.',
      purpose: customPurpose || 'Meningkatkan kualitas diri.',
      guide: 'Lakukan secara konsisten sesuai target.',
      suggestedTarget: 'Setiap hari',
      reflectionPrompt: 'Apa yang bisa ditingkatkan esok hari?',
      isCustom: true
    };

    const customs = getCustomHabits();
    saveCustomHabits([...customs, newHabit]);
    
    setShowCustomModal(false);
    setCustomTitle('');
    setCustomPurpose('');
    loadData();
  };

  const handleDeleteCustom = (habitId) => {
    const customs = getCustomHabits();
    saveCustomHabits(customs.filter(h => h.id !== habitId));
    setSelectedHabit(null);
    loadData();
  };

  const handleDisableDefault = (habitId) => {
    const disabled = getDisabledHabits();
    if (!disabled.includes(habitId)) {
      saveDisabledHabits([...disabled, habitId]);
    }
    setSelectedHabit(null);
    loadData();
  };

  const todayProgress = progress[today] || {};
  const completedCount = habits.filter(h => todayProgress[h.id]).length;
  const totalHabits = habits.length;
  const progressPercent = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  // Group habits by category
  const grouped = habits.reduce((acc, habit) => {
    const cat = habit.category || 'Lainnya';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(habit);
    return acc;
  }, {});

  return (
    <div className="good-path-page">
      {/* Premium Header with Progress Ring */}
      <header className="gp-header">
        <div className="gp-header__inner container">
          <button 
            onClick={handleBack}
            className="gp-header__back"
            aria-label="Kembali"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="gp-header__content">
            <div className="gp-header__text">
              <h1 className="gp-header__title">
                <Compass size={24} /> Good Path
              </h1>
              <p className="gp-header__subtitle">
                Bangun kebiasaan baik, langkah demi langkah
              </p>
            </div>
            
            {/* Progress Ring */}
            <div className="gp-progress-ring" title={`${completedCount}/${totalHabits} selesai`}>
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                <circle 
                  cx="26" cy="26" r="22" fill="none" 
                  stroke="#10B981" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 22}`}
                  strokeDashoffset={`${2 * Math.PI * 22 * (1 - progressPercent / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.6s ease', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
              </svg>
              <span className="gp-progress-ring__text">{progressPercent}%</span>
            </div>
          </div>
          
          <div className="gp-header__stats">
            <span className="gp-header__stat">
              <strong>{completedCount}</strong> / {totalHabits} selesai hari ini
            </span>
          </div>

          {/* Nav Tabs */}
          <div className="gp-tabs">
            <button 
              className={`gp-tab-btn ${activeTab === 'tracker' ? 'gp-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('tracker')}
            >
              <CheckSquare size={16} /> Habit Tracker Harian
            </button>
            <button 
              className={`gp-tab-btn ${activeTab === 'guide' ? 'gp-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('guide')}
            >
              <BookOpen size={16} /> Panduan Hijrah Step-by-Step
            </button>
          </div>
        </div>
      </header>

      <main className="gp-main container">
        {activeTab === 'guide' ? (
          <HijrahGuide onSwitchToTracker={() => setActiveTab('tracker')} />
        ) : (
          <>
            {/* Habit List grouped by Category */}
            {Object.entries(grouped).map(([category, categoryHabits]) => (
              <div key={category} className="gp-category-group">
                <h3 className="gp-category-label">{category}</h3>
                <div className="gp-list">
                  {categoryHabits.map((habit, index) => {
                    const isDone = todayProgress[habit.id];
                    return (
                      <motion.div 
                        key={habit.id} 
                        className={`gp-card ${isDone ? 'gp-card--done' : ''}`}
                        onClick={() => handleOpenDetail(habit)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="gp-card__icon-wrap">
                          {habit.icon}
                        </div>
                        <div className="gp-card__content">
                          <h3 className="gp-card__title">{habit.title}</h3>
                          <p className="gp-card__desc">{habit.frequency || habit.priority}</p>
                        </div>
                        <motion.button 
                          className="gp-card__check" 
                          onClick={(e) => handleToggle(e, habit.id)}
                          aria-label="Tandai selesai"
                          whileTap={{ scale: 0.8 }}
                        >
                          {isDone ? (
                            <CheckCircle2 className="gp-icon-checked" size={26} />
                          ) : (
                            <Circle className="gp-icon-unchecked" size={26} />
                          )}
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Floating Add Button */}
            <motion.button 
              className="gp-fab" 
              onClick={() => setShowCustomModal(true)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              title="Buat Habit Baru"
            >
              <Plus size={22} />
            </motion.button>
          </>
        )}
      </main>

      {/* Habit Detail Sheet */}
      {selectedHabit && (
        <HabitDetailSheet 
          habit={selectedHabit}
          onClose={handleCloseDetail}
          onDelete={handleDeleteCustom}
          onDisable={handleDisableDefault}
          onUpdate={() => {
             alert("Fitur edit akan segera hadir.");
          }}
        />
      )}

      {/* Custom Habit Modal — Glassmorphism */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div 
            className="gp-custom-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCustomModal(false)}
          >
            <motion.div 
              className="gp-custom-modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="gp-modal-header">
                <h3>Buat Habit Baru</h3>
                <button className="gp-modal-close" onClick={() => setShowCustomModal(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSaveCustomHabit} className="gp-modal-form">
                <div className="gp-form-group">
                  <label>Nama Habit</label>
                  <input 
                    className="gp-input" 
                    value={customTitle} 
                    onChange={e => setCustomTitle(e.target.value)} 
                    placeholder="Misal: Puasa Senin Kamis"
                    required
                    autoFocus
                  />
                </div>
                <div className="gp-form-group">
                  <label>Icon (Emoji)</label>
                  <input 
                    className="gp-input gp-input--icon" 
                    value={customIcon} 
                    onChange={e => setCustomIcon(e.target.value)} 
                    placeholder="🌟"
                    maxLength={5}
                  />
                </div>
                <div className="gp-form-group">
                  <label>Tujuan</label>
                  <input 
                    className="gp-input" 
                    value={customPurpose} 
                    onChange={e => setCustomPurpose(e.target.value)} 
                    placeholder="Misal: Menjaga kesehatan dan sunnah"
                  />
                </div>
                <div className="gp-modal-actions">
                  <button type="button" className="gp-btn-cancel" onClick={() => setShowCustomModal(false)}>Batal</button>
                  <button type="submit" className="gp-btn-save">Simpan</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
