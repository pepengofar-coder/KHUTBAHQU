/**
 * Backward-compatibility shim.
 * All Supabase usage is now consolidated in supabaseClient.js.
 * This file re-exports for existing imports (AuthContext, PremiumContext, etc.)
 */
export { supabaseClient as supabase, logSupabaseWarning as authLogWarning } from './supabaseClient';
