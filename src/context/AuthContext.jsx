import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, authLogWarning } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authLogWarning();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    return supabase.auth.signInWithPassword({ email, password });
  };

  const register = async (email, password, fullName) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
  };

  const logout = async () => {
    if (!supabase) return;
    return supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
