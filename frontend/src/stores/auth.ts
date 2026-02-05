import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

function supabaseUserToUser(user: SupabaseUser | null): User | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) => set({ session }),

      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error: error.message };
        }

        set({
          user: supabaseUserToUser(data.user),
          session: data.session,
          isAuthenticated: true,
        });

        return { error: null };
      },

      signup: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          return { error: error.message };
        }

        // Auto-login after signup if email confirmation is disabled
        if (data.session) {
          set({
            user: supabaseUserToUser(data.user),
            session: data.session,
            isAuthenticated: true,
          });
        }

        return { error: null };
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          session: null,
          isAuthenticated: false,
        });
      },

      initialize: async () => {
        set({ isLoading: true });

        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          set({
            user: supabaseUserToUser(session.user),
            session,
            isAuthenticated: true,
          });
        }

        set({ isLoading: false });

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
          set({
            user: supabaseUserToUser(session?.user || null),
            session,
            isAuthenticated: !!session,
          });
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
