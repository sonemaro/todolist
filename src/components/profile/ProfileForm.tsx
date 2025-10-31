import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Upload, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from '../../hooks/useTranslation';
import { validateEmail, validatePhone, validateUsername, validatePassword } from '../../utils/validation';
import AvatarUpload from './AvatarUpload';

const ProfileForm: React.FC = () => {
  const { t } = useTranslation();
  const { profile, session, updateProfile, uploadAvatar, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (profile && session) {
      setFormData({
        username: profile.username || '',
        email: session.user.email || '',
        phone_number: profile.phone_number || '',
        bio: profile.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [profile, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError.message;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError.message;

    if (formData.phone_number) {
      const phoneError = validatePhone(formData.phone_number);
      if (phoneError) newErrors.phone_number = phoneError.message;
    }

    if (showPasswordFields && formData.newPassword) {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) newErrors.newPassword = passwordError.message;

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = t('passwordsDoNotMatch');
      }

      if (!formData.currentPassword) {
        newErrors.currentPassword = t('passwordRequired');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) return;

    const updates = {
      username: formData.username,
      phone_number: formData.phone_number || null,
      bio: formData.bio || null,
    };

    const result = await updateProfile(updates);

    if (result.success) {
      setSuccessMessage(t('profileUpdated'));
      setShowPasswordFields(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrors({ submit: result.error || t('loginFailed') });
    }
  };

  const handleAvatarUpload = async (file: File) => {
    const result = await uploadAvatar(file);
    if (result.success) {
      setSuccessMessage(t('profileUpdated'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrors({ avatar: result.error || 'Upload failed' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AvatarUpload
        currentAvatar={profile?.avatar_url}
        onUpload={handleAvatarUpload}
        isLoading={isLoading}
      />

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400"
        >
          {successMessage}
        </motion.div>
      )}

      {errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400"
        >
          {errors.submit}
        </motion.div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('username')}
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.username
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent`}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-500">{errors.username}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('email')}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Email cannot be changed
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('phone')}
        </label>
        <input
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="+1234567890"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.phone_number
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent`}
        />
        {errors.phone_number && (
          <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('bio')}
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent resize-none"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowPasswordFields(!showPasswordFields)}
          className="text-sm text-pastel-mint hover:text-pastel-blue font-medium"
        >
          {showPasswordFields ? t('cancel') : 'Change Password'}
        </button>
      </div>

      {showPasswordFields && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.currentPassword
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.newPassword
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('confirmPassword')}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.confirmPassword
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </motion.div>
      )}

      <div className="flex justify-end space-x-3 rtl:space-x-reverse">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-pastel-mint to-pastel-blue text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-5 w-5 mr-2" />
          {isLoading ? 'Saving...' : t('saveProfile')}
        </motion.button>
      </div>
    </form>
  );
};

export default ProfileForm;
