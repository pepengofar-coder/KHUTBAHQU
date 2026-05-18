/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { PLANS } from '../config/premium';

const PremiumContext = createContext();

export function PremiumProvider({ children }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback state for local dev without DB
  const [mockPremium, setMockPremium] = useState(() => {
    try { return localStorage.getItem('kq_mock_premium') === 'true'; } catch { return false; }
  });

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubscription(null);
       
      setLoading(false);
      return;
    }

    if (!supabase) {
      // Mock logic if Supabase is disabled
       
      setSubscription(mockPremium ? { status: 'active', plan: 'plan_monthly' } : null);
       
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (!error && data) {
        setSubscription(data);
      } else {
        setSubscription(null);
      }
      setLoading(false);
    };

    fetchSubscription();
  }, [user, mockPremium]);

  const isPremiumUser = () => {
    if (mockPremium) return true; // Local override
    if (!subscription) return false;
    return subscription.status === 'active';
  };

  const hasPremiumFeature = (_featureKey) => {
    if (!isPremiumUser()) return false;
    
    // In a real app, you might check specific entitlements based on the plan.
    // Here, any active premium plan gets all features defined in config.
    const plan = PLANS[subscription?.plan === 'plan_yearly' ? 'YEARLY' : 'MONTHLY'];
    if (!plan) return true; // fallback allow
    
    // Return true if the plan exists (we give all premium features to premium users for now)
    return true; 
  };

  // Helper for development testing
  const toggleMockPremium = () => {
    const next = !mockPremium;
    setMockPremium(next);
    localStorage.setItem('kq_mock_premium', next.toString());
  };

  const value = {
    subscription,
    loading,
    isPremiumUser,
    hasPremiumFeature,
    toggleMockPremium, // Dev only
  };

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
}

export function usePremium() {
  return useContext(PremiumContext);
}
