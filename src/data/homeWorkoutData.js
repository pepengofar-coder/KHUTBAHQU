/**
 * HomeWorkout Data — Lengkap dengan silhouette images
 * Islamediaku — Olahraga di Rumah
 */

export const SAFETY_DISCLAIMER = '⚠️ Lakukan pemanasan sebelum latihan. Hentikan jika merasakan nyeri. Konsultasikan dengan dokter jika memiliki kondisi medis tertentu.';
export const SAFETY_DISCLAIMER_EN = 'Warm up before exercise. Stop if you feel pain. Consult a doctor if you have medical conditions.';

// ============ Exercise Library ============
export const EXERCISES = {
  // ---- Pemanasan ----
  arm_circles: {
    id: 'arm_circles', name: 'Arm Circles', nameId: 'Putaran Lengan',
    phase: 'warmup', duration: 30,
    instruction: 'Rentangkan kedua tangan ke samping, putar secara perlahan. 15 detik ke depan, 15 detik ke belakang.',
    image: '/images/workout/jumpingjack.png',
    muscles: ['Bahu', 'Lengan'],
  },
  neck_stretch: {
    id: 'neck_stretch', name: 'Neck Stretch', nameId: 'Peregangan Leher',
    phase: 'warmup', duration: 20,
    instruction: 'Miringkan kepala ke kiri dan kanan perlahan, tahan 5 detik setiap sisi.',
    image: '/images/workout/hero.png',
    muscles: ['Leher'],
  },
  high_knees_warmup: {
    id: 'high_knees_warmup', name: 'High Knees (Warmup)', nameId: 'Angkat Lutut Tinggi',
    phase: 'warmup', duration: 30,
    instruction: 'Berlari di tempat dengan mengangkat lutut setinggi pinggul. Jaga ritme stabil.',
    image: '/images/workout/jumpingjack.png',
    muscles: ['Paha', 'Core'],
  },
  jumping_jacks_warmup: {
    id: 'jumping_jacks_warmup', name: 'Jumping Jacks', nameId: 'Jumping Jacks',
    phase: 'warmup', duration: 30,
    instruction: 'Lompat sambil membuka kaki dan mengangkat tangan ke atas, lalu kembali ke posisi awal.',
    image: '/images/workout/jumpingjack.png',
    muscles: ['Seluruh Tubuh'],
  },
  hip_circles: {
    id: 'hip_circles', name: 'Hip Circles', nameId: 'Putaran Pinggul',
    phase: 'warmup', duration: 20,
    instruction: 'Tangan di pinggul, putar pinggul dalam lingkaran besar. 10 detik searah jarum jam, 10 detik berlawanan.',
    image: '/images/workout/squat.png',
    muscles: ['Pinggul', 'Core'],
  },

  // ---- Latihan Inti ----
  push_up: {
    id: 'push_up', name: 'Push-Up', nameId: 'Push-Up',
    phase: 'main', reps: 10, sets: 3, rest: 30,
    instruction: 'Posisi plank, turunkan badan hingga dada hampir menyentuh lantai. Dorong kembali ke atas. Jaga punggung lurus.',
    lowImpact: 'Lakukan dengan lutut di lantai.',
    image: '/images/workout/pushup.png',
    muscles: ['Dada', 'Trisep', 'Bahu'],
    calories: 8,
  },
  squat: {
    id: 'squat', name: 'Squat', nameId: 'Squat',
    phase: 'main', reps: 15, sets: 3, rest: 30,
    instruction: 'Berdiri dengan kaki selebar bahu. Turunkan pinggul seperti duduk di kursi. Lutut tidak melewati ujung jari kaki.',
    lowImpact: 'Tidak perlu turun terlalu dalam.',
    image: '/images/workout/squat.png',
    muscles: ['Paha', 'Glute', 'Core'],
    calories: 6,
  },
  lunge: {
    id: 'lunge', name: 'Lunge', nameId: 'Lunge',
    phase: 'main', reps: 10, sets: 3, rest: 30,
    note: '10 rep per kaki',
    instruction: 'Langkahkan satu kaki ke depan, tekuk kedua lutut hingga 90 derajat. Kembali berdiri dan ganti kaki.',
    lowImpact: 'Langkah lebih pendek, tidak perlu terlalu rendah.',
    image: '/images/workout/lunge.png',
    muscles: ['Paha', 'Glute', 'Betis'],
    calories: 7,
  },
  plank: {
    id: 'plank', name: 'Plank', nameId: 'Plank',
    phase: 'main', duration: 30, sets: 3, rest: 20,
    instruction: 'Posisi push-up dengan bertumpu pada lengan bawah. Jaga tubuh lurus dari kepala hingga tumit. Tahan.',
    lowImpact: 'Lakukan dengan lutut di lantai.',
    image: '/images/workout/plank.png',
    muscles: ['Core', 'Bahu', 'Punggung'],
    calories: 4,
  },
  jumping_jacks: {
    id: 'jumping_jacks', name: 'Jumping Jacks', nameId: 'Jumping Jacks',
    phase: 'main', reps: 20, sets: 3, rest: 20,
    instruction: 'Lompat sambil membuka kaki dan tangan ke atas, lalu kembali. Jaga ritme konstan.',
    lowImpact: 'Langkahkan kaki ke samping tanpa melompat.',
    image: '/images/workout/jumpingjack.png',
    muscles: ['Seluruh Tubuh', 'Kardio'],
    calories: 10,
  },
  mountain_climber: {
    id: 'mountain_climber', name: 'Mountain Climber', nameId: 'Mountain Climber',
    phase: 'main', reps: 20, sets: 3, rest: 20,
    note: '20 rep total (10 per kaki)',
    instruction: 'Posisi plank tinggi. Tarik lutut kanan ke dada, lalu ganti kiri dengan cepat seperti berlari.',
    lowImpact: 'Lakukan lebih lambat tanpa melompat.',
    image: '/images/workout/plank.png',
    muscles: ['Core', 'Bahu', 'Kardio'],
    calories: 12,
  },
  burpee: {
    id: 'burpee', name: 'Burpee', nameId: 'Burpee',
    phase: 'main', reps: 8, sets: 3, rest: 30,
    instruction: 'Berdiri → jongkok → lempar kaki ke belakang (plank) → push-up → tarik kaki → lompat ke atas.',
    lowImpact: 'Skip lompatan dan push-up.',
    image: '/images/workout/jumpingjack.png',
    muscles: ['Seluruh Tubuh'],
    calories: 15,
  },
  sit_up: {
    id: 'sit_up', name: 'Sit-Up', nameId: 'Sit-Up',
    phase: 'main', reps: 15, sets: 3, rest: 20,
    instruction: 'Berbaring dengan lutut ditekuk, tangan silang di dada. Angkat badan hingga duduk, turun perlahan.',
    lowImpact: 'Lakukan crunch (hanya angkat bahu).',
    image: '/images/workout/pushup.png',
    muscles: ['Perut', 'Core'],
    calories: 5,
  },
  glute_bridge: {
    id: 'glute_bridge', name: 'Glute Bridge', nameId: 'Glute Bridge',
    phase: 'main', reps: 15, sets: 3, rest: 20,
    instruction: 'Berbaring, kaki ditekuk rata di lantai. Angkat pinggul ke atas, tahan 2 detik, turun perlahan.',
    image: '/images/workout/squat.png',
    muscles: ['Glute', 'Paha belakang', 'Core'],
    calories: 4,
  },
  wall_sit: {
    id: 'wall_sit', name: 'Wall Sit', nameId: 'Wall Sit',
    phase: 'main', duration: 30, sets: 3, rest: 20,
    instruction: 'Bersandar di dinding, turun hingga paha sejajar lantai. Tahan posisi.',
    image: '/images/workout/squat.png',
    muscles: ['Paha', 'Glute'],
    calories: 3,
  },
  superman: {
    id: 'superman', name: 'Superman', nameId: 'Superman',
    phase: 'main', reps: 12, sets: 3, rest: 20,
    instruction: 'Tengkurap, angkat tangan dan kaki bersamaan dari lantai. Tahan 2 detik, turun perlahan.',
    image: '/images/workout/plank.png',
    muscles: ['Punggung bawah', 'Glute'],
    calories: 4,
  },
  calf_raise: {
    id: 'calf_raise', name: 'Calf Raise', nameId: 'Calf Raise',
    phase: 'main', reps: 20, sets: 3, rest: 15,
    instruction: 'Berdiri tegak, angkat tumit setinggi mungkin dengan berjinjit. Turun perlahan.',
    image: '/images/workout/lunge.png',
    muscles: ['Betis'],
    calories: 3,
  },
  tricep_dip: {
    id: 'tricep_dip', name: 'Tricep Dip', nameId: 'Tricep Dip',
    phase: 'main', reps: 10, sets: 3, rest: 20,
    instruction: 'Duduk di tepi kursi, tangan di sisi badan. Turunkan tubuh dengan menekuk siku, dorong kembali ke atas.',
    image: '/images/workout/pushup.png',
    muscles: ['Trisep', 'Bahu'],
    calories: 6,
  },

  // ---- Pendinginan ----
  quad_stretch: {
    id: 'quad_stretch', name: 'Quad Stretch', nameId: 'Peregangan Paha Depan',
    phase: 'cooldown', duration: 20,
    note: '10 detik per kaki',
    instruction: 'Berdiri satu kaki, tarik kaki lain ke belakang pegang pergelangan kaki. Tahan 10 detik per sisi.',
    image: '/images/workout/lunge.png',
    muscles: ['Paha depan'],
  },
  hamstring_stretch: {
    id: 'hamstring_stretch', name: 'Hamstring Stretch', nameId: 'Peregangan Paha Belakang',
    phase: 'cooldown', duration: 20,
    instruction: 'Duduk, luruskan satu kaki. Raih ujung jari kaki perlahan. Tahan 10 detik per kaki.',
    image: '/images/workout/plank.png',
    muscles: ['Paha belakang'],
  },
  child_pose: {
    id: 'child_pose', name: "Child's Pose", nameId: 'Pose Anak',
    phase: 'cooldown', duration: 30,
    instruction: 'Berlutut, duduk di tumit, rentangkan tangan ke depan di lantai. Rileks dan tarik napas dalam.',
    image: '/images/workout/plank.png',
    muscles: ['Punggung', 'Bahu'],
  },
  shoulder_stretch: {
    id: 'shoulder_stretch', name: 'Shoulder Stretch', nameId: 'Peregangan Bahu',
    phase: 'cooldown', duration: 20,
    instruction: 'Silangkan satu lengan di depan dada, tekan dengan tangan lain. 10 detik per lengan.',
    image: '/images/workout/jumpingjack.png',
    muscles: ['Bahu'],
  },
  deep_breathing: {
    id: 'deep_breathing', name: 'Deep Breathing', nameId: 'Pernapasan Dalam',
    phase: 'cooldown', duration: 30,
    instruction: 'Berdiri atau duduk rileks. Tarik napas dalam 4 detik, tahan 4 detik, buang 6 detik. Ulangi.',
    image: '/images/workout/hero.png',
    muscles: ['Relaksasi'],
  },
};

// ============ Categories ============
export const CATEGORIES = [
  { id: 'full_body', label: 'Full Body', emoji: '💪' },
  { id: 'upper', label: 'Upper Body', emoji: '🤸' },
  { id: 'lower', label: 'Lower Body', emoji: '🦵' },
  { id: 'core', label: 'Core & Abs', emoji: '🔥' },
  { id: 'cardio', label: 'Cardio', emoji: '❤️‍🔥' },
  { id: 'stretch', label: 'Peregangan', emoji: '🧘' },
];

// ============ Weekly Plan ============
export const WEEKLY_PLAN = [
  { day: 'Senin', focus: 'Full Body', emoji: '💪', programId: 'full_body_beginner' },
  { day: 'Selasa', focus: 'Upper Body', emoji: '🤸', programId: 'upper_body' },
  { day: 'Rabu', focus: 'Istirahat Aktif', emoji: '🧘', rest: true, programId: 'stretch_recovery' },
  { day: 'Kamis', focus: 'Lower Body', emoji: '🦵', programId: 'lower_body' },
  { day: 'Jumat', focus: 'Cardio HIIT', emoji: '❤️‍🔥', programId: 'cardio_hiit' },
  { day: 'Sabtu', focus: 'Core & Abs', emoji: '🔥', programId: 'core_abs' },
  { day: 'Ahad', focus: 'Istirahat', emoji: '🌙', rest: true },
];

// ============ Workout Programs ============
export const WORKOUT_PROGRAMS = [
  {
    id: 'full_body_beginner',
    title: 'Full Body Beginner',
    titleId: 'Full Body Pemula',
    category: 'full_body',
    difficulty: 'Easy',
    durationMinutes: 15,
    rounds: 1,
    targetArea: 'Seluruh Tubuh',
    calorieEstimate: '80-120 kal',
    safetyTip: 'Lakukan gerakan dengan kontrol, bukan kecepatan.',
    image: '/images/workout/hero.png',
    warmup: ['arm_circles', 'high_knees_warmup', 'hip_circles'],
    main: ['push_up', 'squat', 'plank', 'glute_bridge'],
    cooldown: ['quad_stretch', 'shoulder_stretch', 'deep_breathing'],
  },
  {
    id: 'full_body_intermediate',
    title: 'Full Body Intermediate',
    titleId: 'Full Body Menengah',
    category: 'full_body',
    difficulty: 'Medium',
    durationMinutes: 25,
    rounds: 1,
    targetArea: 'Seluruh Tubuh',
    calorieEstimate: '150-200 kal',
    safetyTip: 'Jaga form yang benar. Istirahat jika perlu.',
    image: '/images/workout/hero.png',
    warmup: ['jumping_jacks_warmup', 'high_knees_warmup', 'arm_circles', 'hip_circles'],
    main: ['push_up', 'squat', 'lunge', 'plank', 'mountain_climber', 'sit_up'],
    cooldown: ['quad_stretch', 'hamstring_stretch', 'child_pose', 'deep_breathing'],
  },
  {
    id: 'upper_body',
    title: 'Upper Body Strength',
    titleId: 'Kekuatan Tubuh Atas',
    category: 'upper',
    difficulty: 'Medium',
    durationMinutes: 20,
    rounds: 1,
    targetArea: 'Dada, Bahu, Trisep',
    calorieEstimate: '100-150 kal',
    safetyTip: 'Jangan paksakan jika sendi terasa sakit.',
    image: '/images/workout/pushup.png',
    warmup: ['arm_circles', 'neck_stretch', 'jumping_jacks_warmup'],
    main: ['push_up', 'tricep_dip', 'plank', 'superman'],
    cooldown: ['shoulder_stretch', 'child_pose', 'deep_breathing'],
  },
  {
    id: 'lower_body',
    title: 'Lower Body Power',
    titleId: 'Kekuatan Tubuh Bawah',
    category: 'lower',
    difficulty: 'Medium',
    durationMinutes: 20,
    rounds: 1,
    targetArea: 'Paha, Glute, Betis',
    calorieEstimate: '120-160 kal',
    safetyTip: 'Pastikan lutut tidak melewati ujung jari kaki saat squat/lunge.',
    image: '/images/workout/squat.png',
    warmup: ['hip_circles', 'high_knees_warmup', 'jumping_jacks_warmup'],
    main: ['squat', 'lunge', 'glute_bridge', 'wall_sit', 'calf_raise'],
    cooldown: ['quad_stretch', 'hamstring_stretch', 'deep_breathing'],
  },
  {
    id: 'core_abs',
    title: 'Core & Abs',
    titleId: 'Core & Perut',
    category: 'core',
    difficulty: 'Medium',
    durationMinutes: 15,
    rounds: 1,
    targetArea: 'Perut, Punggung, Core',
    calorieEstimate: '80-120 kal',
    safetyTip: 'Jaga leher rileks selama sit-up. Fokus pada kontraksi perut.',
    image: '/images/workout/plank.png',
    warmup: ['hip_circles', 'arm_circles'],
    main: ['plank', 'sit_up', 'mountain_climber', 'superman', 'glute_bridge'],
    cooldown: ['child_pose', 'hamstring_stretch', 'deep_breathing'],
  },
  {
    id: 'cardio_hiit',
    title: 'Cardio HIIT',
    titleId: 'Kardio HIIT',
    category: 'cardio',
    difficulty: 'Hard',
    durationMinutes: 20,
    rounds: 1,
    targetArea: 'Kardiovaskular',
    calorieEstimate: '200-300 kal',
    safetyTip: 'Jangan skip pemanasan. Minum air yang cukup.',
    image: '/images/workout/jumpingjack.png',
    warmup: ['jumping_jacks_warmup', 'high_knees_warmup', 'arm_circles'],
    main: ['jumping_jacks', 'mountain_climber', 'burpee', 'high_knees_warmup', 'squat'],
    cooldown: ['quad_stretch', 'hamstring_stretch', 'shoulder_stretch', 'child_pose', 'deep_breathing'],
  },
  {
    id: 'stretch_recovery',
    title: 'Stretching & Recovery',
    titleId: 'Peregangan & Pemulihan',
    category: 'stretch',
    difficulty: 'Easy',
    durationMinutes: 10,
    rounds: 1,
    targetArea: 'Seluruh Tubuh',
    calorieEstimate: '30-50 kal',
    safetyTip: 'Jangan memantul saat stretching. Tahan posisi dengan stabil.',
    image: '/images/workout/lunge.png',
    warmup: ['neck_stretch'],
    main: ['arm_circles', 'hip_circles', 'quad_stretch', 'hamstring_stretch', 'shoulder_stretch'],
    cooldown: ['child_pose', 'deep_breathing'],
  },
];

// ============ Build Workout Flow ============
export function buildWorkoutFlow(program) {
  if (!program) return [];
  const flow = [];
  for (const id of (program.warmup || [])) {
    const ex = EXERCISES[id];
    if (ex) flow.push({ ...ex, phase: 'warmup' });
  }
  for (const id of (program.main || [])) {
    const ex = EXERCISES[id];
    if (ex) flow.push({ ...ex, phase: 'main' });
  }
  for (const id of (program.cooldown || [])) {
    const ex = EXERCISES[id];
    if (ex) flow.push({ ...ex, phase: 'cooldown' });
  }
  return flow;
}

// ============ LocalStorage Helpers ============
const PROGRESS_KEY = 'islamediaku_workout_progress';
const FAVORITES_KEY = 'islamediaku_workout_favorites';
const LAST_WORKOUT_KEY = 'islamediaku_workout_last';

export function getWorkoutProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []; }
  catch { return []; }
}

export function saveWorkoutCompletion(programId, programTitle, durationMin) {
  const progress = getWorkoutProgress();
  progress.push({
    date: new Date().toISOString().split('T')[0],
    programId, programTitle, durationMin,
    timestamp: Date.now(),
  });
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getWorkoutFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; }
  catch { return []; }
}

export function toggleWorkoutFavorite(programId) {
  const favs = getWorkoutFavorites();
  const idx = favs.indexOf(programId);
  if (idx > -1) favs.splice(idx, 1);
  else favs.push(programId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  return favs;
}

export function getLastWorkout() {
  try { return JSON.parse(localStorage.getItem(LAST_WORKOUT_KEY)); }
  catch { return null; }
}

export function saveLastWorkout(programId, stepIndex) {
  localStorage.setItem(LAST_WORKOUT_KEY, JSON.stringify({ programId, stepIndex, timestamp: Date.now() }));
}

export function clearLastWorkout() {
  localStorage.removeItem(LAST_WORKOUT_KEY);
}
