import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
import { CheckCircle2, Circle, Plus, Compass, ChevronLeft, Activity } from 'lucide-react';
import HabitDetailSheet from '../../components/HabitDetailSheet/HabitDetailSheet';
import './GoodPathPage.css';

export default function GoodPathPage() {
  useSEO({
    title: 'Good Path - Islamediaku',
    description: 'Sistem pembiasaan dan perbaikan diri islami secara konsisten.',
    path: '/good-path'
  });

  const [habits, setHabits] = useState([]);
  const [progress, setProgress] = useState({});
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
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
    e.stopPropagation(); // Prevent opening detail sheet
    const newProgress = toggleHabitProgress(habitId, today);
    setProgress({...newProgress});
  };

  const handleOpenDetail = (habit) => {
    setSelectedHabit(habit);
  };

  const handleCloseDetail = () => {
    setSelectedHabit(null);
    loadData(); // Reload in case notes/stats changed
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

  return (
    <div className="good-path-page">
      <header className="gp-header" style={{ position: 'relative' }}>
        <div className="container">
          <button 
            onClick={handleBack}
            className="gp-header__back"
            aria-label="Kembali"
          >
            <ChevronLeft size={20} />
          </button>
          <div style={{ marginLeft: '40px' }}>
            <h1 className="gp-header__title"><Compass size={28}/> Good Path</h1>
            <p className="gp-header__subtitle">Bangun kebiasaan baik yang berkelanjutan, langkah demi langkah.</p>
          </div>
        </div>
      </header>

      <main className="gp-main">
        {/* Home Workout Feature Card */}
        <Link to="/good-path/home-workout" className="gp-feature-link" style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '16px', borderRadius: '16px', marginBottom: '16px',
          background: 'linear-gradient(135deg, #065f4618, #0d948818)',
          border: '1px solid #04785725', textDecoration: 'none',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #047857, #0d9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Activity size={24} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 2px', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-color, #1e293b)' }}>🏋️ Home Workout</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #64748b)' }}>Olahraga di Rumah — Latihan ringan dan terstruktur</p>
          </div>
          <ChevronLeft size={18} style={{ transform: 'rotate(180deg)', color: 'var(--text-muted, #64748b)' }} />
        </Link>

        <div className="gp-list">
          {habits.map(habit => {
            const isDone = todayProgress[habit.id];
            return (
              <div 
                key={habit.id} 
                className={`gp-card ${isDone ? 'gp-card--done' : ''}`}
                onClick={() => handleOpenDetail(habit)}
              >
                <div className="gp-card__icon-wrap">
                  {habit.icon}
                </div>
                <div className="gp-card__content">
                  <h3 className="gp-card__title">{habit.title}</h3>
                  <p className="gp-card__desc">{habit.category} • {habit.priority}</p>
                </div>
                <button 
                  className="gp-card__check" 
                  onClick={(e) => handleToggle(e, habit.id)}
                  aria-label="Tandai selesai"
                >
                  {isDone ? (
                    <CheckCircle2 className="gp-icon-checked" size={28} />
                  ) : (
                    <Circle className="gp-icon-unchecked" size={28} />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <button className="gp-add-btn" onClick={() => setShowCustomModal(true)}>
          <Plus size={20} /> Buat Habit Sendiri
        </button>
      </main>

      {/* Habit Detail Sheet */}
      {selectedHabit && (
        <HabitDetailSheet 
          habit={selectedHabit}
          onClose={handleCloseDetail}
          onDelete={handleDeleteCustom}
          onDisable={handleDisableDefault}
          onUpdate={() => {
             // In future, can implement full edit custom habit here
             alert("Fitur edit akan segera hadir.");
          }}
        />
      )}

      {/* Custom Habit Modal */}
      {showCustomModal && (
        <div className="gp-custom-modal-overlay">
          <div className="gp-custom-modal">
            <h3>Buat Habit Baru</h3>
            <form onSubmit={handleSaveCustomHabit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
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
                  className="gp-input" 
                  value={customIcon} 
                  onChange={e => setCustomIcon(e.target.value)} 
                  placeholder="Misal: 🌟"
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
          </div>
        </div>
      )}
    </div>
  );
}
