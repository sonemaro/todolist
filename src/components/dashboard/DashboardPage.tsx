import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Award, TrendingUp, Activity, Zap } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/useAppStore';
import { useRewardsStore } from '../../stores/rewardsStore';
import { useActivityStore } from '../../stores/activityStore';

type Tab = 'overview' | 'gamification' | 'rewards' | 'activity';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { profile, session } = useAuthStore();
  const { stats } = useAppStore();
  const { balance } = useRewardsStore();
  const { activities } = useActivityStore();

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: User },
    { id: 'gamification' as Tab, label: 'Gamification', icon: Zap },
    { id: 'rewards' as Tab, label: 'Rewards', icon: Award },
    { id: 'activity' as Tab, label: 'Activity', icon: Activity },
  ];

  const xpForNextLevel = stats.level * 100;
  const xpProgress = (stats.points % 100) / 100 * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

        <div className="flex space-x-2 overflow-x-auto mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-pastel-mint border-b-2 border-pastel-mint'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-gradient-to-r from-pastel-mint to-pastel-blue rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="h-10 w-10" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profile?.username || session?.user?.email}</h2>
                  <p className="text-white/90">Level {stats.level} • {stats.points} XP</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Seeds</p>
                <p className="text-2xl font-bold text-green-600">🌱 {balance.seeds}</p>
              </div>
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Coins</p>
                <p className="text-2xl font-bold text-yellow-600">🪙 {balance.coins}</p>
              </div>
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
                <p className="text-gray-600 dark:text-gray-400 text-sm">XP</p>
                <p className="text-2xl font-bold text-purple-600">⭐ {balance.xp}</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'gamification' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Level {stats.level}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{stats.points} / {xpForNextLevel} XP</p>
                </div>
                <TrendingUp className="h-8 w-8 text-pastel-mint" />
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-pastel-mint to-pastel-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Streak</p>
                <p className="text-3xl font-bold text-orange-500">🔥 {stats.currentStreak} days</p>
              </div>
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Tasks Completed</p>
                <p className="text-3xl font-bold text-green-600">✓ {stats.completedTasks}</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'rewards' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: '🏆', title: 'First Task', desc: 'Complete your first task' },
                { icon: '🎯', title: 'Goal Setter', desc: 'Set 10 goals' },
                { icon: '⚡', title: 'Speed Runner', desc: 'Complete 5 tasks in a day' },
                { icon: '🌟', title: 'Star Achiever', desc: 'Reach level 10' },
                { icon: '💎', title: 'Diamond', desc: 'Maintain 30-day streak' },
                { icon: '🔥', title: 'Fire Starter', desc: 'Start a 7-day streak' },
              ].map((badge, i) => (
                <div key={i} className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border text-center">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{badge.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{badge.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {activities.length > 0 ? (
              activities.slice(0, 10).map((activity, i) => (
                <div key={i} className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border flex items-center space-x-4">
                  <div className="w-10 h-10 bg-pastel-mint/20 rounded-full flex items-center justify-center">
                    <Activity className="h-5 w-5 text-pastel-mint" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-dark-card rounded-xl p-8 border border-gray-200 dark:border-dark-border text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
