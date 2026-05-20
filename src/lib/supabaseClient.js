import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isMissingKeys = !supabaseUrl || !supabaseAnonKey;

/**
 * Supabase client for general app features (kajian banners, user data, etc.)
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
 * Log a warning if Supabase is not configured (call once on init)
 */
export function logSupabaseWarning(feature = 'Feature') {
  if (isMissingKeys) {
    console.warn(`[Islamediaku] Supabase keys missing. ${feature} features are disabled.`);
  }
}
