import { VALIDATION_RULES, ValidationError } from '../types/auth';

export const validateEmail = (email: string): ValidationError | null => {
  if (!email) {
    return { field: 'email', message: 'Email is required' };
  }
  if (!VALIDATION_RULES.email.test(email)) {
    return { field: 'email', message: 'Invalid email format' };
  }
  return null;
};

export const validatePhone = (phone: string): ValidationError | null => {
  if (!phone) {
    return { field: 'phone', message: 'Phone number is required' };
  }
  if (!VALIDATION_RULES.phone.test(phone)) {
    return { field: 'phone', message: 'Invalid phone number format (use international format, e.g., +1234567890)' };
  }
  return null;
};

export const validatePassword = (password: string): ValidationError | null => {
  if (!password) {
    return { field: 'password', message: 'Password is required' };
  }
  if (password.length < VALIDATION_RULES.password.minLength) {
    return {
      field: 'password',
      message: `Password must be at least ${VALIDATION_RULES.password.minLength} characters`,
    };
  }
  if (!VALIDATION_RULES.password.hasUppercase.test(password)) {
    return { field: 'password', message: 'Password must contain at least one uppercase letter' };
  }
  if (!VALIDATION_RULES.password.hasLowercase.test(password)) {
    return { field: 'password', message: 'Password must contain at least one lowercase letter' };
  }
  if (!VALIDATION_RULES.password.hasNumber.test(password)) {
    return { field: 'password', message: 'Password must contain at least one number' };
  }
  return null;
};

export const validateUsername = (username: string): ValidationError | null => {
  if (!username) {
    return { field: 'username', message: 'Username is required' };
  }
  if (username.length < VALIDATION_RULES.username.minLength) {
    return {
      field: 'username',
      message: `Username must be at least ${VALIDATION_RULES.username.minLength} characters`,
    };
  }
  if (username.length > VALIDATION_RULES.username.maxLength) {
    return {
      field: 'username',
      message: `Username must be less than ${VALIDATION_RULES.username.maxLength} characters`,
    };
  }
  if (!VALIDATION_RULES.username.pattern.test(username)) {
    return {
      field: 'username',
      message: 'Username can only contain letters, numbers, underscores, and hyphens',
    };
  }
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationError | null => {
  if (!confirmPassword) {
    return { field: 'confirmPassword', message: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { field: 'confirmPassword', message: 'Passwords do not match' };
  }
  return null;
};

export const validateRegistration = (data: {
  email: string;
  password: string;
  confirmPassword: string;
  username?: string;
  phone_number?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push(passwordError);

  const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmPasswordError) errors.push(confirmPasswordError);

  if (data.username) {
    const usernameError = validateUsername(data.username);
    if (usernameError) errors.push(usernameError);
  }

  if (data.phone_number) {
    const phoneError = validatePhone(data.phone_number);
    if (phoneError) errors.push(phoneError);
  }

  return errors;
};

export const validateLogin = (data: {
  email?: string;
  phone?: string;
  password: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.email && !data.phone) {
    errors.push({ field: 'email', message: 'Email or phone number is required' });
  }

  if (data.email) {
    const emailError = validateEmail(data.email);
    if (emailError) errors.push(emailError);
  }

  if (data.phone) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.push(phoneError);
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return errors;
};
