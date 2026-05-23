import { useState, useCallback } from 'react';
import { useI18n } from '../context/I18nContext';
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

  const { t } = useI18n();
  const isFriday = new Date().getDay() === 5;
  
  const fridayMissions = [
    { id: 'alkahfi', label: t('mission.friday.alkahfi'), subtitle: '', icon: '📖' },
    { id: 'shalawat', label: t('mission.friday.shalawat'), subtitle: '', icon: '📿' },
    { id: 'sedekah_jumat', label: t('mission.friday.sedekah'), subtitle: '', icon: '💝' },
    { id: 'jumat', label: t('mission.friday.jumuah'), subtitle: '', icon: '🕌' },
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
