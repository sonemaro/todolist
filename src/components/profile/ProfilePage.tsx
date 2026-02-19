import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Award, TrendingUp, LogOut, Edit2, Loader, Lock } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/useAppStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useRewardsStore } from '../../stores/rewardsStore';
import { useTranslation } from '../../hooks/useTranslation';
import ProfileForm from './ProfileForm';
import GamificationDisplay from '../progress/GamificationDisplay';
import RewardBadge from '../rewards/RewardBadge';
import AchievementList from './AchievementList';
import AvatarUpload from './AvatarUpload';
import { changePassword } from '../../services/authService';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { session, profile, isLoading, loadProfile, logout, updateProfile, uploadAvatar } = useAuthStore();
  const { stats } = useAppStore();
  const { tasks } = useTaskStore();
  const { balance, getUnclaimedRewards } = useRewardsStore();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (profile && showEditModal) {
      setEditForm({
        name: profile.full_name || '',
        email: session?.user?.email || '',
        phone: profile.phone_number || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [profile, session, showEditModal]);

  const handleLogout = async () => {
    await logout();
  };

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true);
    setEditError('');
    try {
      const result = await uploadAvatar(file);
      if (result.success) {
        setEditSuccess('Avatar updated successfully!');
        setTimeout(() => setEditSuccess(''), 3000);
      } else {
        setEditError(result.error || 'Failed to upload avatar');
      }
    } catch (error: any) {
      setEditError(error?.message || 'Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    setIsSaving(true);

    try {
      const updates: any = {};
      if (editForm.name !== profile?.full_name) updates.full_name = editForm.name;
      if (editForm.phone !== profile?.phone_number) updates.phone_number = editForm.phone;

      if (Object.keys(updates).length > 0) {
        const result = await updateProfile(updates);
        if (!result.success) {
          setEditError(result.error || 'Failed to update profile');
          setIsSaving(false);
          return;
        }
      }

      if (editForm.newPassword) {
        if (editForm.newPassword !== editForm.confirmPassword) {
          setEditError('New passwords do not match');
          setIsSaving(false);
          return;
        }
        if (editForm.newPassword.length < 8) {
          setEditError('Password must be at least 8 characters');
          setIsSaving(false);
          return;
        }
        const pwdResult = await changePassword(editForm.newPassword);
        if (!pwdResult.success) {
          setEditError(pwdResult.error || 'Failed to change password');
          setIsSaving(false);
          return;
        }
      }

      setEditSuccess('Profile updated successfully!');
      setTimeout(() => {
        setShowEditModal(false);
        setEditSuccess('');
        setEditForm({
          name: '',
          email: '',
          phone: '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }, 1500);
    } catch (error: any) {
      setEditError(error?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (session && !profile) {
      loadProfile();
    }
  }, [session, profile, loadProfile]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t('login')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {t('dontHaveAccount')}
          </p>
        </div>
      </div>
    );
  }

  const unclaimedCount = getUnclaimedRewards().length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-pastel-mint to-pastel-blue rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('profile')}</h1>
              <p className="text-white/90">
                {profile?.username || session.user.email}
              </p>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="relative">
                <RewardBadge />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEditModal(true)}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <Edit2 className="h-5 w-5" />
                <span className="font-medium">Edit Profile</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('editProfile')}
              </h2>
              <ProfileForm />
            </div>

            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                {t('badges')}
              </h2>
              <AchievementList />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {t('rewardBalance')}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">🌱</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {t('seeds')}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {balance.seeds}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">🪙</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {t('coins')}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {balance.coins}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">⭐</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {t('xp')}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {balance.xp}
                  </span>
                </div>

                {unclaimedCount > 0 && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-4 p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white text-center"
                  >
                    <p className="font-semibold">
                      {unclaimedCount} {t('unclaimedRewards')}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                {t('progress')}
              </h2>
              <GamificationDisplay compact={false} />
            </div>

            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {t('stats')}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('level')}</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.level}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('points')}</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.points}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('streak')}</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.currentStreak}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('tasksCompleted')}</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {tasks.filter(t => t.completed).length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-6 w-full max-w-2xl my-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Edit Profile
              </h2>

              <AvatarUpload
                currentAvatar={profile?.avatar_url}
                onUpload={handleAvatarUpload}
                isLoading={avatarUploading}
              />

              <AnimatePresence>
                {editError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm"
                  >
                    {editError}
                  </motion.div>
                )}
                {editSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm"
                  >
                    {editSuccess}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email (read-only)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={editForm.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone (optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent"
                      placeholder="Enter your phone"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Change Password
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="password"
                          value={editForm.newPassword}
                          onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent"
                          placeholder="Leave blank to keep current"
                          minLength={8}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="password"
                          value={editForm.confirmPassword}
                          onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-pastel-mint focus:border-transparent"
                          placeholder="Confirm new password"
                          minLength={8}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-3 bg-gradient-to-r from-pastel-mint to-pastel-blue text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSaving ? (
                      <>
                        <Loader className="animate-spin h-5 w-5 mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
