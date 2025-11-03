import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader, Phone } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/useAppStore';
import { sendPasswordReset, registerWithPhone, loginWithPhone } from '../../services/authService';

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, register, isLoading, isAuthenticated } = useAuthStore();
  const { setCurrentView } = useAppStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    username: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showExistsOptions, setShowExistsOptions] = useState(false);
  const [resetInProgress, setResetInProgress] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const isEmail = (value: string) => value.includes('@');
  const inputType = isEmail(formData.emailOrPhone) ? 'email' : 'phone';


  useEffect(() => {
  
    if (isAuthenticated) {
      setCurrentView('dashboard'); 
    }
  }, [isAuthenticated, setCurrentView]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
    setShowExistsOptions(false);
  };

  const handleSendPasswordReset = async () => {
    setError('');
    setSuccess('');
    const emailToReset = resetEmail || (isEmail(formData.emailOrPhone) ? formData.emailOrPhone : '');
    if (!emailToReset) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setResetInProgress(true);
      const res = await sendPasswordReset(emailToReset);
      if (!res.success) {
        setError(res.error || 'Failed to send password reset email.');
      } else {
        setSuccess('Password reset email sent. Please check your inbox.');
        setShowExistsOptions(false);
        setShowForgotPassword(false);
        setResetEmail('');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while sending the reset email.');
    } finally {
      setResetInProgress(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
     setShowExistsOptions(false);

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setError(t('passwordsDoNotMatch'));
        return;
      }

      if (formData.password.length < 8) {
        setError(t('passwordTooShort'));
        return;
      }

      if (!formData.username.trim()) {
        setError('Username is required');
        return;
      }

      const isEmailType = isEmail(formData.emailOrPhone);
      let result: any;

      if (isEmailType) {
        result = await register({
          email: formData.emailOrPhone,
          password: formData.password,
          username: formData.username,
          confirmPassword: formData.confirmPassword,
        });
      } else {
        const phoneResult = await registerWithPhone(formData.emailOrPhone, formData.password);
        if (!phoneResult.success) {
          setError(phoneResult.error || t('registrationFailed'));
          return;
        }
        result = phoneResult;
      }

      console.log('REGISTER RESULT:', result);

      if (!result.success) {
        if (result.exists) {
          setError('This account already exists.');
          setShowExistsOptions(true);
          setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
          return;
        }

        setError(result.error || t('registrationFailed'));
        return;
      }

      setSuccess(t('registrationSuccess') || 'Registration successful!');

      if (result.session || result.data?.session) {
        setCurrentView('dashboard');
      } else {
        setSuccess('Registration successful! Please confirm your email or phone to continue.');
      }
    } else {
      const isEmailType = isEmail(formData.emailOrPhone);
      let result: any;

      if (isEmailType) {
        result = await login({
          email: formData.emailOrPhone,
          password: formData.password,
          remember_me: false,
        });
      } else {
        const phoneResult = await loginWithPhone(formData.emailOrPhone, formData.password);
        if (!phoneResult.success) {
          setError(phoneResult.error || 'Login failed. Please check your credentials.');
          return;
        }
        result = phoneResult;
      }

      console.log('LOGIN RESULT:', result);

      if (!result.success) {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    }
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-mint via-pastel-blue to-pastel-lavender p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {mode === 'login' ? t('login') : t('register')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === 'login' ? t('welcomeBack') : t('createAccount')}
            </p>
          </div>

          <div className="flex space-x-2 rtl:space-x-reverse mb-6">
            <button
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-pastel-mint to-pastel-blue text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-pastel-mint to-pastel-blue text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {t('register')}
            </button>
          </div>

          <AnimatePresence mode="wait">
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm"
              >
                {error}
                {showExistsOptions && (
                  <div className="mt-3 flex space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => {
                        setMode('login');
                        setShowExistsOptions(false);
                        setError('');
                      }}
                      className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg"
                    >
                      ورود
                    </button>
                    <button
                      onClick={handleSendPasswordReset}
                      disabled={resetInProgress}
                      className="flex-1 py-2 px-3 bg-yellow-500 text-white rounded-lg"
                    >
                      {resetInProgress ? 'در حال ارسال...' : 'بازنشانی رمز'}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('username')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent"
                    placeholder={t('enterUsername')}
                    required
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email or Phone
              </label>
              <div className="relative">
                {inputType === 'email' ? (
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                ) : (
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                )}
                <input
                  type="text"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent"
                  placeholder="Enter email or phone"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {inputType === 'email' ? 'Using email' : 'Using phone'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent"
                  placeholder={t('enterPassword')}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent"
                    placeholder={t('confirmPassword')}
                    required
                    minLength={8}
                  />
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-pastel-mint to-pastel-blue text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  {mode === 'login' ? t('loggingIn') : t('creatingAccount')}
                </>
              ) : (
                <>{mode === 'login' ? t('login') : t('register')}</>
              )}
            </motion.button>
          </form>

          {mode === 'login' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowForgotPassword(true);
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-pastel-mint hover:text-pastel-blue font-medium"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {mode === 'login' ? (
              <>
                {t('dontHaveAccount')}{' '}
                <button
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className="text-pastel-mint hover:text-pastel-blue font-medium"
                >
                  {t('register')}
                </button>
              </>
            ) : (
              <>
                {t('alreadyHaveAccount')}{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="text-pastel-mint hover:text-pastel-blue font-medium"
                >
                  {t('login')}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {showForgotPassword && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForgotPassword(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Reset Password
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                }}
                className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendPasswordReset}
                disabled={resetInProgress || !resetEmail}
                className="flex-1 py-3 bg-gradient-to-r from-pastel-mint to-pastel-blue text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {resetInProgress ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AuthPage;
