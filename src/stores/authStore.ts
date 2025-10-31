import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { AuthSession, UserProfile, RegisterCredentials, LoginCredentials, ProfileUpdateData } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  session: AuthSession | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  rememberMe: boolean;

  init: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfile: (updates: ProfileUpdateData) => Promise<{ success: boolean; error?: string }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; error?: string }>;
  setRememberMe: (remember: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  session: null,
  profile: null,
  isLoading: false,
  isAuthenticated: false,
  rememberMe: false,

  init: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      set({
        session: data.session as any,
        isAuthenticated: !!data.session,
        isLoading: false,
      });

      if (data.session?.user?.id) {
        await get().loadProfile();
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session: session as any,
          isAuthenticated: !!session,
        });
        if (session?.user?.id) {
          get().loadProfile();
        } else {
          set({ profile: null });
        }
      });
    } catch (error) {
      console.error('[authStore] init error:', error);
      set({ isLoading: false });
    }
  },

      register: async (credentials) => {
        set({ isLoading: true });

        const result = await authService.register(credentials);

        if (!result.success) {
          set({ isLoading: false });
          return {
            success: false,
            error: result.error,
          };
        }

        if (result.session) {
          set({
            session: result.session,
            isAuthenticated: !!result.session,
            isLoading: false,
          });

          await get().loadProfile();
        }

        return { success: true };
      },

      login: async (credentials) => {
        set({ isLoading: true });

        const result = await authService.login(credentials);

        if (!result.success) {
          set({ isLoading: false });
          return {
            success: false,
            error: result.error,
          };
        }

        if (result.session) {
          set({
            session: result.session,
            isAuthenticated: !!result.session,
            isLoading: false,
            rememberMe: credentials.remember_me || false,
          });

          await get().loadProfile();
        }

        return { success: true };
      },

      logout: async () => {
        set({ isLoading: true });

        await authService.logout();

        set({
          session: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      loadSession: async () => {
        set({ isLoading: true });

        const session = await authService.getSession();

        if (session) {
          set({
            session,
            isAuthenticated: !!session,
            isLoading: false,
          });

          await get().loadProfile();
        } else {
          set({
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      loadProfile: async () => {
        const { session } = get();

        if (!session) return;

        const profile = await authService.getUserProfile(session.user.id);

        if (profile) {
          set({ profile });
        }
      },

      updateProfile: async (updates) => {
        const { session, profile } = get();

        if (!session) {
          return {
            success: false,
            error: 'Not authenticated',
          };
        }

        set({ isLoading: true });

        if (navigator.onLine) {
          const { profile: updatedProfile, error } = await authService.updateProfile(session.user.id, updates);

          if (error) {
            set({ isLoading: false });
            return {
              success: false,
              error: error.message,
            };
          }

          if (updatedProfile) {
            set({ profile: updatedProfile, isLoading: false });
          }
        } else {
          await authService.queueProfileUpdate(session.user.id, updates);

          set({
            profile: { ...profile, ...updates },
            isLoading: false,
          });
        }

        return { success: true };
      },

      uploadAvatar: async (file) => {
        const { session } = get();

        if (!session) {
          return {
            success: false,
            error: 'Not authenticated',
          };
        }

        set({ isLoading: true });

        const { url, error } = await authService.uploadAvatar(session.user.id, file);

        if (error) {
          set({ isLoading: false });
          return {
            success: false,
            error: error.message,
          };
        }

        if (url) {
          await get().updateProfile({ avatar_url: url });
        }

        set({ isLoading: false });

        return { success: true };
      },

      setRememberMe: (remember) => {
        set({ rememberMe: remember });
      },

      clearAuth: () => {
        set({
          session: null,
          profile: null,
          isAuthenticated: false,
        });
      },
  })
);
