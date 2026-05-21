/**
 * dailyProgress.js — Unified daily progress helper for Islamediaku.
 *
 * Single source of truth for daily mission + tracker data.
 * Used by: HomePage (DailyMission), TrackerPage, RuangSayaPage, SettingsPage.
 *
 * Primary key: islamediaku_daily_progress
 * Legacy keys kept readable for backward compat.
 */

// ─── Constants ───

/** Primary unified key */
export const LS_KEY = 'islamediaku_daily_progress';

/** Legacy keys (read for migration, kept for DoaDzikir compat) */
export const LEGACY_KEYS = {
  missionProgress: 'islamediaku_daily_mission_progress',
  trackerDaily: 'islamediaku_tracker_daily',
  stepsDaily: 'islamediaku_steps_daily',
  stepsTarget: 'islamediaku_steps_target',
  stepsActivityLog: 'islamediaku_steps_activity_log',
  dzikirPagi: 'islamediaku_dzikir_pagi_progress',
  dzikirPetang: 'islamediaku_dzikir_petang_progress',
  gratitudeNotes: 'islamediaku_gratitude_notes',
};

/** Mission items shown on homepage card */
export const MISSIONS = [
  { id: 'dzikir', label: 'Dzikir pagi/petang', subtitle: 'Lindungi harimu', icon: '🌅' },
  { id: 'quran', label: 'Baca Al-Qur\'an', subtitle: 'Walau satu ayat', icon: '📖' },
  { id: 'sholat', label: 'Cek jadwal sholat', subtitle: 'Tepat waktu', icon: '🕌' },
  { id: 'sedekah', label: 'Sedekah / amal baik', subtitle: 'Sekecil apapun', icon: '💝' },
  { id: 'syukur', label: 'Catatan syukur', subtitle: 'Bersyukur hari ini', icon: '✨' },
];

/** Tracker ibadah items (full list) */
export const TRACKER_ITEMS = [
  { id: 'subuh', label: 'Sholat Subuh', icon: '🌙', group: 'sholat' },
  { id: 'dzuhur', label: 'Sholat Dzuhur', icon: '☀️', group: 'sholat' },
  { id: 'ashar', label: 'Sholat Ashar', icon: '🌤️', group: 'sholat' },
  { id: 'maghrib', label: 'Sholat Maghrib', icon: '🌇', group: 'sholat' },
  { id: 'isya', label: 'Sholat Isya', icon: '🌃', group: 'sholat' },
  { id: 'dzikir_pagi', label: 'Dzikir Pagi', icon: '🌅', group: 'sunnah' },
  { id: 'dzikir_petang', label: 'Dzikir Petang', icon: '🌇', group: 'sunnah' },
  { id: 'tilawah', label: 'Tilawah', icon: '📖', group: 'sunnah' },
  { id: 'sedekah', label: 'Sedekah', icon: '💝', group: 'sunnah' },
];

// ─── Date Helpers ───

/** Get today as YYYY-MM-DD in local timezone. */
export function getTodayKey() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localD = new Date(d.getTime() - (offset * 60 * 1000));
  return localD.toISOString().split('T')[0];
}

// ─── Safe JSON Helpers ───

export function safeParseJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function safeSaveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[dailyProgress] Failed to save ${key}:`, e);
  }
}

// ─── Data Shape ───
// {
//   date: "YYYY-MM-DD",
//   missions: { dzikir: bool, quran: bool, sholat: bool, sedekah: bool, syukur: bool },
//   tracker:  { subuh: bool, dzuhur: bool, ashar: bool, maghrib: bool, isya: bool,
//               dzikir_pagi: bool, dzikir_petang: bool, tilawah: bool, sedekah: bool },
//   updatedAt: ISO string
// }

/** Build fresh empty progress for today. */
function freshProgress(date) {
  const missions = {};
  MISSIONS.forEach(m => { missions[m.id] = false; });
  const tracker = {};
  TRACKER_ITEMS.forEach(t => { tracker[t.id] = false; });
  return { date, missions, tracker, updatedAt: new Date().toISOString() };
}

// ─── Core API ───

/**
 * Get today's daily progress. Creates fresh if date mismatch or missing.
 * Also migrates legacy data on first load.
 */
export function getDailyProgress() {
  const today = getTodayKey();
  const stored = safeParseJSON(LS_KEY);

  if (stored && stored.date === today && stored.missions && stored.tracker) {
    return stored;
  }

  // Date changed or first load — create fresh, attempt legacy migration
  const data = freshProgress(today);
  migrateLegacy(data, today);
  safeSaveJSON(LS_KEY, data);
  return data;
}

/**
 * Save daily progress and update legacy keys for backward compat.
 */
export function saveDailyProgress(data) {
  data.updatedAt = new Date().toISOString();
  safeSaveJSON(LS_KEY, data);
  syncToLegacyKeys(data);
}

/**
 * Toggle a mission by id. Returns updated data.
 */
export function updateDailyMission(id, data) {
  if (!data || !data.missions) return data;
  const next = {
    ...data,
    missions: { ...data.missions, [id]: !data.missions[id] },
  };
  saveDailyProgress(next);
  return next;
}

/**
 * Toggle a tracker ibadah item. Returns updated data.
 */
export function updateTrackerItem(id, data) {
  if (!data || !data.tracker) return data;
  const next = {
    ...data,
    tracker: { ...data.tracker, [id]: !data.tracker[id] },
  };

  // Auto-sync tracker → mission mappings
  syncTrackerToMissions(next);
  saveDailyProgress(next);
  return next;
}

/**
 * Get summary for Ruang Saya dashboard.
 */
export function getRuangSayaSummary() {
  const data = getDailyProgress();
  const missionEntries = Object.values(data.missions || {});
  const trackerEntries = Object.values(data.tracker || {});

  const missionDone = missionEntries.filter(Boolean).length;
  const missionTotal = missionEntries.length;
  const trackerDone = trackerEntries.filter(Boolean).length;
  const trackerTotal = trackerEntries.length;

  // Sholat subset
  const sholatIds = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  const sholatDone = sholatIds.filter(id => data.tracker[id]).length;

  const totalAll = missionTotal + trackerTotal;
  const doneAll = missionDone + trackerDone;
  const percent = totalAll > 0 ? Math.min(Math.round((doneAll / totalAll) * 100), 100) : 0;

  return {
    data,
    missionDone,
    missionTotal,
    trackerDone,
    trackerTotal,
    sholatDone,
    sholatTotal: 5,
    totalAll,
    doneAll,
    percent,
  };
}

/**
 * Get motivation message based on mission completion.
 */
export function getMotivation(doneCount, totalCount) {
  if (doneCount >= totalCount && totalCount > 0) return 'MasyaAllah, misi hari ini selesai.';
  if (doneCount >= 3) return 'Sedikit lagi, semoga istiqamah.';
  if (doneCount >= 1) return 'Bagus, lanjutkan pelan-pelan.';
  return 'Mulai dari satu kebaikan kecil.';
}

// ─── Sync Helpers ───

/**
 * When tracker items change, auto-update related missions:
 *   - dzikir_pagi OR dzikir_petang done → mission.dzikir = true
 *   - tilawah done → mission.quran = true
 *   - tracker.sedekah done → mission.sedekah = true
 */
function syncTrackerToMissions(data) {
  if (!data.missions || !data.tracker) return;

  // Dzikir: either pagi or petang → mission dzikir
  if (data.tracker.dzikir_pagi || data.tracker.dzikir_petang) {
    data.missions.dzikir = true;
  }
  // Tilawah → quran
  if (data.tracker.tilawah) {
    data.missions.quran = true;
  }
  // Sedekah → sedekah
  if (data.tracker.sedekah) {
    data.missions.sedekah = true;
  }
}

/**
 * On first load of day, read from legacy keys if new key is empty.
 */
function migrateLegacy(data, today) {
  try {
    // Migrate old mission progress
    const oldMission = safeParseJSON(LEGACY_KEYS.missionProgress);
    if (oldMission && oldMission.data && Array.isArray(oldMission.data)) {
      // Old format used YYYY-M-D, new uses YYYY-MM-DD — check both
      const oldDate = oldMission.date;
      const d = new Date();
      const oldStyleDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      if (oldDate === today || oldDate === oldStyleDate) {
        oldMission.data.forEach(m => {
          if (m.done && data.missions.hasOwnProperty(m.id)) {
            data.missions[m.id] = true;
          }
          // Map old 'nikmat' id to new 'syukur'
          if (m.id === 'nikmat' && m.done) {
            data.missions.syukur = true;
          }
        });
      }
    }

    // Migrate old tracker data
    const oldTracker = safeParseJSON(LEGACY_KEYS.trackerDaily, {});
    const oldTrackerToday = oldTracker[today];
    if (oldTrackerToday && typeof oldTrackerToday === 'object') {
      Object.keys(oldTrackerToday).forEach(key => {
        if (data.tracker.hasOwnProperty(key) && oldTrackerToday[key]) {
          data.tracker[key] = true;
        }
      });
    }

    // Apply tracker → mission sync after migration
    syncTrackerToMissions(data);
  } catch (e) {
    console.warn('[dailyProgress] Legacy migration failed:', e);
  }
}

/**
 * Write back to legacy keys so DoaDzikirPage, SettingsPage, etc. still work.
 */
function syncToLegacyKeys(data) {
  try {
    // Write to old mission key (array format)
    const missionArr = MISSIONS.map(m => ({
      id: m.id,
      label: m.label,
      subtitle: m.subtitle,
      icon: m.icon,
      done: !!data.missions[m.id],
    }));
    const d = new Date();
    const oldStyleDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    safeSaveJSON(LEGACY_KEYS.missionProgress, { date: oldStyleDate, data: missionArr });

    // Write to old tracker key
    const oldTracker = safeParseJSON(LEGACY_KEYS.trackerDaily, {});
    oldTracker[data.date] = { ...data.tracker };
    safeSaveJSON(LEGACY_KEYS.trackerDaily, oldTracker);
  } catch (e) {
    console.warn('[dailyProgress] Legacy sync failed:', e);
  }
}

// ─── Reset ───

/**
 * Remove all daily progress keys (for Settings reset).
 */
export function resetAllDailyProgress() {
  try { localStorage.removeItem(LS_KEY); } catch { /* safe */ }
  Object.values(LEGACY_KEYS).forEach(key => {
    try { localStorage.removeItem(key); } catch { /* safe */ }
  });
}
