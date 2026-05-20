import { supabaseClient, isSupabaseConfigured } from './supabaseClient';

/**
 * Sync localStorage preferences to Supabase user_preferences table
 */
export async function syncPreferences(userId) {
  if (!isSupabaseConfigured() || !supabaseClient || !userId) return { success: false, error: 'Not configured' };

  try {
    const theme = localStorage.getItem('islamediaku_theme') || 'default';
    const darkMode = localStorage.getItem('islamediaku_dark') || '0';
    const prayerCity = localStorage.getItem('kq_prayer_city') || 'Jakarta';
    const fontSize = localStorage.getItem('islamediaku_font_size') || '1';
    const mushafTrans = localStorage.getItem('islamediaku_mushaf_trans') || '1';
    const mushafFocus = localStorage.getItem('islamediaku_mushaf_focus_default') || '0';
    const adzanEnabled = localStorage.getItem('islamediaku_adzan_enabled') || '0';

    const settings = {
      darkMode,
      prayerCity,
      fontSize,
      mushafTrans,
      mushafFocus,
      adzanEnabled,
    };

    const { error } = await supabaseClient
      .from('user_preferences')
      .upsert({
        user_id: userId,
        theme,
        settings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Sync Quran last-read and bookmarks to Supabase user_bookmarks table
 */
export async function syncQuranData(userId) {
  if (!isSupabaseConfigured() || !supabaseClient || !userId) return { success: false, error: 'Not configured' };

  try {
    const results = [];

    // Sync last read
    const lastRead = localStorage.getItem('islamediaku_quran_last_read');
    if (lastRead) {
      const { error } = await supabaseClient
        .from('user_bookmarks')
        .upsert({
          user_id: userId,
          bookmark_type: 'quran_last_read',
          bookmark_data: JSON.parse(lastRead),
        }, {
          onConflict: 'user_id,bookmark_type',
          ignoreDuplicates: false
        });
      results.push({ type: 'quran_last_read', error: error?.message });
    }

    // Sync mushaf bookmarks
    const bookmarks = localStorage.getItem('kq_mushaf_bookmarks');
    if (bookmarks) {
      const parsed = JSON.parse(bookmarks);
      if (Array.isArray(parsed)) {
        const { error } = await supabaseClient
          .from('user_bookmarks')
          .upsert({
            user_id: userId,
            bookmark_type: 'mushaf_bookmarks',
            bookmark_data: { items: parsed },
          }, {
            onConflict: 'user_id,bookmark_type',
            ignoreDuplicates: false
          });
        results.push({ type: 'mushaf_bookmarks', error: error?.message });
      }
    }

    const hasError = results.some(r => r.error);
    return { success: !hasError, results };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Sync tracker summary to Supabase user_activity table
 */
export async function syncTrackerSummary(userId) {
  if (!isSupabaseConfigured() || !supabaseClient || !userId) return { success: false, error: 'Not configured' };

  try {
    const trackerData = localStorage.getItem('islamediaku_tracker_daily');
    const missionData = localStorage.getItem('islamediaku_daily_mission_progress');

    const activityData = {};
    if (trackerData) activityData.tracker = JSON.parse(trackerData);
    if (missionData) activityData.mission = JSON.parse(missionData);

    if (Object.keys(activityData).length === 0) {
      return { success: true, message: 'No tracker data to sync' };
    }

    const { error } = await supabaseClient
      .from('user_activity')
      .insert({
        user_id: userId,
        activity_type: 'sync_snapshot',
        activity_data: activityData,
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Load preferences from Supabase and apply to localStorage
 */
export async function loadPreferencesFromCloud(userId) {
  if (!isSupabaseConfigured() || !supabaseClient || !userId) return { success: false };

  try {
    const { data, error } = await supabaseClient
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return { success: false };

    // Apply to localStorage (don't overwrite if user didn't have cloud data)
    if (data.theme) localStorage.setItem('islamediaku_theme', data.theme);
    if (data.settings) {
      const s = data.settings;
      if (s.darkMode) localStorage.setItem('islamediaku_dark', s.darkMode);
      if (s.prayerCity) localStorage.setItem('kq_prayer_city', s.prayerCity);
      if (s.fontSize) localStorage.setItem('islamediaku_font_size', s.fontSize);
      if (s.mushafTrans) localStorage.setItem('islamediaku_mushaf_trans', s.mushafTrans);
      if (s.mushafFocus) localStorage.setItem('islamediaku_mushaf_focus_default', s.mushafFocus);
      if (s.adzanEnabled) localStorage.setItem('islamediaku_adzan_enabled', s.adzanEnabled);
    }

    return { success: true, data };
  } catch {
    return { success: false };
  }
}

/**
 * Get sync status for a user
 */
export async function getSyncStatus(userId) {
  if (!isSupabaseConfigured() || !supabaseClient || !userId) {
    return { synced: false, lastSync: null };
  }

  try {
    const { data } = await supabaseClient
      .from('user_preferences')
      .select('updated_at')
      .eq('user_id', userId)
      .single();

    if (data?.updated_at) {
      return { synced: true, lastSync: new Date(data.updated_at) };
    }
    return { synced: false, lastSync: null };
  } catch {
    return { synced: false, lastSync: null };
  }
}

/**
 * Run full sync (preferences + quran + tracker)
 */
export async function syncAllData(userId) {
  const results = {
    preferences: await syncPreferences(userId),
    quran: await syncQuranData(userId),
    tracker: await syncTrackerSummary(userId),
  };

  const allSuccess = Object.values(results).every(r => r.success);
  return { success: allSuccess, results };
}
