import React, { useState, useEffect, useRef } from 'react';
import { X, Target, Heart, Edit3, Trash2, BookOpen, Clock, Activity } from 'lucide-react';
import { getHabitNoteForDate, saveHabitNote, calculateHabitStats, getTodayKey } from '../../utils/goodPathData';
import './HabitDetailSheet.css';

export default function HabitDetailSheet({ habit, onClose, onUpdate, onDelete, onDisable }) {
  const [note, setNote] = useState('');
  const [stats, setStats] = useState({ completedToday: false, completedThisWeek: 0, completedThisMonth: 0 });
  const [isEditingNote, setIsEditingNote] = useState(false);
  const today = getTodayKey();

  const contentRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (habit) {
      setNote(getHabitNoteForDate(habit.id, today));
      setStats(calculateHabitStats(habit.id));
      // Scroll to top when opened
      requestAnimationFrame(() => {
        if (contentRef.current) contentRef.current.scrollTop = 0;
      });

      // Intercept browser/Android back button
      const handlePopState = (e) => {
        if (onCloseRef.current) onCloseRef.current();
      };

      // Push dummy state to trap the first back button press
      window.history.pushState({ habitDetailOpen: true }, '');
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
        // Clean up dummy state if component unmounts via Close button
        if (window.history.state?.habitDetailOpen) {
          window.history.back();
        }
      };
    }
  }, [habit, today]);

  if (!habit) return null;

  const handleSaveNote = () => {
    saveHabitNote(habit.id, today, note);
    setIsEditingNote(false);
  };

  const getProgressMessage = () => {
    if (stats.completedToday) return "Alhamdulillah, sudah selesai hari ini. Semoga Allah mudahkan untuk istiqamah.";
    if (stats.completedThisWeek > 0) return "Satu langkah kecil hari ini tetap berarti. Yuk diselesaikan!";
    return "Pelan-pelan, yang penting terus kembali dan berusaha.";
  };

  return (
    <div className="habit-sheet-overlay" onClick={onClose}>
      <div className="habit-sheet" onClick={e => e.stopPropagation()}>
        <div className="habit-sheet-header">
          <div className="habit-sheet-title-group">
            <div className="habit-sheet-icon">{habit.icon}</div>
            <div>
              <h2 className="habit-sheet-title">{habit.title}</h2>
              <span className="habit-sheet-badge">{habit.priority} • {habit.category}</span>
            </div>
          </div>
          <button className="habit-sheet-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="habit-sheet-content sheet-content" ref={contentRef}>
          {/* Tujuan */}
          <div className="habit-section">
            <h3 className="habit-section-title"><Heart size={16} className="text-pink-500" /> Tujuan</h3>
            <p className="habit-section-text">{habit.purpose}</p>
          </div>

          {/* Cara Melakukan */}
          <div className="habit-section">
            <h3 className="habit-section-title"><BookOpen size={16} className="text-blue-500" /> Cara Melakukan</h3>
            <p className="habit-section-text">{habit.guide}</p>
          </div>

          {/* Target */}
          <div className="habit-section">
            <h3 className="habit-section-title"><Target size={16} className="text-green-500" /> Target Disarankan</h3>
            <p className="habit-section-text">{habit.suggestedTarget}</p>
          </div>

          {/* Progress */}
          <div className="habit-section">
            <h3 className="habit-section-title"><Activity size={16} className="text-orange-500" /> Progress</h3>
            <div className="habit-stats-grid">
              <div className="habit-stat-box">
                <span className="habit-stat-val">{stats.completedThisWeek} <span style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>/ 7</span></span>
                <span className="habit-stat-label">Minggu Ini</span>
              </div>
              <div className="habit-stat-box">
                <span className="habit-stat-val">{stats.completedThisMonth} <span style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>/ 30</span></span>
                <span className="habit-stat-label">Bulan Ini</span>
              </div>
            </div>
            <p className="habit-progress-msg">{getProgressMessage()}</p>
          </div>

          {/* Catatan / Refleksi */}
          <div className="habit-section">
            <h3 className="habit-section-title"><Edit3 size={16} className="text-purple-500" /> Catatan & Refleksi</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px'}}>{habit.reflectionPrompt}</p>
            {isEditingNote ? (
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <textarea
                  className="habit-note-area"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Tulis refleksi hari ini..."
                  autoFocus
                />
                <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                  <button onClick={() => setIsEditingNote(false)} className="habit-btn habit-btn-secondary" style={{padding: '8px 16px', flex: 'none'}}>Batal</button>
                  <button onClick={handleSaveNote} className="habit-btn habit-btn-primary" style={{padding: '8px 16px', flex: 'none'}}>Simpan</button>
                </div>
              </div>
            ) : (
              <div 
                className="habit-section-text" 
                style={{cursor: 'pointer', fontStyle: note ? 'normal' : 'italic', opacity: note ? 1 : 0.7}}
                onClick={() => setIsEditingNote(true)}
              >
                {note || "Belum ada catatan hari ini. Ketuk untuk menulis."}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="habit-sheet-actions">
            {habit.isCustom ? (
              <>
                {/* <button className="habit-btn habit-btn-secondary" onClick={() => onUpdate(habit)}>Edit Habit</button> */}
                <button className="habit-btn habit-btn-danger" onClick={() => {
                  if(window.confirm('Yakin ingin menghapus habit custom ini?')) onDelete(habit.id);
                }}>
                  <Trash2 size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
                  Hapus
                </button>
              </>
            ) : (
              <button className="habit-btn habit-btn-secondary" onClick={() => {
                if(window.confirm('Sembunyikan habit bawaan ini dari daftar?')) onDisable(habit.id);
              }}>
                Sembunyikan Habit
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
