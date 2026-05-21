import { useState, useMemo, useCallback } from 'react';

// ── Constants ──
const LS_KEY_PROGRESS = 'islamediaku_daily_mission_progress';
const LS_KEY_DATE = 'islamediaku_daily_mission_date';

/**
 * Default mission items for the day.
 * Each has: id, label, subtitle (optional micro-hint), icon (emoji), done state.
 */
const DEFAULT_MISSIONS = [
  { id: 'dzikir', label: 'Dzikir pagi/petang', subtitle: 'Lindungi harimu', icon: '🌅', done: false },
  { id: 'quran', label: 'Baca Al-Qur\'an', subtitle: 'Walau satu ayat', icon: '📖', done: false },
  { id: 'sholat', label: 'Cek jadwal sholat', subtitle: 'Tepat waktu', icon: '🕌', done: false },
  { id: 'sedekah', label: 'Sedekah / amal baik', subtitle: 'Sekecil apapun', icon: '💝', done: false },
  { id: 'nikmat', label: 'Catat satu nikmat', subtitle: 'Bersyukur hari ini', icon: '✨', done: false },
];

/**
 * Motivation messages based on completion count.
 */
const MOTIVATION_MESSAGES = [
  { min: 0, max: 0, message: 'Mulai dari satu kebaikan kecil.' },
  { min: 1, max: 2, message: 'Bagus, lanjutkan pelan-pelan.' },
  { min: 3, max: 4, message: 'Sedikit lagi, semoga istiqamah.' },
  { min: 5, max: Infinity, message: 'MasyaAllah, misi hari ini selesai.' },
];

/**
 * Get today's date string in YYYY-M-D format.
 * This matches the existing format used in HomePage.jsx.
 */
function getTodayDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * Safely parse JSON from localStorage.
 */
function safeJsonParse(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Safely save JSON to localStorage.
 */
function safeJsonSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${key}:`, e);
  }
}

/**
 * Get motivation message for completed count.
 */
function getMotivation(completedCount, totalCount) {
  // Special case for all complete
  if (completedCount >= totalCount && totalCount > 0) {
    return 'MasyaAllah, misi hari ini selesai.';
  }
  const match = MOTIVATION_MESSAGES.find(
    m => completedCount >= m.min && completedCount <= m.max
  );
  return match ? match.message : MOTIVATION_MESSAGES[0].message;
}

/**
 * useDailyMission hook
 *
 * Returns:
 * - missions: array of mission objects
 * - toggleMission: function(id) to toggle a mission
 * - completedCount: number of completed missions
 * - totalCount: total number of missions
 * - progressPercent: 0-100
 * - motivationMessage: contextual encouragement string
 * - allCompleted: boolean
 */
export default function useDailyMission() {
  const todayDateStr = useMemo(() => getTodayDateStr(), []);

  const [missions, setMissions] = useState(() => {
    try {
      const stored = safeJsonParse(LS_KEY_PROGRESS);
      if (stored && stored.date === todayDateStr && Array.isArray(stored.data)) {
        // Merge stored data with default missions to handle additions/removals
        const storedMap = {};
        stored.data.forEach(m => { storedMap[m.id] = m; });

        return DEFAULT_MISSIONS.map(def => ({
          ...def,
          done: storedMap[def.id] ? storedMap[def.id].done : false,
        }));
      }
    } catch (e) {
      console.warn('Daily missions parse error:', e);
    }
    return DEFAULT_MISSIONS.map(m => ({ ...m }));
  });

  const toggleMission = useCallback((id) => {
    setMissions(prev => {
      const next = prev.map(m =>
        m.id === id ? { ...m, done: !m.done } : m
      );
      safeJsonSave(LS_KEY_PROGRESS, { date: todayDateStr, data: next });
      return next;
    });
  }, [todayDateStr]);

  const completedCount = missions.filter(m => m.done).length;
  const totalCount = missions.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allCompleted = completedCount === totalCount && totalCount > 0;
  const motivationMessage = getMotivation(completedCount, totalCount);

  return {
    missions,
    toggleMission,
    completedCount,
    totalCount,
    progressPercent,
    allCompleted,
    motivationMessage,
    todayDateStr,
  };
}

// Export constants for external use (e.g., RuangSayaPage reading mission data)
export { LS_KEY_PROGRESS, DEFAULT_MISSIONS, getMotivation, safeJsonParse, getTodayDateStr };
