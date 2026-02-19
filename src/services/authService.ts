import { api } from '../lib/api';
import {
  RegisterCredentials,
  LoginCredentials,
  UserProfile,
  ProfileUpdateData,
  AuthSession,
  AuthError,
} from '../types/auth';
// Validation is handled by the form component and the server

function saveToken(token: string) {
  localStorage.setItem('auth_token', token);
}

function clearToken() {
  localStorage.removeItem('auth_token');
}

export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export const authService = {
  async register(
    credentials: RegisterCredentials
  ): Promise<{ success: boolean; user?: any; session?: any; error?: string; exists?: boolean }> {
    try {
      const data = await api.post('/api/auth/register', {
        email: credentials.email,
        password: credentials.password,
        username: credentials.username,
        phone_number: credentials.phone_number,
      });
      saveToken(data.token);
      const session: AuthSession = {
        access_token: data.token,
        refresh_token: '',
        expires_at: 0,
        user: {
          id: data.user.id,
          email: data.user.email,
          phone: data.user.phone,
          created_at: data.user.created_at,
        },
      };
      return { success: true, user: data.user, session };
    } catch (err: any) {
      if (err.status === 409) {
        return { success: false, error: 'User already registered', exists: true };
      }
      return { success: false, error: err.message || 'Registration failed' };
    }
  },

  async login(
    credentials: LoginCredentials
  ): Promise<{ success: boolean; user?: any; session?: any; error?: string }> {
    try {
      const data = await api.post('/api/auth/login', {
        email: credentials.email,
        phone: credentials.phone,
        password: credentials.password,
      });
      saveToken(data.token);
      const session: AuthSession = {
        access_token: data.token,
        refresh_token: '',
        expires_at: 0,
        user: {
          id: data.user.id,
          email: data.user.email,
          phone: data.user.phone,
          created_at: data.user.created_at,
        },
      };
      return { success: true, user: data.user, session };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  },

  async logout(): Promise<{ error: AuthError | null }> {
    clearToken();
    return { error: null };
  },

  async getSession(): Promise<AuthSession | null> {
    const token = getToken();
    if (!token) return null;
    try {
      const data = await api.get('/api/auth/me');
      return {
        access_token: token,
        refresh_token: '',
        expires_at: 0,
        user: {
          id: data.user.id,
          email: data.user.email,
          phone: data.user.phone,
          created_at: data.user.created_at,
        },
      };
    } catch {
      clearToken();
      return null;
    }
  },

  async getUserProfile(_userId: string): Promise<UserProfile | null> {
    try {
      const data = await api.get('/api/profile');
      return data.profile as UserProfile;
    } catch {
      return null;
    }
  },

  async updateProfile(
    _userId: string,
    updates: ProfileUpdateData
  ): Promise<{ profile: UserProfile | null; error: AuthError | null }> {
    try {
      const data = await api.put('/api/profile', updates);
      return { profile: data.profile as UserProfile, error: null };
    } catch (err: any) {
      return { profile: null, error: { message: err.message || 'Update failed' } };
    }
  },

  async queueProfileUpdate(_userId: string, updates: ProfileUpdateData): Promise<boolean> {
    try {
      const queue = JSON.parse(localStorage.getItem('profile_update_queue') || '[]');
      queue.push({ updates, timestamp: Date.now() });
      localStorage.setItem('profile_update_queue', JSON.stringify(queue));
      return true;
    } catch {
      return false;
    }
  },

  async uploadAvatar(
    _userId: string,
    file: File
  ): Promise<{ url: string | null; error: AuthError | null }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const data = await api.post('/api/profile/avatar', formData);
      return { url: data.url, error: null };
    } catch (err: any) {
      return { url: null, error: { message: err.message || 'Upload failed' } };
    }
  },
};

export const sendPasswordReset = async (_email: string) => {
  return { success: false, error: 'Password reset not available yet. Contact admin.' };
};

export const changePassword = async (newPassword: string, oldPassword?: string) => {
  try {
    await api.post('/api/auth/change-password', { oldPassword, newPassword });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to change password' };
  }
};

export const registerWithPhone = async (phone: string, password: string) => {
  try {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const data = await api.post('/api/auth/register', {
      email: cleanPhone + '@phone.local',
      password,
      phone_number: phone,
    });
    saveToken(data.token);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration failed' };
  }
};

export const loginWithPhone = async (phone: string, password: string) => {
  try {
    const data = await api.post('/api/auth/login', { phone, password });
    saveToken(data.token);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Login failed' };
  }
};
