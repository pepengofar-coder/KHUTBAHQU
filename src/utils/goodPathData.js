export const DEFAULT_GOOD_PATH_HABITS = [
  {
    id: 'gp-subuh',
    title: 'Sholat Subuh',
    category: 'Sholat',
    priority: 'Utama',
    icon: '🌙',
    defaultEnabled: true,
    frequency: 'Setiap hari',
    description: 'Menjaga sholat Subuh berjamaah atau tepat waktu.',
    purpose: 'Menjaga ibadah wajib di awal hari.',
    guide: 'Cek waktu sholat, siapkan alarm, dan usahakan sholat dengan tenang.',
    suggestedTarget: 'Setiap hari',
    reflectionPrompt: 'Apa yang membantu kamu bangun lebih baik hari ini?',
    isCustom: false
  },
  {
    id: 'gp-dzuhur',
    title: 'Sholat Dzuhur',
    category: 'Sholat',
    priority: 'Utama',
    icon: '☀️',
    defaultEnabled: true,
    frequency: 'Setiap hari',
    description: 'Menjaga sholat Dzuhur berjamaah atau tepat waktu.',
    purpose: 'Menjaga ibadah di tengah aktivitas.',
    guide: 'Jeda sejenak dari pekerjaan/belajar.',
    suggestedTarget: 'Setiap hari',
    reflectionPrompt: 'Apa yang paling sering membuatmu menunda?',
    isCustom: false
  },
  {
    id: 'gp-ashar',
    title: 'Sholat Ashar',
    category: 'Sholat',
    priority: 'Utama',
    icon: '🌤️',
    defaultEnabled: true,
    frequency: 'Setiap hari',
    description: 'Menjaga sholat Ashar berjamaah atau tepat waktu.',
    purpose: 'Menjaga konsistensi di sore hari.',
    guide: 'Siapkan waktu sebelum aktivitas sore.',
    suggestedTarget: 'Setiap hari',
    reflectionPrompt: 'Bagaimana menjaga fokus saat hari mulai lelah?',
    isCustom: false
  },
  {
    id: 'gp-maghrib',
    title: 'Sholat Maghrib',
    category: 'Sholat',
    priority: 'Utama',
    icon: '🌇',
    defaultEnabled: true,
    frequency: 'Setiap hari',
    description: 'Menjaga sholat Maghrib berjamaah atau tepat waktu.',
    purpose: 'Menutup sore dengan ibadah.',
    guide: 'Perhatikan waktu Maghrib yang singkat.',
    suggestedTarget: 'Setiap hari',
    reflectionPrompt: 'Apa kebiasaan baik setelah Maghrib?',
    isCustom: false
  },
  {
    id: 'gp-isya',
    title: 'Sholat Isya',
    category: 'Sholat',
    priority: 'Utama',
    icon: '🌃',
    defaultEnabled: true,
    frequency: 'Setiap hari',
    description: 'Menjaga sholat Isya berjamaah atau tepat waktu.',
    purpose: 'Menutup hari dengan ibadah wajib.',
    guide: 'Jangan menunda terlalu lama.',
    suggestedTarget: 'Setiap hari',
    reflectionPrompt: 'Apa yang ingin diperbaiki sebelum tidur?',
    isCustom: false
  },
  {
    id: 'gp-quran',
    title: 'Baca Al-Qur\'an',
    category: 'Al-Qur\'an',
    priority: 'Sunnah',
    icon: '📖',
    defaultEnabled: true,
    frequency: 'Setiap hari',
    description: 'Membaca Al-Qur\'an setiap hari walau satu ayat.',
    purpose: 'Mendekatkan diri dengan Al-Qur\'an.',
    guide: 'Mulai dari 1–5 ayat, lanjutkan perlahan.',
    suggestedTarget: '1-5 ayat setiap hari',
    reflectionPrompt: 'Ayat apa yang menenangkan hati hari ini?',
    isCustom: false
  },
  {
    id: 'gp-dzikir-pagi',
    title: 'Dzikir Pagi',
    category: 'Dzikir',
    priority: 'Sunnah',
    icon: '🌅',
    defaultEnabled: true,
    frequency: 'Setiap hari',
    description: 'Membaca dzikir pagi untuk perlindungan harian.',
    purpose: 'Memulai hari dengan mengingat Allah.',
    guide: 'Baca perlahan setelah Subuh atau saat pagi.',
    suggestedTarget: 'Setiap pagi',
    reflectionPrompt: 'Bagaimana dzikir mempengaruhi awal harimu?',
    isCustom: false
  },
  {
    id: 'gp-dzikir-petang',
    title: 'Dzikir Petang',
    category: 'Dzikir',
    priority: 'Sunnah',
    icon: '🌇',
    defaultEnabled: true,
    frequency: 'Setiap hari',
    description: 'Membaca dzikir petang sebagai penutup aktivitas.',
    purpose: 'Menutup aktivitas dengan ketenangan.',
    guide: 'Baca setelah Ashar atau menjelang malam.',
    suggestedTarget: 'Setiap sore',
    reflectionPrompt: 'Apa yang kamu syukuri hari ini?',
    isCustom: false
  },
  {
    id: 'gp-tilawah',
    title: 'Tilawah',
    category: 'Al-Qur\'an',
    priority: 'Sunnah',
    icon: '🎧',
    defaultEnabled: true,
    frequency: 'Fleksibel',
    description: 'Mendengarkan lantunan Al-Qur\'an.',
    purpose: 'Menghadirkan bacaan Qur\'an dalam aktivitas.',
    guide: 'Dengarkan saat santai atau perjalanan.',
    suggestedTarget: 'Setiap hari / saat luang',
    reflectionPrompt: 'Qari/tilawah apa yang membuatmu lebih tenang?',
    isCustom: false
  },
  {
    id: 'gp-sedekah',
    title: 'Sedekah',
    category: 'Amal',
    priority: 'Sunnah',
    icon: '💝',
    defaultEnabled: true,
    frequency: 'Fleksibel',
    description: 'Berbagi rezeki atau bantuan kepada yang membutuhkan.',
    purpose: 'Melatih kepedulian.',
    guide: 'Mulai dari nominal kecil atau bantuan sederhana.',
    suggestedTarget: 'Sesuai kemampuan',
    reflectionPrompt: 'Kebaikan kecil apa yang bisa kamu bagikan?',
    isCustom: false
  },
  {
    id: 'gp-kajian',
    title: 'Kajian Ringan',
    category: 'Ilmu',
    priority: 'Opsional',
    icon: '📚',
    defaultEnabled: true,
    frequency: 'Fleksibel',
    description: 'Menonton atau mendengarkan kajian singkat.',
    purpose: 'Menambah ilmu secara bertahap.',
    guide: 'Dengarkan 5–10 menit dari sumber terpercaya.',
    suggestedTarget: '1 video/audio per hari',
    reflectionPrompt: 'Satu pelajaran apa yang kamu dapat?',
    isCustom: false
  },
  {
    id: 'gp-lisan',
    title: 'Jaga Lisan',
    category: 'Akhlak',
    priority: 'Akhlak',
    icon: '🤐',
    defaultEnabled: true,
    frequency: 'Setiap hari',
    description: 'Menjaga ucapan dari hal yang sia-sia atau menyakiti.',
    purpose: 'Menjaga ucapan agar lebih baik.',
    guide: 'Tahan komentar negatif, pilih kata lembut.',
    suggestedTarget: 'Sepanjang hari',
    reflectionPrompt: 'Kapan kamu berhasil menahan lisan?',
    isCustom: false
  },
  {
    id: 'gp-refleksi',
    title: 'Refleksi Malam',
    category: 'Akhlak',
    priority: 'Sunnah',
    icon: '📓',
    defaultEnabled: true,
    frequency: 'Setiap malam',
    description: 'Mengingat kembali apa yang sudah dilakukan hari ini.',
    purpose: 'Muhasabah sebelum tidur.',
    guide: 'Tulis satu syukur dan satu hal yang ingin diperbaiki.',
    suggestedTarget: 'Sebelum tidur',
    reflectionPrompt: 'Apa satu pelajaran hari ini?',
    isCustom: false
  }
];

export const GOOD_PATH_LS_KEYS = {
  HABITS: 'islamediaku_good_path_custom_habits', // Stores custom habits
  DISABLED: 'islamediaku_good_path_disabled', // Stores disabled default habit IDs
  PROGRESS: 'islamediaku_good_path_progress', // Stores daily completion status
  NOTES: 'islamediaku_good_path_habit_notes' // Stores user notes per habit per day
};

export function getTodayKey() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localD = new Date(d.getTime() - (offset * 60 * 1000));
  return localD.toISOString().split('T')[0];
}

function safeParse(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function safeSave(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

// Data fetching
export function getCustomHabits() {
  return safeParse(GOOD_PATH_LS_KEYS.HABITS, []);
}

export function saveCustomHabits(habits) {
  safeSave(GOOD_PATH_LS_KEYS.HABITS, habits);
}

export function getDisabledHabits() {
  return safeParse(GOOD_PATH_LS_KEYS.DISABLED, []);
}

export function saveDisabledHabits(ids) {
  safeSave(GOOD_PATH_LS_KEYS.DISABLED, ids);
}

export function getHabits() {
  const custom = getCustomHabits();
  const disabled = getDisabledHabits();
  
  const activeDefaults = DEFAULT_GOOD_PATH_HABITS.map(h => ({
    ...h,
    enabled: !disabled.includes(h.id)
  }));
  
  const activeCustoms = custom.map(h => ({
    ...h,
    enabled: true // Custom habits can be deleted, not disabled, but we track them here
  }));
  
  return [...activeDefaults, ...activeCustoms];
}

export function getHabitProgress() {
  return safeParse(GOOD_PATH_LS_KEYS.PROGRESS, {});
}

export function toggleHabitProgress(habitId, date) {
  const progress = getHabitProgress();
  if (!progress[date]) progress[date] = {};
  progress[date][habitId] = !progress[date][habitId];
  safeSave(GOOD_PATH_LS_KEYS.PROGRESS, progress);
  return progress;
}

export function getHabitNotes() {
  return safeParse(GOOD_PATH_LS_KEYS.NOTES, []);
}

export function saveHabitNote(habitId, date, noteText) {
  let notes = getHabitNotes();
  const index = notes.findIndex(n => n.habitId === habitId && n.date === date);
  if (index >= 0) {
    if (noteText.trim() === '') {
      notes.splice(index, 1);
    } else {
      notes[index].note = noteText;
    }
  } else if (noteText.trim() !== '') {
    notes.push({ date, habitId, note: noteText });
  }
  safeSave(GOOD_PATH_LS_KEYS.NOTES, notes);
}

export function getHabitNoteForDate(habitId, date) {
  const notes = getHabitNotes();
  const found = notes.find(n => n.habitId === habitId && n.date === date);
  return found ? found.note : '';
}

export function calculateHabitStats(habitId) {
  const progress = getHabitProgress();
  const today = getTodayKey();
  
  let completedToday = false;
  if (progress[today] && progress[today][habitId]) {
    completedToday = true;
  }
  
  // Weekly (Last 7 days)
  let completedThisWeek = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (progress[dateStr] && progress[dateStr][habitId]) {
      completedThisWeek++;
    }
  }
  
  // Monthly (Last 30 days)
  let completedThisMonth = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (progress[dateStr] && progress[dateStr][habitId]) {
      completedThisMonth++;
    }
  }
  
  return { completedToday, completedThisWeek, completedThisMonth };
}
