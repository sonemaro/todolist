export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  phone_number?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  preferences: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  phone?: string | null;
  email_confirmed_at?: string | null;
  phone_confirmed_at?: string | null;
  created_at: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username?: string;
  phone_number?: string;
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
  remember_me?: boolean;
}

export interface ProfileUpdateData {
  username?: string;
  phone_number?: string;
  avatar_url?: string;
  bio?: string;
  preferences?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: AuthUser;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthError {
  message: string;
  errors?: ValidationError[];
}

export const PASSWORD_MIN_LENGTH = 8;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  password: {
    minLength: PASSWORD_MIN_LENGTH,
    hasUppercase: /[A-Z]/,
    hasLowercase: /[a-z]/,
    hasNumber: /\d/,
  },
  username: {
    minLength: USERNAME_MIN_LENGTH,
    maxLength: USERNAME_MAX_LENGTH,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },
};
