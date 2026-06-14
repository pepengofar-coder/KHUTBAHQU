/**
 * Home Workout Data for Islamediaku — Good Path
 * All exercises are bodyweight-based, safe for home use.
 */

export const SAFETY_DISCLAIMER = 
  'Fitur ini hanya panduan kebugaran umum. Hentikan latihan jika merasa nyeri, pusing, sesak napas tidak wajar, atau nyeri dada. ' +
  'Konsultasikan dengan tenaga medis profesional sebelum memulai program latihan jika Anda memiliki cedera, sedang hamil, ' +
  'memiliki penyakit kronis, atau kondisi medis tertentu.';

export const SAFETY_DISCLAIMER_EN = 
  'This feature is for general fitness guidance only. Stop if you feel pain, dizziness, chest discomfort, or unusual shortness of breath.';

export const CATEGORIES = [
  { id: 'beginner', label: 'Beginner', emoji: '🌱', color: '#10b981' },
  { id: 'intermediate', label: 'Intermediate', emoji: '💪', color: '#f59e0b' },
  { id: 'advanced', label: 'Advanced', emoji: '🔥', color: '#ef4444' },
  { id: 'fat-loss', label: 'Fat Loss', emoji: '🏃', color: '#ec4899' },
  { id: 'strength', label: 'Strength', emoji: '🏋️', color: '#8b5cf6' },
  { id: 'mobility', label: 'Mobility & Flexibility', emoji: '🧘', color: '#06b6d4' },
  { id: 'low-impact', label: 'Low Impact', emoji: '🦶', color: '#14b8a6' },
  { id: 'no-equipment', label: 'No Equipment', emoji: '🏠', color: '#6366f1' },
];

export const WARMUP_EXERCISES = [
  { id: 'w1', name: 'Neck Rotation', nameId: 'Rotasi Leher', duration: 30, reps: null, instruction: 'Putar kepala perlahan searah jarum jam, lalu balik. 5 putaran tiap arah.', lowImpact: 'Lakukan lebih pelan jika terasa tegang.' },
  { id: 'w2', name: 'Shoulder Circles', nameId: 'Putaran Bahu', duration: 30, reps: null, instruction: 'Angkat bahu ke depan dan putar ke belakang secara perlahan. 10 putaran tiap arah.', lowImpact: null },
  { id: 'w3', name: 'Arm Swings', nameId: 'Ayunan Lengan', duration: 30, reps: 20, instruction: 'Ayunkan kedua lengan ke depan dan belakang secara bergantian. Jaga postur tegak.', lowImpact: null },
  { id: 'w4', name: 'Hip Rotation', nameId: 'Rotasi Pinggul', duration: 30, reps: null, instruction: 'Letakkan tangan di pinggang, putar pinggul membentuk lingkaran besar. 5 putaran tiap arah.', lowImpact: null },
  { id: 'w5', name: 'March in Place', nameId: 'Jalan di Tempat', duration: 45, reps: null, instruction: 'Angkat lutut bergantian setinggi pinggang sambil mengayunkan lengan.', lowImpact: 'Kurangi tinggi angkatan lutut.' },
  { id: 'w6', name: 'Step Jack', nameId: 'Step Jack (Low Impact)', duration: 30, reps: null, instruction: 'Langkahkan kaki ke samping kanan, angkat tangan ke atas, lalu kembali. Bergantian kiri-kanan.', lowImpact: 'Tetap satu kaki di lantai sepanjang waktu.' },
  { id: 'w7', name: 'Dynamic Hamstring Stretch', nameId: 'Peregangan Hamstring Dinamis', duration: 30, reps: 10, instruction: 'Berdiri, ayunkan satu kaki ke depan lurus tanpa membungkuk berlebihan. Bergantian.', lowImpact: 'Kurangi ketinggian ayunan.' },
];

export const MAIN_EXERCISES = [
  { id: 'm1', name: 'Squat', nameId: 'Squat', duration: null, reps: 12, sets: 3, rest: 30, target: 'Kaki & Glutes', instruction: 'Berdiri selebar bahu. Turunkan tubuh seperti duduk di kursi. Lutut tidak melewati ujung jari kaki. Dorong pinggul ke belakang.', lowImpact: 'Half squat — turun setengah saja.', caloriePerSet: 8 },
  { id: 'm2', name: 'Push-up', nameId: 'Push-up', duration: null, reps: 10, sets: 3, rest: 30, target: 'Dada & Trisep', instruction: 'Posisi plank, tangan selebar bahu. Turunkan dada hingga hampir menyentuh lantai. Dorong kembali.', lowImpact: 'Knee push-up (lutut di lantai) atau wall push-up.', caloriePerSet: 7 },
  { id: 'm3', name: 'Lunges', nameId: 'Lunges', duration: null, reps: 10, sets: 3, rest: 30, target: 'Kaki & Glutes', instruction: 'Langkahkan satu kaki ke depan, turunkan lutut belakang hampir menyentuh lantai. Bergantian.', lowImpact: 'Reverse lunge atau step back lunge.', caloriePerSet: 9 },
  { id: 'm4', name: 'Glute Bridge', nameId: 'Glute Bridge', duration: null, reps: 15, sets: 3, rest: 20, target: 'Glutes & Core', instruction: 'Berbaring, tekuk lutut, kaki rata di lantai. Angkat pinggul hingga tubuh lurus dari bahu ke lutut. Tahan 2 detik.', lowImpact: null, caloriePerSet: 5 },
  { id: 'm5', name: 'Plank', nameId: 'Plank', duration: 30, reps: null, sets: 3, rest: 30, target: 'Core', instruction: 'Posisi push-up, tahan tubuh lurus dari kepala hingga tumit. Kencangkan perut. Jangan biarkan pinggul turun.', lowImpact: 'Plank dengan lutut di lantai.', caloriePerSet: 4 },
  { id: 'm6', name: 'Mountain Climber', nameId: 'Mountain Climber', duration: 30, reps: null, sets: 3, rest: 30, target: 'Core & Kardio', instruction: 'Dari posisi plank, tarik lutut ke dada secara bergantian dengan cepat.', lowImpact: 'Lakukan perlahan, satu kaki pada satu waktu.', caloriePerSet: 10 },
  { id: 'm7', name: 'High Knees', nameId: 'High Knees', duration: 30, reps: null, sets: 3, rest: 30, target: 'Kardio & Kaki', instruction: 'Berlari di tempat sambil mengangkat lutut setinggi mungkin. Ayunkan lengan.', lowImpact: 'March in place — jalan di tempat biasa.', caloriePerSet: 12 },
  { id: 'm8', name: 'Superman Hold', nameId: 'Superman Hold', duration: 20, reps: null, sets: 3, rest: 20, target: 'Punggung & Core', instruction: 'Tengkurap, angkat kedua lengan dan kaki secara bersamaan dari lantai. Tahan.', lowImpact: 'Angkat lengan dan kaki berlawanan secara bergantian (Bird Dog).', caloriePerSet: 4 },
  { id: 'm9', name: 'Bird Dog', nameId: 'Bird Dog', duration: null, reps: 10, sets: 3, rest: 20, target: 'Core & Keseimbangan', instruction: 'Posisi merangkak, luruskan lengan kanan dan kaki kiri secara bersamaan. Tahan 2 detik. Bergantian.', lowImpact: null, caloriePerSet: 4 },
  { id: 'm10', name: 'Side Plank', nameId: 'Side Plank', duration: 20, reps: null, sets: 2, rest: 20, target: 'Core Samping', instruction: 'Berbaring menyamping, angkat tubuh dengan siku. Tahan posisi lurus. Lakukan kedua sisi.', lowImpact: 'Tekuk lutut bawah untuk penopang.', caloriePerSet: 4 },
  { id: 'm11', name: 'Calf Raise', nameId: 'Calf Raise', duration: null, reps: 20, sets: 3, rest: 15, target: 'Betis', instruction: 'Berdiri tegak, angkat tumit setinggi mungkin, tahan 1 detik, turunkan perlahan.', lowImpact: null, caloriePerSet: 3 },
];

export const COOLDOWN_EXERCISES = [
  { id: 'c1', name: 'Deep Breathing', nameId: 'Pernapasan Dalam', duration: 60, instruction: 'Tarik napas dalam 4 detik, tahan 4 detik, hembuskan 6 detik. Ulangi 5-8 kali.' },
  { id: 'c2', name: "Child's Pose", nameId: 'Child\'s Pose', duration: 30, instruction: 'Berlutut, duduk ke tumit, rentangkan lengan ke depan di lantai. Relaksasikan punggung.' },
  { id: 'c3', name: 'Hamstring Stretch', nameId: 'Peregangan Hamstring', duration: 30, instruction: 'Duduk, luruskan satu kaki, tekuk kaki lain. Raih ujung kaki yang lurus. Tahan 15 detik tiap sisi.' },
  { id: 'c4', name: 'Quad Stretch', nameId: 'Peregangan Quad', duration: 30, instruction: 'Berdiri, pegang pergelangan kaki belakang, tarik tumit ke bokong. Tahan 15 detik tiap sisi.' },
  { id: 'c5', name: 'Shoulder Stretch', nameId: 'Peregangan Bahu', duration: 30, instruction: 'Silangkan satu lengan di depan dada, tekan dengan tangan lain. Tahan 15 detik tiap sisi.' },
  { id: 'c6', name: 'Cat-Cow Stretch', nameId: 'Peregangan Cat-Cow', duration: 30, instruction: 'Posisi merangkak, lengkungkan punggung ke atas (cat), lalu ke bawah (cow). Ulangi 8 kali perlahan.' },
  { id: 'c7', name: 'Seated Forward Fold', nameId: 'Duduk Membungkuk ke Depan', duration: 30, instruction: 'Duduk dengan kaki lurus, perlahan raih ujung kaki sambil menjaga punggung lurus. Tahan 20 detik.' },
];

export const WEEKLY_PLAN = [
  { day: 'Senin', focus: 'Full Body Beginner', programId: 'prog-beginner-full', emoji: '💪', rest: false },
  { day: 'Selasa', focus: 'Mobility & Stretching', programId: 'prog-mobility', emoji: '🧘', rest: false },
  { day: 'Rabu', focus: 'Strength Focus', programId: 'prog-strength', emoji: '🏋️', rest: false },
  { day: 'Kamis', focus: 'Istirahat / Jalan Ringan', programId: null, emoji: '🌿', rest: true },
  { day: 'Jumat', focus: 'Cardio Low Impact', programId: 'prog-low-impact-cardio', emoji: '🏃', rest: false },
  { day: 'Sabtu', focus: 'Core & Flexibility', programId: 'prog-core-flex', emoji: '🔥', rest: false },
  { day: 'Minggu', focus: 'Istirahat', programId: null, emoji: '😴', rest: true },
];

export const WORKOUT_PROGRAMS = [
  {
    id: 'prog-beginner-full',
    title: 'Full Body Beginner',
    titleId: 'Full Body Pemula',
    category: 'beginner',
    difficulty: 'Easy',
    durationMinutes: 25,
    targetArea: 'Seluruh Tubuh',
    calorieEstimate: '~120-180 kcal',
    rounds: 2,
    safetyTip: 'Fokus pada gerakan yang benar, bukan kecepatan. Istirahat kapan saja jika diperlukan.',
    warmup: ['w5', 'w4', 'w6', 'w2'],
    exercises: [
      { exerciseId: 'm1', reps: 10, sets: 2, rest: 30 },
      { exerciseId: 'm2', reps: 8, sets: 2, rest: 30, note: 'Gunakan knee push-up jika perlu' },
      { exerciseId: 'm4', reps: 12, sets: 2, rest: 20 },
      { exerciseId: 'm5', duration: 20, sets: 2, rest: 30 },
      { exerciseId: 'm11', reps: 15, sets: 2, rest: 15 },
    ],
    cooldown: ['c1', 'c2', 'c3', 'c5'],
  },
  {
    id: 'prog-strength',
    title: 'Strength Builder',
    titleId: 'Pembangun Kekuatan',
    category: 'strength',
    difficulty: 'Medium',
    durationMinutes: 35,
    targetArea: 'Dada, Kaki, Core',
    calorieEstimate: '~180-250 kcal',
    rounds: 3,
    safetyTip: 'Jaga postur sepanjang latihan. Jangan menahan napas saat mengangkat atau menahan posisi.',
    warmup: ['w5', 'w3', 'w4', 'w7'],
    exercises: [
      { exerciseId: 'm1', reps: 15, sets: 3, rest: 30 },
      { exerciseId: 'm2', reps: 12, sets: 3, rest: 30 },
      { exerciseId: 'm3', reps: 12, sets: 3, rest: 30 },
      { exerciseId: 'm4', reps: 15, sets: 3, rest: 20 },
      { exerciseId: 'm8', duration: 25, sets: 3, rest: 20 },
      { exerciseId: 'm10', duration: 20, sets: 2, rest: 20 },
    ],
    cooldown: ['c1', 'c2', 'c3', 'c4', 'c6'],
  },
  {
    id: 'prog-mobility',
    title: 'Mobility & Flexibility',
    titleId: 'Mobilitas & Fleksibilitas',
    category: 'mobility',
    difficulty: 'Easy',
    durationMinutes: 20,
    targetArea: 'Seluruh Tubuh',
    calorieEstimate: '~60-100 kcal',
    rounds: 1,
    safetyTip: 'Bergerak perlahan dan hati-hati. Jangan memaksakan peregangan hingga terasa sakit.',
    warmup: ['w1', 'w2', 'w4'],
    exercises: [
      { exerciseId: 'm9', reps: 8, sets: 2, rest: 15 },
      { exerciseId: 'm5', duration: 20, sets: 2, rest: 20 },
      { exerciseId: 'm10', duration: 15, sets: 2, rest: 15 },
      { exerciseId: 'm8', duration: 15, sets: 2, rest: 15 },
    ],
    cooldown: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
  },
  {
    id: 'prog-low-impact-cardio',
    title: 'Low Impact Cardio',
    titleId: 'Kardio Rendah Benturan',
    category: 'low-impact',
    difficulty: 'Easy',
    durationMinutes: 25,
    targetArea: 'Kardiovaskular',
    calorieEstimate: '~100-160 kcal',
    rounds: 2,
    safetyTip: 'Tetap satu kaki di lantai sepanjang waktu. Jaga napas teratur.',
    warmup: ['w5', 'w6', 'w2', 'w4'],
    exercises: [
      { exerciseId: 'm7', duration: 30, sets: 3, rest: 30, note: 'Gunakan march in place untuk low impact' },
      { exerciseId: 'm6', duration: 20, sets: 3, rest: 30, note: 'Lakukan perlahan' },
      { exerciseId: 'm1', reps: 12, sets: 2, rest: 20 },
      { exerciseId: 'm11', reps: 20, sets: 2, rest: 15 },
    ],
    cooldown: ['c1', 'c3', 'c4', 'c7'],
  },
  {
    id: 'prog-core-flex',
    title: 'Core & Flexibility',
    titleId: 'Core & Fleksibilitas',
    category: 'no-equipment',
    difficulty: 'Medium',
    durationMinutes: 30,
    targetArea: 'Core & Punggung',
    calorieEstimate: '~100-150 kcal',
    rounds: 3,
    safetyTip: 'Kencangkan perut sepanjang latihan core. Jangan biarkan punggung bawah melengkung ke bawah.',
    warmup: ['w1', 'w4', 'w5'],
    exercises: [
      { exerciseId: 'm5', duration: 30, sets: 3, rest: 30 },
      { exerciseId: 'm10', duration: 20, sets: 2, rest: 20 },
      { exerciseId: 'm6', duration: 25, sets: 3, rest: 30 },
      { exerciseId: 'm9', reps: 10, sets: 3, rest: 20 },
      { exerciseId: 'm8', duration: 20, sets: 3, rest: 20 },
      { exerciseId: 'm4', reps: 15, sets: 3, rest: 20 },
    ],
    cooldown: ['c1', 'c2', 'c6', 'c7'],
  },
  {
    id: 'prog-fat-burn',
    title: 'Fat Burn HIIT',
    titleId: 'Pembakaran Lemak HIIT',
    category: 'fat-loss',
    difficulty: 'Hard',
    durationMinutes: 30,
    targetArea: 'Seluruh Tubuh',
    calorieEstimate: '~200-300 kcal',
    rounds: 3,
    safetyTip: 'Istirahat jika jantung berdebar terlalu kencang. Minum air sedikit-sedikit.',
    warmup: ['w5', 'w6', 'w3', 'w7'],
    exercises: [
      { exerciseId: 'm7', duration: 30, sets: 3, rest: 20 },
      { exerciseId: 'm1', reps: 15, sets: 3, rest: 20 },
      { exerciseId: 'm6', duration: 30, sets: 3, rest: 20 },
      { exerciseId: 'm2', reps: 12, sets: 3, rest: 20 },
      { exerciseId: 'm3', reps: 12, sets: 3, rest: 20 },
      { exerciseId: 'm5', duration: 30, sets: 3, rest: 20 },
    ],
    cooldown: ['c1', 'c2', 'c3', 'c4', 'c5'],
  },
];

// Helper: get exercise by ID
export function getWarmupById(id) { return WARMUP_EXERCISES.find(e => e.id === id); }
export function getMainById(id) { return MAIN_EXERCISES.find(e => e.id === id); }
export function getCooldownById(id) { return COOLDOWN_EXERCISES.find(e => e.id === id); }

// Helper: build full workout flow from program
export function buildWorkoutFlow(program) {
  const warmup = program.warmup.map(id => ({ ...getWarmupById(id), phase: 'warmup' })).filter(Boolean);
  const exercises = program.exercises.map(ex => {
    const base = getMainById(ex.exerciseId);
    if (!base) return null;
    return { ...base, ...ex, phase: 'main' };
  }).filter(Boolean);
  const cooldown = program.cooldown.map(id => ({ ...getCooldownById(id), phase: 'cooldown' })).filter(Boolean);
  return [...warmup, ...exercises, ...cooldown];
}

// localStorage helpers for workout progress
const WK_PROGRESS_KEY = 'islamediaku_workout_progress';
const WK_FAVORITES_KEY = 'islamediaku_workout_favorites';
const WK_LAST_KEY = 'islamediaku_workout_last';

export function getWorkoutProgress() {
  try { return JSON.parse(localStorage.getItem(WK_PROGRESS_KEY)) || []; } catch { return []; }
}

export function saveWorkoutCompletion(programId, programTitle, durationMin) {
  const progress = getWorkoutProgress();
  progress.push({ date: new Date().toISOString().split('T')[0], programId, programTitle, durationMin, timestamp: Date.now() });
  // Keep last 90 entries
  const trimmed = progress.slice(-90);
  localStorage.setItem(WK_PROGRESS_KEY, JSON.stringify(trimmed));
}

export function getWorkoutFavorites() {
  try { return JSON.parse(localStorage.getItem(WK_FAVORITES_KEY)) || []; } catch { return []; }
}

export function toggleWorkoutFavorite(programId) {
  const favs = getWorkoutFavorites();
  const idx = favs.indexOf(programId);
  if (idx >= 0) favs.splice(idx, 1); else favs.push(programId);
  localStorage.setItem(WK_FAVORITES_KEY, JSON.stringify(favs));
  return favs;
}

export function getLastWorkout() {
  try { return JSON.parse(localStorage.getItem(WK_LAST_KEY)); } catch { return null; }
}

export function saveLastWorkout(programId, stepIndex) {
  localStorage.setItem(WK_LAST_KEY, JSON.stringify({ programId, stepIndex, timestamp: Date.now() }));
}

export function clearLastWorkout() {
  localStorage.removeItem(WK_LAST_KEY);
}
