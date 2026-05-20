import { supabaseClient, isSupabaseConfigured } from './supabaseClient';

// ─── Helpers ───
const ok = (d) => ({ success: true, data: d });
const fail = (e) => ({ success: false, error: typeof e === 'string' ? e : e?.message || 'Unknown error' });
const sb = () => isSupabaseConfigured() && supabaseClient;
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

// Debounce map to prevent spam writes
const _debounceTimers = {};
function debounced(key, fn, ms = 2000) {
  clearTimeout(_debounceTimers[key]);
  _debounceTimers[key] = setTimeout(fn, ms);
}

// ─────────────────────────────────────────────
// 1. Daily Targets
// ─────────────────────────────────────────────

const DEFAULT_TARGETS = [
  { id: 'sholat5', label: 'Sholat 5 Waktu', icon: '🕌' },
  { id: 'dzikir_pagi', label: 'Dzikir Pagi', icon: '🌅' },
  { id: 'dzikir_petang', label: 'Dzikir Petang', icon: '🌇' },
  { id: 'quran', label: 'Baca Al-Qur\'an', icon: '📖' },
  { id: 'tilawah', label: 'Tilawah / Audio', icon: '🎧' },
  { id: 'sedekah', label: 'Sedekah', icon: '💚' },
  { id: 'sehat', label: 'Langkah Sehat', icon: '🚶' },
  { id: 'kajian', label: 'Kajian Ringan', icon: '📚' },
  { id: 'catatan', label: 'Catatan Harian', icon: '✏️' },
];

export { DEFAULT_TARGETS };

export async function loadDailyTargets(userId) {
  const dateStr = today();
  // Try Supabase first
  if (sb() && userId) {
    try {
      const { data, error } = await supabaseClient
        .from('user_daily_targets')
        .select('*')
        .eq('user_id', userId)
        .eq('target_date', dateStr)
        .single();
      if (!error && data) {
        return ok({ targets: data.targets, completed: data.completed, progress: data.progress, date: dateStr, source: 'cloud' });
      }
    } catch { /* fall through */ }
  }
  // Fallback: localStorage
  try {
    const stored = JSON.parse(localStorage.getItem('islamediaku_daily_targets'));
    if (stored && stored.date === dateStr) {
      return ok({ ...stored, source: 'local' });
    }
  } catch { /* ignore */ }
  // No data for today — return defaults
  return ok({ targets: DEFAULT_TARGETS, completed: [], progress: 0, date: dateStr, source: 'default' });
}

export async function saveDailyTargets(userId, targets, completed) {
  const dateStr = today();
  const progress = Math.round((completed.length / Math.max(targets.length, 1)) * 100);
  const payload = { targets, completed, progress, date: dateStr };

  // Always save to localStorage
  localStorage.setItem('islamediaku_daily_targets', JSON.stringify(payload));

  // Save to Supabase if available
  if (sb() && userId) {
    debounced('daily_targets', async () => {
      try {
        await supabaseClient.from('user_daily_targets').upsert({
          user_id: userId,
          target_date: dateStr,
          targets,
          completed,
          progress,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,target_date' });
      } catch { /* silent */ }
    }, 1000);
  }
  return ok(payload);
}

// ─────────────────────────────────────────────
// 2. Daily Notes
// ─────────────────────────────────────────────

export async function loadDailyNote(userId) {
  const dateStr = today();
  if (sb() && userId) {
    try {
      const { data, error } = await supabaseClient
        .from('user_daily_notes')
        .select('*')
        .eq('user_id', userId)
        .eq('note_date', dateStr)
        .single();
      if (!error && data) {
        return ok({ content: data.content, date: dateStr, updatedAt: data.updated_at, source: 'cloud' });
      }
    } catch { /* fall through */ }
  }
  try {
    const stored = JSON.parse(localStorage.getItem('islamediaku_daily_note'));
    if (stored && stored.date === dateStr) return ok({ ...stored, source: 'local' });
  } catch { /* ignore */ }
  return ok({ content: '', date: dateStr, updatedAt: null, source: 'default' });
}

export async function saveDailyNote(userId, content) {
  const dateStr = today();
  const payload = { content, date: dateStr, updatedAt: new Date().toISOString() };
  localStorage.setItem('islamediaku_daily_note', JSON.stringify(payload));

  if (sb() && userId) {
    debounced('daily_note', async () => {
      try {
        await supabaseClient.from('user_daily_notes').upsert({
          user_id: userId,
          note_date: dateStr,
          content,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,note_date' });
      } catch { /* silent */ }
    }, 1500);
  }
  return ok(payload);
}

export async function deleteDailyNote(userId) {
  const dateStr = today();
  localStorage.removeItem('islamediaku_daily_note');
  if (sb() && userId) {
    try {
      await supabaseClient.from('user_daily_notes').delete().eq('user_id', userId).eq('note_date', dateStr);
    } catch { /* silent */ }
  }
  return ok(null);
}

// ─────────────────────────────────────────────
// 3. Feature State (generic per-feature storage)
// ─────────────────────────────────────────────

export async function saveFeatureState(userId, feature, stateData) {
  const lsKey = `islamediaku_feature_${feature}`;
  localStorage.setItem(lsKey, JSON.stringify(stateData));

  if (sb() && userId) {
    debounced(`feature_${feature}`, async () => {
      try {
        await supabaseClient.from('user_feature_state').upsert({
          user_id: userId,
          feature,
          state_data: stateData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,feature' });
      } catch { /* silent */ }
    }, 2000);
  }
  return ok(stateData);
}

export async function loadFeatureState(userId, feature) {
  if (sb() && userId) {
    try {
      const { data, error } = await supabaseClient
        .from('user_feature_state')
        .select('state_data, updated_at')
        .eq('user_id', userId)
        .eq('feature', feature)
        .single();
      if (!error && data) return ok({ ...data.state_data, _updatedAt: data.updated_at, _source: 'cloud' });
    } catch { /* fall through */ }
  }
  try {
    const stored = JSON.parse(localStorage.getItem(`islamediaku_feature_${feature}`));
    if (stored) return ok({ ...stored, _source: 'local' });
  } catch { /* ignore */ }
  return ok(null);
}

// ─────────────────────────────────────────────
// 4. Activity Tracking
// ─────────────────────────────────────────────

export async function trackUserActivity(userId, feature, activityType, data = {}) {
  // Always log locally
  try {
    const activities = JSON.parse(localStorage.getItem('islamediaku_recent_activities') || '[]');
    activities.unshift({ feature, activityType, data, timestamp: new Date().toISOString() });
    // Keep last 50
    localStorage.setItem('islamediaku_recent_activities', JSON.stringify(activities.slice(0, 50)));
  } catch { /* ignore */ }

  if (sb() && userId) {
    debounced(`activity_${feature}_${activityType}`, async () => {
      try {
        await supabaseClient.from('user_activity').insert({
          user_id: userId,
          feature,
          activity_type: activityType,
          activity_data: data,
        });
      } catch { /* silent */ }
    }, 3000);
  }
}

export async function getRecentActivity(userId, limit = 10) {
  if (sb() && userId) {
    try {
      const { data, error } = await supabaseClient
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (!error && data?.length) return ok(data);
    } catch { /* fall through */ }
  }
  // Fallback local
  try {
    const activities = JSON.parse(localStorage.getItem('islamediaku_recent_activities') || '[]');
    return ok(activities.slice(0, limit));
  } catch { return ok([]); }
}

// ─────────────────────────────────────────────
// 5. Profile Photo Upload
// ─────────────────────────────────────────────

export async function uploadAvatar(userId, file) {
  if (!sb() || !userId) return fail('Supabase tidak tersedia.');
  if (!file) return fail('File tidak ditemukan.');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return fail('Format tidak didukung. Gunakan JPEG, PNG, atau WebP.');
  }
  if (file.size > 2 * 1024 * 1024) {
    return fail('Ukuran file maksimal 2MB.');
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `${userId}/profile.${ext}`;

  try {
    // Upload/overwrite
    const { error: uploadError } = await supabaseClient.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) return fail(uploadError.message);

    // Get public URL
    const { data: urlData } = supabaseClient.storage.from('avatars').getPublicUrl(filePath);
    const avatarUrl = urlData?.publicUrl ? `${urlData.publicUrl}?t=${Date.now()}` : null;

    // Update profile
    if (avatarUrl) {
      await supabaseClient.from('profiles').update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() }).eq('id', userId);
    }

    return ok({ avatarUrl, filePath });
  } catch (err) {
    return fail(err);
  }
}

export async function removeAvatar(userId) {
  if (!sb() || !userId) return fail('Supabase tidak tersedia.');
  try {
    // List files in user's avatar folder
    const { data: files } = await supabaseClient.storage.from('avatars').list(userId);
    if (files?.length) {
      const paths = files.map(f => `${userId}/${f.name}`);
      await supabaseClient.storage.from('avatars').remove(paths);
    }
    await supabaseClient.from('profiles').update({ avatar_url: null, updated_at: new Date().toISOString() }).eq('id', userId);
    return ok(null);
  } catch (err) {
    return fail(err);
  }
}

// ─────────────────────────────────────────────
// 6. Dashboard Summary
// ─────────────────────────────────────────────

export async function getUserDashboardSummary(userId) {
  const [targets, note, recentAct] = await Promise.all([
    loadDailyTargets(userId),
    loadDailyNote(userId),
    getRecentActivity(userId, 10),
  ]);

  // Gather localStorage stats
  const quranLastRead = (() => {
    try { const d = JSON.parse(localStorage.getItem('islamediaku_quran_last_read')); return d?.surahId ? d : null; } catch { return null; }
  })();
  const bookmarkCount = (() => {
    try { const bm = JSON.parse(localStorage.getItem('kq_mushaf_bookmarks')); return Array.isArray(bm) ? bm.length : 0; } catch { return 0; }
  })();
  const favCount = (() => {
    try { const f = JSON.parse(localStorage.getItem('islamediaku_favorites')); return Array.isArray(f) ? f.length : 0; } catch { return 0; }
  })();
  const lastTilawah = (() => {
    try { return JSON.parse(localStorage.getItem('kq_last_tilawah')); } catch { return null; }
  })();
  const prayerCity = localStorage.getItem('kq_prayer_city') || 'Jakarta';
  const theme = localStorage.getItem('islamediaku_theme') || 'default';

  return {
    targets: targets.data,
    note: note.data,
    recentActivity: recentAct.data || [],
    quranLastRead,
    bookmarkCount,
    favCount,
    lastTilawah,
    prayerCity,
    theme,
  };
}

// ─────────────────────────────────────────────
// 7. Full Sync (preferences + quran + tracker)
// ─────────────────────────────────────────────

export async function syncPreferences(userId) {
  if (!sb() || !userId) return fail('Not configured');
  try {
    const theme = localStorage.getItem('islamediaku_theme') || 'default';
    const settings = {
      darkMode: localStorage.getItem('islamediaku_dark') || '0',
      prayerCity: localStorage.getItem('kq_prayer_city') || 'Jakarta',
      fontSize: localStorage.getItem('islamediaku_font_size') || '1',
      mushafTrans: localStorage.getItem('islamediaku_mushaf_trans') || '1',
      mushafFocus: localStorage.getItem('islamediaku_mushaf_focus_default') || '0',
      adzanEnabled: localStorage.getItem('islamediaku_adzan_enabled') || '0',
    };
    const { error } = await supabaseClient.from('user_preferences').upsert({
      user_id: userId, theme, settings, updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    return error ? fail(error) : ok(null);
  } catch (e) { return fail(e); }
}

export async function syncQuranData(userId) {
  if (!sb() || !userId) return fail('Not configured');
  try {
    const results = [];
    const lastRead = localStorage.getItem('islamediaku_quran_last_read');
    if (lastRead) {
      const { error } = await supabaseClient.from('user_bookmarks').upsert({
        user_id: userId, bookmark_type: 'quran_last_read', bookmark_data: JSON.parse(lastRead),
      }, { onConflict: 'user_id,bookmark_type', ignoreDuplicates: false });
      results.push({ type: 'quran_last_read', error: error?.message });
    }
    const bookmarks = localStorage.getItem('kq_mushaf_bookmarks');
    if (bookmarks) {
      const parsed = JSON.parse(bookmarks);
      if (Array.isArray(parsed)) {
        const { error } = await supabaseClient.from('user_bookmarks').upsert({
          user_id: userId, bookmark_type: 'mushaf_bookmarks', bookmark_data: { items: parsed },
        }, { onConflict: 'user_id,bookmark_type', ignoreDuplicates: false });
        results.push({ type: 'mushaf_bookmarks', error: error?.message });
      }
    }
    return results.some(r => r.error) ? fail(results) : ok(results);
  } catch (e) { return fail(e); }
}

export async function syncAllData(userId) {
  const [prefs, quran] = await Promise.all([
    syncPreferences(userId),
    syncQuranData(userId),
  ]);
  const allSuccess = prefs.success && quran.success;
  return { success: allSuccess, results: { preferences: prefs, quran } };
}

export async function getSyncStatus(userId) {
  if (!sb() || !userId) return { synced: false, lastSync: null };
  try {
    const { data } = await supabaseClient.from('user_preferences').select('updated_at').eq('user_id', userId).single();
    return data?.updated_at ? { synced: true, lastSync: new Date(data.updated_at) } : { synced: false, lastSync: null };
  } catch { return { synced: false, lastSync: null }; }
}
