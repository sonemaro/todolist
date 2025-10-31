import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
  Zap,
  Target,
  Calendar as CalendarIcon,
  Download,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../stores/useAppStore';
import { useAuthStore } from '../../stores/authStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useRewardsStore } from '../../stores/rewardsStore';
import { useActivityStore } from '../../stores/activityStore';
import GamificationDisplay from '../progress/GamificationDisplay';
import ProgressCharts from '../analytics/ProgressCharts';
import RewardBadge from '../rewards/RewardBadge';

interface SummaryCard {
  id: string;
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: string;
}

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { stats } = useAppStore();
  const { isAuthenticated, profile } = useAuthStore();
  const { tasks, getTasksByStatus, getOverdueTasks } = useTaskStore();
  const { balance, getUnclaimedRewards } = useRewardsStore();
  const { loadActivities, activities } = useActivityStore();
  const [activeSection, setActiveSection] = useState<'overview' | 'analytics' | 'reports'>(
    'overview'
  );

  useEffect(() => {
    if (isAuthenticated && profile) {
      const authStore = useAuthStore.getState();
      if (authStore.session) {
        loadActivities(authStore.session.user.id);
      }
    }
  }, [isAuthenticated, profile, loadActivities]);

  const completedTasks = getTasksByStatus('completed').length;
  const pendingTasks = getTasksByStatus('pending').length;
  const overdueTasks = getOverdueTasks().length;
  const unclaimedRewards = getUnclaimedRewards().length;

  const summaryCards: SummaryCard[] = [
    {
      id: 'completed',
      title: t('tasksCompleted'),
      value: completedTasks,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      trend: '+12%',
    },
    {
      id: 'pending',
      title: t('pendingTasks'),
      value: pendingTasks,
      icon: <Clock className="h-6 w-6" />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
    },
    {
      id: 'overdue',
      title: t('overdueTasks'),
      value: overdueTasks,
      icon: <AlertCircle className="h-6 w-6" />,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
    },
    {
      id: 'level',
      title: t('level'),
      value: `Level ${stats.level}`,
      icon: <Zap className="h-6 w-6" />,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20',
    },
    {
      id: 'streak',
      title: t('streak'),
      value: `${stats.currentStreak} ${t('days')}`,
      icon: <Target className="h-6 w-6" />,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
    },
    {
      id: 'xp',
      title: t('xp'),
      value: stats.xp,
      icon: <Award className="h-6 w-6" />,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      trend: `${Math.round((stats.xp / stats.xpForNextLevel) * 100)}%`,
    },
  ];

  const sections = [
    { id: 'overview' as const, label: t('overview'), icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'analytics' as const, label: 'Analytics', icon: <CalendarIcon className="h-4 w-4" /> },
    { id: 'reports' as const, label: 'Reports', icon: <Download className="h-4 w-4" /> },
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t('login')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Log in to view your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-pastel-mint via-pastel-blue to-pastel-lavender rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('dashboard')}</h1>
              <p className="text-white/90">
                Welcome back, {profile?.username || 'User'}!
              </p>
            </div>
            {unclaimedRewards > 0 && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <RewardBadge />
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="flex space-x-2 rtl:space-x-reverse bg-white dark:bg-dark-card rounded-xl p-1 border border-gray-200 dark:border-dark-border">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-pastel-mint to-pastel-blue text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {activeSection === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {summaryCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`${card.bgColor} rounded-xl p-6 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${card.color.replace('text', 'bg').replace('600', '500').replace('400', '500')}`}>
                      <div className="text-white">{card.icon}</div>
                    </div>
                    {card.trend && (
                      <span className={`text-xs font-semibold ${card.color}`}>
                        {card.trend}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </h3>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  {t('gamification')}
                </h2>
                <GamificationDisplay compact={false} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-500" />
                  {t('rewardBalance')}
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">🌱</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {t('seeds')}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {balance.seeds}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">🪙</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {t('coins')}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {balance.coins}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">🏆</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {t('badges')}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {balance.badges}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                Recent Activity
              </h2>
              {activities.length > 0 ? (
                <div className="space-y-2">
                  {activities.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="p-2 bg-pastel-mint/20 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-pastel-mint" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {activity.points_earned > 0 && (
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          +{activity.points_earned} XP
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No recent activity
                </p>
              )}
            </motion.div>
          </motion.div>
        )}

        {activeSection === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border"
          >
            <ProgressCharts />
          </motion.div>
        )}

        {activeSection === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Activity Reports
            </h2>
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Download className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Reports Coming Soon</p>
              <p className="text-sm">
                Export and analyze your productivity data
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
