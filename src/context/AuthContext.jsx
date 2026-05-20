/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabaseClient, isSupabaseConfigured, logSupabaseWarning } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const isEmailConfirmed = !!(user?.email_confirmed_at);

  // Fetch profile from profiles table
  const fetchProfile = useCallback(async (userId) => {
    if (!supabaseClient || !userId) return null;
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error && error.code !== 'PGRST116') {
        // PGRST116 = not found, which is OK for new users
        console.warn('[Islamediaku] Profile fetch error:', error.message);
      }
      return data || null;
    } catch {
      return null;
    }
  }, []);

  // Upsert profile (create if not exists, update if exists)
  const upsertProfile = useCallback(async (userId, displayName, email) => {
    if (!supabaseClient || !userId) return;
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .upsert({
          id: userId,
          display_name: displayName || email?.split('@')[0] || 'Pengguna',
          email: email,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      if (error) {
        console.warn('[Islamediaku] Profile upsert error:', error.message);
      }
    } catch (err) {
      console.warn('[Islamediaku] Profile upsert failed:', err);
    }
  }, []);

  // Handle session changes — load profile
  const handleSession = useCallback(async (newSession) => {
    setSession(newSession);
    const currentUser = newSession?.user || null;
    setUser(currentUser);

    if (currentUser) {
      const p = await fetchProfile(currentUser.id);
      setProfile(p);
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    logSupabaseWarning('Auth');

    if (!supabaseClient) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabaseClient.auth.getSession().then(({ data: { session: s } }) => {
      handleSession(s);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (_event, newSession) => {
        await handleSession(newSession);
      }
    );

    return () => subscription?.unsubscribe();
  }, [handleSession]);

  const login = async (email, password) => {
    if (!supabaseClient) throw new Error('Supabase belum dikonfigurasi.');
    const result = await supabaseClient.auth.signInWithPassword({ email, password });

    if (!result.error && result.data?.user) {
      // Check email confirmation
      if (!result.data.user.email_confirmed_at) {
        // Sign out the unconfirmed user
        await supabaseClient.auth.signOut();
        return {
          data: result.data,
          error: { message: 'Silakan konfirmasi email terlebih dahulu. Cek inbox atau folder spam Anda.' }
        };
      }

      // Upsert profile on login
      await upsertProfile(
        result.data.user.id,
        result.data.user.user_metadata?.full_name,
        result.data.user.email
      );

      // Load profile
      const p = await fetchProfile(result.data.user.id);
      setProfile(p);
    }

    return result;
  };

  const register = async (email, password, fullName) => {
    if (!supabaseClient) throw new Error('Supabase belum dikonfigurasi.');
    const result = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return result;
  };

  const logout = async () => {
    if (!supabaseClient) return;
    setProfile(null);
    return supabaseClient.auth.signOut();
  };

  const resetPassword = async (email) => {
    if (!supabaseClient) throw new Error('Supabase belum dikonfigurasi.');
    return supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`
    });
  };

  const updateDisplayName = async (newName) => {
    if (!supabaseClient || !user) throw new Error('Tidak terautentikasi.');
    // Update profiles table
    const { error } = await supabaseClient
      .from('profiles')
      .update({ display_name: newName, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (error) throw error;

    // Also update auth metadata
    await supabaseClient.auth.updateUser({
      data: { full_name: newName }
    });

    // Refresh profile
    const p = await fetchProfile(user.id);
    setProfile(p);
    return p;
  };

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await fetchProfile(user.id);
      setProfile(p);
    }
  }, [user, fetchProfile]);

  const value = {
    user,
    session,
    profile,
    loading,
    isEmailConfirmed,
    isSupabaseReady: isSupabaseConfigured(),
    login,
    register,
    logout,
    resetPassword,
    updateDisplayName,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
