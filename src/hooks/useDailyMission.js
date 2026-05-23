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

  const isFriday = new Date().getDay() === 5;
  
  const fridayMissions = [
    { id: 'alkahfi', label: 'Baca Surah Al-Kahfi', subtitle: 'Sunnah hari Jumat', icon: '📖' },
    { id: 'shalawat', label: 'Perbanyak Shalawat', subtitle: 'Nabi Muhammad ﷺ', icon: '📿' },
    { id: 'sedekah_jumat', label: 'Sedekah Jumat', subtitle: 'Hari penuh berkah', icon: '💝' },
    { id: 'jumat', label: 'Amalan Jumat', subtitle: 'Jika sholat Jumat, datang lebih awal', icon: '🕌' },
    { id: 'syukur', label: 'Catatan syukur', subtitle: 'Bersyukur hari ini', icon: '✨' },
  ];

  const activeMissions = isFriday ? fridayMissions : MISSIONS;

  const missions = activeMissions.map(m => ({
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
  
  let motivationMessage = getMotivation(completedCount, totalCount);
  if (isFriday && completedCount === 0) {
    motivationMessage = "Hari Jumat, perbanyak shalawat dan kebaikan.";
  }

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
