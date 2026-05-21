import { useState, useCallback } from 'react';
import {
  getDailyProgress,
  updateDailyMission,
  getMotivation,
  MISSIONS,
} from '../utils/dailyProgress';

/**
 * useDailyMission — React hook for homepage Daily Mission card.
 *
 * Reads/writes via the unified dailyProgress helper,
 * so Tracker and Ruang Saya always see the same data.
 */
export default function useDailyMission() {
  const [data, setData] = useState(() => getDailyProgress());

  const missions = MISSIONS.map(m => ({
    ...m,
    done: !!data.missions[m.id],
  }));

  const toggleMission = useCallback((id) => {
    setData(prev => updateDailyMission(id, prev));
  }, []);

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
  };
}
