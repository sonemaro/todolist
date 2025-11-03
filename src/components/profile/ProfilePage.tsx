import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Award, TrendingUp, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/useAppStore';
import { useRewardsStore } from '../../stores/rewardsStore';
import { useTranslation } from '../../hooks/useTranslation';
import ProfileForm from './ProfileForm';
import GamificationDisplay from '../progress/GamificationDisplay';
import RewardBadge from '../rewards/RewardBadge';
import AchievementList from './AchievementList';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { session, profile, isLoading, loadProfile, logout } = useAuthStore();
  const { stats } = useAppStore();
  const { balance, getUnclaimedRewards } = useRewardsStore();

  const handleLogout = async () => {
    await logout();
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
                    {stats.completedTasks}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
