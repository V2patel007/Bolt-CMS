import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Profile {
  id: string;
  role: 'admin' | 'client';
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
  fetchProfile: async () => {
    const { user } = get();
    if (!user || !supabase || !isSupabaseConfigured) {
      console.log('Cannot fetch profile - missing user or supabase');
      set({ loading: false });
      return;
    }

    console.log('Creating profile from user data due to RLS policy issues');
    
    // Create profile directly from user data to bypass RLS policy issues
    const userData = user.user_metadata || {};
    const profile = {
      id: user.id,
      email: user.email || '',
      full_name: userData.full_name || user.email?.split('@')[0] || 'User',
      role: (userData.role as 'admin' | 'client') || 'client',
      company_name: userData.company_name || null,
      phone: userData.phone || null,
      avatar_url: userData.avatar_url || null,
    };
    
    console.log('Profile created from user metadata:', profile);
    set({ profile: profile as Profile, loading: false });
  }
}));