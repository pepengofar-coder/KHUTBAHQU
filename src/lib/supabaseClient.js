import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isMissingKeys = !supabaseUrl || !supabaseAnonKey;

/**
 * Single Supabase client for the entire Islamediaku app.
 * Used for Auth, Database, Storage, and all features.
 * Returns null if environment variables are not configured.
 * All consumers MUST check for null before using.
 */
export const supabaseClient = isMissingKeys
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured() {
  return !isMissingKeys;
}

/**
 * Log a warning if Supabase is not configured (call once per feature init)
 */
export function logSupabaseWarning(feature = 'Feature') {
  if (isMissingKeys) {
    console.warn(`[Islamediaku] Supabase keys missing. ${feature} features are disabled.`);
  }
}
