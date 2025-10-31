import { supabase } from '../lib/supabaseClient';
import {
  RegisterCredentials,
  LoginCredentials,
  UserProfile,
  ProfileUpdateData,
  AuthSession,
  AuthError,
} from '../types/auth';
import { validateRegistration, validateLogin } from '../utils/validation';

export const authService = {

 
  async register(credentials: RegisterCredentials): Promise<{ success: boolean; user?: any; session?: any; error?: string }> {
    try {
      const validationErrors = validateRegistration({
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword || '',
        username: credentials.username,
        phone_number: credentials.phone_number,
      });

      if (validationErrors.length > 0) {
        const msg = validationErrors.map(e => `${e.field}: ${e.message}`).join('; ');
        return {
          success: false,
          error: msg,
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            username: credentials.username,
            phone_number: credentials.phone_number,
          },
        },
      });

      if (error) {
        const m = error.message?.toLowerCase?.() || '';
        if (m.includes('confirm') && m.includes('email')) {
          return {
            success: false,
            error: 'Please confirm your email before logging in.',
          };
        }
        return {
          success: false,
          error: error.message,
        };
      }

if (data?.user?.id) {
        try {
          // insert profile only if not exists
          await supabase
            .from('user_profiles')
            .insert(
              [
                {
                  id: data.user.id,
                  username: credentials.username || null,
                  full_name: credentials.username || null,
                  avatar_url: null,
                },
              ],
              { onConflict: 'id' } // safe: do nothing if already exists
            );
        } catch (insertErr) {
          console.error('Failed to create user_profiles row after signUp:', insertErr);
          // Don't fail the whole register just because profile insert failed.
        }
      }

      
      if (data?.session) {
        return {
          success: true,
          user: data.user,
          session: data.session,
        };
      }
////////////
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) {
        const m = signInError.message?.toLowerCase?.() || '';
        if (m.includes('confirm') && m.includes('email')) {
          return {
            success: false,
            error: 'Please confirm your email before logging in.',
          };
        }
        return {
          success: false,
          error: signInError.message || 'Login failed',
        };
      }
////////////
      return {
        success: true,
        user: data.user || undefined,
        session: undefined,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'An unexpected error occurred',
      };
    }
  },

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: any; session?: any; error?: string }> {
    try {
      const validationErrors = validateLogin(credentials);

      if (validationErrors.length > 0) {
        const msg = validationErrors.map(e => `${e.field}: ${e.message}`).join('; ');
        return {
          success: false,
          error: msg,
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        phone: credentials.phone,
        password: credentials.password,
      });

      if (error) {
        const m = error.message?.toLowerCase?.() || '';
        if (m.includes('confirm') && m.includes('email')) {
          return {
            success: false,
            error: 'Please confirm your email before logging in.',
          };
        }
        return {
          success: false,
          error: error.message || 'Login failed',
        };
      }

      if (!data.user || !data.session) {
        return {
          success: false,
          error: 'Login failed - invalid credentials',
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'An unexpected error occurred',
      };
    }
  },

  async logout(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          error: {
            message: error.message || 'Logout failed',
          },
        };
      }

      return { error: null };
    } catch (err) {
      return {
        error: {
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
        },
      };
    }
  },

  async getSession(): Promise<AuthSession | null> {
    try {
      const { data } = await supabase.auth.getSession();

      if (!data.session) return null;

      return {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at || 0,
        user: {
          id: data.session.user.id,
          email: data.session.user.email!,
          phone: data.session.user.phone,
          email_confirmed_at: data.session.user.email_confirmed_at,
          phone_confirmed_at: data.session.user.phone_confirmed_at,
          created_at: data.session.user.created_at,
        },
      };
    } catch (err) {
      console.error('Error getting session:', err);
      return null;
    }
  },


  
 async getUserProfile(userId: string): Promise<UserProfile | null> {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user profile (by id):', error);
        return null;
        }

        return data as UserProfile | null;
      } catch (err) {
        console.error('Unexpected error fetching user profile:', err);
      return null;
    }
  },
            

  async updateProfile(userId: string, updates: ProfileUpdateData): Promise<{ profile: UserProfile | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return {
          profile: null,
          error: {
            message: error.message || 'Failed to update profile',
          },
        };
      }

      return {
        profile: data as UserProfile,
        error: null,
      };
    } catch (err) {
      return {
        profile: null,
        error: {
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
        },
      };
    }
  },

  async queueProfileUpdate(userId: string, updates: ProfileUpdateData): Promise<boolean> {
    try {
      const { error } = await supabase.from('profile_update_queue').insert({
        user_id: userId,
        updates,
      });

      return !error;
    } catch (err) {
      console.error('Error queuing profile update:', err);
      return false;
    }
  },

  async uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: AuthError | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        return {
          url: null,
          error: {
            message: uploadError.message || 'Failed to upload avatar',
          },
        };
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      return {
        url: data.publicUrl,
        error: null,
      };
    } catch (err) {
      return {
        url: null,
        error: {
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
        },
      };
    }
  },

  onAuthStateChange(callback: (session: AuthSession | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        callback(null);
        return;
      }

      callback({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at || 0,
        user: {
          id: session.user.id,
          email: session.user.email!,
          phone: session.user.phone,
          email_confirmed_at: session.user.email_confirmed_at,
          phone_confirmed_at: session.user.phone_confirmed_at,
          created_at: session.user.created_at,
        },
      });
    });
  },
};
