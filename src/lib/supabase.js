import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client if environment variables are missing (for dev/UI building)
const isMissingKeys = !supabaseUrl || !supabaseAnonKey;

export const supabase = isMissingKeys 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey);

export const authLogWarning = () => {
  if (isMissingKeys) {
    console.warn("Supabase keys are missing. Auth/Database features are disabled.");
  }
};
